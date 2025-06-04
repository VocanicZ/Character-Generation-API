import { generateRandom } from "./src/v1/generate.js";

function percentage(part, total, fixed = 2) {
    if (fixed > 0) {
        return ((part / total) * 100).toFixed(fixed);
    }
    return ((part / total) * 100);
}

console.log("Starting Character Generation Test...");

var count = 0;
var common = 0;
var lastCommon = '';
var uncommon = 0;
var lastUncommon = '';
var rare = 0;
var lastRare = '';
var superRare = 0;
var lastSuperRare = '';
var superSuperRare = 0;
var lastSuperSuperRare = '';
var ultraRare = 0;
var lastUltraRare = '';
var epic = 0;
var lastEpic = '';
var legendary = 0;
var lastLegendary = '';
var mystic = 0;
var mysticSeeds = [];
var unique = 0;
var uniqueSeeds = [];

while (count < 2000000000000000) { // 2 quadrillion
    const result = await generateRandom();
    count++;
    switch (result.rarity.name) {
        case "Common":
            common++;
            lastCommon = result.seed;
            break;
        case "Uncommon":
            uncommon++;
            lastUncommon = result.seed;
            break;
        case "Rare":
            rare++;
            lastRare = result.seed;
            break;
        case "Super Rare":
            superRare++;
            lastSuperRare = result.seed;
            break;
        case "Super Super Rare":
            superSuperRare++;
            lastSuperSuperRare = result.seed;
            break;
        case "Ultra Rare":
            ultraRare++;
            lastUltraRare = result.seed;
            break;
        case "Epic":
            epic++;
            lastEpic = result.seed;
            break;
        case "Legendary":
            legendary++;
            lastLegendary = result.seed;
            break;
        case "Mystic":
            mystic++;
            break;
        case "Unique":
            unique++;
            break;
    }
    if (count > 1000000 && count % 1000000 === 0 && (mystic > 0 || unique > 0)) {
        console.log(`Generated ${count} characters so far...`);
        console.log(` |_Common: ${common}(${percentage(common, count)}%)`);
        console.log(` | |_${lastCommon}`);
        console.log(` |_Uncommon: ${uncommon}(${percentage(uncommon, count)}%)`);
        console.log(` | |_${lastUncommon}`);
        console.log(` |_|_Rare: ${rare}(${percentage(rare, count)}%)`);
        console.log(` | |_${lastRare}`);
        console.log(` |_Super Rare: ${superRare}(${percentage(superRare, count)}%)`);
        console.log(` | |_${lastSuperRare}`);
        console.log(` |_Super Super Rare: ${superSuperRare}(${percentage(superSuperRare, count)}%)`);
        console.log(` | |_${lastSuperSuperRare}`);
        console.log(` |_Ultra Rare: ${ultraRare}(${percentage(ultraRare, count)}%)`);
        console.log(` | |_${lastUltraRare}`);
        console.log(` |_Epic: ${epic}(${percentage(epic, count, 3)}%)`);
        console.log(` | |_${lastEpic}`);
        console.log(` |_Legendary: ${legendary}(${percentage(legendary, count, 5)}%)`);
        console.log(` | |_${lastLegendary}`);
        console.log(` |_Mystic: ${mystic}(${percentage(mystic, count, 0)}%)`);
        for (let i = 0; i < mysticSeeds.length; i++) {
            console.log(` | |_${mysticSeeds[i]}`);
        }
        console.log(` |_Unique: ${unique}(${percentage(unique, count, 0)}%)`);
        for (let i = 0; i < uniqueSeeds.length; i++) {
            console.log(` | |_${uniqueSeeds[i]}`);
        }
    }
    else if (count % 100000 === 0) {
        console.log(`Generated ${count} characters so far...`);
        console.log(` |_Common: ${common}(${percentage(common, count)}%)\n |_Uncommon: ${uncommon}(${percentage(uncommon, count)}%)\n |_Rare: ${rare}(${percentage(rare, count)}%)\n |_Super Rare: ${superRare}(${percentage(superRare, count)}%)\n |_Super Super Rare: ${superSuperRare}(${percentage(superSuperRare, count)}%)\n |_Ultra Rare: ${ultraRare}(${percentage(ultraRare, count)}%)\n |_Epic: ${epic}(${percentage(epic, count, 3)}%)\n |_Legendary: ${legendary}(${percentage(legendary, count, 5)}%)\n |_Mystic: ${mystic}(${percentage(mystic, count, 0)}%)\n |_Unique: ${unique}(${percentage(unique, count, 0)}%)`);
    }
    if (result.rarity.name == "Mystic" || result.rarity.name == "Unique") {
        console.log(`Found a ${result.rarity} Character! ${count}`);
        console.log(result);
        if (result.rarity.name == "Mystic") {
            mysticSeeds.push(result.seed);
        } else if (result.rarity.name == "Unique") {
            uniqueSeeds.push(result.seed);
        }
    }
}
console.log(`Generated ${count} characters so far...`);
console.log(` |_Common: ${common}(${percentage(common, count)}%)`);
console.log(` | |_${lastCommon}`);
console.log(` |_Uncommon: ${uncommon}(${percentage(uncommon, count)}%)`);
console.log(` | |_${lastUncommon}`);
console.log(` |_|_Rare: ${rare}(${percentage(rare, count)}%)`);
console.log(` | |_${lastRare}`);
console.log(` |_Super Rare: ${superRare}(${percentage(superRare, count)}%)`);
console.log(` | |_${lastSuperRare}`);
console.log(` |_Super Super Rare: ${superSuperRare}(${percentage(superSuperRare, count)}%)`);
console.log(` | |_${lastSuperSuperRare}`);
console.log(` |_Ultra Rare: ${ultraRare}(${percentage(ultraRare, count)}%)`);
console.log(` | |_${lastUltraRare}`);
console.log(` |_Epic: ${epic}(${percentage(epic, count, 3)}%)`);
console.log(` | |_${lastEpic}`);
console.log(` |_Legendary: ${legendary}(${percentage(legendary, count, 5)}%)`);
console.log(` | |_${lastLegendary}`);
console.log(` |_Mystic: ${mystic}(${percentage(mystic, count, 0)}%)`);
for (let i = 0; i < mysticSeeds.length; i++) {
    console.log(` | |_${mysticSeeds[i]}`);
}
console.log(` |_Unique: ${unique}(${percentage(unique, count, 0)}%)`);
for (let i = 0; i < uniqueSeeds.length; i++) {
    console.log(` | |_${uniqueSeeds[i]}`);
}