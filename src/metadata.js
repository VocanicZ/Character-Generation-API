const getMetadata = (id, character) => {
  const metadata = {
    seed: character.seed,
    rarity: character.rarity.name,
    name: character.name,
    sex: character.sex,
    race: character.race.race, 
    class: character.class.class,
    coins: character.coins,
    background: character.background.background,
    description: character.description,
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
