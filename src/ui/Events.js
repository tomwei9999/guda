import React, { Component } from 'react';
import {Container} from 'flux/utils';
import Store from '../Store.js';
import Actions from '../Actions.js';
import './Events.css';
import Images from './Images.js';


const materials = require('../materials.json');
const events = require('../events.json');

const MAT = 'mat';
const GEM = 'gem';
const PIECE = 'piece';

/*
JSON.stringify(document.getElementById('wpTextbox1').innerHTML.split('\n').filter(l => l.includes('Shopline')).map(l=>l.match(/.+Shopline\|([^\|]+)\|\d+\|(\d+).+/)).map(l => l ?[ l[1],l[2]] : null).filter(l => l ))
*/
// JSON.stringify(s.map(l=>l.match(/.+\|([^\|]+)\|(\d+).*/)).map(l => l ?[ l[1],l[2]] : null).filter(l => l ))
/*
{
    "井盖": "Proof of Hero",
    "凶骨": "Evil Bone",
    "龙牙": "Dragon Fang",
    "黑灰": "Void's Dust",
    "锁链": "Fool's Chain",
    "毒针": "Deadly Poisonous Needle",
    "髓液": "Magical Cerebrospinal Fluid",
    "铁钉": "Iron Stake of the Weeping Dusk",
    "火药": "Volatile Gunpowder",
    "核桃": "Seed of Yggdrasil",
    "鬼灯": "Ghost Lantern",
    "八连": "Octuplet Crystals",
    "蛇眼": "Serpent Jewel",
    "羽毛": "Phoenix Feather",
    "齿轮": "Eternal Gear",
    "书页": "Forbidden Page",
    "血瓶": "Homunculus Baby",
    "蹄铁": "Meteor Horseshoe",
    "勋章": "Great Knight Medal",
    "贝壳": "Shell of Reminiscence",
    "勾玉": "Elegant Magatama",
    "冰块": "Permafrost",
    "指环": "Giant's Ring",
    "极光钢": "Aurora Steel",
    "铃铛": "Old-fashioned Bell",
    "爪子": "Claw of Chaos",
    "心脏": "Heart of the Foreign God",
    "龙鳞": "Dragon's Reverse Scale",
    "精灵根": "Spirit Root",
    "马角": "Warhorse's Young Horn",
    "泪石": "Tearstone of Blood",
    "黑兽脂": "Black Beast Grease",
    "神灯": "Lamp of Evil-Sealing",
    "甲虫": "Scarab of Wisdom",
    "胎毛": "Primordial Lanugo",
    "胆石": "Cursed Beast Gallstone",
    "神酒": "Bizarre Godly Wine",
    "炉心": "Gyoukou Core"
}
JSON.stringify(events.map(e=>{
	r = {shop: {}, lottery: {}, name: e.name};
	mats.forEach(mat => {
		if (e[mat].includes('N')) {r.lottery[mat] = parseInt(e[mat]);} else if (e[mat]) {r.shop[mat] = parseInt(e[mat]);}
	});
	return r;
}))
*/


class Events extends Component {

  static getStores() {
    return [Store];
  }

  static calculateState() {
    return {
      eventConfigs: Store.getEventConfigs(),
      currentContent: Store.getCurrentContent(),
      materialConfigs: Store.getMaterialConfigs(),
    };
  }

  render() {
    return (
      <div className="Servants_List">
        {this._render()}
      </div>
    );
  }

  _render() {
    const {materialConfigs, currentContent, eventConfigs} = this.state;
    if (currentContent.event) {
      return (<>
        <div className="Materials_cat">Shop</div>
        <div className="Events_shop">
          {Object.keys(this.state.currentContent.event.shop).map(k => {
            return (
              <div className="Events_shopitem"><img
                style={{ width: 52, height: 52, }}
                src={Images[`Icon_Item_${k.replace(/[ |-]/g, '_').replace(/'/g, '')}`]}
              /><div className="Events_shopitem_count">{this.state.currentContent.event.shop[k]}</div></div>
            );
          })}
        </div>
        <div className="Materials_cat">Lottery</div>
        <div className="Events_shop">
          {Object.keys(this.state.currentContent.event.lottery).map(k => {
            return (
              <div className="Events_shopitem"><img
                style={{ width: 52, height: 52, }}
                src={Images[`Icon_Item_${k.replace(/[ |-]/g, '_').replace(/'/g, '')}`]}
              /><div className="Events_shopitem_count">{this.state.currentContent.event.lottery[k]}</div></div>
            );
          })}
        </div>
      </>);
    }
    return events.map((event, index) => {
      return (
        <div key={event.name} className="Events_item" onClick={() => Actions.addRouteEvent(index)}>
          <div className="Events_itemname" >
            {event.name}
          </div>
          <div>{
            eventConfigs[index] ? <input checked type="checkbox" onClick={e => e.stopPropagation()} onChange={e => Actions.updateEvent(index, e.target.checked)} />
            :<input type="checkbox" onClick={e => e.stopPropagation()} onChange={e => Actions.updateEvent(index, e.target.checked)} />
          }</div>
        </div>
      );
    });
  }
}

export default Container.create(
  Events,
  {withProps: false}
);
