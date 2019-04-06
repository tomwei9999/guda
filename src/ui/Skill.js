import React, { Component } from 'react';
import {Container} from 'flux/utils';
import Store from '../Store.js';
import Actions from '../Actions.js';
import './Materials.css';
import './Events.css';
import './Skill.css';
import Images from './Images.js';

const mats = require('../mats.json');
const skillConfigs = require('../skillConfigs.json');
/*
l = [...skilltable.children].map(tr => ({title: tr.firstElementChild.firstElementChild.title, rank: tr.children[1].innerText,effect: tr.children[3].innerText, image: tr.getElementsByClassName('image')[0].href.substr(tr.getElementsByClassName('image')[0].href.indexOf('Skil'))}));
r = {};
l.forEach(li => {
  if (!r[li.title]) {
    r[li.title] = {image: li.image}
  };
  r[li.title][li.rank] = li.effect;
});
*/

class Skill extends Component {

  static getStores() {
    return [Store];
  }

  static calculateState() {
    const skill = Store.getCurrentContent().skill;
    return {
      servant: mats.find(s => s.id === skill.id),
      index: skill.index,
    };
  }

  componentDidMount() {
    window.scrollTo(0,0);
  }

  _renderSkillDesc(skillName) {
    if (!skillName) {
      return <div></div>;
    }
    const keys = skillName.split(';');
    let rank = keys[1];
    if (
      !rank ||
      rank.startsWith('A') ||
      rank.startsWith('B') ||
      rank.startsWith('C')||
      rank.startsWith('D')||
      rank.startsWith('E')||
      rank.startsWith('EX')||
      rank.startsWith('(')
    ) {
      ;
    } else {
      rank = '';
    }
    if (!skillConfigs[keys[0]])  {
      return skillName;
    }
    const skillConfig = Object.values(skillConfigs[keys[0]]).find(config => {
      return rank ? config.skilltier === rank : true;
    });
    if (!skillConfig) {
      return <div>{skillName}</div>
    }
    return (
      <>
        <div style={{
          padding: '8px 20px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
          <img
            style={{ width: 48, height: 48, marginRight: 16}}
            src={Images[`Skill_Icon_${skillConfig.imagetype.replace(/\s+/g, '_')}`]}
          />
          <div>
            <div>
              {skillConfig.skillname} {rank ? rank : null}
            </div>
            <div style={{fontWeight: 300}}>
              Cooldown: {skillConfig.cooldown1}/{skillConfig.cooldown2}/{skillConfig.cooldown3}
            </div>
          </div>
        </div>
          {/* <div>{JSON.stringify(skillConfig)}</div> */}
        {[1,2,3,4,5].map(i => this._renderDesc(i, skillConfig))}
      </>
    );
  }

  _renderDesc(effectIndex, skillConfig) {
    let effect = skillConfig['effect' + effectIndex];
    if (effect) {
      return (
        <div style={{
          borderTop: '1px solid #cccccc',
          padding: '4px 20px',
          lineHeight: '20px',
        }}>
          <div>{effect.replace(/\[Status Effects\|(.+)\]/, '$1')}</div>
            <div className="Skill_levelGrid">{[1,2,3,4,5,6,7,8,9,10].map(level => (
              <span style={{color: level === 6 || level === 10 ? 'red' : null}}>{skillConfig[`e${effectIndex}-lvl${level}`]}</span>
            ))}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    const {servant, index} = this.state;
    return (
      <div>
        <div className="Materials_cat">Pre-Strengthen</div>
        {this._renderSkillDesc(servant.skillNames[index + 1])}
        <div className="Materials_cat">Post-Strengthen</div>
        {this._renderSkillDesc(servant.skillNames[index + 1  + 's'])}
        {
          [1,2,3,4,5,6,7,8,9].map(level => this._renderLevel(level))
        }
      </div>
    );
  }

  _renderLevel(level) {
    const {servant} = this.state;
    return <>
      <div className="Materials_cat">Level {level} → {level + 1}</div>
      <div className="Events_shop">
        {
          (servant.skills[level] || [{mat: 'Crystallized Lore', num: 1}]).map(m => {
            return (
              <div key={m.mat} className="Events_shopitem">
                <img
                  style={{ width: 48, height: 48, }}
                  src={Images[`Icon_Item_${m.mat.replace(/[ |-]/g, '_').replace(/'/g, '')}`]}
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
  Skill,
  {withProps: false}
);
