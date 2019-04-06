var SnappyJS = require('snappyjs');

const empty = {
  AT: 0,
  AC: 0,
  S1T: 1,
  S1C: 1,
  S2T: 1,
  S2C: 1,
  S3T: 1,
  S3C: 1,
};
const complete = {
  AT: 4,
  AC: 4,
  S1T: 10,
  S1C: 10,
  S2T: 10,
  S2C: 10,
  S3T: 10,
  S3C: 10,
};
const KEYS = [
'AC',
'AT',
'S1C',
'S1T',
'S2C',
'S2T',
'S3C',
'S3T',
];

const matMap = {
  "Gem of Saber": 0,
  "Gem of Archer": 1,
  "Gem of Lancer": 2,
  "Gem of Rider": 3,
  "Gem of Caster": 4,
  "Gem of Assassin": 5,
  "Gem of Berserker": 6,
  "Magic Gem of Saber": 7,
  "Magic Gem of Archer": 8,
  "Magic Gem of Lancer": 9,
  "Magic Gem of Rider": 10,
  "Magic Gem of Caster": 11,
  "Magic Gem of Assassin": 12,
  "Magic Gem of Berserker": 13,
  "Secret Gem of Saber": 14,
  "Secret Gem of Archer": 15,
  "Secret Gem of Lancer": 16,
  "Secret Gem of Rider": 17,
  "Secret Gem of Caster": 18,
  "Secret Gem of Assassin": 19,
  "Secret Gem of Berserker": 20,
  "Saber Piece": 21,
  "Archer Piece": 22,
  "Lancer Piece": 23,
  "Rider Piece": 24,
  "Caster Piece": 25,
  "Assassin Piece": 26,
  "Berserker Piece": 27,
  "Saber Monument": 28,
  "Archer Monument": 29,
  "Lancer Monument": 30,
  "Rider Monument": 31,
  "Caster Monument": 32,
  "Assassin Monument": 33,
  "Berserker Monument": 34,
  "Proof of Hero": 35,
  "Evil Bone": 36,
  "Dragon Fang": 37,
  "Void's Dust": 38,
  "Fool's Chain": 39,
  "Deadly Poisonous Needle": 40,
  "Magical Cerebrospinal Fluid": 41,
  "Iron Stake of the Weeping Dusk": 42,
  "Volatile Gunpowder": 43,
  "Seed of Yggdrasil": 44,
  "Ghost Lantern": 45,
  "Octuplet Crystals": 46,
  "Serpent Jewel": 47,
  "Phoenix Feather": 48,
  "Eternal Gear": 49,
  "Forbidden Page": 50,
  "Homunculus Baby": 51,
  "Meteor Horseshoe": 52,
  "Great Knight Medal": 53,
  "Shell of Reminiscence": 54,
  "Elegant Magatama": 55,
  "Permafrost": 56,
  "Giant's Ring": 57,
  "Aurora Steel": 58,
  "Old-fashioned Bell": 59,
  "Claw of Chaos": 60,
  "Heart of the Foreign God": 61,
  "Dragon's Reverse Scale": 62,
  "Spirit Root": 63,
  "Warhorse's Young Horn": 64,
  "Tearstone of Blood": 65,
  "Black Beast Grease": 66,
  "Lamp of Evil-Sealing": 67,
  "Scarab of Wisdom": 68,
  "Primordial Lanugo": 69,
  "Cursed Beast Gallstone": 70,
  "Bizarre Godly Wine": 71,
  "Gyoukou Core": 72,
  "Crystallized Lore": 73,
	"Holy Grail": 74
};
const matMapRev = {};
Object.keys(matMap).forEach(k => {
  matMapRev[matMap[k]] = k;
});

const MATERIAL_KEY = 'm';
const EVENTS_KEY = 'e';

export default {
  getMatConfigs() {
    const string = this.getQuery(MATERIAL_KEY);
    if (string == null) {
      return {};
    } else {
      const rawConfig = string.split(',');
      const r = {};
      rawConfig.forEach((v, i) => {
        r[matMapRev[i]] = parseInt(v);
      });
      return r;
    }
  },

  getEventConfigs() {
    const string = this.getQuery(EVENTS_KEY);
    if (string == null) {
      return [];
    } else {
      return string.split('').map(v => v === '1');
    }
  },

  getServantConfigs(id) {
    const string = this.getQuery(String(parseInt(id)));
    if (string == null) {
      return empty;
    } else if (string == 'D') {
      return complete;
    } else {
      const rawConfig = string.split(',');
      return {
        AC: parseInt(rawConfig[0] || 0),
        AT: parseInt(rawConfig[1] || 0),
        S1C: parseInt(rawConfig[2] || 1),
        S1T: parseInt(rawConfig[3] || 1),
        S2C: parseInt(rawConfig[4] || 1),
        S2T: parseInt(rawConfig[5] || 1),
        S3C: parseInt(rawConfig[6] || 1),
        S3T: parseInt(rawConfig[7] || 1),
      }
    }
  },

  getQuery(key) {
    const {search} = window.location;
    const index = search.indexOf(key + '=');
    if (index < 0) {
      return null;
    }
    const start = index + key.length + 1;
    const end = search.indexOf('&', start);
    const len = end < 0 ? undefined : end - start;
    return search.substr(start, len);
  },

  setQuery(key, value) {
    const search = window.location.search.slice(1);
    const index = search.indexOf(key + '=');
    if (index < 0) {
      return `?${search}${search ? '&' : ''}${key}=${value}`;
    }
    const start = index + key.length + 1;
    const end = search.indexOf('&', start);
    if (end < 0) {
      return `?${search.substr(0, start)}${value}`;
    }
    return `?${search.substr(0, start)}${value}${search.substr(end)}`;
  },

  removeQuery(key) {
    const search = window.location.search.slice(1);
    const index = search.indexOf(key + '=');
    if (index < 0) {
      return window.location.search;
    }
    const end = search.indexOf('&', index);
    const start = search.charAt(index - 1) == '&' ? index - 1 : index;
    if (end < 0) {
      return `?${search.substr(0, start)}`;
    } else {
      return `?${search.substr(0, start)}${search.substr(end + 1)}`;
    }
  },

  updateURLServant(id, servantConfig) {
    const complete = KEYS.every(k => {
      const val = servantConfig[k];
      return k[0] === 'A' ? val === 4 : val === 10;
    });
    let queryVal;
    if (complete) {
      queryVal = 'D';
    } else {
      queryVal = KEYS.map(k => {
        const val = servantConfig[k];
        if (k[0] === 'A') {
          return val === 0 ? '' : String(val);
        } else {
          return val <= 1 ? '' : String(val);
        }
      }).join(',');
    }
    if (queryVal === ',,,,,,,') {
      window.history.replaceState("", "", `/${this.removeQuery(String(parseInt(id)))}`);
    } else {
      window.history.replaceState("", "", `/${this.setQuery(String(parseInt(id)), queryVal)}`);
    }
  },

  updateEvents(configs) {
    const c = new Array(configs.length).fill(null);
    const val = c.map((_, index) => configs[index] ? '1':'0').join('');
    window.history.replaceState("", "", `/${this.setQuery(EVENTS_KEY, val)}`);
  },

  updateMaterials(configs) {
    const vals = Object.keys(matMap).map((_, index) => {
      return configs[matMapRev[index]];
    });
    window.history.replaceState("", "", `/${this.setQuery(MATERIAL_KEY, vals.map(v => v === 0? '': v).join(','))}`);
  },
};
