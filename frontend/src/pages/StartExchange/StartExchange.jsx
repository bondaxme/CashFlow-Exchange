import CurrencyCalculator from "../../components/CurrencyCalculator/CurrencyCalculator";
import classes from "./StartExchange.module.css";
import RequestsHistory from "../../components/RequestsHistory/RequestsHistory";

const StartExchange = () => {

  return (
      <div className={classes.mainContainer}>
        <CurrencyCalculator showCreateButton />
        <RequestsHistory />
      </div>
    );
  };
  
  export default StartExchange;