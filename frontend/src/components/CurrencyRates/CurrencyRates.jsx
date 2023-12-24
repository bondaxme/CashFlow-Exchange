import { useEffect, useState } from 'react';

import classes from './CurrencyRates.module.css';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

import usdIcon from '../../assets/icons/US.svg';
import eurIcon from '../../assets/icons/EU.svg';
import plnIcon from '../../assets/icons/PL.svg';
import gbpIcon from '../../assets/icons/UK.svg';

const currencyIcons = {
  USD: usdIcon,
  EUR: eurIcon,
  PLN: plnIcon,
  GBP: gbpIcon,
};

const CurrencyRates = () => {
  const [rates, setRates] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        const endpoint = 'latest';
        const baseCurrency = 'UAH';
    
        try {
          const response = await fetch(`https://v6.exchangerate-api.com/v6/${endpoint}/${baseCurlrency}`, {
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_EXCHANGE_RATES_API_KEY}`,
            },
          });
          const data = await response.json();
    
          const requiredCurrencies = ['USD', 'EUR', 'PLN', 'GBP'];

          const filteredRates = Object.fromEntries(
          Object.entries(data.conversion_rates)
            .filter(([currency]) => requiredCurrencies.includes(currency))
          );

          const reciprocalRates = Object.fromEntries(
            Object.entries(filteredRates).map(([currency, rate]) => [currency, 1 / rate])
          );

          setRates(reciprocalRates);

          const ratesDoc = doc(db, 'rates', 'latestRates');
          await setDoc(ratesDoc, reciprocalRates);

          console.log(rates);
        } catch (error) {
          console.log(`Error fetching currency rates: ${error.message}`);
        }
    };

    fetchData();
  }, []);


  return (
    <div>
        <h2 className={classes.header}>Exchange rates</h2>
        <table className={classes.table}>
            <thead>
                <tr className={classes.tableRow}>
                    <th className={classes.tableHeader}>Currency</th>
                    <th className={classes.tableHeader}>Purchase</th>
                    <th className={classes.tableHeader}>Sale</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(rates).map(([currency, rate]) => (
                    <tr className={classes.tableRow} key={currency}>
                        <td className={classes.tableFields}>
                          <div className={classes.currencyInfo}>
                            <img className={classes.flag} src={currencyIcons[currency]} alt={currency} />
                            <span>{currency}</span>
                          </div>
                        </td>
                        <td className={classes.tableFields}>{(rate).toFixed(2)}</td>
                        <td className={classes.tableFields}>{(rate + 0.01 * (rate)).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};

export default CurrencyRates;

