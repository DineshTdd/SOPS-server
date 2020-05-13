const sharp = require("sharp");
const User = require("../models/user");

exports.userRegister = (userData) => {
  return new Promise((resolve, reject) => {
    const newUser = new User(userData);
    try {
      const generateUser = async () => {
        try {
          let result = await new Promise(async (resolve, reject) => {
            await newUser.save().then(
              async (user) => {
                let token = await new Promise((resolve) =>
                  newUser.generateAuthToken().then(
                    (result) => resolve(result),
                    async (err) => {
                      console.log(err);
                      await newUser.remove();
                      reject({ status: 500, message: "User creation failed!", err });
                    }
                  )
                );
                resolve({ user, token });
              },
              (err) => {
                reject({ status: 500, message: "User creation failed!", err });
              }
            );
          });
          if (result.user && result.token) {
            resolve({ status: 200, result });
          } else {
            throw result;
          }
        } catch (err) {
          // console.log(err);
          reject(err);
        }
      };
      generateUser();
    } catch (err) {
      reject({ status: 500, err });
    }
  });
};
exports.userLogin = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    try {
      let login = async () => {
        const user = await User.findByCredentials(email, password).catch((err) => {
          return reject({ status: 500, error: err });
        });
        const token = await new Promise((resolve) => {
          return user
            .generateAuthToken()
            .then((tok) => resolve(tok))
            .catch((err) => {
              return reject({ status: 500, error: err });
            });
        });
        return resolve({ status: 200, result: { user, token } });
      };
      return login();
    } catch (err) {
      return reject({ status: 500, error: "Email or password may be wrong!", err });
    }
  });
};

exports.setAvatar = async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250,
      })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
};

exports.userLogout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send("Logged out");
  } catch (e) {
    res.status(500).send(e);
  }
};
