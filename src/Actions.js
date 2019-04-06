
import Dispatcher from './Dispatcher.js';

const Actions = {
  servantUpdate(id, config) {
    Dispatcher.dispatch({
      type: 'servantUpdate',
      id,
      config,
    });
  },

  toggleFilter(tab) {
    Dispatcher.dispatch({type: 'toggleFilter', tab});
  },

  backRoute() {
    Dispatcher.dispatch({type: 'backRoute'});
  },

  changeTab(tab) {
    Dispatcher.dispatch({type: 'changeTab', tab});
  },

  addRouteSkill(id, index) {
    Dispatcher.dispatch({type: 'addRouteSkill', id, index});
  },

  addRouteAsce(id) {
    Dispatcher.dispatch({type: 'addRouteAsce', id});
  },

  addRouteServant(id) {
    Dispatcher.dispatch({type: 'addRouteServant', id});
  },

  addRouteEvent(index) {
    Dispatcher.dispatch({type: 'addRouteEvent', index});
  },

  addRouteMaterial(mat) {
    Dispatcher.dispatch({type: 'addRouteMaterial', mat});
  },

  materialUpdate(mat, val) {
    Dispatcher.dispatch({
      type: 'materialUpdate',
      mat,
      val,
    });
  },

  updateEvent(eventIndex, val) {
    Dispatcher.dispatch({
      type: 'eventsUpdate',
      eventIndex,
      val,
    });
  },
};

export default Actions;
