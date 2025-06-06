// Node Module Imports
// Code File Imports
const utils = require("../utils");
const { sha3_256 } = require("js-sha3");

// Asset Imports
const bowsInfo = require("../../assets/v1/weapons/bows.json");
const staffsInfo = require("../../assets/v1/weapons/staffs.json");
const daggersInfo = require("../../assets/v1/weapons/daggers.json");
const swordsInfo = require("../../assets/v1/weapons/swords.json");
const chestInfo = require("../../assets/v1/shirts/chest.json");
const legInfo = require("../../assets/v1/legs/leg.json");
const bodyInfo = require("../../assets/v1/body/body.json");
const eyeInfo = require("../../assets/v1/eyes/eye.json");
const hairInfo = require("../../assets/v1/hair/hair.json");
const facialHairInfo = require("../../assets/v1/facial-hair/facial-hair.json");
const maleFirstNames = require("../../assets/attributes/firstNameMale.json");
const femaleFirstNames = require("../../assets/attributes/firstNameFemale.json");
const lastNames = require("../../assets/attributes/LastName.json");
const sex = require("../../assets/attributes/sex.json");
const classes = require("../../assets/attributes/classes.json");
const backgroundInfo = require("../../assets/attributes/background.json");

// ******************************************//
// Generate Methods for Characters/ NPC's
// ******************************************//

// Generate random character
const generateRandom = async (seed) => {
  // Hash the seed with the SHA256 Algorithm
  let lastRand = {
    v: sha3_256(seed).slice(-64),
  };

  var con = utils.rollStat(lastRand);
  var sexVal = sex[Math.floor(utils.getRand(lastRand, 0, sex.length))];
  var classVal =
    classes[Math.floor(utils.getRand(lastRand, 0, classes.length))];

  if (sexVal === "Male") {
    var name =
      maleFirstNames[
        Math.floor(utils.getRand(lastRand, 0, maleFirstNames.length))
      ] +
      " " +
      lastNames[Math.floor(utils.getRand(lastRand, 0, lastNames.length))];
  } else {
    var name =
      femaleFirstNames[
        Math.floor(utils.getRand(lastRand, 0, femaleFirstNames.length))
      ] +
      " " +
      lastNames[Math.floor(utils.getRand(lastRand, 0, lastNames.length))];
  }

  var hair = hairInfo[utils.rand(lastRand, hairInfo)];
  var body = bodyInfo[Math.floor(utils.getRand(lastRand, 0, bodyInfo.length))];

  var height = utils.getHeight(body.race, lastRand);
  var height = height + "cm (" + utils.toFeet(height) + ")";

  var chest = chestInfo[utils.rand(lastRand, chestInfo)];
  var leg = legInfo[utils.rand(lastRand, legInfo)];
  if (sexVal === "Male") {
    var facialHair = facialHairInfo[utils.rand(lastRand, facialHairInfo)];
  } else {
    var facialHair = facialHairInfo[0];
  }

  // Weapon Selection
  if (classVal === "Ranger") {
    var weapon = bowsInfo[utils.rand(lastRand, bowsInfo)];
  } else if (classVal === "Rogue") {
    var weapon = daggersInfo[utils.rand(lastRand, daggersInfo)];
  } else if (classVal === "Wizard" || classVal == "Cleric") {
    var weapon = staffsInfo[utils.rand(lastRand, staffsInfo)];
  } else if (classVal === "Knight" || classVal == "Barbarian") {
    var weapon = swordsInfo[utils.rand(lastRand, swordsInfo)];
  }
  weapon.modifier = Math.floor(utils.getRand(lastRand, 1, 6));

  var ac = 10 + chest.armor + leg.armor + hair.armor;

  const stats = ["STR ", "DEX ", "CON ", "INT ", "WIS ", "CHA "];
  var statMod = stats[Math.floor(utils.getRand(lastRand, 0, stats.length))];
  var statModVal = Math.floor(utils.getRand(lastRand, 1, 5));

  // Write Character Data
  var characterData = {
    body: body,
    eyes: eyeInfo[utils.rand(lastRand, eyeInfo)],
    hair: hair,
    chest: chest,
    legs: leg,
    facialHair: facialHair,
    weapon: weapon,
    hp: utils.getHP(classVal, con, lastRand),
    ac: ac,
    str: utils.rollStat(lastRand),
    strModifier: "",
    dex: utils.rollStat(lastRand),
    dexModifier: "",
    con: con,
    conModifier: "",
    int: utils.rollStat(lastRand),
    intModifier: "",
    wis: utils.rollStat(lastRand),
    wisModifier: "",
    cha: utils.rollStat(lastRand),
    chaModifier: "",
    statModifier: statMod,
    statModifierValue: statModVal,
    coins: Math.floor(utils.getRand(lastRand, 0, 1000)),
    name: name,
    sex: sexVal,
    race: body.race, // race
    class: classVal,
    height: height,
    background: backgroundInfo[utils.rand(lastRand, backgroundInfo)],
    description: "",
    seed: seed,
  };

  characterData.strModifier = utils.getAbilityModifier(characterData.str);
  characterData.dexModifier = utils.getAbilityModifier(characterData.dex);
  characterData.conModifier = utils.getAbilityModifier(characterData.con);
  characterData.intModifier = utils.getAbilityModifier(characterData.int);
  characterData.wisModifier = utils.getAbilityModifier(characterData.wis);
  characterData.chaModifier = utils.getAbilityModifier(characterData.cha);

  characterData.description = utils.getBackgroundStory(lastRand, characterData)

  /*
  console.log(
    "Seed: " + seed + "\n",
    "Name: " + characterData.name + "\n",
    "Sex: " + characterData.sex + "\n",
    "Race: " + characterData.race + "\n",
    "Class: " + characterData.class + "\n",
    "Height: " + characterData.height + "\n"
  );
  */

  return characterData;
};

