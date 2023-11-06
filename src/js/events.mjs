import { app } from './app.mjs';

const onAuctionCreated = () => {
  app.auctions.AuctionCreated({}, (error, event) => {
    if (!error) {
      const id = event.args.id.toNumber();
      if (event.args.owner.toLowerCase() !== app.account.toLowerCase() && !app.loading) {
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

const onPlacedBid = () => {
  app.auctions.PlacedBid({}, (error, event) => {
    if (!error && app.account.toLowerCase() !== event.args.bidder.toLowerCase() && !app.loading) {
      const id = event.args.id.toNumber();
      const amount = (event.args.currentPrice.toNumber() / 100).toFixed(2);
      $(`.activeTemplate[name=${id}] .currentPrice`).html(amount);
      $(`.active-auctions .enter-bid[name=${id}]`).attr('min', (+amount + 0.01).toFixed(2));
    } else {
      console.error(error);
    }
  });
};

export { onAuctionCreated, onPlacedBid };
