import SignUpForm from "../../components/SignUpForm/SignUpForm";
import classes from "./SignUp.module.css";

const SignUp = () => {
  return (
    <section className={classes.mainCont}>
      <SignUpForm />
    </section>
  );
};

export default SignUp;
