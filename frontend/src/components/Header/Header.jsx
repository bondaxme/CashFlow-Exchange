import { Link } from 'react-router-dom';
import classes from './Header.module.css';

const Header = () => {
  return (
    <header className={classes.header}>
      <div className={classes.leftSide}>
        <Link to="/">
          <img src="./assets/logo.png" alt="Logo" className={classes.logo} />
        </Link>
        <Link to="/">Home</Link>
      </div>
      <div className={classes.rightSide}>
        <Link to="/signin">Sign In</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </header>
  );
};

export default Header;
