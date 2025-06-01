require("dotenv").config();
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const crypto = require("crypto");

// Code File Imports
const generator = require("./src/v1/generate-v1");
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

async function hexBytesToSHA256(hexString) {
  const cleanHex = hexString.replace(/[^0-9a-fA-F]/g, '');
  const buffer = Buffer.from(cleanHex, 'hex');

  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
}

async function getRandomSeed() {
  const response = await fetch("https://www.random.org/cgi-bin/randbyte?nbytes=256&format=h");
  const hexString = await response.text();
  const seed = await hexBytesToSHA256(hexString);
  return seed;
}

// Get random Character Metadata
app.get(`/random/metadata`, async (req, res) => {
  res.header("Content-Type", "application/json");
  res.send(metadata.getMetadata(0, await generator.generateRandom(await getRandomSeed())));
});

// Get Character Metadata Based on Seed
app.get(`/seed/:seed([a-zA-Z0-9]+)/metadata`, async (req, res) => {
  var seed = req.params.seed;
  if (seed == "random") {
    seed = await getRandomSeed();
  }
  res.header("Content-Type", "application/json");
  res.send(metadata.getMetadata(0, await generator.generateRandom(seed)));
});

// Server Listen
app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
});