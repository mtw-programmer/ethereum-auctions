import { toggleLoaders } from './load.mjs';
import { render } from './render.mjs';
import './listeners.mjs';

class App {
  constructor() {
    this.loading = false;
    this.contracts = {};
    this.activeTemplate = '';
    this.stopTemplate = '';
  }

  setLoading(active, end) {
    try {
      this.loading = active || end;
      let bool = active;
      let loader = $('#active-loader');
      let content = $('.active-auctions');

      toggleLoaders(bool, loader, content);

      bool = end;
      loader = $('#end-loader');
      content = $('#stop-auctions');

      toggleLoaders(bool, loader, content);
    } catch (ex) {
      console.error(ex);
    }
  }
}

const app = new App();

export { app, render };
