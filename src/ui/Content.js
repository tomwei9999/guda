import React, { Component } from 'react';
import {Container} from 'flux/utils';
import Store from '../Store.js';
import Servant from './Servant.js';
import Materials from './Materials.js';
import Material from './Material.js';
import Servants from './Servants.js';
import Events from './Events.js';
import Skill from './Skill.js';
import Ascension from './Ascension.js';


class Content extends Component {

  static getStores() {
    return [Store];
  }


  static calculateState(prevState) {
    return {
      currentContent: Store.getCurrentContent(),
      route: Store.getRoute(),
    };
  }

  componentDidUpdate(_, presvState) {
    if (this.state.route.length === 0 && this.state.route.length !== presvState.route.length) {
      window.scrollTo(0, Store.getTabYPosition());
    }
  }

  render() {
    return (
      <div>
        {this._renderContent()}
      </div>
    );
  }

  _renderContent() {
    const {currentContent} = this.state;
    let subView = null;
    if (currentContent.servant) {
      subView = <Servant />;
    }
    if (currentContent.mat) {
      subView = <Material />;
    }
    if (currentContent.skill) {
      subView = <Skill />;
    }
    if (currentContent.asce) {
      subView = <Ascension />;
    }
    let view = null;
    switch(currentContent.tab) {
      case 's':
        view =  <Servants />;
        break;
      case 'm':
        view =  <Materials />;
        break;
      case 'e':
        view =  <Events />;
        break;
    }
    return (
      <>
        {subView}
        <div style={{display: subView ? 'none': 'block'}}>
          {view}
        </div>
      </>
    );
  }

}

export default Container.create(
  Content,
  {withProps: false}
);
