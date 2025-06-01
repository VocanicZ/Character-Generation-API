require("dotenv").config();
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const crypto = require("crypto");

const { registerFont } = require("canvas");
registerFont(__dirname + "/assets/Press_Start_2P/PressStart2P-Regular.ttf", {
  family: "Press Start 2P",
  Style: "Regular",
});

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

// Link CSS and script files
app.use("/", express.static(__dirname + "/assets/"));

app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, "/README.html"));
});

async function hexBytesToSHA256(hexString) {
  const cleanHex = hexString.replace(/[^0-9a-fA-F]/g, '');
  const buffer = Buffer.from(cleanHex, 'hex');

  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
}

app.get(`/v2/metadata`, async (req, res) => {
  try {
    const response = await fetch("https://www.random.org/cgi-bin/randbyte?nbytes=256&format=h");
    const hexString = await response.text();
    // Step 2: Convert to SHA-256
    const seed = await hexBytesToSHA256(hexString);
    res.header("Content-Type", "application/json");
    res.send(metadata.getMetadata(0, await generator.generateRandom(seed)));
  } catch (error) {
    console.error("Error generating metadata:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get Character Metadata Based on Seed
app.get(`/v2/seed/:seed([a-zA-Z0-9]+)/metadata`, async (req, res) => {
  const seed = req.params.seed;
  res.header("Content-Type", "application/json");
  res.send(metadata.getMetadata(0, await generator.generateRandom(seed)));
});

// Server Listen
app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
});