(() => {
  "use strict";

  const SAVE_KEY = "pokeg-grand-region-v3";
  const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
  const ANIMATED_BASE = `${SPRITE_BASE}/versions/generation-v/black-white/animated`;
  const WORLD = { width: 96, height: 72, tile: 32 };
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
    mapPanel: document.getElementById("mapPanel"),
    dexPanel: document.getElementById("dexPanel"),
    logPanel: document.getElementById("logPanel"),
    editionModal: document.getElementById("editionModal"),
    editionGrid: document.getElementById("editionGrid"),
    introModal: document.getElementById("introModal"),
    introKicker: document.getElementById("introKicker"),
    introTitle: document.getElementById("introTitle"),
    introScene: document.getElementById("introScene"),
    introText: document.getElementById("introText"),
    introNextButton: document.getElementById("introNextButton"),
    introSkipButton: document.getElementById("introSkipButton"),
    starterModal: document.getElementById("starterModal"),
    starterProfessor: document.getElementById("starterProfessor"),
    starterHeadline: document.getElementById("starterHeadline"),
    starterGrid: document.getElementById("starterGrid"),
    mapModal: document.getElementById("mapModal"),
    regionMapModal: document.getElementById("regionMapModal"),
    mapCloseButton: document.getElementById("mapCloseButton"),
    interiorModal: document.getElementById("interiorModal"),
    interiorKicker: document.getElementById("interiorKicker"),
    interiorTitle: document.getElementById("interiorTitle"),
    interiorScene: document.getElementById("interiorScene"),
    interiorText: document.getElementById("interiorText"),
    interiorPrimaryButton: document.getElementById("interiorPrimaryButton"),
    interiorSecondaryButton: document.getElementById("interiorSecondaryButton"),
    interiorExitButton: document.getElementById("interiorExitButton"),
    finishModal: document.getElementById("finishModal"),
    finishTitle: document.getElementById("finishTitle"),
    finishText: document.getElementById("finishText"),
    battleOverlay: document.getElementById("battleOverlay"),
    battleStage: document.getElementById("battleStage"),
    battleFlash: document.getElementById("battleFlash"),
    battleTitle: document.getElementById("battleTitle"),
    battleCloseButton: document.getElementById("battleCloseButton"),
    playerCombatant: document.getElementById("playerCombatant"),
    enemyCombatant: document.getElementById("enemyCombatant"),
    battleLog: document.getElementById("battleLog"),
    moveGrid: document.getElementById("moveGrid"),
    pauseMenu: document.getElementById("pauseMenu"),
    dialogBox: document.getElementById("dialogBox"),
    dialogSpeaker: document.getElementById("dialogSpeaker"),
    dialogText: document.getElementById("dialogText"),
    menuButton: document.getElementById("menuButton"),
    menuSaveButton: document.getElementById("menuSaveButton"),
    menuCloseButton: document.getElementById("menuCloseButton"),
    catchButton: document.getElementById("catchButton"),
    potionButton: document.getElementById("potionButton"),
    switchButton: document.getElementById("switchButton"),
    fleeButton: document.getElementById("fleeButton"),
    switchPanel: document.getElementById("switchPanel"),
    mapButton: document.getElementById("mapButton"),
    journalButton: document.getElementById("journalButton"),
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

  const CITY_DEFS = [
    { id: "lumen", name: "Lumen Village", x: 5, y: 5, w: 15, h: 11, color: "#e6d2a2", role: "home" },
    { id: "bracken", name: "Bracken City", x: 29, y: 5, w: 15, h: 12, color: "#c9d796", gym: "gym-bracken" },
    { id: "quarry", name: "Quarry Town", x: 54, y: 6, w: 16, h: 12, color: "#c9beb0", gym: "gym-quarry" },
    { id: "harbor", name: "Harborside City", x: 76, y: 12, w: 15, h: 12, color: "#b9d6d8", gym: "gym-harbor" },
    { id: "emberfall", name: "Emberfall City", x: 72, y: 34, w: 16, h: 12, color: "#d9b48d", gym: "gym-emberfall" },
    { id: "crown", name: "Crown City", x: 67, y: 55, w: 18, h: 12, color: "#d7c9e5", role: "league" },
    { id: "frostvale", name: "Frostvale City", x: 49, y: 50, w: 16, h: 12, color: "#c7dde2", gym: "gym-frostvale" },
    { id: "neon", name: "Neon Heights", x: 24, y: 48, w: 16, h: 12, color: "#c8c3df", gym: "gym-neon" },
    { id: "thornmere", name: "Thornmere City", x: 6, y: 37, w: 16, h: 12, color: "#c0ce9a", gym: "gym-thornmere" },
    { id: "astral", name: "Astral City", x: 40, y: 27, w: 16, h: 12, color: "#d4c5df", gym: "gym-astral" }
  ];

  const GYM_DEFS = [
    { trainerId: "gym-bracken", cityId: "bracken", leader: "Leader Sylva", badge: "Briar Badge", type: "grass", rank: 1, roof: "#4e9e56" },
    { trainerId: "gym-quarry", cityId: "quarry", leader: "Leader Flint", badge: "Granite Badge", type: "rock", rank: 2, roof: "#8a7a62" },
    { trainerId: "gym-harbor", cityId: "harbor", leader: "Leader Maris", badge: "Harbor Badge", type: "water", rank: 3, roof: "#3398c8" },
    { trainerId: "gym-emberfall", cityId: "emberfall", leader: "Leader Cinder", badge: "Cinder Badge", type: "fire", rank: 4, roof: "#d86242" },
    { trainerId: "gym-frostvale", cityId: "frostvale", leader: "Leader Noelle", badge: "Glacier Badge", type: "ice", rank: 5, roof: "#67bec7" },
    { trainerId: "gym-neon", cityId: "neon", leader: "Leader Volt", badge: "Neon Badge", type: "electric", rank: 6, roof: "#d5b125" },
    { trainerId: "gym-thornmere", cityId: "thornmere", leader: "Leader Mallow", badge: "Venom Badge", type: "poison", rank: 7, roof: "#8e55b7" },
    { trainerId: "gym-astral", cityId: "astral", leader: "Leader Sol", badge: "Astral Badge", type: "psychic", rank: 8, roof: "#dc5c94" }
  ];

  const ROAD_SEGMENTS = [
    { x1: 12, y1: 10, x2: 36, y2: 10, w: 1 },
    { x1: 36, y1: 10, x2: 62, y2: 12, w: 1 },
    { x1: 62, y1: 12, x2: 83, y2: 17, w: 1 },
    { x1: 83, y1: 17, x2: 83, y2: 40, w: 1 },
    { x1: 80, y1: 40, x2: 80, y2: 61, w: 1 },
    { x1: 57, y1: 56, x2: 80, y2: 61, w: 1 },
    { x1: 32, y1: 54, x2: 57, y2: 56, w: 1 },
    { x1: 14, y1: 43, x2: 32, y2: 54, w: 1 },
    { x1: 14, y1: 43, x2: 48, y2: 33, w: 1 },
    { x1: 48, y1: 33, x2: 36, y2: 10, w: 1 },
    { x1: 48, y1: 33, x2: 80, y2: 40, w: 1 },
    { x1: 32, y1: 54, x2: 48, y2: 33, w: 1 }
  ];

  const WILD_ZONES = [
    { id: "sunpetal", name: "Sunpetal Route", x: 19, y: 4, w: 11, h: 12, encounter: "meadow" },
    { id: "boulderpass", name: "Boulderpass", x: 44, y: 4, w: 12, h: 17, encounter: "granite" },
    { id: "saltwind", name: "Saltwind Coast", x: 69, y: 10, w: 8, h: 20, encounter: "coast" },
    { id: "ashrun", name: "Ashrun Trail", x: 63, y: 29, w: 10, h: 18, encounter: "granite" },
    { id: "snowmelt", name: "Snowmelt Pass", x: 47, y: 41, w: 16, h: 10, encounter: "orchard" },
    { id: "sparkline", name: "Sparkline Flats", x: 22, y: 38, w: 20, h: 10, encounter: "meadow" },
    { id: "murkwood", name: "Murkwood", x: 3, y: 25, w: 22, h: 13, encounter: "orchard" },
    { id: "starfall", name: "Starfall Garden", x: 35, y: 20, w: 25, h: 10, encounter: "orchard" },
    { id: "crownroad", name: "Crown Road", x: 61, y: 46, w: 15, h: 12, encounter: "meadow" }
  ];

  const GATE_DEFS = [
    { id: "bracken-east", x: 44, y: 9, w: 2, h: 3, badge: "Briar Badge", title: "Briar Gate", text: "Bracken's east gate opens after the Briar Badge." },
    { id: "quarry-east", x: 70, y: 11, w: 2, h: 3, badge: "Granite Badge", trainer: "umbra-quarry", title: "Quarry Checkpoint", text: "The checkpoint needs the Granite Badge and Team Umbra cleared from the cable road." },
    { id: "harbor-south", x: 82, y: 28, w: 3, h: 2, badge: "Harbor Badge", title: "Ferry Bridge", text: "The ferry bridge lowers after the Harbor Badge." },
    { id: "ember-south", x: 78, y: 48, w: 3, h: 2, badge: "Cinder Badge", title: "Ashlift Gate", text: "Hot ash blocks the southern lift until the Cinder Badge is certified." },
    { id: "frost-west", x: 44, y: 55, w: 2, h: 3, badge: "Glacier Badge", title: "Snowmelt Gate", text: "The icy road crew opens this gate after the Glacier Badge." },
    { id: "neon-west", x: 22, y: 50, w: 2, h: 3, badge: "Neon Badge", title: "Power Gate", text: "Neon power is needed before the west gate can safely open." },
    { id: "thorn-astral", x: 34, y: 38, w: 3, h: 2, badge: "Venom Badge", title: "Murkwood Crossing", text: "Thornmere's mist thins after the Venom Badge." },
    { id: "crown-gate", x: 66, y: 59, w: 2, h: 3, badge: "Astral Badge", title: "Crown Gate", text: "Eight badges are required beyond this gate." }
  ];

  const CITY_LOCKS = {
    quarry: { badge: "Briar Badge", text: "Quarry Town's tram opens once Bracken certifies the Briar Badge." },
    harbor: { badge: "Granite Badge", trainer: "umbra-quarry", text: "Harborside is holding arrivals until the Granite Badge is logged and Umbra leaves the cable road." },
    emberfall: { badge: "Harbor Badge", text: "The ferry to Emberfall opens after the Harbor Badge." },
    frostvale: { badge: "Cinder Badge", text: "Frostvale's ash-clearing lift opens after the Cinder Badge." },
    neon: { badge: "Glacier Badge", text: "Neon Heights powers its bridge after the Glacier Badge." },
    thornmere: { badge: "Neon Badge", text: "The Thornmere wardens open the west mist road after the Neon Badge." },
    astral: { badge: "Venom Badge", trainer: "umbra-admin", text: "Astral City is locked down until the Venom Badge is earned and Admin Nyx is gone." },
    crown: { badge: "Astral Badge", text: "Crown City accepts challengers only after the Astral Badge." }
  };

  const LANDMARKS = [
    { cityId: "lumen", kind: "lab-dish", x: 17, y: 7, color: "#5bb9d6" },
    { cityId: "bracken", kind: "tree-shrine", x: 36, y: 8, color: "#4e9e56" },
    { cityId: "quarry", kind: "crane", x: 62, y: 8, color: "#8a7a62" },
    { cityId: "harbor", kind: "lighthouse", x: 86, y: 14, color: "#3398c8" },
    { cityId: "emberfall", kind: "furnace", x: 82, y: 37, color: "#d86242" },
    { cityId: "crown", kind: "antenna", x: 76, y: 57, color: "#7567d9" },
    { cityId: "frostvale", kind: "ice-spire", x: 58, y: 52, color: "#67bec7" },
    { cityId: "neon", kind: "power-tower", x: 34, y: 50, color: "#d5b125" },
    { cityId: "thornmere", kind: "mist-well", x: 15, y: 39, color: "#8e55b7" },
    { cityId: "astral", kind: "observatory", x: 48, y: 29, color: "#dc5c94" }
  ];

  const ROUTE_NAMES = Object.fromEntries([
    ...CITY_DEFS.map((city) => [city.id, city.name]),
    ...WILD_ZONES.map((zone) => [zone.id, zone.name]),
    ["road", "Grand Circuit Road"],
    ["coast", "Tidebreak Water"],
    ["woods", "Old Pine Wall"]
  ]);

  const INTRO_STEPS = [
    {
      kicker: "Professor",
      title: "Welcome to the Grand Circuit",
      scene: "professor",
      text: "Ten cities ring the region, eight of them guarded by gym leaders. Your first partner will carry you from Lumen Village to Crown City."
    },
    {
      kicker: "Rival",
      title: "Jules Is Already Moving",
      scene: "rival",
      text: "Your rival Jules wants the same badges, but they keep noticing black vans, cut power lines, and strangers calling themselves Team Umbra."
    },
    {
      kicker: "Region Map",
      title: "A Circuit Built To Open Up",
      scene: "map",
      text: "Routes, gates, markets, clinics, wild zones, and city landmarks now react as you earn badges and stop Team Umbra's blackout plan."
    }
  ];

  const BUILDINGS = createRegionBuildings();
  const NPCS = createRegionNpcs();

  const TRAINERS = {
    scout: {
      name: "Scout Ren",
      reward: 96,
      intro: "Scout Ren wants to test your field instincts.",
      team: [{ id: 10, level: 5 }, { id: 13, level: 5 }, { id: 16, level: 6 }],
      storyLog: "Scout Ren marked tall-grass pockets across the circuit."
    },
    "rival-lumen": {
      name: "Rival Jules",
      reward: 160,
      intro: "Rival Jules darts into the road with a grin and a brand-new plan.",
      dynamic: "rival",
      rank: 1,
      storyLog: "Jules promised to race you to Bracken City."
    },
    "rival-quarry": {
      name: "Rival Jules",
      reward: 360,
      intro: "Jules has been training in the quarry dust and wants proof it mattered.",
      dynamic: "rival",
      rank: 3,
      minBadges: 2,
      requiresTrainer: "rival-lumen",
      storyLog: "Jules saw Team Umbra hauling black crates toward Astral City."
    },
    "rival-astral": {
      name: "Rival Jules",
      reward: 620,
      intro: "Jules steadies their throw under the observatory lights.",
      dynamic: "rival",
      rank: 6,
      minBadges: 5,
      requiresTrainer: "rival-quarry",
      storyLog: "Jules agreed to distract Umbra while you take the last gyms."
    },
    "rival-crown": {
      name: "Rival Jules",
      reward: 960,
      intro: "At Crown Gate, Jules asks for one honest battle before the league.",
      dynamic: "rival",
      rank: 9,
      minBadges: 8,
      requiresTrainer: "rival-astral",
      storyLog: "Jules is waiting at the league desk after Team Umbra falls."
    },
    "umbra-bracken": {
      name: "Umbra Grunt Pax",
      reward: 220,
      intro: "Umbra Grunt Pax blocks the path with a crate stamped in black ink.",
      team: [{ id: 19, level: 8 }, { id: 23, level: 9 }],
      story: "umbra",
      minBadges: 1,
      storyLog: "Team Umbra is collecting gym signal stones."
    },
    "umbra-quarry": {
      name: "Umbra Grunt Voss",
      reward: 340,
      intro: "Umbra Grunt Voss kicks gravel over a humming cable.",
      team: [{ id: 41, level: 13 }, { id: 109, level: 14 }, { id: 27, level: 14 }],
      story: "umbra",
      minBadges: 2,
      requiresTrainer: "umbra-bracken",
      storyLog: "Umbra rerouted quarry power toward Astral City."
    },
    "umbra-admin": {
      name: "Admin Nyx",
      reward: 740,
      intro: "Admin Nyx folds a star map shut and sends out a shadowed partner.",
      team: [{ id: 92, level: 25 }, { id: 88, level: 26 }, { id: 262, level: 27 }],
      story: "umbra",
      minBadges: 5,
      requiresTrainer: "umbra-quarry",
      storyLog: "Admin Nyx fled to Crown City with the stolen signal core."
    },
    "umbra-boss": {
      name: "Director Vey",
      reward: 1600,
      intro: "Director Vey stands beneath the Crown antenna and starts the blackout protocol.",
      team: [{ id: 24, level: 38 }, { id: 81, level: 39 }, { id: 92, level: 40 }, { id: 143, level: 41 }],
      story: "umbra",
      minBadges: 8,
      requiresTrainer: "umbra-admin",
      storyLog: "Team Umbra's signal plot collapsed. Crown City lit up again."
    },
    "gym-bracken": {
      name: "Leader Sylva",
      reward: 680,
      intro: "Leader Sylva bows beside a wall of living vines.",
      badge: "Briar Badge",
      gymRank: 1,
      team: [{ id: 43, level: 8 }, { id: 69, level: 9 }, { id: 46, level: 10 }],
      badgeText: "The Briar Badge opens the eastern circuit and teaches your team to hold steady in longer battles."
    },
    "gym-quarry": {
      name: "Leader Flint",
      reward: 900,
      intro: "Leader Flint slams a pick into the arena floor.",
      badge: "Granite Badge",
      gymRank: 2,
      team: [{ id: 74, level: 12 }, { id: 27, level: 13 }, { id: 95, level: 14 }],
      badgeText: "The Granite Badge clears the quarry pass and gets Team Umbra nervous."
    },
    "gym-harbor": {
      name: "Leader Maris",
      reward: 1120,
      intro: "Leader Maris lets the tide bell ring once before the battle.",
      badge: "Harbor Badge",
      gymRank: 3,
      team: [{ id: 60, level: 16 }, { id: 54, level: 17 }, { id: 120, level: 18 }],
      badgeText: "The Harbor Badge unlocks safe passage along Saltwind Coast."
    },
    "gym-emberfall": {
      name: "Leader Cinder",
      reward: 1360,
      intro: "Leader Cinder smiles through the furnace glow.",
      badge: "Cinder Badge",
      gymRank: 4,
      team: [{ id: 37, level: 20 }, { id: 58, level: 21 }, { id: 77, level: 22 }],
      badgeText: "The Cinder Badge pushes the story south toward the colder routes."
    },
    "gym-frostvale": {
      name: "Leader Noelle",
      reward: 1620,
      intro: "Leader Noelle's arena lights glint across polished ice.",
      badge: "Glacier Badge",
      gymRank: 5,
      team: [{ id: 86, level: 24 }, { id: 90, level: 25 }, { id: 363, level: 26 }],
      badgeText: "The Glacier Badge steadies your team before the neon highlands."
    },
    "gym-neon": {
      name: "Leader Volt",
      reward: 1880,
      intro: "Leader Volt counts down as the gym floor starts to hum.",
      badge: "Neon Badge",
      gymRank: 6,
      team: [{ id: 25, level: 28 }, { id: 100, level: 29 }, { id: 81, level: 30 }, { id: 309, level: 30 }],
      badgeText: "The Neon Badge restores power to the west road scanners."
    },
    "gym-thornmere": {
      name: "Leader Mallow",
      reward: 2140,
      intro: "Leader Mallow vanishes into purple mist, then laughs from the arena center.",
      badge: "Venom Badge",
      gymRank: 7,
      team: [{ id: 23, level: 32 }, { id: 109, level: 33 }, { id: 88, level: 34 }, { id: 42, level: 35 }],
      badgeText: "The Venom Badge breaks the last roadblock before Astral City."
    },
    "gym-astral": {
      name: "Leader Sol",
      reward: 2600,
      intro: "Leader Sol reads the stars, then throws first.",
      badge: "Astral Badge",
      gymRank: 8,
      team: [{ id: 63, level: 36 }, { id: 96, level: 37 }, { id: 102, level: 38 }, { id: 282, level: 39 }],
      badgeText: "The Astral Badge completes the circuit. Crown City and Team Umbra's finale are waiting."
    },
    rival: {
      name: "Rival Jules",
      reward: 180,
      intro: "Rival Jules grins and tosses a polished ball.",
      dynamic: "rival",
      rank: 2
    },
    leader: {
      name: "Leader Sylva",
      reward: 680,
      intro: "Leader Sylva accepts the challenge.",
      badge: "Briar Badge",
      dynamic: "leader"
    }
  };

  function createRegionBuildings() {
    const buildings = [];
    const add = (building) => {
      buildings.push({
        body: "#fff8e8",
        roof: "#6f8491",
        doorX: building.x + Math.floor(building.w / 2),
        ...building
      });
    };

    CITY_DEFS.forEach((city) => {
      add({
        id: `clinic-${city.id}`,
        kind: "clinic",
        cityId: city.id,
        name: "Clinic",
        label: "CLINIC",
        x: city.x + 1,
        y: city.y + 1,
        w: 4,
        h: 3,
        roof: "#ef704b",
        body: "#fff8e8"
      });
      add({
        id: `market-${city.id}`,
        kind: "market",
        cityId: city.id,
        name: "Market",
        label: "MART",
        x: city.x + 1,
        y: city.y + city.h - 4,
        w: 4,
        h: 3,
        roof: "#f1c84b",
        body: "#fff7df"
      });
      add({
        id: `house-${city.id}`,
        kind: "house",
        cityId: city.id,
        name: "House",
        label: "HOME",
        x: city.x + city.w - 5,
        y: city.y + city.h - 4,
        w: 4,
        h: 3,
        roof: "#8c6c54",
        body: "#f9f0d8"
      });

      if (city.role === "home") {
        add({
          id: "lab-lumen",
          kind: "lab",
          cityId: city.id,
          name: "Maple Lab",
          label: "LAB",
          x: city.x + 8,
          y: city.y + 1,
          w: 5,
          h: 4,
          roof: "#5bb9d6",
          body: "#f9f4df"
        });
      }

      if (city.role === "league") {
        add({
          id: "umbra-crown",
          kind: "umbra",
          cityId: city.id,
          name: "Crown Station",
          label: "STATION",
          x: city.x + 6,
          y: city.y + 1,
          w: 7,
          h: 5,
          roof: "#443f58",
          body: "#ece7f4",
          trainerId: "umbra-boss"
        });
        add({
          id: "league-crown",
          kind: "league",
          cityId: city.id,
          name: "League Desk",
          label: "LEAGUE",
          x: city.x + 13,
          y: city.y + 7,
          w: 4,
          h: 4,
          roof: "#7567d9",
          body: "#f3f1fb"
        });
      }

      const gym = GYM_DEFS.find((entry) => entry.cityId === city.id);
      if (gym) {
        add({
          id: gym.trainerId,
          kind: "gym",
          cityId: city.id,
          name: `${gym.type} Gym`,
          label: "GYM",
          x: city.x + city.w - 6,
          y: city.y + 1,
          w: 5,
          h: 4,
          roof: gym.roof,
          body: "#f7f0e8",
          trainerId: gym.trainerId,
          badge: gym.badge
        });
      }
    });

    return buildings;
  }

  function createRegionNpcs() {
    const npcs = [
      { id: "nurse-lumen", name: "Nurse Luma", x: 9, y: 10, color: "#ef704b", action: "heal", sprite: "nurse" },
      { id: "professor", name: "Professor Maple", x: 15, y: 11, color: "#5bb9d6", action: "gift", sprite: "professor" },
      { id: "scout", name: "Scout Ren", x: 22, y: 10, color: "#7fbf5f", action: "trainer", trainerId: "scout", sprite: "scout" },
      { id: "rival-lumen", name: "Rival Jules", x: 20, y: 10, color: "#f1c84b", action: "trainer", trainerId: "rival-lumen", sprite: "rival" },
      { id: "rival-quarry", name: "Rival Jules", x: 53, y: 15, color: "#f1c84b", action: "trainer", trainerId: "rival-quarry", sprite: "rival" },
      { id: "rival-astral", name: "Rival Jules", x: 39, y: 32, color: "#f1c84b", action: "trainer", trainerId: "rival-astral", sprite: "rival" },
      { id: "rival-crown", name: "Rival Jules", x: 66, y: 62, color: "#f1c84b", action: "trainer", trainerId: "rival-crown", sprite: "rival" },
      { id: "umbra-bracken", name: "Umbra Grunt Pax", x: 45, y: 10, color: "#443f58", action: "trainer", trainerId: "umbra-bracken", sprite: "umbra" },
      { id: "umbra-quarry", name: "Umbra Grunt Voss", x: 70, y: 12, color: "#443f58", action: "trainer", trainerId: "umbra-quarry", sprite: "umbra" },
      { id: "umbra-admin", name: "Admin Nyx", x: 56, y: 33, color: "#594678", action: "trainer", trainerId: "umbra-admin", sprite: "umbraAdmin" },
      { id: "umbra-boss", name: "Director Vey", x: 76, y: 62, color: "#272236", action: "trainer", trainerId: "umbra-boss", sprite: "umbraBoss" },
      { id: "captain", name: "Captain Mira", x: 83, y: 24, color: "#3398c8", action: "talk", sprite: "captain", text: "Umbra boats keep cutting their lights near Saltwind Coast. Win badges, then make them answer for it." },
      { id: "mechanic", name: "Mechanic Ivo", x: 30, y: 56, color: "#d5b125", action: "talk", sprite: "worker", text: "Neon Heights runs on gym power. Every badge you earn brings another district back online." },
      { id: "archivist", name: "Archivist Rue", x: 47, y: 34, color: "#dc5c94", action: "talk", sprite: "scholar", text: "The Astral charts mention a Crown antenna. Team Umbra did not pick that target at random." },
      { id: "elder", name: "Elder Pavo", x: 12, y: 44, color: "#8e55b7", action: "talk", sprite: "elder", text: "Thornmere's old roads hide rare partners after dusk. The brave come back with stories." }
    ];

    GYM_DEFS.forEach((gym) => {
      const building = BUILDINGS.find((entry) => entry.trainerId === gym.trainerId);
      if (!building) return;
      npcs.push({
        id: `${gym.trainerId}-leader`,
        name: gym.leader,
        x: building.doorX,
        y: building.y + building.h,
        color: gym.roof,
        action: "trainer",
        trainerId: gym.trainerId,
        sprite: "leader"
      });
    });

    CITY_DEFS.forEach((city, index) => {
      npcs.push({
        id: `guide-${city.id}`,
        name: `${city.name.split(" ")[0]} Guide`,
        x: city.x + Math.floor(city.w / 2),
        y: city.y + city.h - 2,
        color: index % 2 ? "#5bb9d6" : "#7fbf5f",
        action: "talk",
        sprite: "guide",
        text: `${city.name} is stop ${index + 1} on the Grand Circuit. Roads loop wide, so check your map name in the top bar.`
      });
    });

    return npcs;
  }

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
      cardText: "A grand circuit with ten cities, eight gyms, Team Umbra, and classic partners.",
      cardTags: ["grand", "fire", "circuit"],
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
        town: "Lumen Village",
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
      badgeText: "The next city on the Grand Circuit is open, and Team Umbra's signal gets easier to trace."
    },
    sapphire: {
      id: "sapphire",
      name: "PokeG Sapphire Tide",
      shortName: "Sapphire Tide",
      cardTitle: "Sapphire Tide",
      cardText: "A coastal grand circuit with ten cities, eight gyms, Team Umbra, and Gen III partners.",
      cardTags: ["coastal", "water", "circuit"],
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
        town: "Lumen Village",
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
      badgeText: "The next city on the Grand Circuit is open, and rare coastal encounters begin pulsing on your dex."
    }
  };

  const keysDown = new Set();
  let activeTab = "party";
  let state = freshState();
  let camera = { x: 0, y: 0 };
  let playerMotion = null;
  let trainerApproach = null;
  let currentInterior = null;
  let introStep = 0;
  let battleFxTimer = 0;
  const footstepEffects = [];
  let lastMoveAt = 0;
  let toastTimer = 0;
  let audioContext = null;

  function freshState(editionId = null) {
    const selectedEdition = editionId && EDITIONS[editionId] ? editionId : null;
    return {
      version: 3,
      edition: selectedEdition,
      trainer: { name: "Rookie" },
      player: { x: 12, y: 12, dir: "down", steps: 0 },
      party: [],
      pc: [],
      activeIndex: 0,
      bag: { balls: selectedEdition === "sapphire" ? 10 : 8, potions: 4, berries: selectedEdition === "sapphire" ? 3 : 2 },
      money: selectedEdition === "sapphire" ? 320 : 300,
      badges: [],
      dexSeen: [],
      dexCaught: [],
      flags: { mapleGift: false, trainers: {}, story: {} },
      log: [],
      battle: null,
      dialog: null,
      menuOpen: false,
      audioMuted: false
    };
  }

  function normalizeState(save) {
    const selectedEdition = save.edition && EDITIONS[save.edition] ? save.edition : "ember";
    const base = freshState(selectedEdition);
    const merged = { ...base, ...save };
    merged.version = 3;
    merged.edition = selectedEdition;
    merged.trainer = { ...base.trainer, ...(save.trainer || {}) };
    merged.player = { ...base.player, ...(save.player || {}) };
    merged.bag = { ...base.bag, ...(save.bag || {}) };
    merged.flags = { ...base.flags, ...(save.flags || {}) };
    merged.flags.trainers = { ...(save.flags && save.flags.trainers ? save.flags.trainers : {}) };
    merged.flags.story = { ...(save.flags && save.flags.story ? save.flags.story : {}) };
    merged.party = Array.isArray(save.party) ? save.party.map(revivePokemon).filter(Boolean) : [];
    merged.pc = Array.isArray(save.pc) ? save.pc.map(revivePokemon).filter(Boolean) : [];
    merged.dexSeen = uniqueNumbers(save.dexSeen || []);
    merged.dexCaught = uniqueNumbers(save.dexCaught || []);
    merged.badges = Array.isArray(save.badges) ? save.badges : [];
    merged.log = Array.isArray(save.log) ? save.log.slice(0, 40) : [];
    merged.battle = null;
    merged.dialog = null;
    merged.menuOpen = false;
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
      ensurePlayerInUnlockedArea();
      applyEditionTheme();
      els.editionModal.hidden = true;
      els.introModal.hidden = true;
      els.starterModal.hidden = true;
      els.mapModal.hidden = true;
      els.interiorModal.hidden = true;
      showToast("Save loaded.");
    } else {
      applyEditionTheme("ember");
      els.editionModal.hidden = false;
      els.introModal.hidden = true;
      els.starterModal.hidden = true;
      els.mapModal.hidden = true;
      els.interiorModal.hidden = true;
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

  function ensurePlayerInUnlockedArea() {
    const lock = lockedCityAt(state.player.x, state.player.y);
    if (!lock) return;
    state.player.x = 12;
    state.player.y = 12;
    state.player.dir = "down";
    pushLog(`Returned to Lumen Village while ${lock.city.name} is gated.`);
  }

  function saveGame(manual = false) {
    const snapshot = {
      ...state,
      battle: null,
      dialog: null,
      menuOpen: false,
      party: state.party.map(cleanPokemonForSave),
      pc: state.pc.map(cleanPokemonForSave)
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
    if (manual) {
      pushLog("Game saved.");
      showDialog("Save", "Game saved.");
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
    document.title = `${edition.name} - Grand Circuit`;
  }

  function editionTrainer(trainerId) {
    const edition = getEdition();
    const trainer = edition.trainers[trainerId] || TRAINERS[trainerId];
    if (!trainer) return null;
    if (trainer.name === "Rival Jules") return { ...trainer, name: edition.npcs.rival.name };
    return trainer;
  }

  function editionNpcs() {
    const edition = getEdition();
    return NPCS.map((npc) => {
      const themed = { ...npc, ...(edition.npcs[npc.id] || {}) };
      if (npc.id === "professor") themed.name = edition.professor;
      if (npc.id.startsWith("rival-")) themed.name = edition.npcs.rival.name;
      return themed;
    });
  }

  function worldPalette() {
    return getEdition().world;
  }

  function cityById(id) {
    return CITY_DEFS.find((city) => city.id === id);
  }

  function cityName(id) {
    const city = cityById(id);
    return city ? city.name : "the circuit";
  }

  function nextGymChallenge() {
    return GYM_DEFS.find((gym) => !state.badges.includes(gym.badge));
  }

  function cleanPokemonForSave(pokemon) {
    const { stages, ...rest } = pokemon;
    return rest;
  }

  function renderAll() {
    renderTopline();
    renderSidePanels();
    renderQuest();
    renderDialog();
    renderPauseMenu();
    if (state.battle) renderBattle();
  }

  function renderTopline() {
    const edition = getEdition();
    els.gameTitle.textContent = state.edition ? edition.name : "PokeG v3";
    els.trainerName.textContent = state.trainer.name;
    els.routeName.textContent = state.edition ? currentRouteName() : "Choose your edition";
    els.badgeCount.textContent = `${state.badges.length}/${GYM_DEFS.length}`;
    els.moneyCount.textContent = `$${state.money}`;
    els.seenCount.textContent = state.dexSeen.length;
    els.editionName.textContent = state.edition ? edition.shortName : "v3";
  }

  function renderQuest() {
    const edition = getEdition();
    let text = state.edition ? "Choose a starter" : "Choose a version";
    if (state.party.length) text = `Talk with ${edition.professor} in Lumen Village`;
    if (state.flags.mapleGift) text = "Battle Jules on Sunpetal Route";
    if (state.flags.trainers["rival-lumen"]) {
      const gym = nextGymChallenge();
      text = gym ? `Earn the ${gym.badge} in ${cityName(gym.cityId)}` : "Investigate Crown Station";
    }
    if (state.badges.length >= 1 && !state.flags.trainers["umbra-bracken"]) text = "Stop Team Umbra near Bracken City";
    if (state.badges.length >= 5 && !state.flags.trainers["umbra-admin"]) text = "Follow Team Umbra to Astral City";
    if (state.badges.length >= 8 && !state.flags.trainers["umbra-boss"]) text = "Shut down Team Umbra in Crown City";
    if (state.flags.trainers["umbra-boss"] && !state.flags.trainers["rival-crown"]) text = "Meet Jules at Crown Gate";
    if (state.flags.trainers["rival-crown"]) text = "The Crown League desk is open";
    els.questText.textContent = text;
  }

  function renderSidePanels() {
    renderParty();
    renderBag();
    renderMapPanel();
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

  function renderMapPanel() {
    els.mapPanel.innerHTML = `
      <div class="map-panel-head">
        <strong>${currentRouteName()}</strong>
        <button type="button" class="party-action" data-open-map>Open</button>
      </div>
      ${regionMapHtml(true)}
    `;
  }

  function regionMapHtml(compact = false) {
    const current = cityAt(state.player.x, state.player.y);
    const roads = ROAD_SEGMENTS.map((segment) => {
      const x1 = (segment.x1 / WORLD.width) * 100;
      const y1 = (segment.y1 / WORLD.height) * 100;
      const x2 = (segment.x2 / WORLD.width) * 100;
      const y2 = (segment.y2 / WORLD.height) * 100;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
    }).join("");
    const cities = CITY_DEFS.map((city) => {
      const gym = GYM_DEFS.find((entry) => entry.cityId === city.id);
      const done = gym ? state.badges.includes(gym.badge) : city.role === "home" || city.role === "league";
      const active = current && current.id === city.id;
      const locked = isCityLocked(city.id);
      const left = ((city.x + city.w / 2) / WORLD.width) * 100;
      const top = ((city.y + city.h / 2) / WORLD.height) * 100;
      return `
        <span class="map-city ${done ? "is-done" : ""} ${active ? "is-current" : ""} ${locked ? "is-locked" : ""}" style="left:${left}%;top:${top}%">
          <i>${gym ? gym.rank : city.role === "league" ? "L" : "H"}</i>
          <b>${compact ? city.name.split(" ")[0] : city.name}</b>
        </span>
      `;
    }).join("");
    const gates = GATE_DEFS.map((gate) => {
      const open = isGateOpen(gate);
      const left = ((gate.x + gate.w / 2) / WORLD.width) * 100;
      const top = ((gate.y + gate.h / 2) / WORLD.height) * 100;
      return `<span class="map-gate ${open ? "is-open" : ""}" style="left:${left}%;top:${top}%" title="${escapeHtml(gate.title)}"></span>`;
    }).join("");
    const playerLeft = ((state.player.x + 0.5) / WORLD.width) * 100;
    const playerTop = ((state.player.y + 0.5) / WORLD.height) * 100;
    return `
      <div class="region-map ${compact ? "is-compact" : ""}">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${roads}</svg>
        ${cities}
        ${gates}
        <span class="map-player" style="left:${playerLeft}%;top:${playerTop}%"></span>
      </div>
    `;
  }

  function showRegionMap() {
    if (!state.party.length) {
      showToast("Choose a partner first.");
      return;
    }
    els.regionMapModal.innerHTML = regionMapHtml(false);
    els.mapModal.hidden = false;
    tone(494, 0.06, "triangle");
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
    const objectives = activeObjectives().map((entry) => `
      <div class="objective-row ${entry.done ? "is-done" : ""}">
        <strong>${entry.title}</strong>
        <span>${entry.text}</span>
      </div>
    `).join("");
    const gymRows = GYM_DEFS.map((gym) => {
      const done = state.badges.includes(gym.badge);
      return `<span class="${done ? "is-done" : ""}">${gym.rank}. ${gym.badge}</span>`;
    }).join("");
    const umbraRows = [
      ["Bracken crate", "umbra-bracken"],
      ["Quarry cable", "umbra-quarry"],
      ["Astral chart", "umbra-admin"],
      ["Crown antenna", "umbra-boss"]
    ].map(([label, key]) => `<span class="${state.flags.trainers[key] ? "is-done" : ""}">${label}</span>`).join("");
    els.logPanel.innerHTML = `
      <div class="objective-list">
        ${objectives}
      </div>
      <div class="story-board">
        <strong>Gym Circuit</strong>
        <div>${gymRows}</div>
        <strong>Team Umbra</strong>
        <div>${umbraRows}</div>
      </div>
      <div class="event-log">
        ${state.log.length ? state.log.slice(0, 24).map((entry) => `<div class="log-row"><span>${escapeHtml(entry)}</span></div>`).join("") : `<div class="empty-state">No field notes yet.</div>`}
      </div>
    `;
  }

  function activeObjectives() {
    const nextGym = nextGymChallenge();
    return [
      {
        title: state.flags.mapleGift ? "Field Kit Secured" : "Visit The Professor",
        text: state.flags.mapleGift ? "Professor supplies are packed for the road." : `Talk to ${getEdition().professor} in Lumen Village.`,
        done: !!state.flags.mapleGift
      },
      {
        title: nextGym ? `Next Gym: ${nextGym.badge}` : "Gym Circuit Complete",
        text: nextGym ? `Challenge ${nextGym.leader} in ${cityName(nextGym.cityId)}.` : "All eight badges are registered.",
        done: !nextGym
      },
      {
        title: state.flags.trainers["umbra-boss"] ? "Team Umbra Defeated" : "Team Umbra Investigation",
        text: nextUmbraObjective(),
        done: !!state.flags.trainers["umbra-boss"]
      },
      {
        title: state.flags.trainers["rival-crown"] ? "Rival Gate Battle Won" : "Rival Arc",
        text: nextRivalObjective(),
        done: !!state.flags.trainers["rival-crown"]
      }
    ];
  }

  function nextUmbraObjective() {
    if (!state.flags.trainers["umbra-bracken"]) return "Stop the black-crate roadblock east of Bracken after the first badge.";
    if (!state.flags.trainers["umbra-quarry"]) return "Clear Umbra's cable theft near Quarry Town.";
    if (!state.flags.trainers["umbra-admin"]) return "Follow Admin Nyx to Astral City's observatory road.";
    if (!state.flags.trainers["umbra-boss"]) return "Confront Director Vey at Crown Station after eight badges.";
    return "Crown Station lights are restored.";
  }

  function nextRivalObjective() {
    if (!state.flags.trainers["rival-lumen"]) return "Battle Jules on Sunpetal Route.";
    if (!state.flags.trainers["rival-quarry"]) return "Meet Jules by Quarry Town after two badges.";
    if (!state.flags.trainers["rival-astral"]) return "Meet Jules under Astral City's observatory lights.";
    if (!state.flags.trainers["rival-crown"]) return "Find Jules at Crown Gate after the Umbra finale.";
    return "Jules is ready for the league chapter.";
  }

  function renderDialog() {
    const dialog = state.dialog;
    els.dialogBox.hidden = !dialog;
    if (!dialog) return;
    els.dialogSpeaker.textContent = dialog.speaker || "";
    els.dialogText.textContent = dialog.text || "";
  }

  function showDialog(speaker, text) {
    state.menuOpen = false;
    state.dialog = { speaker, text };
    renderDialog();
    renderPauseMenu();
    tone(440, 0.035, "square");
  }

  function closeDialog() {
    if (!state.dialog) return false;
    state.dialog = null;
    renderDialog();
    return true;
  }

  function renderPauseMenu() {
    els.pauseMenu.hidden = !state.menuOpen;
    if (!state.menuOpen) return;
    els.pauseMenu.querySelectorAll("[data-menu-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.menuTab === activeTab);
    });
  }

  function toggleMenu(force = null) {
    if (!state.party.length || state.battle || !els.editionModal.hidden || !els.introModal.hidden || !els.starterModal.hidden || !els.finishModal.hidden || !els.mapModal.hidden || !els.interiorModal.hidden || state.dialog) return;
    state.menuOpen = force === null ? !state.menuOpen : Boolean(force);
    renderPauseMenu();
    tone(state.menuOpen ? 523 : 392, 0.045, "triangle");
  }

  function renderEditions() {
    els.editionGrid.innerHTML = Object.values(EDITIONS).map((edition) => `
      <button class="edition-card" type="button" data-edition="${edition.id}">
        <div class="version-scene" aria-hidden="true">
          <span class="scene-token">${edition.id === "ember" ? "ER" : "ST"}</span>
          <span class="scene-token">10</span>
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
    els.introModal.hidden = false;
    els.starterModal.hidden = true;
    introStep = 0;
    renderIntro();
    showToast(`${getEdition().shortName} selected.`);
    renderAll();
    tone(392, 0.07, "triangle");
    tone(659, 0.09, "triangle", 0.07);
  }

  function renderIntro() {
    const step = INTRO_STEPS[introStep] || INTRO_STEPS[0];
    els.introKicker.textContent = step.kicker === "Professor" ? getEdition().professor : step.kicker;
    els.introTitle.textContent = step.title;
    els.introText.textContent = step.text;
    els.introScene.dataset.scene = step.scene;
    els.introNextButton.textContent = introStep >= INTRO_STEPS.length - 1 ? "Choose partner" : "Next";
  }

  function advanceIntro(skip = false) {
    if (skip || introStep >= INTRO_STEPS.length - 1) {
      els.introModal.hidden = true;
      els.starterModal.hidden = false;
      tone(523, 0.07, "triangle");
      renderAll();
      return;
    }
    introStep += 1;
    renderIntro();
    tone(440 + introStep * 80, 0.045, "triangle");
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
    els.introModal.hidden = true;
    els.starterModal.hidden = true;
    showToast(`${starter.name} joined your party.`);
    saveGame(false);
    renderAll();
    tone(523, 0.08, "triangle");
    tone(784, 0.12, "triangle", 0.07);
  }

  function drawWorld(time = 0) {
    settlePlayerMotion(time);
    updateCamera(time);
    ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
    ctx.fillStyle = "#111814";
    ctx.fillRect(0, 0, els.canvas.width, els.canvas.height);
    const startX = Math.max(0, Math.floor(camera.x / WORLD.tile) - 1);
    const endX = Math.min(WORLD.width - 1, Math.ceil((camera.x + els.canvas.width) / WORLD.tile) + 1);
    const startY = Math.max(0, Math.floor(camera.y / WORLD.tile) - 1);
    const endY = Math.min(WORLD.height - 1, Math.ceil((camera.y + els.canvas.height) / WORLD.tile) + 1);
    for (let y = startY; y <= endY; y += 1) {
      for (let x = startX; x <= endX; x += 1) {
        drawTile(x, y, tileAt(x, y), time);
      }
    }
    drawRegionDetails(time);
    drawLandmarks(time);
    drawGates(time);
    drawFootstepEffects(time);
    drawBuildings();
    const actors = [
      ...editionNpcs().map((npc) => ({ kind: "npc", y: npc.y, actor: npc })),
      { kind: "player", y: playerDisplayPosition(time).y, actor: state.player }
    ].sort((a, b) => a.y - b.y);
    actors.forEach((entry) => {
      if (entry.kind === "npc") drawNpc(entry.actor, time);
      else drawPlayer(entry.actor, time);
    });
    requestAnimationFrame(drawWorld);
  }

  function updateCamera(time = performance.now()) {
    const player = playerDisplayPosition(time);
    const targetX = player.x * WORLD.tile + WORLD.tile / 2 - els.canvas.width / 2;
    const targetY = player.y * WORLD.tile + WORLD.tile / 2 - els.canvas.height / 2;
    camera.x = clamp(targetX, 0, Math.max(0, WORLD.width * WORLD.tile - els.canvas.width));
    camera.y = clamp(targetY, 0, Math.max(0, WORLD.height * WORLD.tile - els.canvas.height));
  }

  function settlePlayerMotion(time) {
    if (!playerMotion || time - playerMotion.started < playerMotion.duration) return;
    playerMotion = null;
    if (checkTrainerVision(time)) return;
    maybeWildEncounter();
  }

  function playerDisplayPosition(time = performance.now()) {
    if (!playerMotion) return { x: state.player.x, y: state.player.y };
    const t = clamp((time - playerMotion.started) / playerMotion.duration, 0, 1);
    const eased = t * t * (3 - 2 * t);
    return {
      x: playerMotion.fromX + (playerMotion.toX - playerMotion.fromX) * eased,
      y: playerMotion.fromY + (playerMotion.toY - playerMotion.fromY) * eased
    };
  }

  function drawTile(x, y, tile, time) {
    const px = x * WORLD.tile - camera.x;
    const py = y * WORLD.tile - camera.y;
    const h = hash(x, y);
    const palette = worldPalette();
    const baseTile = tile === "building" ? "meadow" : tile;
    const colors = {
      meadow: h % 3 === 0 ? palette.meadow[0] : palette.meadow[1],
      tallgrass: h % 2 === 0 ? palette.tallgrass[0] : palette.tallgrass[1],
      path: h % 2 === 0 ? palette.path[0] : palette.path[1],
      city: cityAt(x, y) ? cityAt(x, y).color : "#d8c99d",
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

    if (baseTile === "city") {
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(px + 2, py + 2, 28, 1);
      ctx.fillRect(px + 2, py + 16, 28, 1);
      ctx.fillStyle = "rgba(23,33,29,0.08)";
      ctx.fillRect(px + 15, py, 1, 32);
      ctx.fillRect(px, py + 15, 32, 1);
      if (h % 9 === 0) {
        ctx.fillStyle = "rgba(255,253,246,0.58)";
        ctx.fillRect(px + 7, py + 7, 4, 4);
      }
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

  function drawRegionDetails(time) {
    CITY_DEFS.forEach((city) => {
      const x = city.x * WORLD.tile - camera.x;
      const y = city.y * WORLD.tile - camera.y;
      const w = city.w * WORLD.tile;
      const h = city.h * WORLD.tile;
      if (x > els.canvas.width || y > els.canvas.height || x + w < 0 || y + h < 0) return;

      ctx.fillStyle = "rgba(23,33,29,0.12)";
      ctx.fillRect(x, y, w, 4);
      ctx.fillRect(x, y + h - 4, w, 4);
      ctx.fillRect(x, y, 4, h);
      ctx.fillRect(x + w - 4, y, 4, h);

      const signX = x + w / 2 - 74;
      const signY = y + h - 26;
      ctx.fillStyle = "rgba(23,33,29,0.72)";
      ctx.fillRect(signX, signY, 148, 18);
      ctx.fillStyle = "#fffdf6";
      ctx.font = "900 10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(city.name.toUpperCase(), x + w / 2, signY + 13);

      const lampPulse = 0.5 + Math.sin(time / 480 + city.x) * 0.18;
      ctx.fillStyle = `rgba(255,235,150,${lampPulse})`;
      [[city.x + 2, city.y + city.h - 2], [city.x + city.w - 3, city.y + 2]].forEach(([lx, ly]) => {
        const px = lx * WORLD.tile - camera.x;
        const py = ly * WORLD.tile - camera.y;
        ctx.fillRect(px + 14, py + 6, 4, 12);
        ctx.fillRect(px + 10, py + 4, 12, 5);
      });
    });

    WILD_ZONES.forEach((zone) => {
      const x = zone.x * WORLD.tile - camera.x;
      const y = zone.y * WORLD.tile - camera.y;
      const w = zone.w * WORLD.tile;
      const h = zone.h * WORLD.tile;
      if (x > els.canvas.width || y > els.canvas.height || x + w < 0 || y + h < 0) return;

      ctx.fillStyle = "rgba(23,33,29,0.45)";
      ctx.fillRect(x + 6, y + 6, 4, 22);
      ctx.fillRect(x + 14, y + 10, 70, 16);
      ctx.fillStyle = "#fffdf6";
      ctx.font = "800 9px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(zone.name.toUpperCase(), x + 18, y + 22);
    });
  }

  function drawLandmarks(time) {
    LANDMARKS.forEach((landmark) => {
      const px = landmark.x * WORLD.tile - camera.x;
      const py = landmark.y * WORLD.tile - camera.y;
      if (px < -80 || py < -80 || px > els.canvas.width + 80 || py > els.canvas.height + 80) return;
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.beginPath();
      ctx.ellipse(px + 16, py + 28, 17, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = landmark.color;
      ctx.strokeStyle = "#18231f";
      ctx.lineWidth = 3;

      if (landmark.kind === "lighthouse") {
        ctx.fillRect(px + 10, py + 4, 12, 25);
        ctx.strokeRect(px + 10, py + 4, 12, 25);
        ctx.fillStyle = `rgba(255,245,170,${0.55 + Math.sin(time / 350) * 0.22})`;
        ctx.fillRect(px + 6, py + 2, 20, 6);
      } else if (landmark.kind === "antenna" || landmark.kind === "power-tower") {
        ctx.beginPath();
        ctx.moveTo(px + 16, py + 3);
        ctx.lineTo(px + 7, py + 29);
        ctx.lineTo(px + 25, py + 29);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = `rgba(241,200,75,${0.45 + Math.sin(time / 180) * 0.25})`;
        ctx.fillRect(px + 13, py, 6, 6);
      } else if (landmark.kind === "observatory") {
        ctx.beginPath();
        ctx.arc(px + 16, py + 16, 13, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillRect(px + 7, py + 16, 18, 12);
      } else if (landmark.kind === "mist-well") {
        ctx.beginPath();
        ctx.arc(px + 16, py + 20, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${0.25 + Math.sin(time / 300) * 0.12})`;
        ctx.fillRect(px + 4, py + 8, 24, 5);
      } else if (landmark.kind === "crane") {
        ctx.fillRect(px + 7, py + 5, 5, 25);
        ctx.fillRect(px + 9, py + 5, 22, 5);
        ctx.strokeRect(px + 7, py + 5, 5, 25);
        ctx.strokeRect(px + 9, py + 5, 22, 5);
      } else {
        ctx.fillRect(px + 7, py + 13, 18, 16);
        ctx.strokeRect(px + 7, py + 13, 18, 16);
        ctx.beginPath();
        ctx.arc(px + 16, py + 11, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });
  }

  function drawGates(time) {
    GATE_DEFS.forEach((gate) => {
      const open = isGateOpen(gate);
      const x = gate.x * WORLD.tile - camera.x;
      const y = gate.y * WORLD.tile - camera.y;
      const w = gate.w * WORLD.tile;
      const h = gate.h * WORLD.tile;
      if (x > els.canvas.width || y > els.canvas.height || x + w < 0 || y + h < 0) return;
      ctx.fillStyle = open ? "rgba(63, 141, 83, 0.28)" : "rgba(207, 77, 77, 0.54)";
      ctx.fillRect(x + 4, y + 6, w - 8, h - 12);
      ctx.strokeStyle = "#18231f";
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 4, y + 6, w - 8, h - 12);
      ctx.fillStyle = open ? "#fffdf6" : "#18231f";
      ctx.font = "900 10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(open ? "OPEN" : "GATE", x + w / 2, y + h / 2 + 4 + Math.sin(time / 300));
    });
  }

  function drawFootstepEffects(time) {
    for (let i = footstepEffects.length - 1; i >= 0; i -= 1) {
      const effect = footstepEffects[i];
      const age = time - effect.time;
      if (age > 420) {
        footstepEffects.splice(i, 1);
        continue;
      }
      const t = age / 420;
      const px = effect.x * WORLD.tile - camera.x;
      const py = effect.y * WORLD.tile - camera.y;
      ctx.fillStyle = `rgba(255,253,246,${0.34 * (1 - t)})`;
      ctx.beginPath();
      ctx.arc(px + 16, py + 27 - t * 8, 4 + t * 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawBuildings() {
    const edition = getEdition();
    BUILDINGS.forEach((building) => {
      const x = building.x * WORLD.tile - camera.x;
      const y = building.y * WORLD.tile - camera.y;
      const w = building.w * WORLD.tile;
      const h = building.h * WORLD.tile;
      if (x > els.canvas.width + 40 || y > els.canvas.height + 40 || x + w < -40 || y + h < -40) return;
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(x + 5, y + h - 4, w, 8);
      ctx.fillStyle = building.body;
      ctx.fillRect(x + 8, y + 24, w - 16, h - 24);
      ctx.fillStyle = edition.buildingRoofs[building.kind] || building.roof;
      ctx.fillRect(x, y + 8, w, 34);
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(x, y + 38, w, 5);
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(x + 10, y + 14, w - 20, 5);
      ctx.fillStyle = "#513b2d";
      ctx.fillRect(building.doorX * WORLD.tile - camera.x + 6, y + h - 34, 20, 34);
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(building.doorX * WORLD.tile - camera.x + 22, y + h - 18, 2, 3);
      ctx.fillStyle = "#ffe9a7";
      ctx.fillRect(x + 18, y + 50, 18, 14);
      ctx.fillRect(x + w - 36, y + 50, 18, 14);
      ctx.fillStyle = "#fffdf6";
      ctx.font = "900 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText((building.label || building.name).toUpperCase(), x + w / 2, y + 29);
    });
  }

  function drawNpc(npc, time) {
    const pos = npcDisplayPosition(npc, time);
    const px = pos.x * WORLD.tile - camera.x;
    const py = pos.y * WORLD.tile - camera.y;
    drawTrainerSprite(px, py, trainerSpriteProfile(npc), "down", time, false);
    if (npc.action === "trainer" && !state.flags.trainers[npc.trainerId]) {
      drawAlertBubble(px, py, time, npc.trainerId && npc.trainerId.startsWith("umbra") ? "!" : "*");
    }
  }

  function npcDisplayPosition(npc, time) {
    if (!trainerApproach || trainerApproach.npcId !== npc.id) return { x: npc.x, y: npc.y };
    const t = clamp((time - trainerApproach.started) / trainerApproach.duration, 0, 1);
    const eased = t * t * (3 - 2 * t);
    return {
      x: trainerApproach.fromX + (trainerApproach.toX - trainerApproach.fromX) * eased,
      y: trainerApproach.fromY + (trainerApproach.toY - trainerApproach.fromY) * eased
    };
  }

  function drawPlayer(player, time) {
    const pos = playerDisplayPosition(time);
    const px = pos.x * WORLD.tile - camera.x;
    const py = pos.y * WORLD.tile - camera.y;
    drawTrainerSprite(px, py, trainerSpriteProfile({ sprite: "player", color: "#ef704b" }), player.dir, time, !!playerMotion);
  }

  function trainerSpriteProfile(actor) {
    const base = {
      outline: "#18231f",
      skin: "#f0bd8e",
      hair: "#2a211d",
      hat: "",
      jacket: actor.color || "#ef704b",
      shirt: "#fffdf6",
      pants: "#263f63",
      shoes: "#1f2428",
      accent: "#f1c84b"
    };
    const profiles = {
      player: { hat: "#ef704b", jacket: "#e85d4c", pants: "#203b62", accent: "#fffdf6" },
      nurse: { hair: "#7b3141", hat: "#fff2f5", jacket: "#ef704b", pants: "#7d4251", accent: "#fffdf6" },
      professor: { hair: "#6d6f73", jacket: "#ffffff", shirt: "#5bb9d6", pants: "#4b5362", accent: "#5bb9d6" },
      scout: { hat: "#7fbf5f", jacket: "#4f9c55", pants: "#66513a", accent: "#fff0a8" },
      rival: { hair: "#4a3327", hat: "#f1c84b", jacket: "#f1c84b", pants: "#2d405f", accent: "#ef704b" },
      leader: { hair: "#272236", jacket: actor.color || "#7567d9", pants: "#222a35", accent: "#fffdf6" },
      umbra: { skin: "#d6a886", hair: "#15151b", hat: "#272236", jacket: "#443f58", pants: "#171722", accent: "#d84d74" },
      umbraAdmin: { skin: "#d6a886", hair: "#1b1223", hat: "#594678", jacket: "#594678", pants: "#171722", accent: "#f1c84b" },
      umbraBoss: { skin: "#d6a886", hair: "#101017", hat: "#272236", jacket: "#272236", pants: "#101017", accent: "#dc5c94" },
      captain: { hat: "#3398c8", jacket: "#2d799f", pants: "#263f63", accent: "#fffdf6" },
      worker: { hat: "#d5b125", jacket: "#6f8491", pants: "#3d3a32", accent: "#d5b125" },
      scholar: { hair: "#594678", jacket: "#d4c5df", pants: "#443f58", accent: "#dc5c94" },
      elder: { hair: "#d7d7d7", jacket: "#8e55b7", pants: "#4d3e56", accent: "#fffdf6" },
      guide: { hat: actor.color || "#7fbf5f", jacket: actor.color || "#7fbf5f", pants: "#3f5068", accent: "#fffdf6" }
    };
    return { ...base, ...(profiles[actor.sprite] || {}) };
  }

  function drawTrainerSprite(px, py, profile, dir, time, moving) {
    const x = Math.round(px);
    const y = Math.round(py);
    const bob = Math.round((moving ? Math.sin(time / 62) * 2 : Math.sin(time / 420) * 1));
    const leg = moving ? Math.round(Math.sin(time / 62) * 2) : 0;
    const side = dir === "left" ? -1 : dir === "right" ? 1 : 0;
    const sy = y + bob;

    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.ellipse(x + 16, y + 29, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = profile.outline;
    ctx.fillRect(x + 7, sy + 13, 18, 15);
    ctx.fillRect(x + 8, sy + 26, 7, 6 + Math.max(0, leg));
    ctx.fillRect(x + 17, sy + 26, 7, 6 + Math.max(0, -leg));
    ctx.fillRect(x + 8, sy + 4, 16, 11);

    ctx.fillStyle = profile.pants;
    ctx.fillRect(x + 9, sy + 25, 5, 6 + Math.max(0, leg));
    ctx.fillRect(x + 18, sy + 25, 5, 6 + Math.max(0, -leg));
    ctx.fillStyle = profile.shoes;
    ctx.fillRect(x + 8, sy + 30 + Math.max(0, leg), 7, 2);
    ctx.fillRect(x + 17, sy + 30 + Math.max(0, -leg), 7, 2);

    ctx.fillStyle = profile.jacket;
    ctx.fillRect(x + 8, sy + 14, 16, 12);
    ctx.fillStyle = profile.shirt;
    ctx.fillRect(x + 13, sy + 15, 6, 10);
    ctx.fillStyle = profile.accent;
    ctx.fillRect(x + 9, sy + 15, 4, 3);
    ctx.fillRect(x + 19, sy + 15, 4, 3);

    ctx.fillStyle = profile.outline;
    ctx.fillRect(x + 5, sy + 16, 4, 9);
    ctx.fillRect(x + 23, sy + 16, 4, 9);
    ctx.fillStyle = profile.skin;
    ctx.fillRect(x + 6, sy + 17 + Math.max(0, side), 3, 7);
    ctx.fillRect(x + 23, sy + 17 + Math.max(0, -side), 3, 7);

    ctx.fillStyle = profile.skin;
    ctx.fillRect(x + 10, sy + 6, 12, 8);
    ctx.fillStyle = profile.hair;
    ctx.fillRect(x + 9, sy + 4, 14, 4);
    ctx.fillRect(x + 8, sy + 7, 3, 5);
    ctx.fillRect(x + 21, sy + 7, 3, 5);
    if (profile.hat) {
      ctx.fillStyle = profile.outline;
      ctx.fillRect(x + 7, sy + 2, 18, 5);
      ctx.fillStyle = profile.hat;
      ctx.fillRect(x + 8, sy + 2, 16, 4);
      ctx.fillRect(x + 12, sy, 8, 3);
      if (dir === "down") ctx.fillRect(x + 10, sy + 6, 12, 2);
    }

    ctx.fillStyle = profile.outline;
    if (dir === "up") {
      ctx.fillRect(x + 10, sy + 8, 12, 2);
    } else if (dir === "left") {
      ctx.fillRect(x + 10, sy + 10, 3, 2);
    } else if (dir === "right") {
      ctx.fillRect(x + 19, sy + 10, 3, 2);
    } else {
      ctx.fillRect(x + 12, sy + 10, 2, 2);
      ctx.fillRect(x + 18, sy + 10, 2, 2);
    }

    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillRect(x + 11, sy + 6, 3, 2);
  }

  function drawAlertBubble(px, py, time, mark) {
    const bob = Math.sin(time / 220) * 2;
    ctx.fillStyle = "rgba(23,33,29,0.24)";
    ctx.beginPath();
    ctx.arc(px + 16, py - 4 + bob, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf6";
    ctx.beginPath();
    ctx.arc(px + 16, py - 6 + bob, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#cf4d4d";
    ctx.font = "900 10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(mark, px + 16, py - 2 + bob);
  }

  function tileAt(x, y) {
    if (x < 0 || y < 0 || x >= WORLD.width || y >= WORLD.height) return "tree";
    if (isBuildingCell(x, y)) return "building";
    if (x === 0 || y === 0 || x === WORLD.width - 1 || y === WORLD.height - 1) return "tree";
    if (isPath(x, y)) return "path";
    if (isCityGround(x, y)) return "city";
    if (isWater(x, y)) return "water";
    if (isRock(x, y)) return "rock";
    if (isTreeCluster(x, y)) return "tree";
    if (isTallGrass(x, y)) return "tallgrass";
    return "meadow";
  }

  function isPath(x, y) {
    if (ROAD_SEGMENTS.some((segment) => roadContains(segment, x, y))) return true;
    const city = cityAt(x, y);
    if (!city) return false;
    const centerX = city.x + Math.floor(city.w / 2);
    const centerY = city.y + Math.floor(city.h / 2);
    if (Math.abs(x - centerX) <= 1 || Math.abs(y - centerY) <= 1) return true;
    return BUILDINGS.some((building) => (
      building.cityId === city.id &&
      Math.abs(x - building.doorX) <= 1 &&
      y >= building.y + building.h &&
      y <= centerY + 1
    ));
  }

  function isWater(x, y) {
    if (x >= 90 && y >= 6 && y <= 34) return true;
    if (x >= 84 && y >= 20 && y <= 29 && (x + y) % 5 !== 0) return true;
    const harborDx = x - 84;
    const harborDy = y - 21;
    if (harborDx * harborDx * 0.75 + harborDy * harborDy * 1.4 < 34) return true;
    const lakeDx = x - 15;
    const lakeDy = y - 31;
    if (lakeDx * lakeDx * 0.92 + lakeDy * lakeDy * 1.25 < 28) return true;
    const frostDx = x - 55;
    const frostDy = y - 46;
    if (frostDx * frostDx * 1.1 + frostDy * frostDy * 0.8 < 18) return true;
    return false;
  }

  function isRock(x, y) {
    if (isPath(x, y) || isCityGround(x, y)) return false;
    if (x >= 45 && x <= 72 && y >= 2 && y <= 23) return (x * 2 + y) % 5 < 2;
    if (x >= 60 && x <= 75 && y >= 28 && y <= 48) return (x + y * 3) % 6 < 2;
    if (x >= 72 && x <= 86 && y >= 48 && y <= 56) return (x * y) % 7 === 0;
    return false;
  }

  function isTreeCluster(x, y) {
    if (isPath(x, y) || isCityGround(x, y) || isWater(x, y)) return false;
    if (x <= 2 || y <= 2 || x >= WORLD.width - 3 || y >= WORLD.height - 3) return true;
    if (x >= 2 && x <= 28 && y >= 20 && y <= 39) return (x + y) % 4 !== 0;
    if (x >= 28 && x <= 43 && y >= 38 && y <= 50) return (x * 3 + y) % 5 < 3;
    if (x >= 5 && x <= 25 && y >= 50 && y <= 66) return (x + y * 2) % 6 < 2;
    if (x >= 34 && x <= 60 && y >= 17 && y <= 28) return (x + y) % 6 === 0;
    return false;
  }

  function isTallGrass(x, y) {
    if (isPath(x, y) || isCityGround(x, y) || isRock(x, y) || isWater(x, y) || isTreeCluster(x, y)) return false;
    const zone = zoneAt(x, y);
    if (!zone) return false;
    return (hash(x, y) + x + y) % 5 !== 0;
  }

  function isCityGround(x, y) {
    const city = cityAt(x, y);
    if (!city) return false;
    return x > city.x && x < city.x + city.w - 1 && y > city.y && y < city.y + city.h - 1;
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
    if (gateAt(x, y)) return true;
    if (lockedCityAt(x, y)) return true;
    return editionNpcs().some((npc) => npc.x === x && npc.y === y);
  }

  function gateAt(x, y) {
    return GATE_DEFS.find((gate) => (
      !isGateOpen(gate) &&
      x >= gate.x &&
      x < gate.x + gate.w &&
      y >= gate.y &&
      y < gate.y + gate.h
    ));
  }

  function isGateOpen(gate) {
    if (gate.badge && !state.badges.includes(gate.badge)) return false;
    if (gate.trainer && !state.flags.trainers[gate.trainer]) return false;
    return true;
  }

  function isCityLocked(cityId) {
    const lock = CITY_LOCKS[cityId];
    if (!lock) return false;
    if (lock.badge && !state.badges.includes(lock.badge)) return true;
    if (lock.trainer && !state.flags.trainers[lock.trainer]) return true;
    return false;
  }

  function lockedCityAt(x, y) {
    const city = cityAt(x, y);
    if (!city) return null;
    const lock = CITY_LOCKS[city.id];
    if (!lock) return null;
    if (lock.badge && !state.badges.includes(lock.badge)) return { city, lock };
    if (lock.trainer && !state.flags.trainers[lock.trainer]) return { city, lock };
    return null;
  }

  function routeKey() {
    const { x, y } = state.player;
    const city = cityAt(x, y);
    if (city) return city.id;
    const zone = zoneAt(x, y);
    if (zone) return zone.id;
    if (isWater(x, y)) return "coast";
    if (isTreeCluster(x, y)) return "woods";
    return "road";
  }

  function currentRouteName() {
    return ROUTE_NAMES[routeKey()] || ROUTE_NAMES.road;
  }

  function encounterArea() {
    const zone = zoneAt(state.player.x, state.player.y);
    return zone ? zone.encounter : "meadow";
  }

  function cityAt(x, y) {
    return CITY_DEFS.find((city) => rectContains(city, x, y));
  }

  function zoneAt(x, y) {
    return WILD_ZONES.find((zone) => rectContains(zone, x, y));
  }

  function rectContains(rect, x, y) {
    return x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h;
  }

  function roadContains(segment, x, y) {
    const minX = Math.min(segment.x1, segment.x2);
    const maxX = Math.max(segment.x1, segment.x2);
    const minY = Math.min(segment.y1, segment.y2);
    const maxY = Math.max(segment.y1, segment.y2);
    const width = segment.w || 0;
    if (segment.y1 === segment.y2) return x >= minX && x <= maxX && Math.abs(y - segment.y1) <= width;
    if (segment.x1 === segment.x2) return y >= minY && y <= maxY && Math.abs(x - segment.x1) <= width;
    const dx = segment.x2 - segment.x1;
    const dy = segment.y2 - segment.y1;
    const lengthSq = dx * dx + dy * dy;
    const t = clamp(((x - segment.x1) * dx + (y - segment.y1) * dy) / lengthSq, 0, 1);
    const closestX = segment.x1 + dx * t;
    const closestY = segment.y1 + dy * t;
    return Math.hypot(x - closestX, y - closestY) <= width + 0.72;
  }

  function tryMove(dir) {
    if (isLocked()) return;
    const delta = DIRS[dir];
    if (!delta) return;
    state.menuOpen = false;
    state.player.dir = dir;
    const nextX = state.player.x + delta.x;
    const nextY = state.player.y + delta.y;
    const gate = gateAt(nextX, nextY);
    if (gate) {
      showDialog(gate.title, gate.text);
      tone(120, 0.035, "square");
      return;
    }
    const cityLock = lockedCityAt(nextX, nextY);
    if (cityLock) {
      showDialog(`${cityLock.city.name} Gate`, cityLock.lock.text);
      tone(120, 0.035, "square");
      return;
    }
    if (isBlocked(nextX, nextY)) {
      tone(120, 0.035, "square");
      renderTopline();
      return;
    }
    footstepEffects.push({ x: state.player.x, y: state.player.y, time: performance.now() });
    if (footstepEffects.length > 10) footstepEffects.shift();
    playerMotion = {
      fromX: state.player.x,
      fromY: state.player.y,
      toX: nextX,
      toY: nextY,
      started: performance.now(),
      duration: 118
    };
    state.player.x = nextX;
    state.player.y = nextY;
    state.player.steps += 1;
    if (state.player.steps % 8 === 0) saveGame(false);
    renderTopline();
  }

  function maybeWildEncounter() {
    if (!state.party.length || state.battle) return;
    if (tileAt(state.player.x, state.player.y) !== "tallgrass") return;
    const rate = state.badges.length ? 0.1 : 0.14;
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

  function checkTrainerVision(time) {
    if (!state.party.length || state.battle || state.dialog || trainerApproach) return false;
    const npc = editionNpcs().find((entry) => (
      entry.action === "trainer" &&
      !state.flags.trainers[entry.trainerId] &&
      canTrainerAutoChallenge(entry.trainerId) &&
      hasLineOfSight(entry, state.player, 6)
    ));
    if (!npc) return false;
    const dx = Math.sign(state.player.x - npc.x);
    const dy = Math.sign(state.player.y - npc.y);
    trainerApproach = {
      npcId: npc.id,
      fromX: npc.x,
      fromY: npc.y,
      toX: state.player.x - dx,
      toY: state.player.y - dy,
      started: time,
      duration: 520
    };
    showDialog(npc.name, npc.trainerId && npc.trainerId.startsWith("umbra") ? "Team Umbra has business here. Battle." : "Eyes up, challenger. Let's battle.");
    tone(880, 0.08, "square");
    window.setTimeout(() => {
      if (state.battle) return;
      if (state.dialog && state.dialog.speaker === npc.name) state.dialog = null;
      trainerApproach = null;
      startTrainerBattle(npc.trainerId);
      renderAll();
    }, 760);
    return true;
  }

  function canTrainerAutoChallenge(trainerId) {
    const trainer = editionTrainer(trainerId);
    if (!trainer || state.flags.trainers[trainerId]) return false;
    if (trainer.requiresTrainer && !state.flags.trainers[trainer.requiresTrainer]) return false;
    if (trainer.minBadges && state.badges.length < trainer.minBadges) return false;
    if (trainer.gymRank && state.badges.length < trainer.gymRank - 1) return false;
    return true;
  }

  function hasLineOfSight(npc, player, range) {
    const sameColumn = npc.x === player.x;
    const sameRow = npc.y === player.y;
    if (!sameColumn && !sameRow) return false;
    const distance = Math.abs(npc.x - player.x) + Math.abs(npc.y - player.y);
    if (distance < 2 || distance > range) return false;
    const dx = Math.sign(player.x - npc.x);
    const dy = Math.sign(player.y - npc.y);
    for (let step = 1; step < distance; step += 1) {
      const x = npc.x + dx * step;
      const y = npc.y + dy * step;
      if (["tree", "rock", "water", "building"].includes(tileAt(x, y)) || gateAt(x, y)) return false;
    }
    return true;
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
    if (building) {
      enterInterior(building);
      return;
    }
    showDialog("", "The route hums quietly.");
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
      return;
    }
    if (npc.action === "talk") {
      showDialog(npc.name, npc.text || "Keep your party healed and your eyes open.");
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
      showDialog(edition.professor, edition.giftRepeat);
      pushLog(edition.giftLog);
      renderAll();
      return;
    }
    state.flags.mapleGift = true;
    state.bag.balls += edition.id === "sapphire" ? 8 : 6;
    state.bag.potions += 2;
    state.money += edition.id === "sapphire" ? 140 : 120;
    pushLog(`${edition.professor} stocked your bag for the road.`);
    showDialog(edition.professor, edition.giftReceived);
    saveGame(false);
    renderAll();
    tone(659, 0.08, "triangle");
    tone(880, 0.1, "triangle", 0.08);
  }

  function healParty(show = false) {
    if (!state.party.length) return;
    const nurse = getEdition().npcs.nurse.name;
    state.party.forEach((pokemon) => {
      pokemon.hp = pokemon.maxHp;
      pokemon.stages = { attack: 0, defense: 0, speed: 0 };
    });
    state.activeIndex = firstAliveIndex();
    pushLog("Your party was healed.");
    if (show) showDialog(nurse, "Your party was healed.");
    saveGame(false);
    renderAll();
    tone(523, 0.08, "sine");
    tone(659, 0.08, "sine", 0.06);
    tone(784, 0.1, "sine", 0.12);
  }

  function enterInterior(building) {
    if (!state.party.length) return;
    currentInterior = building;
    const city = cityName(building.cityId);
    const gym = building.trainerId ? GYM_DEFS.find((entry) => entry.trainerId === building.trainerId) : null;
    const copy = interiorCopy(building, city, gym);
    els.interiorKicker.textContent = city;
    els.interiorTitle.textContent = copy.title;
    els.interiorText.textContent = copy.text;
    els.interiorScene.dataset.kind = building.kind;
    els.interiorScene.dataset.city = building.cityId || "";
    els.interiorPrimaryButton.textContent = copy.primary;
    els.interiorSecondaryButton.textContent = copy.secondary;
    els.interiorSecondaryButton.hidden = !copy.secondary;
    els.interiorModal.hidden = false;
    tone(392, 0.055, "triangle");
  }

  function interiorCopy(building, city, gym) {
    if (building.kind === "clinic") {
      return { title: `${city} Clinic`, text: "Clean lights, soft chimes, and a nurse ready to restore your party before the road gets rough.", primary: "Heal party", secondary: "Talk" };
    }
    if (building.kind === "market") {
      return { title: `${city} Market`, text: "Shelves of balls, potions, berries, and local rumors. The clerk adjusts stock as your badges grow.", primary: "Restock", secondary: "Rumor" };
    }
    if (building.kind === "lab") {
      return { title: getEdition().professor, text: "Maps, dex monitors, and starter notes cover the professor's benches. This is where the circuit starts feeling real.", primary: "Field kit", secondary: "Research" };
    }
    if (building.kind === "gym") {
      const won = gym && state.badges.includes(gym.badge);
      return { title: gym ? `${gym.leader}'s ${gym.type} Gym` : "Circuit Gym", text: won ? `The ${gym.badge} banner hangs over the arena. Trainers here are already telling your story.` : `A full arena waits inside. Win here to earn the ${gym.badge}.`, primary: won ? "Rematch talk" : "Challenge", secondary: "Inspect" };
    }
    if (building.kind === "umbra") {
      return { title: "Crown Station", text: "The station hums with stolen signal power. Team Umbra's blackout equipment fills the room.", primary: "Confront", secondary: "Inspect" };
    }
    if (building.kind === "league") {
      return { title: "League Desk", text: "A polished counter lists badge registrations, Crown Station status, and your rival's signed challenge slip.", primary: "Register", secondary: "Review" };
    }
    return { title: `${city} Home`, text: "A small local home full of city-specific chatter, travel hints, and a warm pause from the circuit.", primary: "Chat", secondary: "Rest" };
  }

  function useInteriorPrimary() {
    if (!currentInterior) return;
    const building = currentInterior;
    els.interiorModal.hidden = true;
    currentInterior = null;
    if (building.kind === "clinic") healParty(true);
    else if (building.kind === "market") marketRestock(building);
    else if (building.kind === "lab") professorGift();
    else if (building.kind === "gym" || building.kind === "umbra") startTrainerBattle(building.trainerId);
    else if (building.kind === "league") leagueDesk();
    else {
      const city = cityById(building.cityId);
      showDialog(city ? `${city.name} Resident` : "Resident", localHouseLine(building.cityId));
    }
  }

  function useInteriorSecondary() {
    if (!currentInterior) return;
    const building = currentInterior;
    const city = cityName(building.cityId);
    let line = "";
    if (building.kind === "clinic") line = "Healthy partners mean longer routes, cleaner rival battles, and fewer emergency walks home.";
    else if (building.kind === "market") line = marketRumor();
    else if (building.kind === "lab") line = professorStoryLine();
    else if (building.kind === "gym") line = gymGuideLine(building.trainerId);
    else if (building.kind === "umbra") line = "Power is being pulled from every gym signal stone into one Crown antenna.";
    else if (building.kind === "league") line = `${state.badges.length}/${GYM_DEFS.length} badges registered. Team Umbra status: ${state.flags.trainers["umbra-boss"] ? "cleared" : "active"}.`;
    else line = localHouseLine(building.cityId);
    els.interiorText.textContent = `${city}: ${line}`;
    tone(523, 0.045, "triangle");
  }

  function localHouseLine(cityId) {
    const lines = {
      lumen: "Professor Maple says the first brave step is usually just leaving town.",
      bracken: "Our vines twitch whenever Team Umbra drives through the east gate.",
      quarry: "The quarry sings when the cable road is clear. Lately it has been dead quiet.",
      harbor: "If the lighthouse flickers, look south. Umbra boats hate witnesses.",
      emberfall: "Cinder's furnace burns hotter when a challenger carries real purpose.",
      crown: "Crown City lights used to be visible from every route. We miss that glow.",
      frostvale: "Noelle trains patience. Ice punishes rushed choices.",
      neon: "Volt says every circuit needs resistance before it can shine.",
      thornmere: "Mallow's mist can hide rare partners and bad ideas equally well.",
      astral: "Sol reads the sky, but even stars get scrambled by Umbra signals."
    };
    return lines[cityId] || "Every city has a story if you slow down enough to hear it.";
  }

  function marketRumor() {
    if (state.badges.length >= 8) return "Everyone is buying extra potions for Crown City. Something big is ending there.";
    if (state.badges.length >= 5) return "Umbra grunts keep asking for batteries and dark cloth. Subtle, they are not.";
    return "Fresh trainers do best when they buy before they need supplies.";
  }

  function professorStoryLine() {
    if (state.flags.trainers["umbra-boss"]) return "You restored the region's signal. Now the league can measure battles cleanly again.";
    if (state.badges.length >= 5) return "Your badge data shows Umbra is not stealing trophies. They are stealing the network those badges power.";
    if (state.badges.length) return "Every badge gives me a clearer signal. Keep moving around the circuit.";
    return "Jules ran east before I could finish the safety lecture. Please be the responsible one.";
  }

  function gymGuideLine(trainerId) {
    const trainer = editionTrainer(trainerId);
    if (!trainer) return "Study your type matchups before stepping onto the arena floor.";
    if (state.flags.trainers[trainerId]) return `${trainer.name} is still talking about that battle. You left a mark here.`;
    return `${trainer.name} favors pressure and clean switches. Bring a healed party and a plan.`;
  }

  function marketRestock(building) {
    if (!state.party.length) return;
    const city = cityName(building.cityId);
    const cost = Math.min(state.money, 120 + state.badges.length * 35);
    const balls = 3 + Math.floor(state.badges.length / 2);
    const potions = 1 + (state.badges.length >= 4 ? 1 : 0);
    state.money -= cost;
    state.bag.balls += balls;
    state.bag.potions += potions;
    if (state.badges.length >= 3) state.bag.berries += 1;
    pushLog(`Restocked in ${city}.`);
    showDialog("Market Clerk", `You spent $${cost} and stocked ${balls} balls, ${potions} potions, and field snacks.`);
    saveGame(false);
    renderAll();
    tone(622, 0.07, "triangle");
    tone(784, 0.08, "triangle", 0.06);
  }

  function leagueDesk() {
    if (state.badges.length < GYM_DEFS.length) {
      showDialog("League Desk", `The Crown League requires all ${GYM_DEFS.length} circuit badges.`);
      return;
    }
    if (!state.flags.trainers["umbra-boss"]) {
      showDialog("League Desk", "Crown Station is dark. Stop Team Umbra before the desk can certify challengers.");
      return;
    }
    showFinish("Crown League Ready", "Eight badges, a stopped blackout, and a rival waiting at the gate. PokeG's grand circuit is open for the next chapter.");
    pushLog("Crown League certification unlocked.");
    saveGame(false);
  }

  function startTrainerBattle(trainerId) {
    const trainer = editionTrainer(trainerId);
    if (!trainer) return;
    if (state.flags.trainers[trainerId]) {
      showDialog(trainer.name, trainerAfterLine(trainerId));
      return;
    }
    if (trainer.requiresTrainer && !state.flags.trainers[trainer.requiresTrainer]) {
      const prior = editionTrainer(trainer.requiresTrainer);
      showDialog(trainer.name, `${prior ? prior.name : "Another trainer"} is part of this story first.`);
      return;
    }
    if (trainer.minBadges && state.badges.length < trainer.minBadges) {
      showDialog(trainer.name, `Bring ${trainer.minBadges} badge${trainer.minBadges === 1 ? "" : "s"} before this battle.`);
      return;
    }
    if (trainer.gymRank && state.badges.length < trainer.gymRank - 1) {
      const previous = GYM_DEFS[trainer.gymRank - 2];
      showDialog(trainer.name, `The ${previous.badge} should be earned before this gym.`);
      return;
    }
    if (trainerId === "leader" && !state.flags.trainers["rival-lumen"]) {
      showDialog(getEdition().leaderName, "Find your rival on Sunpetal Route first.");
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
      const rank = trainer.rank || 2;
      const starterType = state.party[0] ? typesOf(state.party[0])[0] : "grass";
      const counter = edition.id === "sapphire"
        ? starterType === "grass" ? 255 : starterType === "fire" ? 258 : starterType === "water" ? 252 : 261
        : starterType === "grass" ? 4 : starterType === "fire" ? 7 : starterType === "water" ? 1 : 27;
      const scale = clamp(Math.round(avg + rank), 6 + rank * 3, 9 + rank * 4);
      if (edition.id === "sapphire") {
        return [
          createPokemon(rank > 5 ? 262 : 263, scale),
          createPokemon(counter, scale + 1),
          createPokemon(rank > 7 ? 282 : 278, Math.max(7, scale)),
          ...(rank >= 9 ? [createPokemon(363, scale + 2)] : [])
        ];
      }
      return [
        createPokemon(rank > 5 ? 20 : 133, scale),
        createPokemon(counter, scale + 1),
        createPokemon(rank > 7 ? 147 : 21, Math.max(7, scale)),
        ...(rank >= 9 ? [createPokemon(143, scale + 2)] : [])
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

  function trainerAfterLine(trainerId) {
    if (trainerId.startsWith("rival")) {
      if (trainerId === "rival-crown") return "No shortcuts left. The next time we battle, it is for the league story.";
      if (state.badges.length >= 5) return "Umbra is bigger than a road gang. I will keep their scouts busy.";
      return "I am getting stronger too. Do not make the next badge look easy.";
    }
    if (trainerId.startsWith("umbra")) {
      if (trainerId === "umbra-boss") return "The Crown antenna is yours. Umbra's broadcast is over.";
      return "You broke this operation, but the signal still points to Crown City.";
    }
    const gym = GYM_DEFS.find((entry) => entry.trainerId === trainerId);
    if (gym) return `The ${gym.badge} is yours. ${gym.leader} is watching where your story goes next.`;
    if (trainerId === "scout") return "Those routes are bigger than they look. Use the map, not just instinct.";
    return "We already battled. Keep training.";
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
    pulseBattleFx(battle.kind === "trainer" ? "trainer-entry" : "wild-entry");
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

  function pulseBattleFx(kind) {
    window.clearTimeout(battleFxTimer);
    els.battleStage.classList.remove("fx-player-hit", "fx-enemy-hit", "fx-victory", "fx-trainer-entry", "fx-wild-entry");
    void els.battleStage.offsetWidth;
    els.battleStage.classList.add(`fx-${kind}`);
    els.battleFlash.textContent = kind === "victory" ? "WIN" : kind.includes("entry") ? "!" : "";
    battleFxTimer = window.setTimeout(() => {
      els.battleStage.classList.remove("fx-player-hit", "fx-enemy-hit", "fx-victory", "fx-trainer-entry", "fx-wild-entry");
      els.battleFlash.textContent = "";
    }, 520);
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
    if (damage > 0) pulseBattleFx(attacker === activePokemon() ? "enemy-hit" : "player-hit");
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
        handleStoryAfterBattle(battle);
      } else {
        pushLog(`Defeated a wild ${battle.enemy.name}.`);
      }
      battle.log.push("Battle complete.");
      pulseBattleFx("victory");
      tone(784, 0.08, "triangle");
      tone(1046, 0.14, "triangle", 0.08);
    }
    saveGame(false);
    renderAfterBattleAction();
  }

  function handleStoryAfterBattle(battle) {
    const trainer = editionTrainer(battle.trainerId);
    if (!trainer) return;
    if (trainer.storyLog) pushLog(trainer.storyLog);
    if (trainer.story === "umbra") {
      state.flags.story.umbraStage = Math.max(state.flags.story.umbraStage || 0, trainer.minBadges || 1);
      state.bag.balls += 1;
      battle.log.push("You recovered a supply ball from Team Umbra.");
    }
    if (trainer.gymRank && trainer.gymRank === GYM_DEFS.length) {
      battle.finishTitle = "Circuit Complete";
      battle.finishText = "Eight badges are yours. Crown City is ready, but Team Umbra still has the station lights under their control.";
    }
    if (battle.trainerId === "umbra-boss") {
      battle.finishTitle = "Crown Lights Restored";
      battle.finishText = "Director Vey's blackout protocol failed. The league desk is open, and Jules is waiting for a final gate battle.";
      state.money += 500;
    }
  }

  function blackOut() {
    const battle = state.battle;
    const clinicName = "Lumen Village Clinic";
    const loss = Math.min(state.money, Math.max(20, Math.floor(state.money * 0.18)));
    state.money -= loss;
    battle.log.push(`You dropped $${loss} getting back to ${clinicName}.`);
    battle.ended = true;
    battle.locked = false;
    battle.forcedSwitch = false;
    state.player.x = 12;
    state.player.y = 12;
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
    return !els.editionModal.hidden ||
      !els.introModal.hidden ||
      !els.starterModal.hidden ||
      !els.finishModal.hidden ||
      !els.mapModal.hidden ||
      !els.interiorModal.hidden ||
      !!state.battle ||
      !!state.dialog ||
      state.menuOpen ||
      !!playerMotion ||
      !!trainerApproach;
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
    if ((key === " " || key === "enter") && state.dialog) {
      event.preventDefault();
      closeDialog();
      return;
    }
    if (key === "escape" && !els.mapModal.hidden) {
      event.preventDefault();
      els.mapModal.hidden = true;
      renderAll();
      return;
    }
    if (key === "escape" && !els.interiorModal.hidden) {
      event.preventDefault();
      els.interiorModal.hidden = true;
      currentInterior = null;
      renderAll();
      return;
    }
    if (key === "escape" || key === "m") {
      event.preventDefault();
      toggleMenu();
      return;
    }
    if (movement[key]) {
      event.preventDefault();
      if (isLocked()) return;
      keysDown.add(movement[key]);
      if (performance.now() - lastMoveAt > 120) {
        tryMove(movement[key]);
        lastMoveAt = performance.now();
      }
    }
    if (key === " " || key === "enter") {
      event.preventDefault();
      if (state.menuOpen) {
        toggleMenu(false);
        return;
      }
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
    if (event.target.closest("#dialogBox")) {
      closeDialog();
      return;
    }
    const menuTab = event.target.closest("[data-menu-tab]");
    if (menuTab) {
      activeTab = menuTab.dataset.menuTab;
      renderSidePanels();
      renderPauseMenu();
      return;
    }
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
      return;
    }
    if (event.target.closest("[data-open-map]")) {
      showRegionMap();
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

  els.menuButton.addEventListener("click", () => toggleMenu());
  els.mapButton.addEventListener("click", showRegionMap);
  els.journalButton.addEventListener("click", () => {
    if (!state.party.length) {
      showToast("Choose a partner first.");
      return;
    }
    activeTab = "log";
    renderSidePanels();
    toggleMenu(false);
    tone(440, 0.045, "triangle");
  });
  els.menuSaveButton.addEventListener("click", () => {
    if (!state.party.length) return;
    saveGame(true);
  });
  els.menuCloseButton.addEventListener("click", () => toggleMenu(false));
  els.mobileAction.addEventListener("click", () => {
    if (closeDialog()) return;
    interact();
  });
  els.healButton.addEventListener("click", () => healParty(true));
  els.saveButton.addEventListener("click", () => saveGame(true));
  els.audioButton.addEventListener("click", () => {
    state.audioMuted = !state.audioMuted;
    syncAudioButton();
    saveGame(false);
    if (!state.audioMuted) tone(660, 0.06, "triangle");
  });
  els.introNextButton.addEventListener("click", () => advanceIntro(false));
  els.introSkipButton.addEventListener("click", () => advanceIntro(true));
  els.mapCloseButton.addEventListener("click", () => {
    els.mapModal.hidden = true;
    renderAll();
  });
  els.interiorPrimaryButton.addEventListener("click", useInteriorPrimary);
  els.interiorSecondaryButton.addEventListener("click", useInteriorSecondary);
  els.interiorExitButton.addEventListener("click", () => {
    els.interiorModal.hidden = true;
    currentInterior = null;
    renderAll();
  });
  els.resetButton.addEventListener("click", () => {
    const ok = window.confirm("Reset this run?");
    if (!ok) return;
    localStorage.removeItem(SAVE_KEY);
    state = freshState();
    applyEditionTheme("ember");
    els.editionModal.hidden = false;
    els.introModal.hidden = true;
    els.starterModal.hidden = true;
    els.finishModal.hidden = true;
    els.mapModal.hidden = true;
    els.interiorModal.hidden = true;
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
    els.introModal.hidden = true;
    els.starterModal.hidden = true;
    els.mapModal.hidden = true;
    els.interiorModal.hidden = true;
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
