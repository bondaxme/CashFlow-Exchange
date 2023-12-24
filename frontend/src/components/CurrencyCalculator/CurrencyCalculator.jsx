import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import classes from './CurrencyCalculator.module.css';

const CurrencyCalculator = ( onCreateRequest ) => {
  const [currencies, setCurrencies] = useState([]);
  const [sourceCurrency, setSourceCurrency] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [rates, setRates] = useState({});

  useEffect(() => {
    const fetchCurrencies = async () => {
      const ratesDoc = doc(db, 'rates', 'latestRates');
      const docSnapshot = await getDoc(ratesDoc);

      if (docSnapshot.exists()) {
        const ratesData = docSnapshot.data();
        const availableCurrencies = Object.keys(ratesData);

        if (!availableCurrencies.includes('UAH')) {
            availableCurrencies.unshift('UAH');
            ratesData['UAH'] = 1;
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
    if (sourceCurrency && targetCurrency && amount !== '') {
      const sourceRate = rates[sourceCurrency];
      const targetRate = rates[targetCurrency];
      const convertedValue = ((amount * sourceRate) / targetRate).toFixed(2);
      setConvertedAmount(convertedValue);
    } else {
      setConvertedAmount('');
    }
  }, [sourceCurrency, targetCurrency, amount, rates]);

  const handleAmountChange = (e) => {
    const inputAmount = e.target.value;
    setAmount(inputAmount);
  };

  const handleCurrencyChange = (e, type) => {
    const selected = e.target.value;
    if (type === 'source') {
      setSourceCurrency(selected);
    } else {
      setTargetCurrency(selected);
    }
  };

  return (
    <div className={classes.CurrencyCalculator}>
      <div className={classes.CurrencyBlock}>
        <select className={classes.CurrencySelect} value={sourceCurrency} onChange={(e) => handleCurrencyChange(e, 'source')}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
           ))}
        </select>
        <input
          className={classes.CurrencyInput}
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
        />
      </div>
      <div className={classes.CurrencyBlock}>
        <select className={classes.CurrencySelect} value={targetCurrency} onChange={(e) => handleCurrencyChange(e, 'target')}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
           ))}
        </select>
        <input className={classes.CurrencyResult} type="text" value={convertedAmount} readOnly placeholder="You receive" />
      </div>
      {/* <div>
        <button onClick={onCreateRequest}>Create Request</button>
      </div> */}
    </div>
  );
};

export default CurrencyCalculator;
