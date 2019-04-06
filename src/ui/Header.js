import React, { Component } from 'react';
import {Container} from 'flux/utils';
import './Header.css';
import Store from '../Store.js';
import Actions from '../Actions.js';


class Header extends Component {
  static getStores() {
    return [Store];
  }

  static calculateState() {
    return {
      currentContent: Store.getCurrentContent(),
      route: Store.getRoute(),
      filterStatus: Store.getFilterStatus(),
    };
  }

  render() {
    return (
      <div className="Header_root">
        {this._renderBackButton()}
        {this._renderFilterButton()}
        <div className="Header_title">{this._renderTitle()}</div>
        <div/>
      </div>
    );
  }

  _renderFilterButton() {
    if (this.state.route.length > 0 || this.state.filterStatus == null) {
      return null;
    }
    return (
      <div
        onClick={() => Actions.toggleFilter(this.state.currentContent.tab)}
        style={{cursor: 'pointer'}}>
        <img
          style={{ width: 32}}
          src={this.state.filterStatus ? require(`../misc_icons/filter_on.png`) : require(`../misc_icons/filter_off.png`)}
        />
      </div>
    );
  }

  _renderTitle() {
    const {currentContent} = this.state;
    if (currentContent.servant) {
      return currentContent.servant.name;
    }
    if (currentContent.mat) {
      return currentContent.mat;
    }
    if (currentContent.skill) {
      return 'Skill ' + (currentContent.skill.index + 1);
    }
    if (currentContent.asce) {
      return 'Ascension';
    }
    switch (currentContent.tab) {
      case 's':
        return 'Servants';
      case 'm':
        return 'Materials';
      case 'e':
        return 'Events';
      case 'r':
        return 'Requirements';
    }
  }

  _renderBackButton() {
    if (this.state.route.length === 0) {
      return null;
    }
    return (
      <div onClick={() => Actions.backRoute()} style={{cursor: 'pointer'}}>
        <img
          style={{ width: 20, height: 20, }}
          src={require(`../misc_icons/back.png`)}
        />
      </div>)
    ;
  }
}

export default Container.create(
  Header,
  {withProps: false}
);
