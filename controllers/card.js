const cardDetails = require("../models/card_details");
const NodeRSA = require("node-rsa");
const CryptoJS = require("crypto-js");
const steggy = require("steggy");
const fs = require("fs");
const { randomBytes } = require("crypto");
const cryptoRandomString = require("crypto-random-string");

// import email service for sending passphrasee
const { sendPassphrase } = require("../services/email");

exports.fetchCardDetails = (user) => {
  return new Promise((resolve, reject) => {
    const fetch = async () => {
      try {
        await user.populate("cards").execPopulate();
        console.log(user.cards);
        resolve({ status: 200, result: user.cards });
      } catch (err) {
        reject({ status: 500, err });
      }
    };
    fetch();
  });
};

exports.addNewCard = async (
  {
    email,
    card_name,
    card_number,
    card_holder_name,
    expiry_month,
    expiry_year,
    cvv,
    owner,
  },
  res
) => {
  try {
    const key = new NodeRSA({ b: 1024 });
    const text = randomBytes(256).toString();
    const privateKey = key.encrypt(text, "base64");
    // const decryptedKey = key.decrypt(privateKey, "utf8");
    var data = {
      card_number,
      card_holder_name,
      expiry_month,
      expiry_year,
      cvv,
    };
    // var passphrase = Math.random().toString(36).slice(-8);
    var passphrase = cryptoRandomString({ length: 10, type: "base64" });
    console.log(passphrase);
    var encrypted = CryptoJS.TripleDES.encrypt(
      JSON.stringify(data),
      privateKey
    );
    var encryptedCard = encrypted.toString();

    // var encryptedCard = key.encrypt(JSON.stringify(data), "base64");
    const storeDetails = encryptedCard.slice(0, encryptedCard.length / 2);
    const sendDetails = encryptedCard.slice(encryptedCard.length / 2);
    const decryptKey = storeDetails + sendDetails;
    //   console.log("Card: ", encryptedCard);
    //   console.log("Card: ", decryptKey);
    //   console.log("Store: ", storeDetails);
    //   console.log("Send:", sendDetails);
    //   console.log("Decrypt Key: ", decryptKey);

    // console.log(JSON.parse(key.decrypt(decryptKey, 'utf8')));

    //   console.log(
    //     JSON.parse(CryptoJS.TripleDES.decrypt(decryptKey, privateKey).toString(CryptoJS.enc.Utf8))
    //   );

    const card = new cardDetails({
      card_name,
      card_details_private_key: privateKey,
      card_details_user_snap: storeDetails,
      passphrase,
      owner,
    });

    const original = fs.readFileSync(__dirname + "/input.png");
    const concealed = steggy.conceal()(original, sendDetails);
    fs.writeFileSync(__dirname + "/result.png", concealed);
    const image = fs.readFileSync(__dirname + "/result.png");
    const revealed = steggy.reveal()(image);
    // console.log('Send Details: ', revealed.toString());
    // console.log(JSON.parse(key.decrypt(storeDetails + revealed.toString(), 'utf8')));
    await card.save();
    // console.log(card);

    const sendPassphraseObject = { email, passphrase, cardName: card_name };
    sendPassphrase(sendPassphraseObject);
    res.status(201).send(card);
  } catch (e) {
    res.status(400).send("Error" + e);
  }
};

exports.createSnapshot = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const userSnap = req.file.buffer;
    const userPassphrase = req.body.passphrase;
    const cardName = req.body.cardname;
    // const revealed = steggy.reveal()(userSnap);
    // console.log(revealed.toString());
    const user = await User.findOne({ email: userEmail });
    // await user.populate("cards").execPopulate();
    const [card, info] = await cardDetails.findByCredentials(
      user._id,
      cardName,
      req.file.buffer,
      req.body.passphrase
    );
    console.log(card);

    const checker = card.card_details_user_snap;
    const totalSnap = checker + info;
    const priv = card.card_details_private_key;
    const sendIt = JSON.parse(
      CryptoJS.TripleDES.decrypt(totalSnap, priv).toString(CryptoJS.enc.Utf8)
    );
    res.send(sendIt);
  } catch (err) {
    res.status(500).send("" + err);
  }
};
