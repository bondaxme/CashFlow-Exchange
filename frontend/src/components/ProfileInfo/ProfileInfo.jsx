import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import classes from "./ProfileInfo.module.css";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import {
  EmailAuthProvider,
  getAuth,
  updatePassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { reauthenticateWithCredential } from "firebase/auth";


const ProfileInfo = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const currentEmail = user.email;

  const { username, email, currencyDiff, uid, isAuth } = useAuth();
  const [formData, setFormData] = useState({
    username,
    email,
    currencyDiff,
    curPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    curPassword: "",
    newPassword: "",
    usd: "",
    eur: "",
    pln: "",
    gbp: "",
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

  useEffect(() => {
    if (uid) {
      setFormData({
        username,
        email,
        currencyDiff,
      });
    }
  }, [uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "USD" || name === "EUR" || name === "PLN" || name === "GBP") {
      setFormData((prevData) => ({
        ...prevData,
        currencyDiff: { ...prevData.currencyDiff, [name]: value },
      }));
      return;
    } else if (name === "curPassword" || name === "newPassword") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{8,16}$/;

    const validateName = (fieldName, regex) => {
      if (!formData[fieldName].trim() || !regex.test(formData[fieldName])) {
        newErrors[fieldName] = `Valid ${fieldName.toLowerCase()} is required`;
        isValid = false;
      }
    };

    const validateCurrency = (currencyName) => {
      if (
        isNaN(formData.currencyDiff[currencyName]) ||
        formData.currencyDiff[currencyName] < 0 ||
        formData.currencyDiff[currencyName] > 10 ||
        formData.currencyDiff[currencyName] === "-0"
      ) {
        newErrors[currencyName.toLowerCase()] = "Must be from 0 to 10.0";
        isValid = false;
      }
    };

    const validatePassword = (fieldName, regex) => {
      if (!regex.test(formData[fieldName]) && formData[fieldName].trim()) {
        newErrors[fieldName] =
          "Password must be 8-16 characters long, contain only numbers, letters and special characters";
        isValid = false;
      }
    };

    validateName("username", usernameRegex);
    validateName("email", emailRegex);

    ["USD", "EUR", "PLN", "GBP"].forEach((currency) =>
      validateCurrency(currency)
    );

    validatePassword("curPassword", passwordRegex);
    validatePassword("newPassword", passwordRegex);

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await updateDoc(doc(db, "users", uid), {
          username: formData.username,
          currencyDiff: {
            USD: formData.currencyDiff.USD || null,
            EUR: formData.currencyDiff.EUR || null,
            PLN: formData.currencyDiff.PLN || null,
            GBP: formData.currencyDiff.GBP || null,
          },
        });

        if (currentEmail !== formData.email) {
          const credential = EmailAuthProvider.credential(
            currentEmail,
            formData.curPassword
          );
          await reauthenticateWithCredential(user, credential);
          navigate("/signin");

          await verifyBeforeUpdateEmail(user, formData.email);
          await auth.signOut();
        }

        if (formData.newPassword) {
          const credential = EmailAuthProvider.credential(
            currentEmail,
            formData.curPassword
          );
          await reauthenticateWithCredential(user, credential);
          await updatePassword(user, formData.newPassword);
        }

        setShowPopup(true);
      } catch (error) {
        console.error("Error updating profile:", error.message);
        if (
          error.code === "auth/invalid-credential"
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            curPassword: "Invalid password",
          }));
        } else if (error.code === "auth/too-many-requests") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            curPassword: "Too many requests. Try again later",
          }));
        } else if (error.code === "auth/missing-password")
          setErrors((prevErrors) => ({
            ...prevErrors,
            curPassword: "Enter your password",
          }));
      }
    }
  };

  const handleSignOut = async () => {
    try {
      navigate("/");
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        currentEmail,
        formData.curPassword
      );
      await reauthenticateWithCredential(user, credential);
      await deleteDoc(doc(db, "users", uid));
      navigate("/");
      await user.delete();
    } catch (error) {
        console.error("Error deleting account:", error.message);
      if (
        error.code === "auth/invalid-credential"
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          curPassword: "Invalid password",
        }));
      } else if (error.code === "auth/missing-password") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          curPassword: "Enter your password",
        }));
      } else if (error.code === "auth/too-many-requests") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          curPassword: "Too many requests. Try again later",
        }));
      }
    }
  }

  return (
    <div className={classes.profileInfoContainer}>
      {!auth.currentUser.emailVerified ? (
        <div className={classes.verifyEmail}>
          <p>
            Verify your email to get all features
          </p>
        </div>
      ) : null}
      <div className={classes.profileInfoHeader}>
        <h2>Your Profile</h2>
      </div>
      <form className={classes.profileInfoForm} onSubmit={handleSubmit}>
        <label className={classes.profileInfoLabel}>
          Username:
          <input
            className={classes.profileInfoInput}
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={username}
            autoComplete="username"
          />
          <p className={classes.error}>{errors.username}</p>
        </label>

        <label className={classes.profileInfoLabel}>
          Email:
          <input
            className={classes.profileInfoInput}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={email}
            autoComplete="username"
          />
          <p className={classes.error}>{errors.email}</p>
        </label>

        <div className={classes.password}>
          <label className={classes.passwordInfoLabel}>
            Current Password:
            <input
              className={classes.passwordInput}
              type="password"
              name="curPassword"
              value={formData.curPassword}
              onChange={handleChange}
              placeholder={"Enter your current password"}
              autoComplete="current-password"
            />
            <p className={classes.error}>{errors.curPassword}</p>
          </label>
          <label className={classes.passwordInfoLabel}>
            New Password:
            <input
              className={classes.passwordInput}
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder={"Enter your new password"}
              autoComplete="new-password"
            />
            <p className={classes.error}>{errors.newPassword}</p>
          </label>
        </div>

        <p className={classes.paragraph}>
          Would you like to be notified when the exchange rate changes? Enter
          the minimum values next to the required currencies, when changing to
          which the email will be sent
        </p>
        <div className={classes.currBlock}>
          <label className={classes.currencyInfoLabel}>
            USD:
            <input
              className={classes.currency}
              type="text"
              name="USD"
              value={formData.currencyDiff.USD}
              onChange={handleChange}
              disabled={!user.emailVerified}
            />
            <p className={classes.errorCur}>{errors.usd}</p>
          </label>

          <label className={classes.currencyInfoLabel}>
            EUR:
            <input
              className={classes.currency}
              type="text"
              name="EUR"
              value={formData.currencyDiff.EUR}
              onChange={handleChange}
              disabled={!user.emailVerified}
            />
            <p className={classes.errorCur}>{errors.eur}</p>
          </label>

          <label className={classes.currencyInfoLabel}>
            PLN:
            <input
              className={classes.currency}
              type="text"
              name="PLN"
              value={formData.currencyDiff.PLN}
              onChange={handleChange}
              disabled={!user.emailVerified}
            />
            <p className={classes.errorCur}>{errors.pln}</p>
          </label>

          <label className={classes.currencyInfoLabel}>
            GBP:
            <input
              className={classes.currency}
              type="text"
              name="GBP"
              value={formData.currencyDiff.GBP}
              onChange={handleChange}
              disabled={!user.emailVerified}
            />
            <p className={classes.errorCur}>{errors.gbp}</p>
          </label>
        </div>

        <div className={classes.btnDiv}>
          <button className={classes.profileInfoSubmitBtn} type="submit">
            Save Changes
          </button>

          {showPopup && (
            <div className={classes.popup}>
              <p>Profile info successfully updated.</p>
            </div>
          )}
        </div>

        <div className={classes.profileInfoFooter}>
          <button
            className={classes.profileInfoSignoutBtn}
            onClick={handleSignOut}
            type="button"
          >
            Sign Out
          </button>
          <button
            className={classes.profileInfoDeleteBtn}
            onClick={handleDeleteAccount}
            type="button"
          >
            Delete account
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProfileInfo;
