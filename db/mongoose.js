const mongoose = require('mongoose');
const mclient = {};
//Connect to DB
mclient.mconnect = () => {
  // dbUrl = `mongodb+srv://${process.env.MONGOATLASDB_USER}:${process.env.MONGOATLASDB_PASSWORD}@development-m0vmd.mongodb.net/${process.env.MONGOATLASDB_DBNAME}?retryWrites=true&w=majority`;
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log(`Connected to ${process.env.MONGOATLASDB_DBNAME}`);
    })
    .catch((err) => {
      console.log(err, 'Connection not established');
    });
};

exports.mclient = mclient;
