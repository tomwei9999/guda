import React, { Component } from 'react';
import {Container} from 'flux/utils';
import Store from '../Store.js';
import Actions from '../Actions.js';
import './Materials.css';
import './Events.css';
import Images from './Images.js';

const mats = require('../mats.json');

class Ascension extends Component {

  static getStores() {
    return [Store];
  }

  static calculateState() {
    const asce = Store.getCurrentContent().asce;
    return {
      servant: mats.find(s => s.id === asce.id),
    };
  }

  render() {
    const {servant, index} = this.state;
    return (
      <div>
        {
          [1,2,3,4].map(level => this._renderLevel(level))
        }
      </div>
    );
  }

  _renderLevel(level) {
    const {servant} = this.state;
    return <>
      <div className="Materials_cat">Level {level + 1}</div>
      <div className="Events_shop">
        {
          (servant.asce[level] || [{mat: 'Crystallized Lore', num: 1}]).map(m => {
            return (
              <div key={m.mat} className="Events_shopitem">
                <img
                  style={{ width: 48, height: 48, }}
                  src={Images[`Icon_Item_${m.mat.replace(/ |-/g, '_').replace(/'/g, '')}`]}
                />
                <div className="Events_shopitem_count">
                  {m.num}
                </div>
              </div>
            );
          })
        }
      </div>
    </>;
  }
}

export default Container.create(
  Ascension,
  {withProps: false}
);
