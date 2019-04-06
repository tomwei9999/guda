import './Events.css';
import './Servants.css';
import {Container} from 'flux/utils';
import Actions from '../Actions.js';
import React, { Component } from 'react';
import Servant from './Servant.js';
import Store from '../Store.js';
import Images from './Images.js';

const mats = require('../mats.json');

export default class Servants extends Component {
  state = {
    search: '',
  };

  render() {
    const {search} = this.state;
    return (
      <>
      <div className="App_sticky Servants_SearchBar" style={{height: 42}}>
        Search:<input className="Servants_SearchInput" value={search} onChange={v => this.setState({search: v.target.value.toLowerCase()})} type="text" />
      </div>
        <div className="Servants_List" style={{paddingTop: 42}}>
          {(search ? mats.filter(s => s.name.toLowerCase().includes(search)):mats).map(this._renderListItem)}
        </div>
      </>
    );
  }

  _renderListItem = servant => {
    return (
      <div key={servant.id} className="Servants_ListItem" onClick={() => Actions.addRouteServant(servant.id)}>
        <div className="Servants_ListItemText Servants_ListItemIcon Events_shopitem">
          <img
            className="Servants_ListItemIconIcon"
            style={{ width: 60, height: 60, }}
            src={Images[`Icon_Servant_${servant.id}`]} />
          <div className="Servants_ItemID">
            {servant.id}
          </div>
        </div>

        <div className="Servants_ListItemText Servants_ListItemName">{servant.name}</div>
        <div className="Servants_ListItemText Servants_ListItemClass">
          <img
            style={{ width: 36, height: 36, }}
            src={Images[`Icon_Class_${servant.class.replace(/-/g, '_')}_Gold`]}
          />
        </div>
      </div>
    );
  };

}
