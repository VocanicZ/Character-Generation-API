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
const races = require("../../assets/attributes/races.json");
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
    if (seed.length != 96) {
      if (seed.length != 64) {
        seed = sha3_256(seed).slice(-64);
      }
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
  }

  lastRand.a = seed;
  lastRand.f = {
    f: familyname,
    v: sha3_256(familyname).slice(-64)
  }
  lastRand.s = seed+utils.encrypt(familyname);

  lastRand.v = sha3_256(lastRand.s).slice(-64); // reset hash seed roll
  lastRand.r = rarityInfo[utils.rand(lastRand, rarityInfo)];

  // begin character generation
  const raceList = utils.getObject(races, lastRand.r.rarity);
  const raceVal = raceList[Math.floor(utils.rand(lastRand, raceList))];
  var sexVal = sex[Math.floor(utils.getRand(lastRand, 0, sex.length))];
  const classList = utils.getObject(classes, lastRand.r.rarity, sexVal);
  var classVal =
    classList[Math.floor(utils.rand(lastRand, classList))];

  if (sexVal === "male") {
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

  var hp = -1;
  var ac = -1;
  var buff = -1 // todo blessing & curse buff

  // Write Character Data
  var characterData = {
    seed: lastRand.s,
    rarity: lastRand.r,
    name: name,
    sex: sexVal,
    race: raceVal, // race
    class: classVal,
    background: backgroundInfo[utils.rand(lastRand, backgroundInfo)],
    description: "",
    coins: Math.floor(utils.getRand(lastRand, 0, 1000)),
    buff: buff,
    attributes: {
      hp: hp,
      ac: ac,
    },
    parents: [],
    children: [],
    stats: {
      total: -1,
      str: utils.rollStat(lastRand),
      dex: utils.rollStat(lastRand),
      con: utils.rollStat(lastRand),
      int: utils.rollStat(lastRand),
      wis: utils.rollStat(lastRand),
      cha: utils.rollStat(lastRand),
    },
  };

  characterData.stats.total = utils.sumNum([
    characterData.stats.str,
    characterData.stats.dex,
    characterData.stats.con,
    characterData.stats.int,
    characterData.stats.wis,
    characterData.stats.cha,
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
