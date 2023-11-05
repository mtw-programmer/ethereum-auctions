import { app, render } from './app.mjs';
import { onAuctionCreated } from './events.mjs';

const loadAccount = async () => {
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    app.account = accounts[0];
  } catch (ex) {
    console.error(ex);
  }
};

const toggleLoaders = (bool, loader, content) => {
  try {
    if (bool) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  } catch (ex) {
    console.error(ex);
  }
};

const loadContract = async () => {
  try {
    const Auctions = await $.getJSON('Auctions.json');
    app.contracts.auctions = TruffleContract(Auctions);
    app.contracts.auctions.setProvider(ethereum);
    app.auctions = await app.contracts.auctions.deployed();
  } catch (ex) {
    console.error(ex);
  }
};

const loadTemplates = () => {
  app.activeTemplate = $('.activeTemplate');
  app.stopTemplate = $('.stopTemplate');
};

const loadApp = async () => {
  try {
    await loadAccount();
    await loadContract();
    loadTemplates();
    await render();
    onAuctionCreated();
  } catch (ex) {
    console.error(ex);
  }
};

export { toggleLoaders, loadApp };
