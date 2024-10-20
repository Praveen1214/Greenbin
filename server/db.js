const mongoose = require("mongoose");
require("dotenv").config();

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    if (!this.connection) {
      mongoose
        .connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => {
          console.log("MongoDB Connection Successful");
        })
        .catch((err) => {
          console.error("MongoDB Connection Failed", err);
        });
      
      this.connection = mongoose.connection;
    }

    return this.connection;
  }
}

module.exports = new Database();
