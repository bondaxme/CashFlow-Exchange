import CurrencyCalculator from "../../components/CurrencyCalculator/CurrencyCalculator";
import classes from "./StartExchange.module.css";
import RequestsHistory from "../../components/RequestsHistory/RequestsHistory";

const StartExchange = () => {
  return (
    <section className={classes.mainContainer}>
      <h1 className={classes.header}>
        Here you can create a currency exchange request
      </h1>
      <CurrencyCalculator showCreateButton />
      <RequestsHistory />
    </section>
  );
};

export default StartExchange;
