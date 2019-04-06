import React, { Component } from 'react';
import {Container} from 'flux/utils';
import Store from '../Store.js';
import Actions from '../Actions.js';
import './Materials.css';
import './Events.css';
import Images from './Images.js';

const materials = require('../materials.json');

class Material extends Component {

  static getStores() {
    return [Store];
  }

  static calculateState(prevState) {
    const mat = Store.getCurrentContent().mat;
    return {
      filterOn: prevState ? prevState.filterOn : true,
      matReq: Store.getMaterialRequirements()[mat],
    };
  }

  render() {
    const {filterOn, matReq} = this.state;
    const asec = filterOn ? matReq.asec : matReq.asecAll;
    const skills = filterOn ? matReq.skills : matReq.skillsAll;
    let asecTotal = 0;
    let skillTotal = 0;
    const asecServants = Object.keys(asec).sort().map(sid => {
      asecTotal += asec[sid];
      return (
        <div key={sid} className="Events_shopitem" onClick={() => Actions.addRouteServant(sid)}>
          <img
            style={{ width: 70, height: 70, }}
            src={Images[`Icon_Servant_${sid}`]}
          />
          <div className="Events_shopitem_count">
            {asec[sid]}
          </div>
        </div>
      );
    });
    const skillServants = Object.keys(skills).sort().map(sid => {
      skillTotal += skills[sid];
      return (
        <div key={sid} className="Events_shopitem" onClick={() => Actions.addRouteServant(sid)}>
          <img
            style={{ width: 70, height: 70, }}
            src={Images[`Icon_Servant_${sid}`]}
          />
          <div className="Events_shopitem_count">
            {skills[sid]}
          </div>
        </div>
      );
    });
    return (
      <div>
        <input type="button" onClick={() => this.setState(prevState => ({filterOn: !prevState.filterOn}))} value={filterOn ? 'To All' : 'To Needed'} />
        <div className="Materials_cat">Ascensions ({asecTotal})</div>
        <div className="Events_shop">
          {asecServants}
        </div>
        <div className="Materials_cat">Skills ({skillTotal})</div>
        <div className="Events_shop">
          {skillServants}
        </div>
      </div>
    );
    return JSON.stringify(this.state.matReq);
  }
}

export default Container.create(
  Material,
  {withProps: false}
);
