class App {
  constructor() {
    this.loading = false;
    this.contracts = {};
  }

  setLoading(bool) {
    this.loading = bool;
    const loader = $('#loader');
    const content = $('tbody');

    if (bool) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  }
}

const app = new App();

const loadApp = async () => {
  await loadAccount();
  await loadContract();
  await render();
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

$('#add-auction-btn').click(() => createAuction());

const render = async () => {
  if (app.loading) return;

  app.setLoading(true);
  $('.account').html(`Loggged as: ${app.account}`);
  await renderAuctions();
  app.setLoading(false);
};

const createAuction = async () => {
  try {
    app.setLoading(true);
    const title = $('#title').val();
    const description = $('#description').val();
    const price = Math.round(parseFloat($('#price').val()) * 100);

    if (title && description && price) {
      await app.auctions.createAuction(title, description, price, { from: app.account });
    }

    window.location.reload();
  } catch (error) {
    console.error(error);
  } finally {
    app.setLoading(false);
  }
};


const renderAuctions = async () => {
  const auctionCount = await app.auctions.auctionCount();
  const auctionTemplate = $('.auctionTemplate');

  for (let i = 1; i <= auctionCount; i++) {
    const auction = await app.auctions.auctions(i);
    const id = auction[0].toNumber();
    const owner = auction[1];
    const title = auction[2];
    const description = auction[3];
    const currentPrice = auction[5].toNumber();
    const end = auction[6];

    const newAuctionTemplate = auctionTemplate.clone();

    newAuctionTemplate.find('.title').html(title);
    newAuctionTemplate.find('.description').html(description);
    newAuctionTemplate.find('.currentPrice').html((currentPrice / 100).toFixed(2));

    if (owner.toLowerCase() == app.account.toLowerCase()) {
      newAuctionTemplate.find('.enter-bid')
        .prop('name', id);

      newAuctionTemplate.find('.bid-btn')
        .prop('name', id);

      newAuctionTemplate.find('.stop-bid-btn')
        .prop('name', id)
        .removeProp('disabled');
    }
    else {
      newAuctionTemplate.find('.enter-bid')
        .prop('name', id)
        .prop('min', (currentPrice / 100 + 0.01).toFixed(2))
        .removeProp('disabled');

      newAuctionTemplate.find('.bid-btn')
        .prop('name', id)
        .removeProp('disabled');
    }

    $('tbody').append(newAuctionTemplate);
    newAuctionTemplate.show();
  }
};

const placeBid = async (id) => {
  try {
    const newPrice = Math.round(parseFloat($(`.enter-bid[name=${id}]`).val()) * 100);
    if (!newPrice || !id) return;
    app.setLoading(true);

    await app.auctions.PlaceBid(id, newPrice, { from: app.account });
    await delay(500);
  } catch (ex) {
    console.error(ex);
  } finally {
    app.setLoading(false);
    window.location.reload();
  }
};

const stopAuction = async (id) => {
  try {
    console.log(id);
    app.setLoading(true);
    await app.auctions.stopAuction(id, { from: app.account });
    await delay(500);
  } catch (ex) {
    console.log(ex);
  } finally {
    app.setLoading(false);
  }
};

$(window).load(() => loadApp());
$(document).on('click','.bid-btn', (e) => placeBid(e.target.name));
$(document).on('click','.stop-bid-btn', (e) => stopAuction(e.target.name));
