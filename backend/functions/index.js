
require('dotenv').config();
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { ProjectConfig } = require('firebase-admin/auth');

admin.initializeApp();

exports.fetchRatesAndWriteToFirestore = functions.pubsub
  .schedule('0 12 * * *')
  .timeZone('EET')
  .onRun(async (context) => {

    const endpoint = 'latest';
    const baseCurrency = 'UAH';

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${endpoint}/${baseCurrency}`, {
            headers: {
                Authorization: `Bearer ${process.env.VITE_EXCHANGE_RATES_API_KEY}`,
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

      console.log('Rates fetched and written to Firestore successfully.');
      return null;
    } catch (error) {
      console.error('Error fetching and writing rates:', error.message);
      return null;
    }
  });
