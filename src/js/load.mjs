import { app, render } from './app.mjs';
import { onAuctionCreated } from './events.mjs';

const loadAccount = async () => {
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    app.account = accounts[0];
  } catch (ex) {
    console.log(ex);
  }
};

const toggleLoaders = (bool, loader, content) => {
  if (bool) {
    loader.show();
    content.hide();
  } else {
    loader.hide();
    content.show();
  }
};

const loadContract = async () => {
  const Auctions = await $.getJSON('Auctions.json');
  app.contracts.auctions = TruffleContract(Auctions);
  app.contracts.auctions.setProvider(ethereum);
  app.auctions = await app.contracts.auctions.deployed();
};

const loadTemplates = () => {
  app.activeTemplate = $('.activeTemplate');
  app.stopTemplate = $('.stopTemplate');
};

const loadApp = async () => {
  await loadAccount();
  await loadContract();
  loadTemplates();
  await render();
  onAuctionCreated();
};

export {
  loadAccount,
  toggleLoaders,
  loadContract,
  loadTemplates,
  loadApp
};

