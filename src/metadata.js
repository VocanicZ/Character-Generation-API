const getMetadata = (id, character) => {
  const metadata = {
    seed: character.seed,
    rarity: character.rarity.rarity,
    name: character.name,
    sex: character.sex,
    race: character.race, 
    class: character.class,
    coins: character.coins,
    background: character.background.background,
    description: character.description,
    physical: character.physical,
    weapon: character.weapon,
    buff: character.buff,
    attributes: character.attributes,
    stats: character.stats,
    parents: character.parents,
    children: character.children,
  };

  return metadata;
};

// Exports
module.exports = {
  getMetadata,
};
