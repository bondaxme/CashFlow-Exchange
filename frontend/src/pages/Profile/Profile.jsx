import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import classes from "./Profile.module.css";

const Profile = () => {
  return (
    <section className={classes.mainContainer}>
      <ProfileInfo />
    </section>
  );
};

export default Profile;