import classes from './RequestRow.module.css';


const RequestRow = ({ request }, { showName }) => {
    return (
        /* {showName ? (
          <p className={classes.info}>{request.firstName} {request.lastName}</p>
        ) : (
          null
        )}
        <p className={classes.info}>{request.sourceCurrency}</p>
        <p className={classes.info}>{request.targetCurrency}</p>
        <p className={classes.info}>{request.amount}</p>
        <p className={classes.info}>{request.convertedAmount}</p>
        <p className={classes.info}>{request.timestamp.toDate().toLocaleString()}</p>
        <p className={classes.info}>{request.status}</p> */
        <tr className={classes.requestRow}>
          {showName ? (
            <td className={classes.info}>{request.firstName} {request.lastName}</td>
          ) : (
            null
          )}
          <td className={classes.info}>{request.sourceCurrency}</td>
          <td className={classes.info}>{request.targetCurrency}</td>
          <td className={classes.info}>{request.amount}</td>
          <td className={classes.info}>{request.convertedAmount}</td>
          <td className={classes.info}>{request.timestamp.toDate().toLocaleString()}</td>
          <td className={classes.info}>{request.status}</td>
        </tr>
    );
  };
  
  export default RequestRow;