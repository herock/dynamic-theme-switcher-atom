'use babel';

import DynamicThemeSwitcherView from './dynamic-theme-switcher-view';
import { CompositeDisposable } from 'atom';

export default {

  dynamicThemeSwitcherView: null,
  modalPanel: null,
  subscriptions: null,
  intervalId: null,

  activate(state) {
    this.dynamicThemeSwitcherView = new DynamicThemeSwitcherView(state.dynamicThemeSwitcherViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.dynamicThemeSwitcherView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dynamic-theme-switcher:toggle': () => this.toggle()
    }));

    // Ten minuets
    var intervaltime = 600000
    // var intervaltime = 2000;
    this.intervalId = setInterval(
      this.setThemeTest, intervaltime);
  },

  deactivate() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.dynamicThemeSwitcherView.destroy();
  },

  serialize() {
    return {
      dynamicThemeSwitcherViewState: this.dynamicThemeSwitcherView.serialize()
    };
  },

  toggle() {
    // console.log('DynamicThemeSwitcher was toggled!');
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );

    // setInterval(function(){
    //   var that = this;
    //   setThemeTest();
    //   console.log('log');
    // },2000);

    // if (intervalId) {
    //   atom.notifications.addSuccess('dynamic-theme-switcher is OFF');
    //   clearInterval(intervalId);
    //   this.intervalId = null;
    // } else {
    //   atom.notifications.addSuccess('dynamic-theme-switcher is ON');
    //   this.intervalId= setInterval(this.setThemeTest, 3000);
    // };

  },

  setThemeTest() {
    activeThemes = atom.config.get('core.themes');
    console.log("activeThemes:");
    console.log(activeThemes);
    var lightThemes = ["one-light-ui", "one-light-syntax"];
    var darkThemes = ["one-dark-ui", "one-dark-syntax"];
    console.log(lightThemes);
    console.log(activeThemes[0] != lightThemes[1] && activeThemes[1] != lightThemes[1]);

    now = new Date(Date.now());
    hour = now.getHours();
    // second = now.getSeconds();
    // console.log("second is: ");
    // console.log(second);
    if (hour > 7 && hour <= 19) {
      if (
        activeThemes[0] != lightThemes[1] && activeThemes[1] != lightThemes[1]
      ) {
        atom.config.set('core.themes', lightThemes);
        atom.notifications.addInfo('Theme set to: One Light');
      };
    } else {
      if (
        activeThemes[0] != darkThemes[1] && activeThemes[1] != darkThemes[1]
      ) {
        atom.config.set('core.themes', darkThemes);
        atom.notifications.addInfo('Theme set to: One Dark');
      };
    };
  },

  setTheme() {
    var running = this.running;
    now = new Date(Date.now());
    hour = now.getHours();
    if (hour > 7 && hour < 19) {
      atom.config.set(
        'core.themes', ['one-light-ui', 'one-light-syntax']
      );
      atom.notifications.addInfo('Theme set to: One Light');
    } else {
      atom.config.set(
        'core.themes', ['one-dark-ui', 'one-dark-syntax']
      );
      atom.notifications.addInfo('Theme set to: One Dark');
    };
  }

};