// ******************************************//
// Generate Methods for Creatures/ Enemies
// ******************************************//

// Generate random Animal
const generateRandomCreature = async (seed) => {
  // Hash the seed with the SHA256 Algorithm
  let lastRand = {
    v: sha3_256(seed).slice(-64),
  };

  var con = utils.rollStat(lastRand);
  var sexVal = sex[Math.floor(utils.getRand(lastRand, 0, sex.length))];
  var classVal =
    classes[Math.floor(utils.getRand(lastRand, 0, classes.length))];

  if (sexVal === "Male") {
    var name =
      maleFirstNames[
        Math.floor(utils.getRand(lastRand, 0, maleFirstNames.length))
      ] +
      " " +
      lastNames[Math.floor(utils.getRand(lastRand, 0, lastNames.length))];
  } else {
    var name =
      femaleFirstNames[
        Math.floor(utils.getRand(lastRand, 0, femaleFirstNames.length))
      ] +
      " " +
      lastNames[Math.floor(utils.getRand(lastRand, 0, lastNames.length))];
  }

  var hair = hairInfo[utils.rand(lastRand, hairInfo)];
  var body = bodyInfo[Math.floor(utils.getRand(lastRand, 0, bodyInfo.length))];

  var height = utils.getHeight(body.race, lastRand);
  var height = height + "cm (" + utils.toFeet(height) + ")";

  var chest = chestInfo[utils.rand(lastRand, chestInfo)];
  var leg = legInfo[utils.rand(lastRand, legInfo)];
  if (sexVal === "Male") {
    var facialHair = facialHairInfo[utils.rand(lastRand, facialHairInfo)];
  } else {
    var facialHair = facialHairInfo[0];
  }

  // Weapon Selection
  if (classVal === "Ranger") {
    var weapon = bowsInfo[utils.rand(lastRand, bowsInfo)];
  } else if (classVal === "Rogue") {
    var weapon = daggersInfo[utils.rand(lastRand, daggersInfo)];
  } else if (classVal === "Wizard" || classVal == "Cleric") {
    var weapon = staffsInfo[utils.rand(lastRand, staffsInfo)];
  } else if (classVal === "Knight" || classVal == "Barbarian") {
    var weapon = swordsInfo[utils.rand(lastRand, swordsInfo)];
  }
  weapon.modifier = Math.floor(utils.getRand(lastRand, 1, 6));

  var ac = 10 + chest.armor + leg.armor + hair.armor;

  const stats = ["STR ", "DEX ", "CON ", "INT ", "WIS ", "CHA "];
  var statMod = stats[Math.floor(utils.getRand(lastRand, 0, stats.length))];
  var statModVal = Math.floor(utils.getRand(lastRand, 1, 5));

  // Write Creature Data
  var creatureData = {
    body: body,
    eyes: eyeInfo[utils.rand(lastRand, eyeInfo)],
    hair: hair,
    chest: chest,
    legs: leg,
    facialHair: facialHair,
    weapon: weapon,
    hp: utils.getHP(classVal, con, lastRand),
    ac: ac,
    str: utils.rollStat(lastRand),
    strModifier: "",
    dex: utils.rollStat(lastRand),
    dexModifier: "",
    con: con,
    conModifier: "",
    int: utils.rollStat(lastRand),
    intModifier: "",
    wis: utils.rollStat(lastRand),
    wisModifier: "",
    cha: utils.rollStat(lastRand),
    chaModifier: "",
    statModifier: statMod,
    statModifierValue: statModVal,
    coins: Math.floor(utils.getRand(lastRand, 0, 1000)),
    name: name,
    sex: sexVal,
    race: body.race, // race
    class: classVal,
    height: height,
    background: backgroundInfo[utils.rand(lastRand, backgroundInfo)],
    description: "",
    seed: seed,
  };

  creatureData.strModifier = utils.getAbilityModifier(creatureData.str);
  creatureData.dexModifier = utils.getAbilityModifier(creatureData.dex);
  creatureData.conModifier = utils.getAbilityModifier(creatureData.con);
  creatureData.intModifier = utils.getAbilityModifier(creatureData.int);
  creatureData.wisModifier = utils.getAbilityModifier(creatureData.wis);
  creatureData.chaModifier = utils.getAbilityModifier(creatureData.cha);

  creatureData.description = utils.getBackgroundStory(lastRand, creatureData);

  return creatureData;
};

// Exports
module.exports = {
  generateRandom,
  generateRandomCreature
};
