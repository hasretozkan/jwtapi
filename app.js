const express = require("express");
const app = express();
const port = 3000;
const authDB = require("./authDB.json");
const config = require("./config.json");
const jwt = require("jsonwebtoken");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!!!username || !!!password) {
    return res
      .status(400)
      .send(JSON.stringify({ code: 1, message: "Missing parameters" }));
  }

  start();

  async function start() {
    const filteredArray = authDB.filter((u) => u.username === username);

    if (!filteredArray.length) {
      return res
        .status(400)
        .send(JSON.stringify({ code: 2, message: "Username is wrong." }));
    }

    const filteredUser = filteredArray[0];

    if (filteredUser.password === password) {
      var token = jwt.sign(filteredUser, config.PRIVATEKEY, {
        expiresIn: "1h",
      });

      return res
        .status(200)
        .send(JSON.stringify({ code: 0, message: "OK", data: token }));
    }

    return res
      .status(400)
      .send(JSON.stringify({ code: 3, message: "Password is wrong." }));
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
