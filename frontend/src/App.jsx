import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import { useEffect } from "react";
import { auth, firestoreDb } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser, removeUser } from "./redux/userReducer";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(firestoreDb, 'users', user.uid);
        onSnapshot(userRef, (snapshot) => {
          const data = snapshot.data();
          dispatch(
            setUser({
              firstName: data.firstName,
              lastName: data.lastName,
              email: user.email,
              uid: user.uid,
            })
          );
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
      </Routes>
    </>
  )
}

export default App
