(() => {
  "use strict";

  const SAVE_KEY = "pokeg-route-battle-v2";
  const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
  const ANIMATED_BASE = `${SPRITE_BASE}/versions/generation-v/black-white/animated`;
  const WORLD = { width: 34, height: 22, tile: 32 };
  const DIRS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  const els = {
    canvas: document.getElementById("worldCanvas"),
    routeName: document.getElementById("routeName"),
    gameTitle: document.getElementById("gameTitle"),
    badgeCount: document.getElementById("badgeCount"),
    moneyCount: document.getElementById("moneyCount"),
    seenCount: document.getElementById("seenCount"),
    editionName: document.getElementById("editionName"),
    trainerName: document.getElementById("trainerName"),
    questText: document.getElementById("questText"),
    toast: document.getElementById("toast"),
    partyPanel: document.getElementById("partyPanel"),
    bagPanel: document.getElementById("bagPanel"),
    dexPanel: document.getElementById("dexPanel"),
    logPanel: document.getElementById("logPanel"),
    editionModal: document.getElementById("editionModal"),
    editionGrid: document.getElementById("editionGrid"),
    starterModal: document.getElementById("starterModal"),
    starterProfessor: document.getElementById("starterProfessor"),
    starterHeadline: document.getElementById("starterHeadline"),
    starterGrid: document.getElementById("starterGrid"),
    finishModal: document.getElementById("finishModal"),
    finishTitle: document.getElementById("finishTitle"),
    finishText: document.getElementById("finishText"),
    battleOverlay: document.getElementById("battleOverlay"),
    battleTitle: document.getElementById("battleTitle"),
    battleCloseButton: document.getElementById("battleCloseButton"),
    playerCombatant: document.getElementById("playerCombatant"),
    enemyCombatant: document.getElementById("enemyCombatant"),
    battleLog: document.getElementById("battleLog"),
    moveGrid: document.getElementById("moveGrid"),
    catchButton: document.getElementById("catchButton"),
    potionButton: document.getElementById("potionButton"),
    switchButton: document.getElementById("switchButton"),
    fleeButton: document.getElementById("fleeButton"),
    switchPanel: document.getElementById("switchPanel"),
    healButton: document.getElementById("healButton"),
    saveButton: document.getElementById("saveButton"),
    audioButton: document.getElementById("audioButton"),
    resetButton: document.getElementById("resetButton"),
    mobileAction: document.getElementById("mobileAction"),
    continueButton: document.getElementById("continueButton"),
    newRunButton: document.getElementById("newRunButton")
  };

  const ctx = els.canvas.getContext("2d");

  const MOVES = {
    tackle: { name: "Tackle", type: "normal", power: 40, accuracy: 95 },
    scratch: { name: "Scratch", type: "normal", power: 40, accuracy: 100 },
    "quick-attack": { name: "Quick Attack", type: "normal", power: 40, accuracy: 100, priority: 1 },
    "body-slam": { name: "Body Slam", type: "normal", power: 85, accuracy: 95 },
    slam: { name: "Slam", type: "normal", power: 80, accuracy: 75 },
    bite: { name: "Bite", type: "dark", power: 60, accuracy: 100 },
    pound: { name: "Pound", type: "normal", power: 40, accuracy: 100 },
    horn: { name: "Horn Attack", type: "normal", power: 65, accuracy: 100 },
    "double-kick": { name: "Double Kick", type: "fighting", power: 60, accuracy: 95 },
    karate: { name: "Karate Chop", type: "fighting", power: 50, accuracy: 100 },
    growl: { name: "Growl", type: "normal", power: 0, accuracy: 100, effect: "attackDown" },
    "tail-whip": { name: "Tail Whip", type: "normal", power: 0, accuracy: 100, effect: "defenseDown" },
    harden: { name: "Harden", type: "normal", power: 0, accuracy: 100, effect: "defenseUp" },
    "sand-attack": { name: "Sand Attack", type: "ground", power: 0, accuracy: 100, effect: "defenseDown" },
    splash: { name: "Splash", type: "normal", power: 0, accuracy: 100, effect: "nothing" },
    "vine-whip": { name: "Vine Whip", type: "grass", power: 45, accuracy: 100 },
    "razor-leaf": { name: "Razor Leaf", type: "grass", power: 55, accuracy: 95 },
    "mega-drain": { name: "Mega Drain", type: "grass", power: 40, accuracy: 100, drain: 0.5 },
    "water-gun": { name: "Water Gun", type: "water", power: 45, accuracy: 100 },
    bubble: { name: "Bubble", type: "water", power: 40, accuracy: 100 },
    "aqua-tail": { name: "Aqua Tail", type: "water", power: 90, accuracy: 90 },
    ember: { name: "Ember", type: "fire", power: 45, accuracy: 100 },
    "flame-wheel": { name: "Flame Wheel", type: "fire", power: 60, accuracy: 100 },
    "fire-spin": { name: "Fire Spin", type: "fire", power: 45, accuracy: 85 },
    "thunder-shock": { name: "Thunder Shock", type: "electric", power: 40, accuracy: 100 },
    spark: { name: "Spark", type: "electric", power: 65, accuracy: 100 },
    "thunderbolt": { name: "Thunderbolt", type: "electric", power: 90, accuracy: 100 },
    gust: { name: "Gust", type: "flying", power: 40, accuracy: 100 },
    "wing-attack": { name: "Wing Attack", type: "flying", power: 60, accuracy: 100 },
    peck: { name: "Peck", type: "flying", power: 35, accuracy: 100 },
    "bug-bite": { name: "Bug Bite", type: "bug", power: 60, accuracy: 100 },
    "poison-sting": { name: "Poison Sting", type: "poison", power: 30, accuracy: 100 },
    acid: { name: "Acid", type: "poison", power: 40, accuracy: 100 },
    dig: { name: "Dig", type: "ground", power: 80, accuracy: 100 },
    "mud-slap": { name: "Mud Slap", type: "ground", power: 35, accuracy: 100 },
    "rock-throw": { name: "Rock Throw", type: "rock", power: 50, accuracy: 90 },
    "rock-slide": { name: "Rock Slide", type: "rock", power: 75, accuracy: 90 },
    confusion: { name: "Confusion", type: "psychic", power: 50, accuracy: 100 },
    psybeam: { name: "Psybeam", type: "psychic", power: 65, accuracy: 100 },
    lick: { name: "Lick", type: "ghost", power: 30, accuracy: 100 },
    "shadow-sneak": { name: "Shadow Sneak", type: "ghost", power: 40, accuracy: 100, priority: 1 },
    "ice-shard": { name: "Ice Shard", type: "ice", power: 40, accuracy: 100, priority: 1 },
    aurora: { name: "Aurora Beam", type: "ice", power: 65, accuracy: 100 },
    "metal-claw": { name: "Metal Claw", type: "steel", power: 50, accuracy: 95 },
    "fairy-wind": { name: "Fairy Wind", type: "fairy", power: 40, accuracy: 100 },
    "dragon-breath": { name: "Dragon Breath", type: "dragon", power: 60, accuracy: 100 },
    "leech-life": { name: "Leech Life", type: "bug", power: 55, accuracy: 100, drain: 0.5 }
  };

  const POKEDEX = [
    { id: 1, name: "Bulbasaur", types: ["grass", "poison"], base: { hp: 45, attack: 49, defense: 49, speed: 45 }, catchRate: 45, moves: ["tackle", "growl", "vine-whip", "razor-leaf", "mega-drain"], evolve: { level: 16, to: 2 } },
    { id: 2, name: "Ivysaur", types: ["grass", "poison"], base: { hp: 60, attack: 62, defense: 63, speed: 60 }, catchRate: 45, moves: ["tackle", "vine-whip", "razor-leaf", "mega-drain", "body-slam"], evolve: { level: 32, to: 3 } },
    { id: 3, name: "Venusaur", types: ["grass", "poison"], base: { hp: 80, attack: 82, defense: 83, speed: 80 }, catchRate: 45, moves: ["vine-whip", "razor-leaf", "mega-drain", "body-slam"] },
    { id: 4, name: "Charmander", types: ["fire"], base: { hp: 39, attack: 52, defense: 43, speed: 65 }, catchRate: 45, moves: ["scratch", "growl", "ember", "flame-wheel", "fire-spin"], evolve: { level: 16, to: 5 } },
    { id: 5, name: "Charmeleon", types: ["fire"], base: { hp: 58, attack: 64, defense: 58, speed: 80 }, catchRate: 45, moves: ["scratch", "ember", "flame-wheel", "fire-spin", "slash"], evolve: { level: 36, to: 6 } },
    { id: 6, name: "Charizard", types: ["fire", "flying"], base: { hp: 78, attack: 84, defense: 78, speed: 100 }, catchRate: 45, moves: ["ember", "wing-attack", "flame-wheel", "fire-spin"] },
    { id: 7, name: "Squirtle", types: ["water"], base: { hp: 44, attack: 48, defense: 65, speed: 43 }, catchRate: 45, moves: ["tackle", "tail-whip", "water-gun", "bubble", "aqua-tail"], evolve: { level: 16, to: 8 } },
    { id: 8, name: "Wartortle", types: ["water"], base: { hp: 59, attack: 63, defense: 80, speed: 58 }, catchRate: 45, moves: ["tackle", "water-gun", "bubble", "aqua-tail"], evolve: { level: 36, to: 9 } },
    { id: 9, name: "Blastoise", types: ["water"], base: { hp: 79, attack: 83, defense: 100, speed: 78 }, catchRate: 45, moves: ["water-gun", "bubble", "aqua-tail", "body-slam"] },
    { id: 10, name: "Caterpie", types: ["bug"], base: { hp: 45, attack: 30, defense: 35, speed: 45 }, catchRate: 255, moves: ["tackle", "bug-bite"], evolve: { level: 7, to: 11 } },
    { id: 11, name: "Metapod", types: ["bug"], base: { hp: 50, attack: 20, defense: 55, speed: 30 }, catchRate: 120, moves: ["tackle", "harden", "bug-bite"], evolve: { level: 10, to: 12 } },
    { id: 12, name: "Butterfree", types: ["bug", "flying"], base: { hp: 60, attack: 45, defense: 50, speed: 70 }, catchRate: 45, moves: ["gust", "bug-bite", "confusion", "psybeam"] },
    { id: 13, name: "Weedle", types: ["bug", "poison"], base: { hp: 40, attack: 35, defense: 30, speed: 50 }, catchRate: 255, moves: ["poison-sting", "bug-bite"], evolve: { level: 7, to: 14 } },
    { id: 14, name: "Kakuna", types: ["bug", "poison"], base: { hp: 45, attack: 25, defense: 50, speed: 35 }, catchRate: 120, moves: ["poison-sting", "harden", "bug-bite"], evolve: { level: 10, to: 15 } },
    { id: 15, name: "Beedrill", types: ["bug", "poison"], base: { hp: 65, attack: 90, defense: 40, speed: 75 }, catchRate: 45, moves: ["poison-sting", "bug-bite", "twineedle", "leech-life"] },
    { id: 16, name: "Pidgey", types: ["normal", "flying"], base: { hp: 40, attack: 45, defense: 40, speed: 56 }, catchRate: 255, moves: ["tackle", "sand-attack", "gust", "quick-attack", "wing-attack"], evolve: { level: 18, to: 17 } },
    { id: 17, name: "Pidgeotto", types: ["normal", "flying"], base: { hp: 63, attack: 60, defense: 55, speed: 71 }, catchRate: 120, moves: ["tackle", "gust", "quick-attack", "wing-attack"] },
    { id: 19, name: "Rattata", types: ["normal"], base: { hp: 30, attack: 56, defense: 35, speed: 72 }, catchRate: 255, moves: ["tackle", "tail-whip", "quick-attack", "bite"], evolve: { level: 20, to: 20 } },
    { id: 20, name: "Raticate", types: ["normal"], base: { hp: 55, attack: 81, defense: 60, speed: 97 }, catchRate: 127, moves: ["tackle", "quick-attack", "bite", "body-slam"] },
    { id: 21, name: "Spearow", types: ["normal", "flying"], base: { hp: 40, attack: 60, defense: 30, speed: 70 }, catchRate: 255, moves: ["peck", "growl", "quick-attack", "wing-attack"], evolve: { level: 20, to: 22 } },
    { id: 22, name: "Fearow", types: ["normal", "flying"], base: { hp: 65, attack: 90, defense: 65, speed: 100 }, catchRate: 90, moves: ["peck", "quick-attack", "wing-attack", "drill-peck"] },
    { id: 23, name: "Ekans", types: ["poison"], base: { hp: 35, attack: 60, defense: 44, speed: 55 }, catchRate: 255, moves: ["wrap", "poison-sting", "bite", "acid"], evolve: { level: 22, to: 24 } },
    { id: 24, name: "Arbok", types: ["poison"], base: { hp: 60, attack: 95, defense: 69, speed: 80 }, catchRate: 90, moves: ["poison-sting", "bite", "acid", "slam"] },
    { id: 25, name: "Pikachu", types: ["electric"], base: { hp: 35, attack: 55, defense: 40, speed: 90 }, catchRate: 190, moves: ["quick-attack", "tail-whip", "thunder-shock", "spark", "thunderbolt"], evolve: { level: 22, to: 26 } },
    { id: 26, name: "Raichu", types: ["electric"], base: { hp: 60, attack: 90, defense: 55, speed: 110 }, catchRate: 75, moves: ["quick-attack", "thunder-shock", "spark", "thunderbolt"] },
    { id: 27, name: "Sandshrew", types: ["ground"], base: { hp: 50, attack: 75, defense: 85, speed: 40 }, catchRate: 255, moves: ["scratch", "sand-attack", "mud-slap", "dig"], evolve: { level: 22, to: 28 } },
    { id: 28, name: "Sandslash", types: ["ground"], base: { hp: 75, attack: 100, defense: 110, speed: 65 }, catchRate: 90, moves: ["scratch", "mud-slap", "dig", "slash"] },
    { id: 29, name: "Nidoran F", types: ["poison"], base: { hp: 55, attack: 47, defense: 52, speed: 41 }, catchRate: 235, moves: ["scratch", "tail-whip", "poison-sting", "bite"], evolve: { level: 16, to: 30 } },
    { id: 30, name: "Nidorina", types: ["poison"], base: { hp: 70, attack: 62, defense: 67, speed: 56 }, catchRate: 120, moves: ["scratch", "poison-sting", "bite", "double-kick"] },
    { id: 32, name: "Nidoran M", types: ["poison"], base: { hp: 46, attack: 57, defense: 40, speed: 50 }, catchRate: 235, moves: ["peck", "tail-whip", "poison-sting", "horn"], evolve: { level: 16, to: 33 } },
    { id: 33, name: "Nidorino", types: ["poison"], base: { hp: 61, attack: 72, defense: 57, speed: 65 }, catchRate: 120, moves: ["peck", "poison-sting", "horn", "double-kick"] },
    { id: 37, name: "Vulpix", types: ["fire"], base: { hp: 38, attack: 41, defense: 40, speed: 65 }, catchRate: 190, moves: ["scratch", "tail-whip", "ember", "fire-spin"] },
    { id: 39, name: "Jigglypuff", types: ["normal", "fairy"], base: { hp: 115, attack: 45, defense: 20, speed: 20 }, catchRate: 170, moves: ["pound", "fairy-wind", "body-slam", "double-kick"] },
    { id: 41, name: "Zubat", types: ["poison", "flying"], base: { hp: 40, attack: 45, defense: 35, speed: 55 }, catchRate: 255, moves: ["leech-life", "bite", "wing-attack", "poison-sting"], evolve: { level: 22, to: 42 } },
    { id: 42, name: "Golbat", types: ["poison", "flying"], base: { hp: 75, attack: 80, defense: 70, speed: 90 }, catchRate: 90, moves: ["leech-life", "bite", "wing-attack", "acid"] },
    { id: 43, name: "Oddish", types: ["grass", "poison"], base: { hp: 45, attack: 50, defense: 55, speed: 30 }, catchRate: 255, moves: ["tackle", "acid", "mega-drain", "razor-leaf"], evolve: { level: 21, to: 44 } },
    { id: 44, name: "Gloom", types: ["grass", "poison"], base: { hp: 60, attack: 65, defense: 70, speed: 40 }, catchRate: 120, moves: ["acid", "mega-drain", "razor-leaf", "body-slam"] },
    { id: 46, name: "Paras", types: ["bug", "grass"], base: { hp: 35, attack: 70, defense: 55, speed: 25 }, catchRate: 190, moves: ["scratch", "leech-life", "mega-drain", "bug-bite"] },
    { id: 48, name: "Venonat", types: ["bug", "poison"], base: { hp: 60, attack: 55, defense: 50, speed: 45 }, catchRate: 190, moves: ["tackle", "poison-sting", "bug-bite", "confusion"] },
    { id: 50, name: "Diglett", types: ["ground"], base: { hp: 10, attack: 55, defense: 25, speed: 95 }, catchRate: 255, moves: ["scratch", "mud-slap", "dig", "rock-throw"] },
    { id: 52, name: "Meowth", types: ["normal"], base: { hp: 40, attack: 45, defense: 35, speed: 90 }, catchRate: 255, moves: ["scratch", "growl", "bite", "slash"] },
    { id: 54, name: "Psyduck", types: ["water"], base: { hp: 50, attack: 52, defense: 48, speed: 55 }, catchRate: 190, moves: ["scratch", "tail-whip", "water-gun", "confusion"] },
    { id: 56, name: "Mankey", types: ["fighting"], base: { hp: 40, attack: 80, defense: 35, speed: 70 }, catchRate: 190, moves: ["scratch", "karate", "low-kick", "double-kick"] },
    { id: 58, name: "Growlithe", types: ["fire"], base: { hp: 55, attack: 70, defense: 45, speed: 60 }, catchRate: 190, moves: ["bite", "ember", "flame-wheel", "fire-spin"] },
    { id: 60, name: "Poliwag", types: ["water"], base: { hp: 40, attack: 50, defense: 40, speed: 90 }, catchRate: 255, moves: ["bubble", "water-gun", "body-slam", "mud-slap"] },
    { id: 63, name: "Abra", types: ["psychic"], base: { hp: 25, attack: 20, defense: 15, speed: 90 }, catchRate: 200, moves: ["confusion", "psybeam", "quick-attack", "shadow-sneak"] },
    { id: 66, name: "Machop", types: ["fighting"], base: { hp: 70, attack: 80, defense: 50, speed: 35 }, catchRate: 180, moves: ["karate", "low-kick", "double-kick", "rock-throw"] },
    { id: 69, name: "Bellsprout", types: ["grass", "poison"], base: { hp: 50, attack: 75, defense: 35, speed: 40 }, catchRate: 255, moves: ["vine-whip", "acid", "razor-leaf", "slam"] },
    { id: 74, name: "Geodude", types: ["rock", "ground"], base: { hp: 40, attack: 80, defense: 100, speed: 20 }, catchRate: 255, moves: ["tackle", "rock-throw", "mud-slap", "rock-slide"] },
    { id: 77, name: "Ponyta", types: ["fire"], base: { hp: 50, attack: 85, defense: 55, speed: 90 }, catchRate: 190, moves: ["tackle", "ember", "flame-wheel", "stomp"] },
    { id: 79, name: "Slowpoke", types: ["water", "psychic"], base: { hp: 90, attack: 65, defense: 65, speed: 15 }, catchRate: 190, moves: ["tackle", "water-gun", "confusion", "body-slam"] },
    { id: 81, name: "Magnemite", types: ["electric", "steel"], base: { hp: 25, attack: 35, defense: 70, speed: 45 }, catchRate: 190, moves: ["tackle", "thunder-shock", "spark", "metal-claw"] },
    { id: 84, name: "Doduo", types: ["normal", "flying"], base: { hp: 35, attack: 85, defense: 45, speed: 75 }, catchRate: 190, moves: ["peck", "quick-attack", "fury-attack", "wing-attack"] },
    { id: 86, name: "Seel", types: ["water", "ice"], base: { hp: 65, attack: 45, defense: 55, speed: 45 }, catchRate: 190, moves: ["water-gun", "ice-shard", "aurora", "body-slam"] },
    { id: 88, name: "Grimer", types: ["poison"], base: { hp: 80, attack: 80, defense: 50, speed: 25 }, catchRate: 190, moves: ["pound", "poison-sting", "acid", "body-slam"] },
    { id: 90, name: "Shellder", types: ["water"], base: { hp: 30, attack: 65, defense: 100, speed: 40 }, catchRate: 190, moves: ["tackle", "water-gun", "ice-shard", "aurora"] },
    { id: 92, name: "Gastly", types: ["ghost", "poison"], base: { hp: 30, attack: 35, defense: 30, speed: 80 }, catchRate: 190, moves: ["lick", "shadow-sneak", "confusion", "acid"] },
    { id: 95, name: "Onix", types: ["rock", "ground"], base: { hp: 35, attack: 45, defense: 160, speed: 70 }, catchRate: 45, moves: ["tackle", "rock-throw", "dig", "rock-slide"] },
    { id: 96, name: "Drowzee", types: ["psychic"], base: { hp: 60, attack: 48, defense: 45, speed: 42 }, catchRate: 190, moves: ["pound", "confusion", "psybeam", "body-slam"] },
    { id: 98, name: "Krabby", types: ["water"], base: { hp: 30, attack: 105, defense: 90, speed: 50 }, catchRate: 225, moves: ["bubble", "water-gun", "mud-slap", "slam"] },
    { id: 100, name: "Voltorb", types: ["electric"], base: { hp: 40, attack: 30, defense: 50, speed: 100 }, catchRate: 190, moves: ["tackle", "spark", "thunder-shock", "thunderbolt"] },
    { id: 102, name: "Exeggcute", types: ["grass", "psychic"], base: { hp: 60, attack: 40, defense: 80, speed: 40 }, catchRate: 90, moves: ["confusion", "mega-drain", "razor-leaf", "psybeam"] },
    { id: 104, name: "Cubone", types: ["ground"], base: { hp: 50, attack: 50, defense: 95, speed: 35 }, catchRate: 190, moves: ["tackle", "mud-slap", "bone-club", "dig"] },
    { id: 109, name: "Koffing", types: ["poison"], base: { hp: 40, attack: 65, defense: 95, speed: 35 }, catchRate: 190, moves: ["tackle", "poison-sting", "acid", "body-slam"] },
    { id: 111, name: "Rhyhorn", types: ["ground", "rock"], base: { hp: 80, attack: 85, defense: 95, speed: 25 }, catchRate: 120, moves: ["horn", "mud-slap", "rock-throw", "rock-slide"] },
    { id: 116, name: "Horsea", types: ["water"], base: { hp: 30, attack: 40, defense: 70, speed: 60 }, catchRate: 225, moves: ["bubble", "water-gun", "aurora", "dragon-breath"] },
    { id: 118, name: "Goldeen", types: ["water"], base: { hp: 45, attack: 67, defense: 60, speed: 63 }, catchRate: 225, moves: ["peck", "water-gun", "horn", "aqua-tail"] },
    { id: 120, name: "Staryu", types: ["water"], base: { hp: 30, attack: 45, defense: 55, speed: 85 }, catchRate: 225, moves: ["tackle", "water-gun", "swift", "psybeam"] },
    { id: 129, name: "Magikarp", types: ["water"], base: { hp: 20, attack: 10, defense: 55, speed: 80 }, catchRate: 255, moves: ["splash", "tackle"] },
    { id: 133, name: "Eevee", types: ["normal"], base: { hp: 55, attack: 55, defense: 50, speed: 55 }, catchRate: 45, moves: ["tackle", "tail-whip", "quick-attack", "bite", "body-slam"] },
    { id: 143, name: "Snorlax", types: ["normal"], base: { hp: 160, attack: 110, defense: 65, speed: 30 }, catchRate: 25, moves: ["tackle", "body-slam", "bite", "slam"] },
    { id: 147, name: "Dratini", types: ["dragon"], base: { hp: 41, attack: 64, defense: 45, speed: 50 }, catchRate: 45, moves: ["tackle", "thunder-shock", "dragon-breath", "aqua-tail"] },
    { id: 252, name: "Treecko", types: ["grass"], base: { hp: 40, attack: 45, defense: 35, speed: 70 }, catchRate: 45, moves: ["pound", "quick-attack", "absorb", "leaf-blade"], evolve: { level: 16, to: 253 } },
    { id: 253, name: "Grovyle", types: ["grass"], base: { hp: 50, attack: 65, defense: 45, speed: 95 }, catchRate: 45, moves: ["quick-attack", "absorb", "leaf-blade", "slam"], evolve: { level: 36, to: 254 } },
    { id: 254, name: "Sceptile", types: ["grass"], base: { hp: 70, attack: 85, defense: 65, speed: 120 }, catchRate: 45, moves: ["quick-attack", "mega-drain", "leaf-blade", "slam"] },
    { id: 255, name: "Torchic", types: ["fire"], base: { hp: 45, attack: 60, defense: 40, speed: 45 }, catchRate: 45, moves: ["scratch", "growl", "ember", "blaze-kick"], evolve: { level: 16, to: 256 } },
    { id: 256, name: "Combusken", types: ["fire", "fighting"], base: { hp: 60, attack: 85, defense: 60, speed: 55 }, catchRate: 45, moves: ["scratch", "ember", "double-kick", "blaze-kick"], evolve: { level: 36, to: 257 } },
    { id: 257, name: "Blaziken", types: ["fire", "fighting"], base: { hp: 80, attack: 120, defense: 70, speed: 80 }, catchRate: 45, moves: ["ember", "double-kick", "blaze-kick", "slash"] },
    { id: 258, name: "Mudkip", types: ["water"], base: { hp: 50, attack: 70, defense: 50, speed: 40 }, catchRate: 45, moves: ["tackle", "growl", "water-gun", "mud-shot"], evolve: { level: 16, to: 259 } },
    { id: 259, name: "Marshtomp", types: ["water", "ground"], base: { hp: 70, attack: 85, defense: 70, speed: 50 }, catchRate: 45, moves: ["tackle", "water-gun", "mud-shot", "aqua-tail"], evolve: { level: 36, to: 260 } },
    { id: 260, name: "Swampert", types: ["water", "ground"], base: { hp: 100, attack: 110, defense: 90, speed: 60 }, catchRate: 45, moves: ["water-gun", "mud-shot", "aqua-tail", "body-slam"] },
    { id: 261, name: "Poochyena", types: ["dark"], base: { hp: 35, attack: 55, defense: 35, speed: 35 }, catchRate: 255, moves: ["tackle", "sand-attack", "bite", "feint-attack"], evolve: { level: 18, to: 262 } },
    { id: 262, name: "Mightyena", types: ["dark"], base: { hp: 70, attack: 90, defense: 70, speed: 70 }, catchRate: 127, moves: ["tackle", "bite", "feint-attack", "crunch"] },
    { id: 263, name: "Zigzagoon", types: ["normal"], base: { hp: 38, attack: 30, defense: 41, speed: 60 }, catchRate: 255, moves: ["tackle", "tail-whip", "headbutt", "swift"] },
    { id: 265, name: "Wurmple", types: ["bug"], base: { hp: 45, attack: 45, defense: 35, speed: 20 }, catchRate: 255, moves: ["tackle", "poison-sting", "bug-bite"] },
    { id: 270, name: "Lotad", types: ["water", "grass"], base: { hp: 40, attack: 30, defense: 30, speed: 30 }, catchRate: 255, moves: ["absorb", "bubble", "mega-drain", "water-gun"] },
    { id: 278, name: "Wingull", types: ["water", "flying"], base: { hp: 40, attack: 30, defense: 30, speed: 85 }, catchRate: 190, moves: ["water-gun", "gust", "wing-attack", "quick-attack"] },
    { id: 280, name: "Ralts", types: ["psychic", "fairy"], base: { hp: 28, attack: 25, defense: 25, speed: 40 }, catchRate: 235, moves: ["confusion", "fairy-wind", "psybeam", "shadow-sneak"], evolve: { level: 20, to: 281 } },
    { id: 281, name: "Kirlia", types: ["psychic", "fairy"], base: { hp: 38, attack: 35, defense: 35, speed: 50 }, catchRate: 120, moves: ["confusion", "fairy-wind", "psybeam", "shadow-sneak"], evolve: { level: 30, to: 282 } },
    { id: 282, name: "Gardevoir", types: ["psychic", "fairy"], base: { hp: 68, attack: 65, defense: 65, speed: 80 }, catchRate: 45, moves: ["confusion", "fairy-wind", "psybeam", "thunderbolt"] },
    { id: 283, name: "Surskit", types: ["bug", "water"], base: { hp: 40, attack: 30, defense: 32, speed: 65 }, catchRate: 200, moves: ["bubble", "quick-attack", "bug-bite", "water-gun"] },
    { id: 285, name: "Shroomish", types: ["grass"], base: { hp: 60, attack: 40, defense: 60, speed: 35 }, catchRate: 255, moves: ["tackle", "absorb", "mega-drain", "headbutt"] },
    { id: 296, name: "Makuhita", types: ["fighting"], base: { hp: 72, attack: 60, defense: 30, speed: 25 }, catchRate: 180, moves: ["tackle", "sand-attack", "arm-thrust", "karate"] },
    { id: 304, name: "Aron", types: ["steel", "rock"], base: { hp: 50, attack: 70, defense: 100, speed: 30 }, catchRate: 180, moves: ["tackle", "metal-claw", "rock-throw", "iron-head"] },
    { id: 309, name: "Electrike", types: ["electric"], base: { hp: 40, attack: 45, defense: 40, speed: 65 }, catchRate: 120, moves: ["tackle", "quick-attack", "thunder-shock", "spark"] },
    { id: 318, name: "Carvanha", types: ["water", "dark"], base: { hp: 45, attack: 90, defense: 20, speed: 65 }, catchRate: 225, moves: ["bite", "water-gun", "crunch", "aqua-tail"] },
    { id: 328, name: "Trapinch", types: ["ground"], base: { hp: 45, attack: 100, defense: 45, speed: 10 }, catchRate: 255, moves: ["bite", "sand-attack", "mud-shot", "dig"] },
    { id: 333, name: "Swablu", types: ["normal", "flying"], base: { hp: 45, attack: 40, defense: 60, speed: 50 }, catchRate: 255, moves: ["peck", "fairy-wind", "wing-attack", "dragon-breath"] },
    { id: 363, name: "Spheal", types: ["ice", "water"], base: { hp: 70, attack: 40, defense: 50, speed: 25 }, catchRate: 255, moves: ["water-gun", "ice-shard", "aurora", "body-slam"] }
  ];

  Object.assign(MOVES, {
    slash: { name: "Slash", type: "normal", power: 70, accuracy: 100 },
    twineedle: { name: "Twineedle", type: "bug", power: 50, accuracy: 100 },
    "drill-peck": { name: "Drill Peck", type: "flying", power: 80, accuracy: 100 },
    wrap: { name: "Wrap", type: "normal", power: 35, accuracy: 90 },
    "low-kick": { name: "Low Kick", type: "fighting", power: 60, accuracy: 95 },
    stomp: { name: "Stomp", type: "normal", power: 65, accuracy: 100 },
    "fury-attack": { name: "Fury Attack", type: "normal", power: 45, accuracy: 95 },
    "bone-club": { name: "Bone Club", type: "ground", power: 65, accuracy: 85 },
    swift: { name: "Swift", type: "normal", power: 60, accuracy: 100 },
    absorb: { name: "Absorb", type: "grass", power: 30, accuracy: 100, drain: 0.5 },
    "leaf-blade": { name: "Leaf Blade", type: "grass", power: 90, accuracy: 100 },
    "blaze-kick": { name: "Blaze Kick", type: "fire", power: 85, accuracy: 90 },
    "mud-shot": { name: "Mud Shot", type: "ground", power: 55, accuracy: 95 },
    "feint-attack": { name: "Feint Attack", type: "dark", power: 60, accuracy: 100 },
    headbutt: { name: "Headbutt", type: "normal", power: 70, accuracy: 100 },
    crunch: { name: "Crunch", type: "dark", power: 80, accuracy: 100 },
    "arm-thrust": { name: "Arm Thrust", type: "fighting", power: 55, accuracy: 95 },
    "iron-head": { name: "Iron Head", type: "steel", power: 80, accuracy: 100 }
  });

  const SPECIES = new Map(POKEDEX.map((pokemon) => [pokemon.id, pokemon]));
  const STARTERS = [1, 4, 7, 25];
  const TYPE_CHART = {
    normal: { half: ["rock", "steel"], none: ["ghost"] },
    fire: { double: ["grass", "ice", "bug", "steel"], half: ["fire", "water", "rock", "dragon"] },
    water: { double: ["fire", "ground", "rock"], half: ["water", "grass", "dragon"] },
    electric: { double: ["water", "flying"], half: ["electric", "grass", "dragon"], none: ["ground"] },
    grass: { double: ["water", "ground", "rock"], half: ["fire", "grass", "poison", "flying", "bug", "dragon", "steel"] },
    ice: { double: ["grass", "ground", "flying", "dragon"], half: ["fire", "water", "ice", "steel"] },
    fighting: { double: ["normal", "ice", "rock", "dark", "steel"], half: ["poison", "flying", "psychic", "bug", "fairy"], none: ["ghost"] },
    poison: { double: ["grass", "fairy"], half: ["poison", "ground", "rock", "ghost"], none: ["steel"] },
    ground: { double: ["fire", "electric", "poison", "rock", "steel"], half: ["grass", "bug"], none: ["flying"] },
    flying: { double: ["grass", "fighting", "bug"], half: ["electric", "rock", "steel"] },
    psychic: { double: ["fighting", "poison"], half: ["psychic", "steel"], none: ["dark"] },
    bug: { double: ["grass", "psychic", "dark"], half: ["fire", "fighting", "poison", "flying", "ghost", "steel", "fairy"] },
    rock: { double: ["fire", "ice", "flying", "bug"], half: ["fighting", "ground", "steel"] },
    ghost: { double: ["psychic", "ghost"], half: ["dark"], none: ["normal"] },
    dragon: { double: ["dragon"], half: ["steel"], none: ["fairy"] },
    dark: { double: ["psychic", "ghost"], half: ["fighting", "dark", "fairy"] },
    steel: { double: ["ice", "rock", "fairy"], half: ["fire", "water", "electric", "steel"] },
    fairy: { double: ["fighting", "dragon", "dark"], half: ["fire", "poison", "steel"] }
  };

  const BUILDINGS = [
    { id: "clinic", name: "Clinic", x: 3, y: 2, w: 5, h: 4, roof: "#ef704b", body: "#fff8e8", doorX: 5 },
    { id: "lab", name: "Lab", x: 13, y: 15, w: 6, h: 4, roof: "#5bb9d6", body: "#f9f4df", doorX: 16 },
    { id: "gym", name: "Gym", x: 25, y: 2, w: 6, h: 5, roof: "#7567d9", body: "#f7f0e8", doorX: 28 }
  ];

  const NPCS = [
    { id: "nurse", name: "Nurse Luma", x: 5, y: 6, color: "#ef704b", action: "heal" },
    { id: "professor", name: "Professor Maple", x: 16, y: 14, color: "#5bb9d6", action: "gift" },
    { id: "scout", name: "Scout Ren", x: 11, y: 10, color: "#7fbf5f", action: "trainer", trainerId: "scout" },
    { id: "rival", name: "Rival Jules", x: 22, y: 11, color: "#f1c84b", action: "trainer", trainerId: "rival" },
    { id: "leader", name: "Leader Aster", x: 28, y: 8, color: "#7567d9", action: "trainer", trainerId: "leader" }
  ];

  const TRAINERS = {
    scout: {
      name: "Scout Ren",
      reward: 96,
      intro: "Scout Ren wants to test your field instincts.",
      team: [{ id: 10, level: 5 }, { id: 13, level: 5 }, { id: 16, level: 6 }]
    },
    rival: {
      name: "Rival Jules",
      reward: 180,
      intro: "Rival Jules grins and tosses a polished ball.",
      dynamic: "rival"
    },
    leader: {
      name: "Leader Aster",
      reward: 600,
      intro: "Leader Aster accepts the challenge.",
      badge: "Verdant Badge",
      dynamic: "leader"
    }
  };

  const ENCOUNTERS = {
    meadow: [
      { id: 16, weight: 24, min: 2, max: 6 },
      { id: 19, weight: 22, min: 2, max: 6 },
      { id: 10, weight: 17, min: 2, max: 5 },
      { id: 13, weight: 17, min: 2, max: 5 },
      { id: 43, weight: 10, min: 4, max: 7 },
      { id: 25, weight: 4, min: 4, max: 7 },
      { id: 133, weight: 1, min: 5, max: 7 }
    ],
    granite: [
      { id: 74, weight: 26, min: 5, max: 10 },
      { id: 41, weight: 24, min: 5, max: 10 },
      { id: 27, weight: 16, min: 6, max: 11 },
      { id: 50, weight: 14, min: 6, max: 11 },
      { id: 66, weight: 8, min: 7, max: 12 },
      { id: 95, weight: 2, min: 8, max: 12 }
    ],
    coast: [
      { id: 54, weight: 18, min: 6, max: 12 },
      { id: 60, weight: 20, min: 5, max: 11 },
      { id: 98, weight: 16, min: 6, max: 12 },
      { id: 116, weight: 12, min: 7, max: 13 },
      { id: 118, weight: 12, min: 7, max: 13 },
      { id: 120, weight: 8, min: 8, max: 13 },
      { id: 129, weight: 10, min: 4, max: 8 }
    ],
    orchard: [
      { id: 46, weight: 15, min: 7, max: 13 },
      { id: 48, weight: 15, min: 7, max: 13 },
      { id: 69, weight: 15, min: 7, max: 13 },
      { id: 92, weight: 12, min: 8, max: 14 },
      { id: 63, weight: 8, min: 8, max: 14 },
      { id: 37, weight: 8, min: 8, max: 14 },
      { id: 102, weight: 5, min: 9, max: 14 },
      { id: 147, weight: 1, min: 10, max: 14 }
    ]
  };

  const SAPPHIRE_ENCOUNTERS = {
    meadow: [
      { id: 263, weight: 24, min: 2, max: 6 },
      { id: 265, weight: 20, min: 2, max: 5 },
      { id: 270, weight: 16, min: 3, max: 7 },
      { id: 278, weight: 12, min: 4, max: 7 },
      { id: 285, weight: 10, min: 4, max: 8 },
      { id: 280, weight: 4, min: 4, max: 7 },
      { id: 309, weight: 2, min: 5, max: 8 }
    ],
    granite: [
      { id: 304, weight: 24, min: 5, max: 11 },
      { id: 328, weight: 19, min: 6, max: 12 },
      { id: 74, weight: 15, min: 5, max: 10 },
      { id: 296, weight: 12, min: 6, max: 12 },
      { id: 41, weight: 10, min: 5, max: 11 },
      { id: 95, weight: 2, min: 8, max: 13 }
    ],
    coast: [
      { id: 270, weight: 18, min: 5, max: 11 },
      { id: 278, weight: 18, min: 5, max: 12 },
      { id: 283, weight: 16, min: 6, max: 12 },
      { id: 318, weight: 12, min: 7, max: 13 },
      { id: 363, weight: 8, min: 8, max: 14 },
      { id: 116, weight: 8, min: 7, max: 13 },
      { id: 129, weight: 8, min: 4, max: 9 }
    ],
    orchard: [
      { id: 285, weight: 18, min: 7, max: 13 },
      { id: 333, weight: 15, min: 7, max: 13 },
      { id: 280, weight: 12, min: 8, max: 14 },
      { id: 309, weight: 12, min: 8, max: 14 },
      { id: 261, weight: 12, min: 7, max: 13 },
      { id: 252, weight: 2, min: 8, max: 12 },
      { id: 258, weight: 2, min: 8, max: 12 },
      { id: 147, weight: 1, min: 10, max: 14 }
    ]
  };

  const EDITIONS = {
    ember: {
      id: "ember",
      name: "PokeG Ember Red",
      shortName: "Ember Red",
      cardTitle: "Ember Red",
      cardText: "A hotter, Kanto-inspired route set with rocky cuts, bold rivals, and classic partners.",
      cardTags: ["classic", "fire", "rock"],
      starters: STARTERS,
      professor: "Professor Maple",
      starterHeadline: "Choose your Ember partner",
      leaderName: "Leader Aster",
      leaderBadge: "Verdant Badge",
      ballName: "Poke Balls",
      giftRepeat: "Professor Maple is tracking rare signals near the coast.",
      giftLog: "Professor Maple pointed toward the coast.",
      giftReceived: "Received 6 Poke Balls, 2 Potions, and $120.",
      routeNames: {
        town: "Maple Town",
        gym: "Aster Gym Gate",
        coast: "Copperwash Coast",
        granite: "Granite Cut",
        orchard: "Night Orchard",
        meadow: "Sproutline Meadow",
        road: "Amber Road"
      },
      theme: {
        paper: "#fbf7ee",
        paperStrong: "#fffdf6",
        ink: "#201812",
        muted: "#715f55",
        grass: "#7fbf5f",
        grassDark: "#3f8d53",
        water: "#5bb9d6",
        fire: "#ef704b",
        electric: "#f1c84b",
        violet: "#7567d9",
        danger: "#cf4d4d"
      },
      world: {
        meadow: ["#84c46a", "#8fd175"],
        tallgrass: ["#5fae57", "#68b95e"],
        path: ["#d5ad72", "#dfc082"],
        water: "#58b8d4",
        treeTrunk: "#204b34",
        tree: ["#2d7d4a", "#318c53"],
        rock: "#716f69",
        battleSky: "#a8df8a",
        battleGround: "#dbbf80"
      },
      buildingRoofs: { clinic: "#ef704b", lab: "#5bb9d6", gym: "#7567d9" },
      npcs: {
        nurse: { name: "Nurse Luma", color: "#ef704b" },
        professor: { name: "Professor Maple", color: "#5bb9d6" },
        scout: { name: "Scout Ren", color: "#7fbf5f" },
        rival: { name: "Rival Jules", color: "#f1c84b" },
        leader: { name: "Leader Aster", color: "#7567d9" }
      },
      trainers: TRAINERS,
      encounters: ENCOUNTERS,
      badgeText: "Aster opens the longer routes, and your dex signal now marks rare encounters more clearly."
    },
    sapphire: {
      id: "sapphire",
      name: "PokeG Sapphire Tide",
      shortName: "Sapphire Tide",
      cardTitle: "Sapphire Tide",
      cardText: "A wetter, Hoenn-inspired route set with tidal grass, cave steel, and new Gen III partners.",
      cardTags: ["coastal", "water", "gen iii"],
      starters: [252, 255, 258, 280],
      professor: "Professor Coral",
      starterHeadline: "Choose your Tide partner",
      leaderName: "Leader Marina",
      leaderBadge: "Tide Badge",
      ballName: "Net Balls",
      giftRepeat: "Professor Coral is reading strange currents along the south shoals.",
      giftLog: "Professor Coral marked a shoal signal on your dex.",
      giftReceived: "Received 8 Net Balls, 2 Potions, and $140.",
      routeNames: {
        town: "Coralroot Town",
        gym: "Marina Gym Pier",
        coast: "Sapphire Shoals",
        granite: "Slatebreak Cave",
        orchard: "Rainleaf Grove",
        meadow: "Dewdrop Route",
        road: "Harbor Road"
      },
      theme: {
        paper: "#f2fbf8",
        paperStrong: "#fffdf6",
        ink: "#10242a",
        muted: "#557075",
        grass: "#63b985",
        grassDark: "#2f8e71",
        water: "#43acd5",
        fire: "#ec7b4f",
        electric: "#f0c94e",
        violet: "#5d74d8",
        danger: "#c74d5a"
      },
      world: {
        meadow: ["#75c894", "#82d3a0"],
        tallgrass: ["#3c9f80", "#4fb18d"],
        path: ["#d8c48a", "#e4d09a"],
        water: "#43acd5",
        treeTrunk: "#1f584c",
        tree: ["#248166", "#2c9677"],
        rock: "#667783",
        battleSky: "#91d6c7",
        battleGround: "#d7c88e"
      },
      buildingRoofs: { clinic: "#43acd5", lab: "#63b985", gym: "#5d74d8" },
      npcs: {
        nurse: { name: "Nurse Pearl", color: "#43acd5" },
        professor: { name: "Professor Coral", color: "#63b985" },
        scout: { name: "Tuber Nia", color: "#4fb18d" },
        rival: { name: "Rival Kai", color: "#f0c94e" },
        leader: { name: "Leader Marina", color: "#5d74d8" }
      },
      trainers: {
        scout: {
          name: "Tuber Nia",
          reward: 112,
          intro: "Tuber Nia splashes into a quick challenge.",
          team: [{ id: 263, level: 5 }, { id: 270, level: 5 }, { id: 278, level: 6 }]
        },
        rival: {
          name: "Rival Kai",
          reward: 210,
          intro: "Rival Kai flips a coin and sends out a fresh partner.",
          dynamic: "rival"
        },
        leader: {
          name: "Leader Marina",
          reward: 680,
          intro: "Leader Marina lets the tide settle before the first throw.",
          badge: "Tide Badge",
          dynamic: "leader",
          badgeText: "Marina clears the shoal gates, and rare coastal encounters begin pulsing on your dex."
        }
      },
      encounters: SAPPHIRE_ENCOUNTERS,
      badgeText: "Marina clears the shoal gates, and rare coastal encounters begin pulsing on your dex."
    }
  };

  const keysDown = new Set();
  let activeTab = "party";
  let state = freshState();
  let lastMoveAt = 0;
  let toastTimer = 0;
  let audioContext = null;

  function freshState(editionId = null) {
    const selectedEdition = editionId && EDITIONS[editionId] ? editionId : null;
    return {
      version: 2,
      edition: selectedEdition,
      trainer: { name: "Rookie" },
      player: { x: 16, y: 12, dir: "down", steps: 0 },
      party: [],
      pc: [],
      activeIndex: 0,
      bag: { balls: selectedEdition === "sapphire" ? 10 : 8, potions: 4, berries: selectedEdition === "sapphire" ? 3 : 2 },
      money: selectedEdition === "sapphire" ? 320 : 300,
      badges: [],
      dexSeen: [],
      dexCaught: [],
      flags: { mapleGift: false, trainers: {} },
      log: [],
      battle: null,
      audioMuted: false
    };
  }

  function normalizeState(save) {
    const selectedEdition = save.edition && EDITIONS[save.edition] ? save.edition : "ember";
    const base = freshState(selectedEdition);
    const merged = { ...base, ...save };
    merged.version = 2;
    merged.edition = selectedEdition;
    merged.trainer = { ...base.trainer, ...(save.trainer || {}) };
    merged.player = { ...base.player, ...(save.player || {}) };
    merged.bag = { ...base.bag, ...(save.bag || {}) };
    merged.flags = { ...base.flags, ...(save.flags || {}) };
    merged.flags.trainers = { ...(save.flags && save.flags.trainers ? save.flags.trainers : {}) };
    merged.party = Array.isArray(save.party) ? save.party.map(revivePokemon).filter(Boolean) : [];
    merged.pc = Array.isArray(save.pc) ? save.pc.map(revivePokemon).filter(Boolean) : [];
    merged.dexSeen = uniqueNumbers(save.dexSeen || []);
    merged.dexCaught = uniqueNumbers(save.dexCaught || []);
    merged.badges = Array.isArray(save.badges) ? save.badges : [];
    merged.log = Array.isArray(save.log) ? save.log.slice(0, 40) : [];
    merged.battle = null;
    if (merged.activeIndex >= merged.party.length) merged.activeIndex = 0;
    return merged;
  }

  function revivePokemon(raw) {
    if (!raw || !SPECIES.has(raw.speciesId)) return null;
    const pokemon = {
      uid: raw.uid || uid(),
      speciesId: raw.speciesId,
      name: raw.name || speciesOf(raw.speciesId).name,
      level: clamp(raw.level || 1, 1, 100),
      xp: Math.max(0, raw.xp || 0),
      hp: Math.max(0, raw.hp || 1),
      maxHp: raw.maxHp || 1,
      stats: raw.stats || {},
      moves: Array.isArray(raw.moves) ? raw.moves.filter((move) => MOVES[move]).slice(0, 4) : [],
      stages: { attack: 0, defense: 0, speed: 0 }
    };
    if (!pokemon.moves.length) pokemon.moves = movesForLevel(pokemon.speciesId, pokemon.level);
    recalcPokemon(pokemon, true);
    return pokemon;
  }

  function boot() {
    renderEditions();
    renderStarters();
    const saved = loadGame();
    if (saved && saved.party.length) {
      state = saved;
      applyEditionTheme();
      els.editionModal.hidden = true;
      els.starterModal.hidden = true;
      showToast("Save loaded.");
    } else {
      applyEditionTheme("ember");
      els.editionModal.hidden = false;
      els.starterModal.hidden = true;
    }
    syncAudioButton();
    renderAll();
    requestAnimationFrame(drawWorld);
  }

  function loadGame() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      return normalizeState(JSON.parse(raw));
    } catch (error) {
      console.warn("Could not load save", error);
      return null;
    }
  }

  function saveGame(manual = false) {
    const snapshot = {
      ...state,
      battle: null,
      party: state.party.map(cleanPokemonForSave),
      pc: state.pc.map(cleanPokemonForSave)
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
    if (manual) {
      pushLog("Game saved.");
      showToast("Game saved.");
      tone(740, 0.055, "triangle");
      tone(980, 0.07, "triangle", 0.045);
    }
  }

  function getEdition(id = state.edition) {
    return EDITIONS[id] || EDITIONS.ember;
  }

  function applyEditionTheme(id = state.edition) {
    const edition = getEdition(id);
    const root = document.documentElement;
    const theme = edition.theme;
    root.style.setProperty("--paper", theme.paper);
    root.style.setProperty("--paper-strong", theme.paperStrong);
    root.style.setProperty("--ink", theme.ink);
    root.style.setProperty("--muted", theme.muted);
    root.style.setProperty("--grass", theme.grass);
    root.style.setProperty("--grass-dark", theme.grassDark);
    root.style.setProperty("--water", theme.water);
    root.style.setProperty("--fire", theme.fire);
    root.style.setProperty("--electric", theme.electric);
    root.style.setProperty("--violet", theme.violet);
    root.style.setProperty("--danger", theme.danger);
    root.style.setProperty("--battle-sky", edition.world.battleSky);
    root.style.setProperty("--battle-ground", edition.world.battleGround);
    document.body.dataset.gameEdition = edition.id;
    document.title = `${edition.name} - Versioned Routes`;
  }

  function editionTrainer(trainerId) {
    return getEdition().trainers[trainerId];
  }

  function editionNpcs() {
    const edition = getEdition();
    return NPCS.map((npc) => ({ ...npc, ...(edition.npcs[npc.id] || {}) }));
  }

  function worldPalette() {
    return getEdition().world;
  }

  function cleanPokemonForSave(pokemon) {
    const { stages, ...rest } = pokemon;
    return rest;
  }

  function renderAll() {
    renderTopline();
    renderSidePanels();
    renderQuest();
    if (state.battle) renderBattle();
  }

  function renderTopline() {
    const edition = getEdition();
    els.gameTitle.textContent = state.edition ? edition.name : "PokeG v2";
    els.trainerName.textContent = state.trainer.name;
    els.routeName.textContent = state.edition ? currentRouteName() : "Choose your edition";
    els.badgeCount.textContent = state.badges.length;
    els.moneyCount.textContent = `$${state.money}`;
    els.seenCount.textContent = state.dexSeen.length;
    els.editionName.textContent = state.edition ? edition.shortName : "v2";
  }

  function renderQuest() {
    const edition = getEdition();
    let text = state.edition ? "Choose a starter" : "Choose a version";
    if (state.party.length) text = `Talk with ${edition.professor}`;
    if (state.flags.mapleGift) text = "Train in the tall grass";
    if (state.flags.trainers.scout) text = `Find ${edition.npcs.rival.name}`;
    if (state.flags.trainers.rival) text = `Challenge ${edition.leaderName}`;
    if (state.badges.includes(edition.leaderBadge)) text = `${edition.leaderBadge} secured`;
    els.questText.textContent = text;
  }

  function renderSidePanels() {
    renderParty();
    renderBag();
    renderDex();
    renderEventLog();
    document.querySelectorAll(".tab").forEach((tab) => {
      const isActive = tab.dataset.tab === activeTab;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
    document.querySelectorAll(".panel-view").forEach((panel) => panel.classList.remove("is-active"));
    const panel = document.getElementById(`${activeTab}Panel`);
    if (panel) panel.classList.add("is-active");
  }

  function renderParty() {
    if (!state.party.length) {
      els.partyPanel.innerHTML = `<div class="empty-state">No partner yet.</div>`;
      return;
    }
    els.partyPanel.innerHTML = `
      <div class="party-list">
        ${state.party.map((pokemon, index) => partyCard(pokemon, index)).join("")}
      </div>
    `;
  }

  function partyCard(pokemon, index) {
    const hp = percent(pokemon.hp, pokemon.maxHp);
    const xp = percent(pokemon.xp, xpNeeded(pokemon.level));
    const active = index === state.activeIndex ? " is-active" : "";
    return `
      <article class="party-card${active}">
        ${spriteBox(pokemon, "front")}
        <div class="party-body">
          <div class="party-line">
            <strong>${escapeHtml(pokemon.name)}</strong>
            <span>Lv ${pokemon.level}</span>
          </div>
          ${typeStrip(typesOf(pokemon))}
          <div class="stat-line"><span>HP</span><span>${pokemon.hp}/${pokemon.maxHp}</span></div>
          <div class="hp-track"><div class="hp-fill ${hp < 34 ? "low" : ""}" style="width:${hp}%"></div></div>
          <div class="stat-line"><span>XP</span><span>${pokemon.xp}/${xpNeeded(pokemon.level)}</span></div>
          <div class="xp-track"><div class="xp-fill" style="width:${xp}%"></div></div>
          <div class="party-actions">
            <button class="party-action" type="button" data-lead="${index}" ${pokemon.hp <= 0 ? "disabled" : ""}>Lead</button>
            <button class="party-action" type="button" data-party-potion="${index}" ${state.bag.potions <= 0 || pokemon.hp >= pokemon.maxHp ? "disabled" : ""}>Potion</button>
            <button class="party-action" type="button" data-party-berry="${index}" ${state.bag.berries <= 0 || pokemon.hp >= pokemon.maxHp ? "disabled" : ""}>Berry</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderBag() {
    const edition = getEdition();
    const rows = [
      [edition.ballName, state.bag.balls, "Capture wild partners during encounters."],
      ["Potions", state.bag.potions, "Restore 24 HP to a partner."],
      ["Berries", state.bag.berries, "A light snack that restores 12 HP outside battle."]
    ];
    els.bagPanel.innerHTML = `
      <div class="bag-list">
        ${rows.map(([name, count, desc]) => `
          <div class="bag-row">
            <div class="bag-body">
              <div class="bag-line"><strong>${name}</strong></div>
              <div class="bag-line"><span>${desc}</span></div>
            </div>
            <div class="bag-count">${count}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderDex() {
    const seen = state.dexSeen
      .map((id) => speciesOf(id))
      .filter(Boolean)
      .sort((a, b) => a.id - b.id);
    if (!seen.length) {
      els.dexPanel.innerHTML = `<div class="empty-state">The dex is quiet.</div>`;
      return;
    }
    els.dexPanel.innerHTML = `
      <div class="dex-list">
        ${seen.map((species) => {
          const caught = state.dexCaught.includes(species.id);
          return `
            <div class="dex-row ${caught ? "is-caught" : ""}">
              <div class="dex-index">${padDex(species.id)}</div>
              <div class="dex-body">
                <div class="dex-line"><strong>${escapeHtml(caught ? species.name : "Seen silhouette")}</strong><span>${caught ? "Caught" : "Seen"}</span></div>
                ${typeStrip(species.types)}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderEventLog() {
    if (!state.log.length) {
      els.logPanel.innerHTML = `<div class="empty-state">No field notes yet.</div>`;
      return;
    }
    els.logPanel.innerHTML = `
      <div class="event-log">
        ${state.log.slice(0, 24).map((entry) => `<div class="log-row"><span>${escapeHtml(entry)}</span></div>`).join("")}
      </div>
    `;
  }

  function renderEditions() {
    els.editionGrid.innerHTML = Object.values(EDITIONS).map((edition) => `
      <button class="edition-card" type="button" data-edition="${edition.id}">
        <div class="version-scene" aria-hidden="true">
          <span class="scene-token">${edition.id === "ember" ? "FR" : "SA"}</span>
          <span class="scene-token">${edition.id === "ember" ? "01" : "03"}</span>
        </div>
        <div>
          <strong>${edition.cardTitle}</strong>
          <div class="edition-tags">${edition.cardTags.map((tag) => `<span>${tag}</span>`).join("")}</div>
          <p>${edition.cardText}</p>
        </div>
      </button>
    `).join("");
  }

  function renderStarters() {
    const edition = getEdition();
    els.starterProfessor.textContent = edition.professor;
    els.starterHeadline.textContent = edition.starterHeadline;
    els.starterGrid.innerHTML = edition.starters.map((id) => {
      const species = speciesOf(id);
      const move = MOVES[movesForLevel(id, 5).find((key) => MOVES[key].type === species.types[0]) || movesForLevel(id, 5)[0]];
      return `
        <button class="starter-card" type="button" data-starter="${id}">
          ${spriteBox({ speciesId: id, name: species.name, level: 5 }, "front")}
          <div>
            <strong>${species.name}</strong>
            ${typeStrip(species.types)}
            <p>${move.name} gives this partner a clear early rhythm.</p>
          </div>
        </button>
      `;
    }).join("");
  }

  function chooseEdition(editionId) {
    if (!EDITIONS[editionId]) return;
    state = freshState(editionId);
    applyEditionTheme();
    renderStarters();
    els.editionModal.hidden = true;
    els.starterModal.hidden = false;
    showToast(`${getEdition().shortName} selected.`);
    renderAll();
    tone(392, 0.07, "triangle");
    tone(659, 0.09, "triangle", 0.07);
  }

  function startGame(starterId) {
    const editionId = state.edition || "ember";
    state = freshState(editionId);
    applyEditionTheme();
    const starter = createPokemon(starterId, 5);
    state.party.push(starter);
    state.activeIndex = 0;
    markSeen(starterId);
    markCaught(starterId);
    pushLog(`${starter.name} joined your party.`);
    pushLog(`${getEdition().shortName} journey started.`);
    els.editionModal.hidden = true;
    els.starterModal.hidden = true;
    showToast(`${starter.name} joined your party.`);
    saveGame(false);
    renderAll();
    tone(523, 0.08, "triangle");
    tone(784, 0.12, "triangle", 0.07);
  }

  function drawWorld(time = 0) {
    ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
    for (let y = 0; y < WORLD.height; y += 1) {
      for (let x = 0; x < WORLD.width; x += 1) {
        drawTile(x, y, tileAt(x, y), time);
      }
    }
    drawBuildings();
    const actors = [
      ...editionNpcs().map((npc) => ({ kind: "npc", y: npc.y, actor: npc })),
      { kind: "player", y: state.player.y, actor: state.player }
    ].sort((a, b) => a.y - b.y);
    actors.forEach((entry) => {
      if (entry.kind === "npc") drawNpc(entry.actor, time);
      else drawPlayer(entry.actor, time);
    });
    requestAnimationFrame(drawWorld);
  }

  function drawTile(x, y, tile, time) {
    const px = x * WORLD.tile;
    const py = y * WORLD.tile;
    const h = hash(x, y);
    const palette = worldPalette();
    const baseTile = tile === "building" ? "meadow" : tile;
    const colors = {
      meadow: h % 3 === 0 ? palette.meadow[0] : palette.meadow[1],
      tallgrass: h % 2 === 0 ? palette.tallgrass[0] : palette.tallgrass[1],
      path: h % 2 === 0 ? palette.path[0] : palette.path[1],
      water: palette.water,
      tree: palette.tree[0],
      rock: palette.rock
    };
    ctx.fillStyle = colors[baseTile] || colors.meadow;
    ctx.fillRect(px, py, WORLD.tile, WORLD.tile);

    if (baseTile === "path") {
      ctx.fillStyle = "rgba(255,255,255,0.13)";
      ctx.fillRect(px + 6, py + 12, 6, 4);
      ctx.fillRect(px + 20, py + 22, 7, 3);
    }

    if (baseTile === "tallgrass") {
      ctx.strokeStyle = "rgba(25, 87, 44, 0.62)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i += 1) {
        const gx = px + 5 + ((h + i * 11) % 22);
        const gy = py + 23 - ((h + i * 7) % 7);
        ctx.beginPath();
        ctx.moveTo(gx, gy + 5);
        ctx.quadraticCurveTo(gx + 3, gy - 5 - Math.sin(time / 220 + i) * 2, gx + 8, gy + 2);
        ctx.stroke();
      }
    }

    if (baseTile === "water") {
      ctx.fillStyle = `rgba(255,255,255,${0.18 + Math.sin(time / 260 + x) * 0.04})`;
      ctx.fillRect(px + ((h + Math.floor(time / 180)) % 12), py + 9, 13, 3);
      ctx.fillRect(px + ((h + 9 + Math.floor(time / 220)) % 16), py + 22, 10, 2);
    }

    if (baseTile === "tree") {
      ctx.fillStyle = palette.treeTrunk;
      ctx.fillRect(px + 12, py + 17, 8, 13);
      ctx.fillStyle = h % 2 === 0 ? palette.tree[0] : palette.tree[1];
      ctx.beginPath();
      ctx.arc(px + 16, py + 13, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(px + 10, py + 5, 7, 4);
    }

    if (baseTile === "rock") {
      ctx.fillStyle = palette.rock;
      ctx.beginPath();
      ctx.moveTo(px + 7, py + 26);
      ctx.lineTo(px + 12, py + 9);
      ctx.lineTo(px + 23, py + 7);
      ctx.lineTo(px + 29, py + 25);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      ctx.fillRect(px + 14, py + 11, 8, 3);
    }
  }

  function drawBuildings() {
    const edition = getEdition();
    BUILDINGS.forEach((building) => {
      const x = building.x * WORLD.tile;
      const y = building.y * WORLD.tile;
      const w = building.w * WORLD.tile;
      const h = building.h * WORLD.tile;
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(x + 5, y + h - 4, w, 8);
      ctx.fillStyle = building.body;
      ctx.fillRect(x + 8, y + 24, w - 16, h - 24);
      ctx.fillStyle = edition.buildingRoofs[building.id] || building.roof;
      ctx.fillRect(x, y + 8, w, 34);
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(x, y + 38, w, 5);
      ctx.fillStyle = "#513b2d";
      ctx.fillRect(building.doorX * WORLD.tile + 6, y + h - 34, 20, 34);
      ctx.fillStyle = "#ffe9a7";
      ctx.fillRect(x + 18, y + 50, 18, 14);
      ctx.fillRect(x + w - 36, y + 50, 18, 14);
      ctx.fillStyle = "#fffdf6";
      ctx.font = "900 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(building.name.toUpperCase(), x + w / 2, y + 29);
    });
  }

  function drawNpc(npc, time) {
    const px = npc.x * WORLD.tile;
    const py = npc.y * WORLD.tile;
    const bob = Math.sin(time / 340 + npc.x) * 1.5;
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.beginPath();
    ctx.ellipse(px + 16, py + 27, 11, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f3c69f";
    ctx.fillRect(px + 10, py + 5 + bob, 12, 10);
    ctx.fillStyle = npc.color;
    ctx.fillRect(px + 8, py + 14 + bob, 16, 13);
    ctx.fillStyle = "#26322c";
    ctx.fillRect(px + 9, py + 27 + bob, 5, 5);
    ctx.fillRect(px + 18, py + 27 + bob, 5, 5);
    ctx.fillStyle = "#fffdf6";
    ctx.fillRect(px + 13, py + 8 + bob, 3, 2);
  }

  function drawPlayer(player, time) {
    const px = player.x * WORLD.tile;
    const py = player.y * WORLD.tile;
    const moving = keysDown.size && !isLocked();
    const bob = moving ? Math.sin(time / 80) * 2 : Math.sin(time / 420) * 1;
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(px + 16, py + 28, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f2c08f";
    ctx.fillRect(px + 10, py + 6 + bob, 12, 9);
    ctx.fillStyle = "#17211d";
    ctx.fillRect(px + 8, py + 3 + bob, 16, 5);
    ctx.fillStyle = "#ef704b";
    ctx.fillRect(px + 7, py + 14 + bob, 18, 13);
    ctx.fillStyle = "#203b62";
    ctx.fillRect(px + 9, py + 27 + bob, 5, 5);
    ctx.fillRect(px + 18, py + 27 + bob, 5, 5);
    ctx.fillStyle = "#fffdf6";
    if (player.dir === "left") ctx.fillRect(px + 8, py + 11 + bob, 4, 2);
    else if (player.dir === "right") ctx.fillRect(px + 20, py + 11 + bob, 4, 2);
    else ctx.fillRect(px + 13, py + 10 + bob, 6, 2);
  }

  function tileAt(x, y) {
    if (x < 0 || y < 0 || x >= WORLD.width || y >= WORLD.height) return "tree";
    if (isBuildingCell(x, y)) return "building";
    if (x === 0 || y === 0 || x === WORLD.width - 1 || y === WORLD.height - 1) return "tree";
    if (isWater(x, y)) return "water";
    if (isPath(x, y)) return "path";
    if (isRock(x, y)) return "rock";
    if (isTreeCluster(x, y)) return "tree";
    if (isTallGrass(x, y)) return "tallgrass";
    return "meadow";
  }

  function isPath(x, y) {
    if (y === 11 && x >= 3 && x <= 30) return true;
    if (x === 16 && y >= 5 && y <= 18) return true;
    if (y === 7 && x >= 5 && x <= 28) return true;
    if (x === 5 && y >= 6 && y <= 11) return true;
    if (x === 28 && y >= 7 && y <= 11) return true;
    if (x >= 13 && x <= 19 && y === 18) return true;
    return false;
  }

  function isWater(x, y) {
    const dx = x - 27;
    const dy = y - 16;
    return dx * dx * 0.75 + dy * dy * 1.35 < 20 || (x >= 30 && y >= 13 && y <= 19);
  }

  function isRock(x, y) {
    if (x >= 2 && x <= 10 && y >= 16 && y <= 19 && !isPath(x, y)) return (x + y) % 3 !== 0;
    if (x >= 20 && x <= 24 && y >= 3 && y <= 5) return (x * 2 + y) % 4 !== 1;
    return false;
  }

  function isTreeCluster(x, y) {
    if (x <= 2 || y <= 1) return true;
    if (x >= 31 && y <= 10) return true;
    if (x >= 7 && x <= 12 && y >= 2 && y <= 5) return (x + y) % 2 === 0;
    if (x >= 1 && x <= 4 && y >= 12 && y <= 15) return (x + y) % 2 === 1;
    if (x >= 19 && x <= 23 && y >= 15 && y <= 20) return (x + y) % 3 === 0;
    return false;
  }

  function isTallGrass(x, y) {
    if (x >= 7 && x <= 14 && y >= 8 && y <= 14 && !isPath(x, y)) return true;
    if (x >= 18 && x <= 24 && y >= 8 && y <= 14 && !isPath(x, y)) return true;
    if (x >= 2 && x <= 12 && y >= 15 && y <= 20 && !isRock(x, y)) return true;
    if (x >= 24 && x <= 31 && y >= 9 && y <= 19 && !isWater(x, y) && !isPath(x, y)) return true;
    return false;
  }

  function isBuildingCell(x, y) {
    return BUILDINGS.some((building) => (
      x >= building.x &&
      x < building.x + building.w &&
      y >= building.y &&
      y < building.y + building.h
    ));
  }

  function isBlocked(x, y) {
    const tile = tileAt(x, y);
    if (["tree", "rock", "water", "building"].includes(tile)) return true;
    return editionNpcs().some((npc) => npc.x === x && npc.y === y);
  }

  function routeKey() {
    const { x, y } = state.player;
    if (x <= 9 && y <= 8) return "town";
    if (x >= 24 && y <= 9) return "gym";
    if (x >= 24 && y >= 12) return "coast";
    if (x <= 12 && y >= 15) return "granite";
    if (x >= 18 && y >= 8 && y <= 15) return "orchard";
    if (x >= 7 && x <= 14 && y >= 8) return "meadow";
    return "road";
  }

  function currentRouteName() {
    const edition = getEdition();
    return edition.routeNames[routeKey()] || edition.routeNames.road;
  }

  function encounterArea() {
    const route = routeKey();
    if (route === "coast") return "coast";
    if (route === "granite") return "granite";
    if (route === "orchard") return "orchard";
    return "meadow";
  }

  function tryMove(dir) {
    if (isLocked()) return;
    const delta = DIRS[dir];
    if (!delta) return;
    state.player.dir = dir;
    const nextX = state.player.x + delta.x;
    const nextY = state.player.y + delta.y;
    if (isBlocked(nextX, nextY)) {
      tone(120, 0.035, "square");
      renderTopline();
      return;
    }
    state.player.x = nextX;
    state.player.y = nextY;
    state.player.steps += 1;
    if (state.player.steps % 8 === 0) saveGame(false);
    renderTopline();
    maybeWildEncounter();
  }

  function maybeWildEncounter() {
    if (!state.party.length || state.battle) return;
    if (tileAt(state.player.x, state.player.y) !== "tallgrass") return;
    const rate = state.badges.includes(getEdition().leaderBadge) ? 0.1 : 0.14;
    if (Math.random() > rate) return;
    const area = encounterArea();
    const wild = chooseWildPokemon(area);
    markSeen(wild.speciesId);
    pushLog(`A wild ${wild.name} appeared.`);
    startBattle({
      kind: "wild",
      enemy: wild,
      log: [`A wild ${wild.name} appeared.`],
      locked: false,
      ended: false,
      forcedSwitch: false
    });
  }

  function chooseWildPokemon(area) {
    const encounters = getEdition().encounters;
    const table = encounters[area] || encounters.meadow;
    const total = table.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * total;
    let chosen = table[0];
    for (const entry of table) {
      roll -= entry.weight;
      if (roll <= 0) {
        chosen = entry;
        break;
      }
    }
    const avg = partyAverageLevel();
    const min = Math.max(2, Math.min(chosen.max, Math.floor(avg - 3), chosen.min));
    const max = Math.max(min, Math.min(chosen.max + Math.floor(avg / 8), Math.ceil(avg + 2)));
    return createPokemon(chosen.id, randomInt(min, max));
  }

  function interact() {
    if (isLocked()) return;
    const delta = DIRS[state.player.dir] || DIRS.down;
    const target = { x: state.player.x + delta.x, y: state.player.y + delta.y };
    const npc = editionNpcs().find((entry) => entry.x === target.x && entry.y === target.y);
    if (npc) {
      interactNpc(npc);
      return;
    }
    const building = buildingAt(target.x, target.y);
    if (building && building.id === "clinic") {
      healParty(true);
      return;
    }
    if (building && building.id === "gym") {
      showToast(`${getEdition().leaderName} is waiting by the arena gate.`);
      return;
    }
    if (building && building.id === "lab") {
      professorGift();
      return;
    }
    showToast("The route hums quietly.");
  }

  function interactNpc(npc) {
    if (npc.action === "heal") {
      healParty(true);
      return;
    }
    if (npc.action === "gift") {
      professorGift();
      return;
    }
    if (npc.action === "trainer") {
      startTrainerBattle(npc.trainerId);
    }
  }

  function buildingAt(x, y) {
    return BUILDINGS.find((building) => (
      x >= building.x &&
      x < building.x + building.w &&
      y >= building.y &&
      y < building.y + building.h
    ));
  }

  function professorGift() {
    if (!state.party.length) return;
    const edition = getEdition();
    if (state.flags.mapleGift) {
      showToast(edition.giftRepeat);
      pushLog(edition.giftLog);
      renderAll();
      return;
    }
    state.flags.mapleGift = true;
    state.bag.balls += edition.id === "sapphire" ? 8 : 6;
    state.bag.potions += 2;
    state.money += edition.id === "sapphire" ? 140 : 120;
    pushLog(`${edition.professor} stocked your bag for the road.`);
    showToast(edition.giftReceived);
    saveGame(false);
    renderAll();
    tone(659, 0.08, "triangle");
    tone(880, 0.1, "triangle", 0.08);
  }

  function healParty(show = false) {
    if (!state.party.length) return;
    state.party.forEach((pokemon) => {
      pokemon.hp = pokemon.maxHp;
      pokemon.stages = { attack: 0, defense: 0, speed: 0 };
    });
    state.activeIndex = firstAliveIndex();
    pushLog("Your party was healed.");
    if (show) showToast("Your party was healed.");
    saveGame(false);
    renderAll();
    tone(523, 0.08, "sine");
    tone(659, 0.08, "sine", 0.06);
    tone(784, 0.1, "sine", 0.12);
  }

  function startTrainerBattle(trainerId) {
    const trainer = editionTrainer(trainerId);
    if (!trainer) return;
    if (state.flags.trainers[trainerId]) {
      showToast(`${trainer.name} nods in respect.`);
      return;
    }
    if (trainerId === "leader" && !state.flags.trainers.rival) {
      showToast(`${getEdition().leaderName} points back toward the east road.`);
      return;
    }
    const team = trainerTeam(trainerId);
    team.forEach((pokemon) => markSeen(pokemon.speciesId));
    startBattle({
      kind: "trainer",
      trainerId,
      trainerName: trainer.name,
      reward: trainer.reward,
      badge: trainer.badge || "",
      badgeText: trainer.badgeText || getEdition().badgeText,
      enemies: team,
      enemyIndex: 0,
      log: [trainer.intro],
      locked: false,
      ended: false,
      forcedSwitch: false
    });
  }

  function trainerTeam(trainerId) {
    const trainer = editionTrainer(trainerId);
    const edition = getEdition();
    const avg = partyAverageLevel();
    if (trainer.dynamic === "rival") {
      const starterType = state.party[0] ? typesOf(state.party[0])[0] : "grass";
      const counter = edition.id === "sapphire"
        ? starterType === "grass" ? 255 : starterType === "fire" ? 258 : starterType === "water" ? 252 : 261
        : starterType === "grass" ? 4 : starterType === "fire" ? 7 : starterType === "water" ? 1 : 27;
      const scale = clamp(Math.round(avg + 1), 7, 13);
      if (edition.id === "sapphire") {
        return [
          createPokemon(263, scale),
          createPokemon(counter, scale + 1),
          createPokemon(278, Math.max(7, scale))
        ];
      }
      return [
        createPokemon(133, scale),
        createPokemon(counter, scale + 1),
        createPokemon(21, Math.max(7, scale))
      ];
    }
    if (trainer.dynamic === "leader") {
      const scale = clamp(Math.round(avg + 2), 11, 18);
      if (edition.id === "sapphire") {
        return [
          createPokemon(270, scale),
          createPokemon(318, scale + 1),
          createPokemon(363, scale + 2)
        ];
      }
      return [
        createPokemon(43, scale),
        createPokemon(102, scale + 1),
        createPokemon(133, scale + 2)
      ];
    }
    return trainer.team.map((entry) => createPokemon(entry.id, entry.level));
  }

  function startBattle(battle) {
    const active = firstAliveIndex();
    if (active === -1) {
      healParty(true);
      return;
    }
    state.activeIndex = active;
    resetBattleStages();
    state.battle = battle;
    els.battleOverlay.hidden = false;
    renderBattle();
    saveGame(false);
    tone(196, 0.08, "sawtooth");
    tone(147, 0.12, "sawtooth", 0.08);
  }

  function renderBattle() {
    const battle = state.battle;
    if (!battle) {
      els.battleOverlay.hidden = true;
      return;
    }
    const player = activePokemon();
    const enemy = battleEnemy();
    els.battleOverlay.hidden = false;
    els.battleTitle.textContent = battle.kind === "trainer"
      ? `${battle.trainerName} battle`
      : `Wild ${enemy.name}`;
    els.playerCombatant.innerHTML = combatantHtml(player, "player");
    els.enemyCombatant.innerHTML = combatantHtml(enemy, "enemy");
    els.battleLog.innerHTML = battle.log.slice(-8).map((line) => `<p>${escapeHtml(line)}</p>`).join("");
    els.battleLog.scrollTop = els.battleLog.scrollHeight;

    const disableActions = battle.locked || battle.ended || battle.forcedSwitch || !player || player.hp <= 0;
    els.moveGrid.innerHTML = (player ? player.moves : []).map((key) => {
      const move = MOVES[key];
      return `
        <button class="move-button type-${move.type}" type="button" data-move-key="${key}" ${disableActions ? "disabled" : ""}>
          ${move.name}
          <span>${move.type} / ${move.power ? move.power : "status"}</span>
        </button>
      `;
    }).join("");
    els.catchButton.disabled = disableActions || battle.kind !== "wild" || state.bag.balls <= 0;
    els.catchButton.textContent = `${getEdition().ballName.replace(/s$/, "")} (${state.bag.balls})`;
    els.potionButton.disabled = battle.locked || battle.ended || battle.forcedSwitch || state.bag.potions <= 0 || !player || player.hp >= player.maxHp;
    els.potionButton.textContent = `Potion (${state.bag.potions})`;
    els.switchButton.disabled = battle.locked || battle.ended || partyAliveCount() <= 1;
    els.fleeButton.disabled = battle.locked || (battle.kind === "trainer" && !battle.ended);
    els.fleeButton.textContent = battle.ended ? "Continue" : "Flee";
    els.battleCloseButton.disabled = !battle.ended;

    if (battle.forcedSwitch) showSwitchPanel(true);
    else if (els.switchPanel.hidden) els.switchPanel.innerHTML = "";
  }

  function combatantHtml(pokemon, side) {
    if (!pokemon) return "";
    const hp = percent(pokemon.hp, pokemon.maxHp);
    const types = typesOf(pokemon);
    return `
      <div class="combat-card">
        <div class="party-line">
          <strong>${escapeHtml(pokemon.name)}</strong>
          <span>Lv ${pokemon.level}</span>
        </div>
        ${typeStrip(types)}
        <div class="stat-line"><span>HP</span><span>${pokemon.hp}/${pokemon.maxHp}</span></div>
        <div class="hp-track"><div class="hp-fill ${hp < 34 ? "low" : ""}" style="width:${hp}%"></div></div>
      </div>
      <div class="battle-sprite">
        ${spriteBattle(pokemon, side)}
      </div>
    `;
  }

  function useMove(key) {
    const battle = state.battle;
    if (!battle || battle.locked || battle.ended || battle.forcedSwitch) return;
    const player = activePokemon();
    const enemy = battleEnemy();
    if (!player || !enemy || player.hp <= 0) return;
    const enemyMove = chooseMove(enemy, player);
    const playerMove = MOVES[key];
    const foeMove = MOVES[enemyMove];
    const playerFirst = (playerMove.priority || 0) > (foeMove.priority || 0) ||
      ((playerMove.priority || 0) === (foeMove.priority || 0) && effectiveStat(player, "speed") >= effectiveStat(enemy, "speed"));
    battle.locked = true;
    battle.log.push(`${player.name} used ${playerMove.name}.`);
    performTurnOrder(playerFirst, key, enemyMove);
  }

  function performTurnOrder(playerFirst, playerMove, enemyMove) {
    const battle = state.battle;
    const player = activePokemon();
    const enemy = battleEnemy();
    if (playerFirst) {
      battle.log.push(...performAttack(player, enemy, playerMove));
      if (enemy.hp <= 0) {
        handleEnemyFainted();
        return;
      }
      battle.log.push(`${enemy.name} used ${MOVES[enemyMove].name}.`);
      battle.log.push(...performAttack(enemy, player, enemyMove));
      handlePlayerAfterHit();
      return;
    }
    battle.log.push(`${enemy.name} used ${MOVES[enemyMove].name}.`);
    battle.log.push(...performAttack(enemy, player, enemyMove));
    if (player.hp <= 0) {
      handlePlayerAfterHit();
      return;
    }
    battle.log.push(...performAttack(player, enemy, playerMove));
    if (enemy.hp <= 0) {
      handleEnemyFainted();
      return;
    }
    battle.locked = false;
    renderAfterBattleAction();
  }

  function performAttack(attacker, defender, moveKey) {
    const move = MOVES[moveKey] || MOVES.tackle;
    const lines = [];
    if (Math.random() * 100 > move.accuracy) {
      lines.push("It missed.");
      return lines;
    }
    if (!move.power) {
      lines.push(...applyStatusMove(attacker, defender, move));
      return lines;
    }
    const attack = effectiveStat(attacker, "attack");
    const defense = Math.max(5, effectiveStat(defender, "defense"));
    const stab = typesOf(attacker).includes(move.type) ? 1.5 : 1;
    const typeMod = typeModifier(move.type, typesOf(defender));
    const variance = 0.86 + Math.random() * 0.14;
    const raw = (((2 * attacker.level / 5 + 2) * move.power * attack / defense) / 50 + 2) * stab * typeMod * variance;
    const damage = typeMod === 0 ? 0 : Math.max(1, Math.floor(raw));
    defender.hp = clamp(defender.hp - damage, 0, defender.maxHp);
    if (damage === 0) lines.push("It had no effect.");
    else lines.push(`${defender.name} took ${damage} damage.`);
    if (typeMod > 1) lines.push("It was super effective.");
    if (typeMod > 0 && typeMod < 1) lines.push("It was not very effective.");
    if (move.drain && damage > 0) {
      const healed = healPokemon(attacker, Math.max(1, Math.floor(damage * move.drain)));
      if (healed > 0) lines.push(`${attacker.name} recovered ${healed} HP.`);
    }
    toneForType(move.type);
    return lines;
  }

  function applyStatusMove(attacker, defender, move) {
    const lines = [];
    if (move.effect === "attackDown") {
      changeStage(defender, "attack", -1);
      lines.push(`${defender.name}'s attack fell.`);
    } else if (move.effect === "defenseDown") {
      changeStage(defender, "defense", -1);
      lines.push(`${defender.name}'s defense fell.`);
    } else if (move.effect === "defenseUp") {
      changeStage(attacker, "defense", 1);
      lines.push(`${attacker.name}'s defense rose.`);
    } else {
      lines.push("Nothing happened.");
    }
    tone(330, 0.05, "triangle");
    return lines;
  }

  function handleEnemyFainted() {
    const battle = state.battle;
    const enemy = battleEnemy();
    const player = activePokemon();
    battle.log.push(`${enemy.name} fainted.`);
    battle.log.push(...awardXp(player, enemy));
    if (battle.kind === "trainer" && battle.enemyIndex < battle.enemies.length - 1) {
      battle.enemyIndex += 1;
      const next = battleEnemy();
      markSeen(next.speciesId);
      battle.log.push(`${battle.trainerName} sent out ${next.name}.`);
      battle.locked = false;
      renderAfterBattleAction();
      return;
    }
    finishBattle("win");
  }

  function handlePlayerAfterHit() {
    const battle = state.battle;
    const player = activePokemon();
    if (player.hp > 0) {
      battle.locked = false;
      renderAfterBattleAction();
      return;
    }
    battle.log.push(`${player.name} fainted.`);
    const next = firstAliveIndex();
    if (next === -1) {
      blackOut();
      return;
    }
    battle.forcedSwitch = true;
    battle.locked = false;
    battle.log.push("Choose your next partner.");
    renderAfterBattleAction();
  }

  function finishBattle(result) {
    const battle = state.battle;
    battle.locked = false;
    battle.ended = true;
    battle.forcedSwitch = false;
    if (result === "win") {
      if (battle.kind === "trainer") {
        state.money += battle.reward || 0;
        state.flags.trainers[battle.trainerId] = true;
        battle.log.push(`You won $${battle.reward}.`);
        if (battle.badge && !state.badges.includes(battle.badge)) {
          state.badges.push(battle.badge);
          battle.log.push(`${battle.badge} earned.`);
          battle.finishTitle = `${battle.badge} earned`;
          battle.finishText = battle.badgeText || getEdition().badgeText;
        }
        pushLog(`Defeated ${battle.trainerName}.`);
      } else {
        pushLog(`Defeated a wild ${battle.enemy.name}.`);
      }
      battle.log.push("Battle complete.");
      tone(784, 0.08, "triangle");
      tone(1046, 0.14, "triangle", 0.08);
    }
    saveGame(false);
    renderAfterBattleAction();
  }

  function blackOut() {
    const battle = state.battle;
    const clinicName = `${getEdition().routeNames.town} Clinic`;
    const loss = Math.min(state.money, Math.max(20, Math.floor(state.money * 0.18)));
    state.money -= loss;
    battle.log.push(`You dropped $${loss} getting back to ${clinicName}.`);
    battle.ended = true;
    battle.locked = false;
    battle.forcedSwitch = false;
    state.player.x = 5;
    state.player.y = 7;
    healParty(false);
    pushLog(`You recovered at ${clinicName}.`);
    renderAfterBattleAction();
  }

  function renderAfterBattleAction() {
    renderAll();
    saveGame(false);
  }

  function catchWild() {
    const battle = state.battle;
    if (!battle || battle.kind !== "wild" || battle.locked || battle.ended || state.bag.balls <= 0) return;
    const enemy = battleEnemy();
    state.bag.balls -= 1;
    battle.locked = true;
    battle.log.push(`You threw a ${getEdition().ballName.replace(/s$/, "")} at ${enemy.name}.`);
    const species = speciesOf(enemy.speciesId);
    const hpFactor = (3 * enemy.maxHp - 2 * enemy.hp) / (3 * enemy.maxHp);
    const badgeBoost = state.badges.length ? 1.08 : 1;
    const chance = clamp(0.08 + hpFactor * (species.catchRate / 255) * 0.92 * badgeBoost, 0.08, 0.92);
    if (Math.random() < chance) {
      markCaught(enemy.speciesId);
      addPokemon(enemy);
      battle.log.push(`${enemy.name} was caught.`);
      battle.ended = true;
      battle.locked = false;
      pushLog(`Caught ${enemy.name}.`);
      tone(523, 0.07, "triangle");
      tone(659, 0.07, "triangle", 0.07);
      tone(880, 0.12, "triangle", 0.14);
      renderAfterBattleAction();
      return;
    }
    battle.log.push(`${enemy.name} broke free.`);
    const enemyMove = chooseMove(enemy, activePokemon());
    battle.log.push(`${enemy.name} used ${MOVES[enemyMove].name}.`);
    battle.log.push(...performAttack(enemy, activePokemon(), enemyMove));
    handlePlayerAfterHit();
  }

  function usePotionInBattle() {
    const battle = state.battle;
    const player = activePokemon();
    if (!battle || battle.locked || battle.ended || !player || state.bag.potions <= 0 || player.hp >= player.maxHp) return;
    state.bag.potions -= 1;
    const healed = healPokemon(player, 24);
    battle.locked = true;
    battle.log.push(`${player.name} recovered ${healed} HP.`);
    const enemy = battleEnemy();
    const enemyMove = chooseMove(enemy, player);
    battle.log.push(`${enemy.name} used ${MOVES[enemyMove].name}.`);
    battle.log.push(...performAttack(enemy, player, enemyMove));
    handlePlayerAfterHit();
  }

  function fleeBattle() {
    const battle = state.battle;
    if (!battle) return;
    if (battle.ended) {
      closeBattle();
      return;
    }
    if (battle.kind !== "wild" || battle.locked) return;
    battle.locked = true;
    if (Math.random() < 0.74) {
      battle.log.push("You slipped away safely.");
      battle.ended = true;
      battle.locked = false;
      pushLog("Left a wild encounter.");
      renderAfterBattleAction();
      return;
    }
    battle.log.push("Could not get away.");
    const enemy = battleEnemy();
    const move = chooseMove(enemy, activePokemon());
    battle.log.push(`${enemy.name} used ${MOVES[move].name}.`);
    battle.log.push(...performAttack(enemy, activePokemon(), move));
    handlePlayerAfterHit();
  }

  function closeBattle() {
    const battle = state.battle;
    if (!battle || !battle.ended) return;
    const finishTitle = battle.finishTitle;
    const finishText = battle.finishText;
    resetBattleStages();
    state.battle = null;
    els.battleOverlay.hidden = true;
    els.switchPanel.hidden = true;
    saveGame(false);
    renderAll();
    if (finishTitle) showFinish(finishTitle, finishText);
  }

  function showFinish(title, text) {
    els.finishTitle.textContent = title;
    els.finishText.textContent = text;
    els.finishModal.hidden = false;
  }

  function showSwitchPanel(forced = false) {
    const battle = state.battle;
    if (!battle || battle.ended) return;
    els.switchPanel.hidden = false;
    els.switchPanel.innerHTML = state.party.map((pokemon, index) => {
      const disabled = pokemon.hp <= 0 || index === state.activeIndex;
      return `
        <button type="button" data-switch-to="${index}" ${disabled ? "disabled" : ""}>
          ${escapeHtml(pokemon.name)} - Lv ${pokemon.level} - ${pokemon.hp}/${pokemon.maxHp} HP
        </button>
      `;
    }).join("");
    if (forced) battle.log = battle.log;
  }

  function switchTo(index) {
    const battle = state.battle;
    if (!battle || battle.locked || battle.ended) return;
    const target = state.party[index];
    if (!target || target.hp <= 0 || index === state.activeIndex) return;
    const forced = battle.forcedSwitch;
    state.activeIndex = index;
    battle.forcedSwitch = false;
    battle.log.push(`Go, ${target.name}.`);
    els.switchPanel.hidden = true;
    if (forced) {
      battle.locked = false;
      renderAfterBattleAction();
      return;
    }
    battle.locked = true;
    const enemy = battleEnemy();
    const move = chooseMove(enemy, target);
    battle.log.push(`${enemy.name} used ${MOVES[move].name}.`);
    battle.log.push(...performAttack(enemy, target, move));
    handlePlayerAfterHit();
  }

  function chooseMove(attacker, defender) {
    const options = attacker.moves.length ? attacker.moves : ["tackle"];
    let best = options[0];
    let bestScore = -1;
    options.forEach((key) => {
      const move = MOVES[key] || MOVES.tackle;
      const score = (move.power || 16) * typeModifier(move.type, typesOf(defender)) * (typesOf(attacker).includes(move.type) ? 1.2 : 1) + Math.random() * 16;
      if (score > bestScore) {
        best = key;
        bestScore = score;
      }
    });
    return best;
  }

  function awardXp(player, enemy) {
    if (!player || player.hp <= 0) return [];
    const species = speciesOf(enemy.speciesId);
    const gained = Math.max(8, Math.floor((enemy.level * (species.base.hp + species.base.attack + species.base.defense) / 42) + 8));
    const lines = [`${player.name} gained ${gained} XP.`];
    player.xp += gained;
    while (player.level < 100 && player.xp >= xpNeeded(player.level)) {
      player.xp -= xpNeeded(player.level);
      player.level += 1;
      const oldMoves = player.moves.join(",");
      recalcPokemon(player, true);
      player.moves = movesForLevel(player.speciesId, player.level);
      lines.push(`${player.name} grew to level ${player.level}.`);
      if (player.moves.join(",") !== oldMoves) {
        lines.push(`${player.name} refreshed its move set.`);
      }
      const evolved = tryEvolution(player);
      if (evolved) lines.push(evolved);
    }
    return lines;
  }

  function tryEvolution(pokemon) {
    const species = speciesOf(pokemon.speciesId);
    if (!species.evolve || pokemon.level < species.evolve.level || !SPECIES.has(species.evolve.to)) return "";
    const next = speciesOf(species.evolve.to);
    pokemon.speciesId = next.id;
    pokemon.name = next.name;
    recalcPokemon(pokemon, true);
    pokemon.moves = movesForLevel(pokemon.speciesId, pokemon.level);
    markSeen(next.id);
    markCaught(next.id);
    pushLog(`${species.name} evolved into ${next.name}.`);
    tone(622, 0.08, "triangle");
    tone(932, 0.14, "triangle", 0.08);
    return `${species.name} evolved into ${next.name}.`;
  }

  function addPokemon(pokemon) {
    pokemon.hp = Math.max(1, pokemon.hp);
    pokemon.stages = { attack: 0, defense: 0, speed: 0 };
    if (state.party.length < 6) {
      state.party.push(pokemon);
      return;
    }
    state.pc.push(pokemon);
  }

  function createPokemon(speciesId, level) {
    const species = speciesOf(speciesId);
    const pokemon = {
      uid: uid(),
      speciesId,
      name: species.name,
      level: clamp(level, 1, 100),
      xp: 0,
      hp: 1,
      maxHp: 1,
      stats: { attack: 1, defense: 1, speed: 1 },
      moves: movesForLevel(speciesId, level),
      stages: { attack: 0, defense: 0, speed: 0 }
    };
    recalcPokemon(pokemon, false);
    return pokemon;
  }

  function recalcPokemon(pokemon, preserveHp) {
    const species = speciesOf(pokemon.speciesId);
    const oldMax = pokemon.maxHp || 0;
    const level = pokemon.level;
    pokemon.maxHp = Math.floor(((species.base.hp * 2 * level) / 100) + level + 10);
    pokemon.stats = {
      attack: Math.floor(((species.base.attack * 2 * level) / 100) + 5),
      defense: Math.floor(((species.base.defense * 2 * level) / 100) + 5),
      speed: Math.floor(((species.base.speed * 2 * level) / 100) + 5)
    };
    pokemon.hp = preserveHp ? clamp((pokemon.hp || pokemon.maxHp) + (pokemon.maxHp - oldMax), 0, pokemon.maxHp) : pokemon.maxHp;
    pokemon.stages = pokemon.stages || { attack: 0, defense: 0, speed: 0 };
  }

  function movesForLevel(speciesId, level) {
    const species = speciesOf(speciesId);
    const count = clamp(2 + Math.floor(level / 5), 2, 4);
    const moves = species.moves.filter((key) => MOVES[key]).slice(0, count);
    return moves.length ? moves.slice(-4) : ["tackle"];
  }

  function activePokemon() {
    return state.party[state.activeIndex] || state.party[firstAliveIndex()];
  }

  function battleEnemy() {
    if (!state.battle) return null;
    if (state.battle.kind === "trainer") return state.battle.enemies[state.battle.enemyIndex];
    return state.battle.enemy;
  }

  function firstAliveIndex() {
    return state.party.findIndex((pokemon) => pokemon.hp > 0);
  }

  function partyAliveCount() {
    return state.party.filter((pokemon) => pokemon.hp > 0).length;
  }

  function partyAverageLevel() {
    if (!state.party.length) return 5;
    return state.party.reduce((sum, pokemon) => sum + pokemon.level, 0) / state.party.length;
  }

  function healPokemon(pokemon, amount) {
    const before = pokemon.hp;
    pokemon.hp = clamp(pokemon.hp + amount, 0, pokemon.maxHp);
    return pokemon.hp - before;
  }

  function changeStage(pokemon, stat, amount) {
    pokemon.stages = pokemon.stages || { attack: 0, defense: 0, speed: 0 };
    pokemon.stages[stat] = clamp((pokemon.stages[stat] || 0) + amount, -4, 4);
  }

  function effectiveStat(pokemon, stat) {
    const stage = pokemon.stages ? pokemon.stages[stat] || 0 : 0;
    const multiplier = stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
    return Math.max(1, Math.floor(pokemon.stats[stat] * multiplier));
  }

  function resetBattleStages() {
    state.party.forEach((pokemon) => {
      pokemon.stages = { attack: 0, defense: 0, speed: 0 };
    });
    if (state.battle) {
      const enemies = state.battle.kind === "trainer" ? state.battle.enemies : [state.battle.enemy];
      enemies.filter(Boolean).forEach((pokemon) => {
        pokemon.stages = { attack: 0, defense: 0, speed: 0 };
      });
    }
  }

  function typeModifier(moveType, defenderTypes) {
    const chart = TYPE_CHART[moveType] || {};
    return defenderTypes.reduce((mod, type) => {
      if (chart.none && chart.none.includes(type)) return mod * 0;
      if (chart.double && chart.double.includes(type)) return mod * 2;
      if (chart.half && chart.half.includes(type)) return mod * 0.5;
      return mod;
    }, 1);
  }

  function markSeen(id) {
    if (!state.dexSeen.includes(id)) state.dexSeen.push(id);
  }

  function markCaught(id) {
    markSeen(id);
    if (!state.dexCaught.includes(id)) state.dexCaught.push(id);
  }

  function speciesOf(id) {
    return SPECIES.get(id) || SPECIES.get(16);
  }

  function typesOf(pokemon) {
    return speciesOf(pokemon.speciesId).types;
  }

  function typeStrip(types) {
    return `<div class="type-strip">${types.map((type) => `<span class="type-badge type-${type}">${type}</span>`).join("")}</div>`;
  }

  function spriteBox(pokemon, side) {
    return `
      <div class="sprite-box">
        <span class="sprite-fallback">${initials(pokemon.name)}</span>
        <img src="${spriteUrl(pokemon.speciesId, side)}" alt="${escapeHtml(pokemon.name)}" loading="lazy" onload="this.previousElementSibling.hidden=true" onerror="this.hidden=true">
      </div>
    `;
  }

  function spriteBattle(pokemon, side) {
    return `
      <div class="sprite-box">
        <span class="sprite-fallback">${initials(pokemon.name)}</span>
        <img src="${spriteUrl(pokemon.speciesId, side)}" alt="${escapeHtml(pokemon.name)}" onload="this.previousElementSibling.hidden=true" onerror="this.src='${SPRITE_BASE}/${pokemon.speciesId}.png'; this.onerror=function(){this.hidden=true}">
      </div>
    `;
  }

  function spriteUrl(speciesId, side) {
    if (side === "player") return `${ANIMATED_BASE}/back/${speciesId}.gif`;
    return `${ANIMATED_BASE}/${speciesId}.gif`;
  }

  function initials(name) {
    return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  }

  function padDex(id) {
    return String(id).padStart(3, "0");
  }

  function percent(value, max) {
    if (!max) return 0;
    return clamp(Math.round((value / max) * 100), 0, 100);
  }

  function xpNeeded(level) {
    return Math.floor(38 + level * level * 1.42);
  }

  function pushLog(line) {
    state.log.unshift(line);
    state.log = state.log.slice(0, 48);
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2400);
  }

  function isLocked() {
    return !els.editionModal.hidden || !els.starterModal.hidden || !els.finishModal.hidden || !!state.battle;
  }

  function hash(x, y) {
    let n = x * 374761393 + y * 668265263;
    n = (n ^ (n >> 13)) * 1274126177;
    return Math.abs(n ^ (n >> 16));
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function uid() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function uniqueNumbers(values) {
    return [...new Set(values.map(Number).filter((value) => Number.isFinite(value)))];
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function toneForType(type) {
    const tones = {
      fire: 220,
      water: 330,
      grass: 392,
      electric: 880,
      psychic: 660,
      ghost: 196,
      rock: 147,
      ground: 174,
      ice: 740,
      fighting: 246,
      fairy: 698
    };
    tone(tones[type] || 294, 0.045, type === "electric" ? "square" : "triangle");
  }

  function syncAudioButton() {
    els.audioButton.classList.toggle("danger", state.audioMuted);
    els.audioButton.title = state.audioMuted ? "Sound off" : "Sound on";
  }

  function tone(frequency, duration = 0.06, type = "sine", delay = 0) {
    if (state.audioMuted) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const start = audioContext.currentTime + delay;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.045, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    } catch (error) {
      state.audioMuted = true;
      syncAudioButton();
    }
  }

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const movement = { arrowup: "up", w: "up", arrowdown: "down", s: "down", arrowleft: "left", a: "left", arrowright: "right", d: "right" };
    if (movement[key]) {
      event.preventDefault();
      keysDown.add(movement[key]);
      if (performance.now() - lastMoveAt > 120) {
        tryMove(movement[key]);
        lastMoveAt = performance.now();
      }
    }
    if (key === " " || key === "enter") {
      event.preventDefault();
      interact();
    }
  });

  document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    const movement = { arrowup: "up", w: "up", arrowdown: "down", s: "down", arrowleft: "left", a: "left", arrowright: "right", d: "right" };
    if (movement[key]) keysDown.delete(movement[key]);
  });

  window.setInterval(() => {
    if (isLocked()) return;
    const next = keysDown.values().next().value;
    if (next && performance.now() - lastMoveAt > 150) {
      tryMove(next);
      lastMoveAt = performance.now();
    }
  }, 50);

  document.addEventListener("click", (event) => {
    const editionButton = event.target.closest(".edition-card[data-edition]");
    if (editionButton) {
      chooseEdition(editionButton.dataset.edition);
      return;
    }
    const starter = event.target.closest("[data-starter]");
    if (starter) {
      startGame(Number(starter.dataset.starter));
      return;
    }
    const tab = event.target.closest(".tab");
    if (tab) {
      activeTab = tab.dataset.tab;
      renderSidePanels();
      return;
    }
    const lead = event.target.closest("[data-lead]");
    if (lead) {
      const index = Number(lead.dataset.lead);
      if (state.party[index] && state.party[index].hp > 0) {
        state.activeIndex = index;
        showToast(`${state.party[index].name} is leading.`);
        saveGame(false);
        renderAll();
      }
      return;
    }
    const partyPotion = event.target.closest("[data-party-potion]");
    if (partyPotion) {
      const index = Number(partyPotion.dataset.partyPotion);
      useItemPotion(index, false);
      return;
    }
    const partyBerry = event.target.closest("[data-party-berry]");
    if (partyBerry) {
      const index = Number(partyBerry.dataset.partyBerry);
      useItemPotion(index, true);
      return;
    }
    const switchTarget = event.target.closest("[data-switch-to]");
    if (switchTarget) {
      switchTo(Number(switchTarget.dataset.switchTo));
    }
  });

  function useItemPotion(index, berry = false) {
    const pokemon = state.party[index];
    if (!pokemon) return;
    const bagKey = berry ? "berries" : "potions";
    const amount = berry ? 12 : 24;
    if (state.bag[bagKey] <= 0 || pokemon.hp >= pokemon.maxHp) return;
    state.bag[bagKey] -= 1;
    const healed = healPokemon(pokemon, amount);
    showToast(`${pokemon.name} recovered ${healed} HP.`);
    pushLog(`${pokemon.name} recovered ${healed} HP.`);
    saveGame(false);
    renderAll();
    tone(622, 0.08, "sine");
  }

  document.querySelectorAll("[data-move]").forEach((button) => {
    const move = button.dataset.move;
    button.addEventListener("click", () => tryMove(move));
  });

  els.mobileAction.addEventListener("click", interact);
  els.healButton.addEventListener("click", () => healParty(true));
  els.saveButton.addEventListener("click", () => saveGame(true));
  els.audioButton.addEventListener("click", () => {
    state.audioMuted = !state.audioMuted;
    syncAudioButton();
    saveGame(false);
    if (!state.audioMuted) tone(660, 0.06, "triangle");
  });
  els.resetButton.addEventListener("click", () => {
    const ok = window.confirm("Reset this run?");
    if (!ok) return;
    localStorage.removeItem(SAVE_KEY);
    state = freshState();
    applyEditionTheme("ember");
    els.editionModal.hidden = false;
    els.starterModal.hidden = true;
    els.finishModal.hidden = true;
    els.battleOverlay.hidden = true;
    renderAll();
  });
  els.continueButton.addEventListener("click", () => {
    els.finishModal.hidden = true;
    renderAll();
  });
  els.newRunButton.addEventListener("click", () => {
    localStorage.removeItem(SAVE_KEY);
    state = freshState();
    els.finishModal.hidden = true;
    applyEditionTheme("ember");
    els.editionModal.hidden = false;
    els.starterModal.hidden = true;
    renderAll();
  });
  els.battleCloseButton.addEventListener("click", closeBattle);
  els.moveGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-move-key]");
    if (button) useMove(button.dataset.moveKey);
  });
  els.catchButton.addEventListener("click", catchWild);
  els.potionButton.addEventListener("click", usePotionInBattle);
  els.switchButton.addEventListener("click", () => showSwitchPanel(false));
  els.fleeButton.addEventListener("click", fleeBattle);

  boot();
})();
