const auth = require("../middleware/auth.js");
const { Customers, validation } = require("../models/customer.js"); // LEARN OBJECT DESTRUCTURING
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//REST HANDLERS WITH CRUD------------------------------------------------------------------------------------------------------------------------------------------------
// CHECK ALL√------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/", async (req, res) => {
  const customers = await Customers.find().sort("name");
  res.send(customers);
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// CHECK BY ID------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customers.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    res.status(404).send("The requested customer does not exist");
  }
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ADD√------------------------------------------------------------------------------------------------------------------------------------------------
router.post("/", auth, async (req, res) => {
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = new Customers({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  await customer.save();
  res.send(customer);
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// MODIFY√------------------------------------------------------------------------------------------------------------------------------------------------
router.put("/:id", async (req, res) => {
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let customer = await Customers.findById(req.params.id);
    customer.name = req.body.name;
    customer.isGold = req.body.isGold;
    customer.phone = req.body.phone;
    customer = await customer.save();
    res.send(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// DELETE√------------------------------------------------------------------------------------------------------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customers.findByIdAndRemove(req.params.id);
    if (!customer)
      return res.status(404).send("The requested customer does not exist");
    res.send("The customer is now deleted");
  } catch (error) {
    return res.status(404).send("The requested customer does not exist");
  }
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

module.exports = router;
