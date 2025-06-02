// Node Module Imports
// Code File Imports
const utils = require("../utils");
const { sha3_256 } = require("js-sha3");
var maleFirstNames = require( '@stdlib/datasets-male-first-names-en' );
var femaleFirstNames = require( '@stdlib/datasets-female-first-names-en' );

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
const offlineMaleFirstNames = require("../../assets/attributes/firstNameMale.json");
const offlineFemaleFirstNames = require("../../assets/attributes/firstNameFemale.json");
const lastNames = require("../../assets/attributes/LastName.json");
const sex = require("../../assets/attributes/sex.json");
const classes = require("../../assets/attributes/classes.json");
const backgroundInfo = require("../../assets/attributes/background.json");
const rarityInfo = require("../../assets/attributes/rarity.json");

// ******************************************//
// Generate Methods for Characters/ NPC's
// ******************************************//

async function getRandomSeed() {
  const response = await fetch("https://www.random.org/cgi-bin/randbyte?nbytes=256&format=h");
  const hexString = await response.text();
  const seed = utils.hexBytesToSHA256(hexString);
  return seed;
}

// Generate random character
const generateRandom = async (seed = '', familyname = '') => {
  // Hash the seed with the SHA256 Algorithm
  let lastRand = {};
  if (seed  == '') {
    seed = await getRandomSeed();
    lastRand.v = sha3_256(seed).slice(-64);
    if (familyname == '') {
      familyname = lastNames[Math.floor(utils.getRand(lastRand, 0, lastNames.length, false))];
    }
  }
  else {
    let tmp = seed;
    seed = tmp.slice(0,64);
    familyname = utils.decrypt(tmp.slice(64,96));
  }

  lastRand.a = seed;
  lastRand.f = {
    f: familyname,
    v: sha3_256(familyname).slice(-64)
  }
  lastRand.s = seed+utils.encrypt(familyname);

  lastRand.v = sha3_256(seed).slice(-64); // reset hash seed roll
  lastRand.r = rarityInfo[utils.rand(lastRand, rarityInfo)];

  var sexVal = sex[Math.floor(utils.getRand(lastRand, 0, sex.length))];
  var classVal =
    classes[Math.floor(utils.getRand(lastRand, 0, classes.length))];

  if (sexVal === "Male") {
    var maleData = maleFirstNames();
    var name =
      maleData[
        Math.floor(utils.getRand(lastRand, 0, maleData.length))
      ] +
      " " + lastRand.f.f;
  } else {
    var femaleData = femaleFirstNames();
    var name =
      femaleData[
        Math.floor(utils.getRand(lastRand, 0, femaleData.length))
      ] +
      " " + lastRand.f.f;   
  }

  var con = utils.rollStat(lastRand);

  var hair = hairInfo[utils.rand(lastRand, hairInfo)];
  var body = bodyInfo[Math.floor(utils.getRand(lastRand.f, 0, bodyInfo.length))];

  var height = utils.getHeight(body.race, lastRand);
  height = height + "cm (" + utils.toFeet(height) + ")";

  var weight = 0;

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

  /*
  const stats = ["STR ", "DEX ", "CON ", "INT ", "WIS ", "CHA "];
  var statMod = stats[Math.floor(utils.getRand(lastRand, 0, stats.length))];
  var statModVal = Math.floor(utils.getRand(lastRand, 1, 5));
  */

  var buff = -1 // todo blessing & curse buff

  // Write Character Data
  var characterData = {
    seed: lastRand.s,
    rarity: lastRand.r,
    name: name,
    sex: sexVal,
    race: body.race, // race
    class: classVal,
    background: backgroundInfo[utils.rand(lastRand, backgroundInfo)],
    description: "",
    physical: {
      height: height,
      weight: weight,
      body: body,
      eyes: eyeInfo[utils.rand(lastRand, eyeInfo)],
      hair: hair,
      chest: chest,
      legs: leg,
      facialHair: facialHair,
    },
    coins: Math.floor(utils.getRand(lastRand, 0, 1000)),
    weapon: weapon,
    buff: buff,
    attributes: {
      hp: utils.getHP(classVal, con, lastRand),
      ac: ac,
    },
    parent: [],
    children: [],
    stats: {
      total: 0,
      str: 0,
      dex: 0,
      con: 0,
      int: 0,
      wis: 0,
      cha: 0,
      base: {
        total: 0,
        str: utils.rollStat(lastRand),
        dex: utils.rollStat(lastRand),
        con: utils.rollStat(lastRand),
        int: utils.rollStat(lastRand),
        wis: utils.rollStat(lastRand),
        cha: utils.rollStat(lastRand),
      },
      modifier: {
        total: "",
        str: "",
        dex: "",
        con: "",
        int: "",
        wis: "",
        cha: "",
      },
      gear: {
        total: 0,
        str: 0,
        dex: 0,
        con: 0,
        int: 0,
        wis: 0,
        cha: 0,
      },
      buff: {
        total: 0,
        str: 0,
        dex: 0,
        con: 0,
        int: 0,
        wis: 0,
        cha: 0,
      },
    },
  };

  characterData.stats.base.total = utils.sumNum([
    characterData.stats.base.str,
    characterData.stats.base.dex,
    characterData.stats.base.con,
    characterData.stats.base.int,
    characterData.stats.base.wis,
    characterData.stats.base.cha,
  ]);

  characterData.stats.modifier.str = utils.getAbilityModifier(lastRand, characterData.stats.base.str);
  characterData.stats.modifier.dex = utils.getAbilityModifier(lastRand, characterData.stats.base.dex);
  characterData.stats.modifier.con = utils.getAbilityModifier(lastRand, characterData.stats.base.con);
  characterData.stats.modifier.int = utils.getAbilityModifier(lastRand, characterData.stats.base.int);
  characterData.stats.modifier.wis = utils.getAbilityModifier(lastRand, characterData.stats.base.wis);
  characterData.stats.modifier.cha = utils.getAbilityModifier(lastRand, characterData.stats.base.cha);

  characterData.stats.modifier.total = utils.sumNum([
    characterData.stats.modifier.str,
    characterData.stats.modifier.dex,
    characterData.stats.modifier.con,
    characterData.stats.modifier.int,
    characterData.stats.modifier.wis,
    characterData.stats.modifier.cha,
  ]);

  characterData.stats.total = utils.sumNum([
    characterData.stats.base.total,
    characterData.stats.gear.total,
    characterData.stats.buff.total,
  ]);

  characterData.description = utils.getBackgroundStory(lastRand, characterData);

  return characterData;
};

async function generateFamilyTree(lastName, depth = 3, maxChildren = 3){
  async function createPerson(path, currentDepth){
    const person = await generateRandom('', lastName); // returns { name, class, sex, etc. }
    const seed = person.seed.slice(0,64);
    const personData = {
      ...person,
      children: [],
    };

    if (currentDepth < depth) {
      let lastRand = { v: sha3_256(seed).slice(-64) };
      const childCount = Math.floor(utils.getRand(lastRand, 1, maxChildren + 1));

      for (let i = 0; i < childCount; i++) {
        const childPath = `${path}_child${i}`;
        personData.children.push(await createPerson(childPath, currentDepth + 1));
      }
    }

    return personData;
  };

  const per = await createPerson("root", 0);
  return per;
};

async function test(){
  var fam = await generateFamilyTree("Bogaerts")
  return fam;
}


// Exports
module.exports = {
  generateRandom,
  test
};
