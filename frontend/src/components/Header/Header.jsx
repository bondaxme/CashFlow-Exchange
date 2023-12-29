import { Link } from "react-router-dom";
import classes from "./Header.module.css";
import logo from "../../assets/icons/logo.svg";
import { useAuth } from "../../hooks/useAuth";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const Header = () => {
  const user = useAuth();
  const auth = getAuth();
  const userAuth = auth.currentUser;
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (showPopup) {
      const timeoutId = setTimeout(() => {
        setShowPopup(false);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [showPopup]);

  const handleStartExchange = (e) => {
    e.preventDefault();

    if (!userAuth.emailVerified) {
      setError("Please verify your email first!");
      setShowPopup(true);
    } else {
      setError("");
      navigate("/start-exchange");
    }
  };

  return (
    <header className={classes.header}>
      {showPopup && <div className={classes.popup}>{error}</div>}

      {user.isAuth ? (
        user.isAdmin ? (
          <div className={classes.leftSide}>
            <Link to="/">
              <img className={classes.logo} src={logo} />
            </Link>
            <Link to="/">Home</Link>
            <Link to="/exchange-requests">Exchange Requests</Link>
          </div>
        ) : (
          <div className={classes.leftSide}>
            <Link to="/">
              <img className={classes.logo} src={logo} />
            </Link>
            <Link to="/">Home</Link>
            <Link to="/start-exchange" onClick={handleStartExchange}>
              Start Exchange
            </Link>
          </div>
        )
      ) : (
        <div className={classes.leftSide}>
          <Link to="/">
            <img className={classes.logo} src={logo} />
          </Link>
          <Link to="/">Home</Link>
        </div>
      )}

      {user.isAuth ? (
        <div className={classes.rightSide}>
          <Link to="/profile">Profile</Link>
        </div>
      ) : (
        <div className={classes.rightSide}>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
