
import {ReduceStore} from 'flux/utils';
import Dispatcher from './Dispatcher.js';

import URLUtils from './utils/URLUtils.js';

const mats = require('./mats.json');
const events = require('./events.json');
const materials = require('./materials.json');

function calculateSkillReq(i, s, needed, addAll, matReq) {
  const levelReq = i < 9 ? s.skills[i] : [{mat: 'Crystallized Lore', num: 1}];
  levelReq.forEach(r => {
    if (!matReq[r.mat]) {
      return;
    }
    if (needed) {
      if(matReq[r.mat].skills[s.id]) {
        matReq[r.mat].skills[s.id] += r.num;
      } else {
        matReq[r.mat].skills[s.id] = r.num;
      }
    }
    if (addAll) {
      if(matReq[r.mat].skillsAll[s.id]) {
        matReq[r.mat].skillsAll[s.id] += r.num;
      } else {
        matReq[r.mat].skillsAll[s.id] = r.num;
      }
    }
  });
}

function calculateAsecReq(i, s, needed, addAll, matReq) {
  const levelReq = s.asce[i + 1];
  levelReq.forEach(r => {
    if (!matReq[r.mat]) {
      return;
    }
    if (needed) {
      if(matReq[r.mat].asec[s.id]) {
        matReq[r.mat].asec[s.id] += r.num;
      } else {
        matReq[r.mat].asec[s.id] = r.num;
      }
    }
    if (addAll) {
      if(matReq[r.mat].asecAll[s.id]) {
        matReq[r.mat].asecAll[s.id] += r.num;
      } else {
        matReq[r.mat].asecAll[s.id] = r.num;
      }
    }
  });
}

class Store extends ReduceStore {

  getInitialState() {
    const materialConfigs = {};
    const urlMaterialConfigs = URLUtils.getMatConfigs();
    const matReq = {};
    Object.values(materials).forEach(ms => ms.forEach(m => {
      matReq[m] = {
        asec: {},
        asecAll: {},
        skills: {},
        skillsAll: {},
      };
      materialConfigs[m] = urlMaterialConfigs[m] || 0;
    }));
    const servantConfigs = {};
    mats.forEach(s => {
      const config = URLUtils.getServantConfigs(s.id);
      servantConfigs[s.id] = config;
      for(var i = 0; i < 4; i++) {
        calculateAsecReq(i, s, i >= config.AC && i < config.AT, i >= config.AC, matReq);
      }
      for(var i = 1; i < 10; i++) {
        calculateSkillReq(i, s, i >= config.S1C && i < config.S1T, i >= config.S1C, matReq);
        calculateSkillReq(i, s, i >= config.S2C && i < config.S2T, i >= config.S2C, matReq);
        calculateSkillReq(i, s, i >= config.S3C && i < config.S3T, i >= config.S3C, matReq);
      }
    });


    const eventConfigs = URLUtils.getEventConfigs();
    const eventMats = {};
    events.forEach((event,index) => {
      if (!eventConfigs[index]) {
        return;
      }
      Object.keys(event.shop).forEach(k => {
        if (!eventMats[k]) {
          eventMats[k] = 0;
        }
        eventMats[k] += event.shop[k];
      });
      Object.keys(event.lottery).forEach(k => {
        if (!eventMats[k]) {
          eventMats[k] = 0;
        }
        eventMats[k] += event.lottery[k]*(Object.keys(event.lottery).length > 4 ? 30 : 100);
      });
    });

    return {
      eventConfigs,
      eventMats,
      servantConfigs,
      materialConfigs,
      materialRequirements: matReq,
      currentTab: 's',
      routes: {
        s: [],
        m: [],
        e: [],
        r: [],
      },
      filters: {
        s: false,
        m: false,
      },
      yPositions: {
        s: 0,
        m: 0,
        e: 0,
      },
    };
  }

