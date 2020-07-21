const express = require("express");
const auth = require("../middlewares/auth");
const { celebrate, errors, Joi } = require("celebrate");
const multerConfig = require("../middlewares/multer").multerConfig;
const {
  fetchCardDetails,
  addNewCard,
  createSnapshot,
} = require("../controllers/card");
const User = require("../models/user");
const router = new express.Router();

// Get All the card details
router.get("/", auth, (req, res) =>
  fetchCardDetails(req.user).then(
    (result) => res.status(200).json(result),
    (err) => res.status(500).json(err)
  )
);

// Add new card
router.post(
  "/new",
  auth,
  celebrate({
    body: Joi.object()
      .keys({
        cardName: Joi.string().required().min(2).max(26),
        cardHoldername: Joi.string().required().min(2).max(20),
        cardNumber: Joi.string().required().length(16),
        cardExpiryMonth: Joi.string().required().length(2),
        cardExpiryYear: Joi.string().required().length(2),
        cardCVV: Joi.string().required().length(3),
      })
      .required(),
  }),
  errors(),
  (req, res) => {
    return addNewCard(
      {
        email: req.user.email,
        card_name: req.body.cardName,
        card_number: req.body.cardNumber,
        card_holder_name: req.body.cardHoldername,
        expiry_month: req.body.cardExpiryMonth,
        expiry_year: req.body.cardExpiryYear,
        cvv: req.body.cardCVV,
        owner: req.user._id,
      },
      res
    );
  }
);

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
