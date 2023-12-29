import classes from "./RequestRow.module.css";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";

const RequestRow = ({ request }) => {
  const user = useAuth();
  const [status, setStatus] = useState(request.status);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    console.log(user.isAdmin);
    if (!user.isAdmin && newStatus === "rejected") {
      const requestDocRef = doc(db, "requests", request.id);
      await updateDoc(requestDocRef, { status: newStatus });

      setStatus(newStatus);
    } else if (user.isAdmin) {
      const requestDocRef = doc(db, "requests", request.id);
      await updateDoc(requestDocRef, { status: newStatus });

      setStatus(newStatus);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "#6CAA8C";
      case "rejected":
        return "#c48a8a";
      case "take away":
        return "#cbba9c";
      case "pending":
        return "#9ca1cb";
      default:
        return "white";
    }
  };

  return (
    <tr className={classes.requestRow}>
      <td className={classes.info}>{request.shortId}</td>
      <td className={classes.info}>{request.sourceCurrency}</td>
      <td className={classes.info}>{request.targetCurrency}</td>
      <td className={classes.info}>{request.amount}</td>
      <td className={classes.info}>{request.convertedAmount}</td>
      <td className={classes.info}>{request.date}</td>
      <td className={classes.info}>{request.time}</td>
      <td className={classes.select}>
        <select
          className={classes.select}
          value={status}
          onChange={handleStatusChange}
          disabled={status === "completed" || status === "rejected"}
          style={{ backgroundColor: getStatusColor() }}
        >
          <option className={classes.option} value="pending">
            pending
          </option>
          <option className={classes.option} value="completed">
            completed
          </option>
          <option className={classes.option} value="rejected">
            rejected
          </option>
          <option className={classes.option} value="take away">
            take away
          </option>
        </select>
      </td>
    </tr>
  );
};

export default RequestRow;
