import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerContent}>
        <div className={classes.footerSection}>
          <h3>About Us</h3>
          <p>
            CashFlow Exchange offers the ultimate in simplified interaction
            between the individual and the point of exchange. You can track the
            latest and best exchange rates, create exchange orders and receive
            notifications of rate updates
          </p>
        </div>

        <div className={classes.footerSection}>
          <h3>Contact Us</h3>
          <p>Email: cash.flow.exchange.bsn@gmail.com</p>
          <p>Phone: +38 (095) 68-34-322</p>
        </div>
      </div>

      <div className={classes.footerBottom}>
        <p>&copy; 2023 CashFlow Exchange. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
