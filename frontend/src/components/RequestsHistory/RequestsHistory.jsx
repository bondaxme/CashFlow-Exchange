import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import RequestRow from '../RequestRow/RequestRow';
import classes from './RequestsHistory.module.css';
import { query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { doc } from 'firebase/firestore';

const RequestsHistory = ({ showAdmin }) => {
  const [requestsHistory, setRequestsHistory] = useState([]);
  const user = useAuth();


  useEffect(() => {
    const fetchRequestHistory = async () => {
      try {
        const requestsCollection = collection(db, 'requests');

        let requestsQuery = null;
        if (showAdmin) {
          requestsQuery = query(
            requestsCollection,
            orderBy('timestamp', 'desc')
          );


        } else {
          requestsQuery = query(
              requestsCollection,
              where('userId', '==', user.uid),
              orderBy('timestamp', 'desc')
          );
        }
        
        const querySnapshot = await getDocs(requestsQuery);

        const historyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));


        setRequestsHistory(historyData);
      } catch (error) {
        console.error('Error fetching request history:', error.message);
      }
    };

    fetchRequestHistory();
  }, [user.uid]);

  return (
    <div className={classes.requestsHistory}>
      <table>
        <thead>
          <tr className={classes.header}>
            <th className={classes.label}>From</th>
            <th className={classes.label}>To</th>
            <th className={classes.label}>Am1</th>
            <th className={classes.label}>Am2</th>
            <th className={classes.label}>Time</th>
            <th className={classes.label}>Status</th>
          </tr>
        </thead>
        <tbody>
          {requestsHistory.map((request) => (
            <RequestRow key={request.id} request={request} showName={showAdmin} />
          ))}
        </tbody>
      </table>

      {/* <div className={classes.header}>
        <div className={classes.column}>
          <p className={classes.label}>From</p>
        </div>
        <div className={classes.column}>
          <p className={classes.label}>To</p>
        </div>
        <div className={classes.column}>
          <p className={classes.label}>Am1</p>
        </div>
        <div className={classes.column}>
          <p className={classes.label}>Am2</p>
        </div>
        <div className={classes.column}>
          <p className={classes.label}>Time</p>
        </div>
        <div className={classes.column}>
          <p className={classes.label}>Status</p>
        </div>
      </div>
      {requestsHistory.map((request) => (
        <RequestRow key={request.id} request={request} showName={showAdmin} />
      ))} */}
    </div>
  );
};

export default RequestsHistory;
