const getMetadata = (id, character) => {
  const metadata = {
    seed: character.seed,
    name: character.name,
    sex: character.sex,
    race: character.race, 
    class: character.class,
    height: character.height,
    description: character.description,
    background: character.background,
    body: character.body,
    eyes: character.eye,
    hair: character.hair,
    chest: character.chest,
    legs: character.leg,
    facialHair: character.facialHair,
    coins: character.coins,
    weapon: character.weapon,
    hp: character.hp,
    ac: character.ac,
    buff: character.buff,
    stats: character.stats
  };

  return metadata;
};

// Exports
module.exports = {
  getMetadata,
};
