import classes from './RequestRow.module.css';


const RequestRow = ({ request }) => {
    return (
        <div className={classes.requestRow}>
        <p className={classes.info}>{request.sourceCurrency}</p>
        <p className={classes.info}>{request.targetCurrency}</p>
        <p className={classes.info}>{request.amount}</p>
        <p className={classes.info}>{request.convertedAmount}</p>
        <p className={classes.info}>{request.timestamp.toDate().toLocaleString()}</p>
        <p className={classes.info}>{request.status}</p>
      </div>
    );
  };
  
  export default RequestRow;