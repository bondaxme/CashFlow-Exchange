import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import RequestRow from '../RequestRow/RequestRow';
import classes from './RequestsHistory.module.css';
import { query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

const RequestsHistory = () => {
  const [requestsHistory, setRequestsHistory] = useState([]);
  const user = useAuth();


  useEffect(() => {
    const fetchRequestHistory = async () => {
      try {
        const requestsCollection = collection(db, 'requests');

        const requestsQuery = query(
            requestsCollection,
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );
        
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
      <div className={classes.column}>
        <p className={classes.label}>Source Currency</p>
      </div>
      <div className={classes.column}>
        <p className={classes.label}>Target Currency</p>
      </div>
      <div className={classes.column}>
        <p className={classes.label}>Amount</p>
      </div>
      <div className={classes.column}>
        <p className={classes.label}>Converted Amount</p>
      </div>
      <div className={classes.column}>
        <p className={classes.label}>Timestamp</p>
      </div>
      <div className={classes.column}>
        <p className={classes.label}>Status</p>
      </div>
      {requestsHistory.map((request) => (
        <RequestRow key={request.id} request={request} />
      ))}
    </div>
  );
};

export default RequestsHistory;
