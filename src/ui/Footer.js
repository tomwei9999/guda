import React, { Component } from 'react';
import './Footer.css';
import {Container} from 'flux/utils';
import Store from '../Store.js';
import Actions from '../Actions.js';

class Footer extends Component {

  static getStores() {
    return [Store];
  }


  static calculateState() {
    return {
      currentTab: Store.getCurrentTab(),
    };
  }

  render() {
    return (
      <div className="Footer_vert">
        <div className="Footer">
          {this._renderSectionButton('s')}
          {this._renderSectionButton('m')}
          {this._renderSectionButton('e')}
        </div>
      </div>
    );
  }

  _renderSectionButton(s) {
    const className = s === this.state.currentTab ? 'Footer_col active' : 'Footer_col';
    const onClick = () => Actions.changeTab(s);
    switch(s) {
      case 's':
        return <div onClick={onClick} className={className}>从者</div>;
      case 'm':
        return <div onClick={onClick} className={className}>素材</div>;
      case 'e':
        return <div onClick={onClick} className={className}>活动</div>;
    }
  }

}

export default Container.create(
  Footer,
  {withProps: false}
);
