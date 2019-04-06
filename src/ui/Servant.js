import React, { Component } from 'react';

import URLUtils from '../utils/URLUtils.js';
import Store from '../Store.js';
import Actions from '../Actions.js';
import {Container} from 'flux/utils';
import Images from './Images.js';

const skillImages = require('../skillImages.json');
const skillConfigs = require('../skillConfigs.json');

const styles = ({
  text: {
    color: "black"
  },
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5",
  },
  sectionContainer: {
    backgroundColor: "#fff",
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  subContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    height: 48,
    justifyContent: "space-between"
  },
  skillSettings: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  skillLevel: {
    width: 60,
		textAlign: 'center',
  },
  header: {
    fontSize: 20,
    marginLeft: 12,
    marginRight: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  }
});

class Servant extends Component {

  static getStores() {
    return [Store];
  }


  static calculateState() {
    const currentContent = Store.getCurrentContent();
    const servant = currentContent.servant;
    return {
      id: servant.id,
      skillNames: servant.skillNames,
      config: Store.getServantConfig(servant.id),
    };
  }

  render() {
    return (<div>
        <div style={styles.header}>Ascension
        <a onClick={() => Actions.addRouteAsce(this.state.id)}>
          <img
            style={{ width: 20, height: 20, cursor: 'pointer', paddingTop: '8px'}}
            src={require("../misc_icons/info.png")}
          />
        </a></div>
        <div style={styles.sectionContainer}>{this._renderAscension()}</div>
        <div style={styles.header}>Skills</div>
        <div style={styles.sectionContainer}>
          {[0, 1, 2].map(i => this._renderSkill(i))}
        </div>
      </div>);
  }

    _renderAscension() {
      return [
        <div key="c" style={this._getSubContainerStyle(false)}>
          <div>Current Level</div>
          {this._renderLevel('AC', 0, 4)}
        </div>,
        <div key="t" style={this._getSubContainerStyle(true)}>
          <div style={styles.text}>Target Level</div>
          {this._renderLevel('AT', 0, 4)}
        </div>
      ];
    }

    _getBeautifulName(n) {
      const l = n.split(';');
      if (l[1] && l[1].length < 6) {
        return l[0] + ' ' + l[1];
      } else {
        return l[0];
      }
    }

    _renderSkill(index) {
      const {skillNames} = this.state;
      const skillName = skillNames[index + 1 + 's'] || skillNames[index + 1];
      const image = skillConfigs[skillName.split(';')[0]] ? Object.values(skillConfigs[skillName.split(';')[0]])[0].imagetype : null;
      return [
        <div key={index + "s"} style={this._getSubContainerStyle(index > 0)}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {image ?
            <img
              style={{ width: 32, height: 32, marginRight: 16}}
              src={Images[`Skill_Icon_${image.replace(/\s+/g, '_')}`]}
            />
            : null}
            {this._getBeautifulName(skillName)}
          </div>
          <a onClick={() => Actions.addRouteSkill(this.state.id, index)}>
            <img
              style={{ width: 20, height: 20, cursor: 'pointer', paddingTop: '4px'}}
              src={require("../misc_icons/info.png")}
            />
          </a>
        </div>,
        <div key={index + "c"} style={this._getSubContainerStyle(true)}>
          <div>Current Level</div>
          {this._renderLevel(`S${index + 1}C`, 1, 10)}
        </div>,
        <div key={index + "t"} style={this._getSubContainerStyle(true)}>
          <div style={styles.text}>Target Level</div>
          {this._renderLevel(`S${index + 1}T`, 1, 10)}
        </div>
      ];
    }

    _getSubContainerStyle(withBorder) {
      const borderStyle = withBorder
        ? {
            borderTopStyle: "solid",
            borderTopColor: "#CED5D1",
            borderTopWidth: 0.5
          }
        : {};
      return {
        ...borderStyle,
        ...styles.subContainer
      };
    }

  _renderLevel(key, min, max) {
		const val = this.state.config[key];
    return (
      <div style={styles.skillSettings}>
        <a onClick={() => this._onMinus(key, val - 1, min)}>
          <img
            style={{ width: 28, height: 28, cursor: 'pointer'}}
            src={require("../misc_icons/minus.png")}
          />
        </a>
        <div style={styles.skillLevel}>{val}</div>
        <a onClick={() => this._onPlus(key, val + 1, max)}>
          <img
            style={{ width: 24, height: 24, cursor: 'pointer'}}
            src={require("../misc_icons/plus.png")}
          />
        </a>
      </div>
    );
  }

	_onMinus(key, newVal, min) {
		if (newVal >= min) {
      const newConfig = {...this.state.config, [key]: newVal};
      if (key.endsWith('T')) {
        const currentKey = key.substr(0, key.length - 1) + 'C';
        if (newVal < newConfig[currentKey]) {
          newConfig[currentKey] = newVal;
        }
      }
      Actions.servantUpdate(this.state.id, newConfig);
		}
	}

	_onPlus(key, newVal, max) {
		if (newVal <= max) {
      const newConfig = {...this.state.config, [key]: newVal};
      if (key.endsWith('C')) {
        const targetKey = key.substr(0, key.length - 1) + 'T';
        if (newVal > newConfig[targetKey]) {
          newConfig[targetKey] = newVal;
        }
      }
      Actions.servantUpdate(this.state.id, newConfig);
		}
	}
}

export default Container.create(
  Servant,
  {withProps: true}
);
