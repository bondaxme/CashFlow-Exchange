import { useState } from 'react';
import classes from './SignUpForm.module.css';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../firebase';
// import { collection, addDoc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';
import { useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (showPopup) {
      const timeoutId = setTimeout(() => {
        setShowPopup(false);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [showPopup]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    const firstNameRegex = /^[a-zA-Z]+$/;
    if (!formData.firstName.trim() || !firstNameRegex.test(formData.firstName)) {
      newErrors.firstName = 'Valid first name is required';
      isValid = false;
    }

    const lastNameRegex = /^[a-zA-Z]+$/;
    if (!formData.lastName.trim() || !lastNameRegex.test(formData.lastName)) {
      newErrors.lastName = 'Valid last name is required';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
          },
          {
            maxAttempts: 1,
            backoffMillis: 3000,
          }
        );
  
        console.log('User registered successfully:', user);
        console.log('Verification email sent. Please verify your email.');
        setShowPopup(true);
      } catch (error) {
        console.error('Error registering user:', error.message);
        if (error.code === 'auth/email-already-in-use') {
          setErrors((prevErrors) => ({
            ...prevErrors,
            general: 'Email is already in use',
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
    <div className={classes.signUpContainer}>
      <div className={classes.signUpForm}>
        <h2 className={classes.regText}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className={classes.formGroup}>
            <input className={classes.input}
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
            />
            <div className={classes.error}>{errors.firstName}</div>
          </div>
          <div className={classes.formGroup}>
            <input className={classes.input}
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
            <div className={classes.error}>{errors.lastName}</div>
          </div>
          <div className={classes.formGroup}>
            <input className={classes.input}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
            <div className={classes.error}>{errors.email}</div>
          </div>
          <div className={classes.formGroup}>
            <input className={classes.input}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
            <div className={classes.error}>{errors.password}</div>
          </div>

          <button type="submit" className={classes.myBtn}>Sign Up</button>
          {errors.general && <div className={classes.error}>{errors.general}</div>}
        </form>
        {showPopup && (
          <div className={classes.popup}>
            <p>Account successfully created. Please verify it to sign in.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;