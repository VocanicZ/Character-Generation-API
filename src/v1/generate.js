// Node Module Imports
// Code File Imports
const utils = require("../utils");
const { sha3_256 } = require("js-sha3");
var maleFirstNames = require( '@stdlib/datasets-male-first-names-en' );
var femaleFirstNames = require( '@stdlib/datasets-female-first-names-en' );

const offlineMaleFirstNames = require("../../assets/attributes/name/firstNameMale.json");
const offlineFemaleFirstNames = require("../../assets/attributes/name/firstNameFemale.json");
const lastNames = require("../../assets/attributes/name/lastName.json");
const sex = require("../../assets/attributes/sex.json");
const classes = require("../../assets/classes/classes.json");
const races = require("../../assets/races/races.json");
const backgroundInfo = require("../../assets/attributes/background.json");
const rarityInfo = require("../../assets/rarity/rarity.json");

// ******************************************//
// Generate Methods for Characters/ NPC's
// ******************************************//

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function getRandomSeed(online=true) {
  if (!online) {
    return makeid(64);
  }
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
    seed = await getRandomSeed(false);
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

  //console.log(`Generating Character with Seed: ${lastRand.s} and Rarity: ${lastRand.r.name}`);

  // begin character generation
  /*
  var sexVal = sex[Math.floor(utils.getRand(lastRand, 0, sex.length))];

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

  const raceList = utils.getObject(races, lastRand.r.rarity);
  const raceVal = raceList[Math.floor(utils.rand(lastRand, raceList))];


  var classVal = '';
   /*
  const classList = utils.getObject(classes, lastRand.r.rarity, sexVal);
  var classVal =
    classList[Math.floor(utils.rand(lastRand, classList))];
  */
 /*
  var hp = -1;
  var ac = -1;
  var buff = -1 // todo blessing & curse buff

  // Write Character Data
  var characterData = {
    seed: lastRand.s,
    rarity: lastRand.r,
    name: name,
    sex: sexVal,
    race: raceVal,
    class: classVal,
    background: backgroundInfo[utils.rand(lastRand, backgroundInfo)],
    description: 'no description found',
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

  utils.getBackgroundStory(lastRand, characterData);
  */

  var characterData = {
    seed: lastRand.s,
    rarity: lastRand.r
  }
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
