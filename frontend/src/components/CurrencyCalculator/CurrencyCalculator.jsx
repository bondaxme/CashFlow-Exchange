import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import classes from "./CurrencyCalculator.module.css";
import { serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { collection, addDoc } from "firebase/firestore";
import exchangeSvg from "../../assets/icons/exchange.svg";

const CurrencyCalculator = ({ showCreateButton }) => {
  const [currencies, setCurrencies] = useState([]);
  const [sourceCurrency, setSourceCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [rates, setRates] = useState({});

  const user = useAuth();

  useEffect(() => {
    const fetchCurrencies = async () => {
      const ratesDoc = doc(db, "rates", "latestRates");
      const docSnapshot = await getDoc(ratesDoc);

      if (docSnapshot.exists()) {
        const ratesData = docSnapshot.data();
        const availableCurrencies = Object.keys(ratesData);

        if (!availableCurrencies.includes("UAH")) {
          availableCurrencies.unshift("UAH");
          ratesData["UAH"] = 1;
        }

        setCurrencies(availableCurrencies);
        setSourceCurrency(availableCurrencies[0]);
        setTargetCurrency(availableCurrencies[1]);
        setRates(ratesData);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (sourceCurrency && targetCurrency && amount !== "") {
      const sourceRate = rates[sourceCurrency];
      const targetRate = rates[targetCurrency];
      const convertedValue = ((amount * sourceRate) / targetRate).toFixed(2);
      setConvertedAmount(convertedValue);
    } else {
      setConvertedAmount("");
    }
  }, [sourceCurrency, targetCurrency, amount, rates]);

  const handleAmountChange = (e) => {
    const inputAmount = e.target.value;

    if (inputAmount === "" || /^[1-9]\d*\.?\d*$/.test(inputAmount)) {
      setAmount(inputAmount);
    }
  };

  const handleCurrencyChange = (e, type) => {
    const selected = e.target.value;
    if (type === "source") {
      setSourceCurrency(selected);
    } else {
      setTargetCurrency(selected);
    }
  };

  const handleExchangeClick = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
  };

  const handleCreateRequest = async () => {
    if (amount !== "" && sourceCurrency !== targetCurrency) {
      try {
        const requestsCollection = collection(db, "requests");

        await addDoc(requestsCollection, {
          sourceCurrency,
          targetCurrency,
          amount: (parseFloat(amount) + parseFloat(amount / 100)).toFixed(2),
          convertedAmount: parseFloat(convertedAmount),
          userId: user.uid,
          timestamp: serverTimestamp(),
          status: "pending",
        });

        console.log("Request created successfully!");
      } catch (error) {
        console.error("Error creating request:", error.message);
      }
    }
  };

  return (
    <div className={classes.currencyCalculator}>
      <div className={classes.calc}>
        <div className={classes.currencyBlock}>
          <select
            className={classes.currencySelectLeft}
            value={sourceCurrency}
            onChange={(e) => handleCurrencyChange(e, "source")}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input
            className={classes.currencyInput}
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
          />
        </div>
        <img
          src={exchangeSvg}
          className={classes.exchangeBtn}
          alt="Exchange"
          onClick={handleExchangeClick}
        />
        <div className={classes.currencyBlock}>
          <select
            className={classes.currencySelectRight}
            value={targetCurrency}
            onChange={(e) => handleCurrencyChange(e, "target")}
          >
            {currencies.map((currency) => (
              <option className={classes.option} key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input
            className={classes.currencyResult}
            type="text"
            value={convertedAmount}
            readOnly
            placeholder="You receive"
          />
        </div>
        <div className={classes.currencyBlock}>
          {showCreateButton ? (
            <button
              className={classes.createRequestButton}
              onClick={handleCreateRequest}
            ></button>
          ) : null}
        </div>
      </div>
      <div>
        <p className={classes.info}>
          Comission for exchange is 1% of the amount: {(amount / 100).toFixed(2)} {sourceCurrency}
        </p>
      </div>
    </div>
  );
};

export default CurrencyCalculator;