  reduce(state, action) {
    const yPositions = {...state.yPositions};
    switch (action.type) {
      case 'toggleFilter':
        return {
          ...state,
          filters: {
            ...state.filters,
            [action.tab]: !state.filters[action.tab],
          }
        };
      case 'eventsUpdate':
        const eventConfigs = [...state.eventConfigs];
        eventConfigs[action.eventIndex] = action.val;
        URLUtils.updateEvents(eventConfigs);
        const eventMats = {};
        events.forEach((event,index) => {
          if (!eventConfigs[index]) {
            return;
          }
          Object.keys(event.shop).forEach(k => {
            if (!eventMats[k]) {
              eventMats[k] = 0;
            }
            eventMats[k] += event.shop[k];
          });
          Object.keys(event.lottery).forEach(k => {
            if (!eventMats[k]) {
              eventMats[k] = 0;
            }
            eventMats[k] += event.lottery[k]*(Object.keys(event.lottery).length > 4 ? 30 : 100);
          });
        });
        return {
          ...state,
          eventConfigs,
          eventMats,
        };
      case 'servantUpdate':
        URLUtils.updateURLServant(action.id , action.config);
        const servantConfigs = state.servantConfigs;
        const s = mats.find(s => s.id === action.id);
        const matReq = {...state.materialRequirements};
        const {config} = action;
        const hasResetAsec = false;
        const hasResetSkill = false;
        Object.keys(matReq).forEach(m => {
          delete matReq[m].asec[s.id];
          delete matReq[m].skills[s.id];
          delete matReq[m].asecAll[s.id];
          delete matReq[m].skillsAll[s.id];
        });

        for(var i = 0; i < 4; i++) {
          calculateAsecReq(i, s, i >= config.AC && i < config.AT, i >= config.AC, matReq);
        }
        for(var i = 1; i < 10; i++) {
          calculateSkillReq(i, s, i >= config.S1C && i < config.S1T, i >= config.S1C, matReq);
          calculateSkillReq(i, s, i >= config.S2C && i < config.S2T, i >= config.S2C, matReq);
          calculateSkillReq(i, s, i >= config.S3C && i < config.S3T, i >= config.S3C, matReq);
        }
        return {
          ...state,
          materialRequirements: matReq,
          servantConfigs: {
            ...servantConfigs,
            [action.id]: config,
          },
        };
      case 'materialUpdate':
        const newMaterialConfigs = {...state.materialConfigs};
        newMaterialConfigs[action.mat] = action.val;
        URLUtils.updateMaterials(newMaterialConfigs);
        return {
          ...state,
          materialConfigs: newMaterialConfigs,
        };
      case 'addRouteServant':
      case 'backRoute':
      case 'addRouteEvent':
      case 'addRouteMaterial':
      case 'addRouteSkill':
      case 'addRouteAsce':
        const newRoutes = {...state.routes};
        const route = newRoutes[state.currentTab].slice();
        if (route.length === 0) {
          yPositions[state.currentTab] = window.scrollY;
        }
        if (action.type === 'addRouteServant') {
          route.push('servant' + action.id);
        } else if (action.type === 'backRoute') {
          route.pop();
        } else if (action.type === 'addRouteEvent') {
          route.push('event' + action.index);
        } else if (action.type === 'addRouteMaterial') {
          route.push('mat' + action.mat);
        } else if (action.type === 'addRouteSkill') {
          route.push(`skill${action.id}-${action.index}`);
        } else if (action.type === 'addRouteAsce') {
          route.push(`asce${action.id}`);
        }
        newRoutes[state.currentTab] = route;
        return {
          ...state,
          routes: newRoutes,
          yPositions,
        };
      case 'changeTab':
        yPositions[state.currentTab] = window.scrollY;
        return {
          ...state,
          currentTab: action.tab,
          yPositions,
        };
      default:
        return state;
    }
  }

  getServantConfig(id) {
    return this.getState().servantConfigs[id];
  }

  getCurrentContent() {
    const state = this.getState();
    const lastRoute = state.routes[state.currentTab].slice().pop();
    const r = {
      tab: state.currentTab,
    };
    if (lastRoute) {
      if (lastRoute.includes('servant')) {
        r.servant = mats.find(s => s.id === lastRoute.substr(7));
      } else if (lastRoute.includes('mat')) {
        r.mat = lastRoute.substr(3);
      } else if (lastRoute.includes('event')) {
        r.event = events[parseInt(lastRoute.substr(5))];
      } else if (lastRoute.includes('skill')) {
        const pair = lastRoute.substr(5).split('-');
        r.skill = {
          id: pair[0],
          index: parseInt(pair[1]),
        };
      } else if (lastRoute.includes('asce')) {
        r.asce = {
          id: lastRoute.substr(4),
        };
      }
    }
    return r;
  }

  getCurrentTab() {
    return this.getState().currentTab;
  }

  getRoute() {
    const state = this.getState();
    return state.routes[state.currentTab].slice();
  }

  getMaterialConfigs() {
    return this.getState().materialConfigs;
  }

  getMaterialRequirements() {
    return this.getState().materialRequirements;
  }

  getEventMats() {
    return this.getState().eventMats;
  }

  getEventConfigs() {
    return this.getState().eventConfigs;
  }

  getTabYPosition() {
    return this.getState().yPositions[this.getCurrentTab()];
  }

  getFilterStatus() {
    const state = this.getState();
    const {currentTab} = state;
    if (currentTab !== 's' && currentTab !== 'm') {
      return null;
    }
    return state.filters[currentTab];
  }

}

export default new Store(Dispatcher);
