import React, { Component } from 'react';
import {Container} from 'flux/utils';
import Store from '../Store.js';
import Actions from '../Actions.js';
import './Materials.css';
import '../App.css';
import Images from './Images.js';

const materials = require('../materials.json');

const MAT = 'mat';
const GEM = 'gem';
const PIECE = 'piece';

class Materials extends Component {

  state = {
    tab: MAT,
  };

  static getStores() {
    return [Store];
  }

  static calculateState() {
    return {
      matConfigs: Store.getMaterialConfigs(),
      matReq: Store.getMaterialRequirements(),
      eventMats: Store.getEventMats(),
      filterStatus: Store.getFilterStatus(),
    };
  }

  render() {
    return (
      <>
        <div className="App_sticky" style={{height: 32}}>
          {[MAT, GEM, PIECE].map(tab => {
            return <button onClick={() => this.setState({tab})}>{tab}</button>
          })}
        </div>
      <div className="Servants_List" style={{paddingTop: 32}}>
        {this._render()}
      </div>
      </>
    );
  }

  _render() {
    switch (this.state.tab) {
      case MAT:
        return this._renderMats(['bronze', 'silver', 'gold']);
      case GEM:
        return this._renderMats(['gems', 'magicGems', 'secretGems']);
      case PIECE:
        return this._renderMats(['pieces', 'monuments']);
    }
  }

  _renderMats(groups) {
    const {matConfigs, matReq, eventMats, filterStatus} = this.state;
    const l = [];
    groups.forEach((group, index) => {
      l.push(<div className="Materials_cat" key={index}>{group}</div>);
      materials[group].forEach(m => {
        const req = matReq[m];
        let total = 0;
        Object.values(req.asec).forEach(n => {
          total += n;
        });
        Object.values(req.skills).forEach(n => {
          total += n;
        });
        const stock = matConfigs[m];
        const event = eventMats[m] || 0;
        const t = (stock + event);
        if (filterStatus && t >= total) {
          return;
        }
        l.push(
          <div className="Materials_mat" key={m} onClick={() => Actions.addRouteMaterial(m)}>
            <div className="Materials_matIcon">
              <img
                style={{ width: 36, height: 36, }}
                src={Images[`Icon_Item_${m.replace(/[ |-]/g, '_').replace(/'/g, '')}`]}
              />
            </div>
            <div className="Materials_matRight">
              <div>{m}</div>
              <div className="Materials_matInput" style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              textAlign: 'left',}}>
                <span><span>库存: </span><input
                  onClick={ev =>ev .stopPropagation()}
                  placeholder="0"
                  type="text"
                  value={stock || ''}
                  onChange={ev => Actions.materialUpdate(m, parseInt(ev.target.value) || 0)}
                />
                </span>
                <div>活动: {event}</div>
                  <div></div>
              </div>
              <div style={{
                color: t > total ? 'green' : (t == total ? 'black' : 'red'),
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                textAlign: 'left',
              }}>
                <div>总计: {t}</div>
                <div>需求: {total}</div>
                <div>剩余: {t - total}</div>
              </div>
            </div>
          </div>
        );
      })
    });
    return l;
  }
}

export default Container.create(
  Materials,
  {withProps: false}
);
