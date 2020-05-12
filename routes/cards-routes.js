const express = require("express");
const auth = require("../middlewares/auth");
const multerConfig = require("../middlewares/multer").multerConfig;
const { fetchCardDetails, addNewCard, createSnapshot } = require("../controllers/card");
const User = require("../models/user");
const router = new express.Router();

// Get All the card details
router.get("/", auth, (req, res) => fetchCardDetails(req, res));

// Add new card
router.post("/new", auth, (req, res) => {
  return addNewCard(
    {
      card_name: req.body.cardname,
      card_number: req.body.cardnumber,
      card_holder_name: req.body.cardholdername,
      expiry_month: req.body.mon,
      expiry_year: req.body.year,
      cvv: req.body.cvv,
      passphrase: req.body.passphrase,
      owner: req.user._id,
    },
    res
  );
});

router.post(
  "/checkout",
  auth,
  multerConfig.single("snapshot"),
  (req, res) => createSnapshot(req, res),
  (error, req, res, next) => {
    res.send(error);
  }
);

module.exports = router;
