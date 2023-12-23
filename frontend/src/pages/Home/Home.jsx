
import classes from "./Home.module.css";

const Home = () => {
  return (
    <div className={classes.homeBody}>
      <h2 className={classes.greeting}>Welcome!</h2>
      <p className={classes.p1}>Calculate the amount you want to change</p>
      
    </div>
  );
};

export default Home;