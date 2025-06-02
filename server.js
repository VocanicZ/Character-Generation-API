require("dotenv").config();
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

// Code File Imports
const utils = require("./src/utils");
const generator = require("./src/v1/generate");
const metadata = require("./src/metadata");

// API Server Info
const app = express();
const port = process.env.PORT || 3030;

// CORs Headers
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get(`/test`, async (req, res) => {
  const result = await generator.test();
  res.header("Content-Type", "application/json");
  res.send(metadata.getMetadata(0, result));
});

// Get random Character Metadata
app.get(`/random/metadata`, async (req, res) => {
  res.header("Content-Type", "application/json");
  const cha = await generator.generateRandom();
  if (cha) {
    res.send(metadata.getMetadata(0, cha));
  }
  else {
    res.status(400).send('invalid seed')
  }
});

app.get(`/random-family/:family([a-zA-Z0-9]+)/metadata`, async (req, res) => {
  var family = req.params.family;
  res.header("Content-Type", "application/json");
  const cha = await generator.generateRandom('', family);
  if (cha) {
    res.send(metadata.getMetadata(0, cha));
  }
  else {
    res.status(400).send('invalid seed')
  }
});

// Get Character Metadata Based on Seed
app.get(`/seed/:seed([a-zA-Z0-9]+)/metadata`, async (req, res) => {
  var seed = req.params.seed;
  if (seed == "random") {
    seed = '';
  }
  res.header("Content-Type", "application/json");
  const cha = await generator.generateRandom(seed);
  if (cha) {
    res.send(metadata.getMetadata(0, cha));
  }
  else {
    res.status(400).send('invalid seed')
  }
});

// Server Listen
app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
});