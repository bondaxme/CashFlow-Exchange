import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import classes from './CurrencyCalculator.module.css';

const CurrencyCalculator = () => {
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

  const handleAmountChange = (e) => {
    const inputAmount = e.target.value;
    setAmount(inputAmount);

    if (sourceCurrency && targetCurrency && inputAmount !== '') {
      const sourceRate = rates[sourceCurrency];
      const targetRate = rates[targetCurrency];
      const convertedValue = ((inputAmount * sourceRate) / targetRate).toFixed(2);
      setConvertedAmount(convertedValue);
    } else {
      setConvertedAmount('');
    }
  };

  const handleCurrencyChange = (e, type) => {
    const selected = e.target.value;
    if (type === 'source') {
      setSourceCurrency(selected);
    } else {
      setTargetCurrency(selected);
    }

    if (amount !== '') {
      const sourceRate = rates[sourceCurrency];
      const targetRate = rates[targetCurrency];
      const convertedValue = ((amount * sourceRate) / targetRate).toFixed(2);
      setConvertedAmount(convertedValue);
    } else {
      setConvertedAmount('');
    }
  };

  return (
    <div>
      <div>
        <label className={classes.label}>Select Source Currency:</label>
        <select className={classes.select} value={sourceCurrency} onChange={(e) => handleCurrencyChange(e, 'source')}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={classes.label}>Enter Amount:</label>
        <input className={classes.input} type="number" value={amount} onChange={handleAmountChange} />
      </div>
      <div>
        <label className={classes.label}>Select Target Currency:</label>
        <select className={classes.select} value={targetCurrency} onChange={(e) => handleCurrencyChange(e, 'target')}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={classes.label}>Converted Amount:</label>
        <span className={classes.result}>{convertedAmount}</span>
      </div>
    </div>
  );
};

export default CurrencyCalculator;
