class App {
  constructor() {
    this.loading = false;
    this.contracts = {};
    this.activeTemplate = '';
    this.stopTemplate = '';
  }

  setLoading(bool) {
    this.loading = bool;
    const loader = $('#loader');
    const content = $('.active-auctions');

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
  loadTemplates();
  await render();
  onAuctionCreated();
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

const loadTemplates = () => {
  app.activeTemplate = $('.activeTemplate');
  app.stopTemplate = $('.stopTemplate');
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

    for (let i = 1; i <= auctionCount; i++) {
      const auction = await app.auctions.auctions(i);
      const id = auction[0].toNumber();
      const owner = auction[1];
      const title = auction[2];
      const description = auction[3];
      const startPrice = (auction[4].toNumber() / 100).toFixed(2);
      const endPrice = (auction[5].toNumber() / 100).toFixed(2);
      const end = auction[6];

      if (!end) {
        const newActiveTemplate = app.activeTemplate.clone();

        newActiveTemplate.find('.title').html(title);
        newActiveTemplate.find('.description').html(description);

        const currentPrice = auction[5].toNumber();
        newActiveTemplate.find('.currentPrice').html((currentPrice / 100).toFixed(2));

        if (owner.toLowerCase() == app.account.toLowerCase()) {
          newActiveTemplate.find('.enter-bid')
            .prop('name', id);

          newActiveTemplate.find('.bid-btn')
            .prop('name', id);

          newActiveTemplate.find('.stop-bid-btn')
            .prop('name', id)
            .removeProp('disabled');
        }
        else {
          newActiveTemplate.find('.enter-bid')
            .prop('name', id)
            .prop('min', (currentPrice / 100 + 0.01).toFixed(2))
            .removeProp('disabled');

          newActiveTemplate.find('.bid-btn')
            .prop('name', id)
            .removeProp('disabled');
        }

        $('.active-auctions').append(newActiveTemplate);
        newActiveTemplate.show();
      } else {
        const newStopTemplate = app.stopTemplate.clone();

        newStopTemplate.find('.title').html(title);
        newStopTemplate.find('.description').html(description);

        const lastBid = await app.auctions.getLastBidIndex(i);

        if (lastBid.toNumber() - 1 < 0) {
          newStopTemplate.find('.auctionWinner').html('-');
          newStopTemplate.find('.startPrice').html(startPrice);
          newStopTemplate.find('.endPrice').html('-');
        } else {
          const bid = await app.auctions.bids(i, lastBid.toNumber() - 1);

          newStopTemplate.find('.auctionWinner').html(bid.bidder);
          newStopTemplate.find('.startPrice').html(startPrice);
          newStopTemplate.find('.endPrice').html(endPrice);
        }

        $('.stop-auctions').append(newStopTemplate);
        newStopTemplate.show();
      }
    }
};

const placeBid = async (id) => {
  try {
    const newPrice = Math.round(parseFloat($(`.enter-bid[name=${id}]`).val()) * 100);
    if (!newPrice || !id) return;
    app.setLoading(true);

    await app.auctions.placeBid(id, newPrice, { from: app.account });
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
  } catch (ex) {
    console.log(ex);
  } finally {
    app.setLoading(false);
    window.location.reload();
  }
};

const onAuctionCreated = () => {
  app.auctions.AuctionCreated({}, (error, event) => {
    if (!error) {
      const id = event.args.id.toNumber();
      if (event.args.owner.toLowerCase() !== app.account.toLowerCase() && !app.loading) {
        const activeTemplate = $('.activeTemplate');
        const title = event.args.title;
        const description = event.args.description;
        const currentPrice = event.args.startPrice.toNumber();

        const newActiveTemplate = app.activeTemplate.clone();

        newActiveTemplate.find('.title').html(title);
        newActiveTemplate.find('.description').html(description);

        newActiveTemplate.find('.currentPrice').html((currentPrice / 100).toFixed(2));

        newActiveTemplate.find('.enter-bid')
            .prop('name', id)
            .prop('min', (currentPrice / 100 + 0.01).toFixed(2))
            .removeProp('disabled');

        newActiveTemplate.find('.bid-btn')
          .prop('name', id)
          .removeProp('disabled');

        $('.active-auctions').append(newActiveTemplate);
        newActiveTemplate.show();
      }
    } else {
      console.error(error);
    }
  });
};

$(window).load(() => loadApp());
$(document).on('click','.bid-btn', (e) => placeBid(e.target.name));
$(document).on('click','.stop-bid-btn', (e) => stopAuction(e.target.name));
