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
  const auction = await app.auctions.auctions(i);
  const id = auction[0].toNumber();
  const owner = auction[1];
  const title = auction[2];
  const description = auction[3];
  const startPrice = (auction[4].toNumber() / 100).toFixed(2);
  const endPrice = (auction[5].toNumber() / 100).toFixed(2);
  const end = auction[6];

  return { auction, id, owner, title, description, startPrice, endPrice, end };
};

const renderAuctions = async () => {
  try {
    const auctionCount = await app.auctions.auctionCount();

    for (let i = 1; i <= auctionCount; i++) {
      const { auction, id, owner,
        title, description, startPrice,
        endPrice, end } = await getAuction(i);

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
  } catch (ex) {
    console.error(ex);
  }
};

export { render };