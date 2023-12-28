import { Link } from 'react-router-dom';
import classes from './Header.module.css';
import logo from '../../assets/icons/logo.svg';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const user = useAuth();

  return (
    <header className={classes.header}>
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
            <Link to="/start-exchange">Start Exchange</Link>
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
