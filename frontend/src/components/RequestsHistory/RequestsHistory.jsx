import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import RequestRow from "../RequestRow/RequestRow";
import classes from "./RequestsHistory.module.css";
import { query, where, orderBy } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { format } from "date-fns";
import { onSnapshot } from "firebase/firestore";

const RequestsHistory = ({ showAdmin }) => {
  const [requestsHistory, setRequestsHistory] = useState([]);
  const user = useAuth();

  useEffect(() => {
    const fetchRequestHistory = async () => {
      try {
        const requestsCollection = collection(db, "requests");

        let requestsQuery = null;
        if (showAdmin) {
          requestsQuery = query(
            requestsCollection,
            orderBy("timestamp", "desc")
          );
        } else {
          requestsQuery = query(
            requestsCollection,
            where("userId", "==", user.uid),
            orderBy("timestamp", "desc")
          );
        }

        const unsubscribe = onSnapshot(requestsQuery, (querySnapshot) => {
          const historyData = querySnapshot.docs.map((doc) => {
            const { timestamp, ...rest } = doc.data();

            const formattedDate = format(timestamp.toDate(), "yyyy-MM-dd");
            const formattedTime = format(timestamp.toDate(), "HH:mm:ss");

            const shortId = doc.id.slice(-4);

            return {
              id: doc.id,
              shortId: shortId,
              date: formattedDate,
              time: formattedTime,
              ...rest,
            };
          });

          setRequestsHistory(historyData);
        });
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching request history:", error.message);
      }
    };

    fetchRequestHistory();
  }, [user.uid]);

  return (
    <div className={classes.requestsHistory}>
      <table className={classes.table}>
        <thead>
          {requestsHistory.length > 0 ? (
            <tr className={classes.header}>
              <th className={classes.label}>ID</th>
              <th className={classes.label}>From</th>
              <th className={classes.label}>To</th>
              <th className={classes.label}>From</th>
              <th className={classes.label}>To</th>
              <th className={classes.label}>Date</th>
              <th className={classes.label}>Time</th>
              <th className={classes.status}>Status</th>
            </tr>
          ) : null}
        </thead>
        <tbody className={classes.tbody}>
          {requestsHistory.map((request) => (
            <RequestRow key={request.id} request={request} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsHistory;
