import { useState } from "react";
// import classes from './SignUpForm.module.css';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../firebase";
// import { collection, addDoc } from 'firebase/firestore';
import { sendEmailVerification } from "firebase/auth";
import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import classes from "../SignInForm/SignInForm.module.css";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    const firstNameRegex = /^[a-zA-Z]+$/;
    const lastNameRegex = /^[a-zA-Z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateName = (fieldName, regex) => {
      if (!formData[fieldName].trim() || !regex.test(formData[fieldName])) {
        newErrors[fieldName] = `Valid ${fieldName.toLowerCase()} is required`;
        isValid = false;
      }
    };

    validateName("firstName", firstNameRegex);
    validateName("lastName", lastNameRegex);
    validateName("email", emailRegex);

    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 6-16 characters long, contain at least one number and one special character";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const auth = getAuth();

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const user = userCredential.user;

        const userRef = doc(db, "users", user?.uid);

        await sendEmailVerification(auth.currentUser);

        await setDoc(
          userRef,
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            currencyDiff: {
              USD: null,
              EUR: null,
              PLN: null,
              GBP: null,
            },
            isAdmin: false,
          },
          {
            maxAttempts: 1,
            backoffMillis: 3000,
          }
        );

        console.log("User registered successfully:", user);
        console.log("Verification email sent. Please verify your email.");
        navigate("/");
      } catch (error) {
        console.error("Error registering user:", error.message);
        if (error.code === "auth/email-already-in-use") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            general: "Email is already in use",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            general: error.message,
          }));
        }
      }
    }
  };

  return (
    <div className={classes.signInContainer}>
      <div className={classes.signInForm}>
        <h2 className={classes.text}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className={classes.formGroup}>
            <input
              className={classes.input}
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
            />
            <div className={classes.error}>{errors.firstName}</div>
          </div>
          <div className={classes.formGroup}>
            <input
              className={classes.input}
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
            <div className={classes.error}>{errors.lastName}</div>
          </div>
          <div className={classes.formGroup}>
            <input
              className={classes.input}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              autoComplete="username"
            />
            <div className={classes.error}>{errors.email}</div>
          </div>
          <div className={classes.formGroup}>
            <input
              className={classes.input}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              autoComplete="current-password"
            />
            <div className={classes.error}>{errors.password}</div>
          </div>

          <div className={classes.myBtnCont}>
            <button type="submit" className={classes.myBtn}>
              Sign Up
            </button>
           <div className={classes.errorGeneral}>{errors.general}</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
