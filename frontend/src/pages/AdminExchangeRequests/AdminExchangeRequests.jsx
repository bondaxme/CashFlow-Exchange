import RequestsHistory from "../../components/RequestsHistory/RequestsHistory";
import classes from "./AdminExchangeRequests.module.css";

const AdminExchangeRequests = () => {
  return (
    <section className={classes.mainCont}>
      <h1 className={classes.header}>Exchange Requests</h1>
      <RequestsHistory showAdmin />
    </section>
  );
};

export default AdminExchangeRequests;
