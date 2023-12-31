import { app } from './app.mjs';

const render = async () => {
  try {
    if (app.loading) return;

    app.setLoading(true, true);
    $('.account').html(`Loggged as: ${app.account}`);
    await renderAuctions();
    app.setLoading(false, false);
  } catch (ex) {
    console.error(ex);
  }
};

const getAuction = async (i) => {
  try {
    const auction = await app.auctions.auctions(i);
    const id = auction[0].toNumber();
    const owner = auction[1];
    const title = auction[2];
    const description = auction[3];
    const startPrice = (auction[4].toNumber() / 100).toFixed(2);
    const endPrice = (auction[5].toNumber() / 100).toFixed(2);
    const end = auction[6];

    return { i, auction, id, owner, title, description, startPrice, endPrice, end };
  } catch (ex) {
    console.error(ex);
  }
};

const renderActiveAuctions = async (properties) => {
  try {
    const newActiveTemplate = app.activeTemplate.clone();

      newActiveTemplate.attr('name', properties.id);
      newActiveTemplate.find('.title').html(properties.title);
      newActiveTemplate.find('.description').html(properties.description);

      newActiveTemplate.find('.currentPrice').html(properties.endPrice);

      if (properties.owner.toLowerCase() == app.account.toLowerCase()) {
        newActiveTemplate.find('.enter-bid')
          .prop('name', properties.id);

        newActiveTemplate.find('.bid-btn')
          .prop('name', properties.id);

        newActiveTemplate.find('.stop-bid-btn')
          .prop('name', properties.id)
          .removeProp('disabled');
      }
      else {
        newActiveTemplate.find('.enter-bid')
          .prop('name', properties.id)
          .prop('min', (+properties.endPrice + 0.01).toFixed(2))
          .removeProp('disabled');

        newActiveTemplate.find('.bid-btn')
          .prop('name', properties.id)
          .removeProp('disabled');
      }

      $('.active-auctions').append(newActiveTemplate);
      newActiveTemplate.show();
  } catch (ex) {
    console.error(ex);
  }
};

const renderEndAuctions = async (properties) => {
  try {
    const newStopTemplate = app.stopTemplate.clone();

    newStopTemplate.find('.title').html(properties.title);
    newStopTemplate.find('.description').html(properties.description);

    const lastBid = await app.auctions.getLastBidIndex(properties.id);

    if (lastBid.toNumber() - 1 < 0) {
      newStopTemplate.find('.auctionWinner').html('-');
      newStopTemplate.find('.startPrice').html(properties.startPrice);
      newStopTemplate.find('.endPrice').html('-');
    } else {
      const bid = await app.auctions.bids(properties.id, lastBid.toNumber() - 1);

      newStopTemplate.find('.auctionWinner').html(bid.bidder);
      newStopTemplate.find('.startPrice').html(properties.startPrice);
      newStopTemplate.find('.endPrice').html(properties.endPrice);
    }

    $('.stop-auctions').append(newStopTemplate);
    newStopTemplate.show();
  } catch (ex) {
    console.error(ex);
  }
}

const renderAuctions = async () => {
  try {
    const auctionCount = await app.auctions.auctionCount();

    for (let i = 1; i <= auctionCount; i++) {
      const properties = await getAuction(i);

      if (!properties.end)
        await renderActiveAuctions(properties);
      else
        await renderEndAuctions(properties);
    }
  } catch (ex) {
    console.error(ex);
  }
};

export { render, renderEndAuctions };