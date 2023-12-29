require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

admin.initializeApp();

exports.fetchRatesAndWriteToFirestore = functions.pubsub
  .schedule("0 12 * * *")
  .timeZone("UTC")
  .onRun(async (context) => {
    try {
      const endpoint = "latest";
      const baseCurrency = "UAH";
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${endpoint}/${baseCurrency}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VITE_EXCHANGE_RATES_API_KEY}`,
          },
        }
      );
      const data = response.data;

      const requiredCurrencies = ["USD", "EUR", "PLN", "GBP"];

      const filteredRates = Object.fromEntries(
        Object.entries(data.conversion_rates).filter(([currency]) =>
          requiredCurrencies.includes(currency)
        )
      );

      const reciprocalRates = Object.fromEntries(
        Object.entries(filteredRates).map(([currency, rate]) => [
          currency,
          1 / rate,
        ])
      );

      console.log(reciprocalRates);
      console.log(reciprocalRates);
      console.log(reciprocalRates);

      // reciprocalRates = fetchTest();

      const ratesDoc = admin.firestore().collection("rates").doc("latestRates");
      const docSnapshot = await ratesDoc.get();

      const {
        USD = null,
        EUR = null,
        PLN = null,
        GBP = null,
      } = docSnapshot.data() || {};

      const usersSnapshot = await admin.firestore().collection("users").get();

      const sendEmailPromises = [];

      usersSnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();
        const currencyDiff = userData.currencyDiff || {};

        console.log(currencyDiff);

        const newRates = {
          USD: reciprocalRates.USD || null,
          EUR: reciprocalRates.EUR || null,
          PLN: reciprocalRates.PLN || null,
          GBP: reciprocalRates.GBP || null,
        };

        const rateDifferences = {
          USD: newRates.USD - USD,
          EUR: newRates.EUR - EUR,
          PLN: newRates.PLN - PLN,
          GBP: newRates.GBP - GBP,
        };

        console.log(rateDifferences);

        const emailMessages = Object.entries(rateDifferences)
          .filter(
            ([currency, diff]) =>
              Math.abs(diff) >= currencyDiff[currency] &&
              currencyDiff[currency] !== null
          )
          .map(([currency, diff]) => {
            return `${currency} rate changed by ${diff.toFixed(
              2
            )}\nOld rate: ${docSnapshot
              .data()
              [currency].toFixed(2)}\nNew rate: ${newRates[currency].toFixed(
              2
            )}\n`;
          });

        const message = emailMessages.join("");

        console.log(message);

        if (message) {
          sendEmailPromises.push(
            sendEmailNotification(userData.email, message)
          );
        }
      });

      await Promise.all(sendEmailPromises);

      const ratesRef = admin.firestore().collection("rates").doc("latestRates");
      await ratesRef.set(reciprocalRates);

      console.log("Rates fetched and written to Firestore successfully.");
      return null;
    } catch (error) {
      console.error("Error fetching and writing rates:", error.message);
      return null;
    }
  });

async function sendEmailNotification(email, message) {
  console.log(process.env.GMAIL_ADDRESS, process.env.GMAIL_PASSWORD);
  const transporter = nodemailer.createTransport(
    smtpTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASSWORD,
      },
    })
  );

  const mailOptions = {
    from: process.env.GMAIL_ADDRESS,
    to: email,
    subject: "Exchange Rate Notification",
    text: message,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: " + info.response);
  });
}

// function fetchTest()
// {
//   return {
//     USD: 38,
//     EUR: 42,
//     PLN: 9,
//     GBP: 46,
//   }
// }
