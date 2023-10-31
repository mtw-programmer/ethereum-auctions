class App {
  constructor() {
    this.loading = false;
    this.contracts = {};
  }
}

const app = new App();

const loadApp = async () => {
  await loadAccount();
  await loadContract();
};

const loadAccount = async () => {
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    app.account = accounts[0];
  } catch (ex) {
    console.log(ex);
  }
};

const loadContract = async () => {
  const Auctions = await $.getJSON('Auctions.json');
  app.contracts.auctions = TruffleContract(Auctions);
  app.contracts.auctions.setProvider(ethereum);
  app.auctions = await app.contracts.auctions.deployed();
};

$(window).load(() => loadApp());