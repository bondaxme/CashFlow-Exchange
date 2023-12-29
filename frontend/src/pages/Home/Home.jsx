import classes from "./Home.module.css";
import CurrencyRates from "../../components/CurrencyRates/CurrencyRates";
import CurrencyCalculator from "../../components/CurrencyCalculator/CurrencyCalculator";

const Home = () => {
  return (
    <section className={classes.homeBody}>
      <h2 className={classes.greeting}>Welcome!</h2>
      <p className={classes.p1}>Calculate the amount you want to change</p>
      <CurrencyCalculator />
      <CurrencyRates />
    </section>
  );
};

export default Home;
