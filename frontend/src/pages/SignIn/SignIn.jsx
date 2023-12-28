import SignInForm from "../../components/SignInForm/SignInForm";
import classes from "./SignIn.module.css";

const SignIn = () => {
  return (
    <section className={classes.mainCont}>
      <SignInForm />
    </section>
  );
};

export default SignIn;
