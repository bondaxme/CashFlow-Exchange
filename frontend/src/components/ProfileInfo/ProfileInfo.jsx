import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { auth } from "../../firebase";
import classes from "./ProfileInfo.module.css";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";

const ProfileInfo = () => {
  const navigate = useNavigate();

  const { firstName, lastName, email, uid } = useAuth();
  const [formData, setFormData] = useState({
    firstName,
    lastName,
    email,
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "users", uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });

      const currencyDiff = {
        USD: formData.USD || null,
        EUR: formData.EUR || null,
        PLN: formData.PLN || null,
        GBP: formData.GBP || null,
      };

      await updateDoc(doc(db, "users", uid), {
        currencyDiff,
      });
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className={classes.profileInfoContainer}>
      <div className={classes.profileInfoHeader}>
        <h2>Your Profile</h2>
      </div>
      <form className={classes.profileInfoForm} onSubmit={handleSubmit}>
        <label className={classes.profileInfoLabel}>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
        <label className={classes.profileInfoLabel}>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
        <label className={classes.profileInfoLabel}>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label className={classes.profileInfoLabel}>
          New Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <p className={classes.paragraph}>
          Would you like to be notified when the exchange rate changes? Enter the minimum values next to the required currencies, when changing to which the email will be sent
        </p>
        <label className={classes.profileInfoLabel}>
          USD:
          <input
            type="text"
            name="USD"
            value={formData.usdValue}
            onChange={handleChange}
          />
        </label>
        <label className={classes.profileInfoLabel}>
          EUR:
          <input
            type="text"
            name="EUR"
            value={formData.eurValue}
            onChange={handleChange}
          />
        </label>
        <label className={classes.profileInfoLabel}>
          EUR:
          <input
            type="text"
            name="PLN"
            value={formData.PLN}
            onChange={handleChange}
          />
        </label>
        <label className={classes.profileInfoLabel}>
          GBP:
          <input
            type="text"
            name="GBP"
            value={formData.gbpValue}
            onChange={handleChange}
          />
        </label>
        <button className={classes.profileInfoSubmitBtn} type="submit">
          Save Changes
        </button>
        <div className={classes.profileInfoFooter}>
          <h2>Actions</h2>
          <button
            className={classes.profileInfoSignoutBtn}
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;
