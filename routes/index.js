const express = require("express");

const auth0 = require("auth0");
require("dotenv").config();

const router = express.Router();

//Inegration
const management = new auth0.ManagementClient({
  domain: process.env.DOMAIN,
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  token: process.env.TOKEN ,
  scope: "read:users",
});

//GET USERS API
router.get("/users", (req, res) => {
  management.getUsers({ per_page: 100 }, (err, users) => {
    if (err) {
      return res.status(500).send({ error: err });
    }
    return res.status(200).send({ users: users });
  });
});

//Get User by ID
router.get("/userById", async (req, res) => {
  const { id } = req.body;

  try {
    const user = await management.getUser({
      id: id,
    });
    res.status(200).send({ success: true, user: user });
  } catch (error) {
    res.send(error);
  }
});

//Add Claim API
router.post("/addClaim", (req, res) => {
  management
    .updateUserMetadata(
      { id: req.body.id },
      {
        "can-manage-users": true,
      }
    )
    .then((user) => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: err });
    });
});

//CreateUser API
router.post("/createUser", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const newUser = await management.createUser({
      email: email,
      password: password,
      name: name,
      connection: "Username-Password-Authentication",
    });

    res.send({ success: true, newUser });
  } catch (err) {
    res.status(400).send({ success: false, error: err });
  }
});

//UpdateUser API
router.patch("/updateUser", async (req, res) => {
  const { id, email, password, name } = req.body;

  try {
    const updates = await management.updateUser(
      {
        id: id,
      },
      { email: email, name: name, password: password }
    );
    res.status(200).send({ success: true, updates });
  } catch (err) {
    res.status(400).send({ success: false, err });
  }
});

//DeleteUser API
router.delete("/deleteUser", async (req, res) => {
  const { id } = req.body;
  try {
    management.deleteUser({
      id: id,
    });
    res.status(200).send({ deleted: true });
  } catch (err) {
    res.status(400).send({ deleted: false, err });
  }
});

module.exports = router;
