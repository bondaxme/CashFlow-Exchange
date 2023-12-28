import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import StartExchange from "./pages/StartExchange/StartExchange";
import { useDispatch } from 'react-redux';
import { setUser, removeUser } from "./reducers/userReducer";
import { useEffect } from "react";
import { auth } from "./firebase";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Profile from "./pages/Profile/Profile";
import AdminExchangeRequests from "./pages/AdminExchangeRequests/AdminExchangeRequests";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            dispatch(
              setUser({
                firstName: data.firstName,
                lastName: data.lastName,
                email: user.email,
                currencyDiff: data.currencyDiff,
                isAdmin: data.isAdmin,
                uid: user.uid,
              })
            );
          } else {
            console.log('User does not exist in Firestore.');
          }
        });
      } else {
        dispatch(removeUser());
      }
    });
    return () => {
      unsubscribe();
    };
  }, [dispatch]);
  

  return (
    <>
      <Header />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/start-exchange" element={<StartExchange />} />
        <Route path="/exchange-requests" element={<AdminExchangeRequests />} />
      </Routes>
    </>
  )
}

export default App;
