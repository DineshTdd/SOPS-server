const express = require("express");
const {
  userRegister,
  userLogin,
  userLogout,
  setAvatar,
} = require("../controllers/user");
const auth = require("../middlewares/auth");
const multerConfig = require("../middlewares/multer").multerConfig;
const { celebrate, errors, Joi } = require("celebrate");

const router = new express.Router();
router.get("/", auth, async (req, res) => {
  res.send(req.user);
});

// Password Regex
// ^                         Start anchor
// (?=.*[A-Z].*[A-Z])        Ensure string has two uppercase letters.
// (?=.*[!@#$&*])            Ensure string has one special case letter.
// (?=.*[0-9].*[0-9])        Ensure string has two digits.
// (?=.*[a-z].*[a-z].*[a-z]) Ensure string has three lowercase letters.
// .{8,20}                      Ensure string is of length 8-20.
// $                         End anchor.

router.post(
  "/register",
  celebrate({
    body: Joi.object()
      .keys({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().pattern(
          new RegExp(
            "^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,20}$"
          )
        ),
        repeatPassword: Joi.ref("password"),
        email: Joi.string().lowercase().email().required(),
      })
      .required(),
  }),
  errors(),
  (req, res) => {
    let userData = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    };
    userRegister(userData).then(
      (result) => res.status(200).json(result),
      (err) => res.status(500).json(err)
    );
  }
);

router.post(
  "/login",
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().lowercase().email().required(),
        password: Joi.string().required(),
      })
      .required(),
  }),
  errors(),
  (req, res) => {
    userLogin({ email: req.body.email, password: req.body.password }).then(
      (result) => res.status(200).json(result),
      (err) => res.status(500).json(err)
    );
  }
);

router.post("/logout", auth, (req, res) => {
  return userLogout(req, res);
});

router.post(
  "/me/avatar",
  auth,
  multerConfig.single("avatar"),
  (req, res) => {
    return setAvatar(req, res);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
