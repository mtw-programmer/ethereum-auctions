const { assert } = require("chai");

const Auctions = artifacts.require('./Auctions.sol');

contract('Auctions', (accounts) => {
  before(async () => {
    this.auctions = await Auctions.deployed();
  });

  it('deploys successfully', async () => {
    const address = await this.auctions.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it('successfully creates an Auction', async () => {
    const result = await this.auctions.createAuction('Test title', 'Description', 1);
    const auctionCount = await this.auctions.auctionCount();
    assert.equal(auctionCount, 2);
    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), 2);
    assert.equal(event.owner, accounts[0]);
    assert.equal(event.title, 'Test title');
    assert.equal(event.description, 'Description');
    assert.equal(event.startPrice.toNumber(), 1);
  });

  it('successfully places a bid', async () => {
    const bidResult = await this.auctions.placeBid(1, 2, { from: accounts[1] });
    const { currentPrice } = bidResult.logs[0].args;

    const event = bidResult.logs[0].args;

    assert.equal(event.id.toNumber(), 1);
    assert.equal(event.bidder.toLowerCase(), accounts[1].toLowerCase());
    assert.equal(event.oldPrice.toNumber(), 1);
    assert.equal(currentPrice.toNumber(), 2);
    assert.equal(event.currentPrice.toNumber(), 2);
  });

  it('placing a bid should fail when too low id given', async () => {
    try {
      await this.auctions.placeBid(0, 3, { from: accounts[1] });
      assert.fail('Expected an error but did not get one!');
    } catch (ex) {
      assert.include(ex.message, 'Invalid auction ID');
    }
  });
  
  it('placing a bid should fail when too high id given', async () => {
    try {
      const auctionCount = await this.auctions.auctionCount();
      await this.auctions.placeBid(auctionCount + 1, 2, { from: accounts[1] });
      assert.fail('Expected an error but did not get one!');
    } catch (ex) {
      assert.include(ex.message, 'Invalid auction ID');
    }
  });
  
  it('fails when owner of the auction places a bid', async () => {
    try {
      await this.auctions.placeBid(1, 3, { from: accounts[0] });
      assert.fail('Expected an error but did not get one!');
    } catch (ex) {
      assert.include(ex.message, 'You cannot bid your own auctions!');
    }
  });
  
  it('fails when placing a bid amount is not higher by 1 unit', async () => {
    try {
      await this.auctions.placeBid(1, 2, { from: accounts[1] });
      assert.fail('Expected an error but did not get one!');
    } catch (ex) {
      assert.include(ex.message, 'Bid amounts should be greater by at least 1 unit!');
    }
  });

  it('successfully stops an auction', async () => {
    const result = await this.auctions.stopAuction(1, { from: accounts[0] });
    const event = result.logs[0].args;
    const auction = await this.auctions.auctions(1);

    assert.equal(event.id.toNumber(), 1);
    assert.equal(auction.end, true);
  });

  it('stopping an auction should fail when too low id given', async () => {
    try {
      await this.auctions.stopAuction(0, { from: accounts[0] });
      assert.fail('Expected an error but did not get one!');
    } catch (ex) {
      assert.include(ex.message, 'Invalid auction ID');
    }
  });

  it('stopping an auction should fail when too high id given', async () => {
    try {
      const auctionCount = await this.auctions.auctionCount();
      await this.auctions.stopAuction(auctionCount + 1, { from: accounts[0] });
      assert.fail('Expected an error but did not get one!');
    } catch (ex) {
      assert.include(ex.message, 'Invalid auction ID');
    }
  });

  it('stopping an auction should fail when the sender is not the owner of an auction', async () => {
    try {
      await this.auctions.stopAuction(1, { from: accounts[1] });
      assert.fail('Expected an error but did not get one!');
    } catch (ex) {
      assert.include(ex.message, 'You can stop only your auctions!');
    }
  });

  it('stopping an auction should fail when the auction is already stopped', async () => {
    try {
      await this.auctions.stopAuction(1, { from: accounts[0] });
      assert.fail('Expected an error but did not get one!');
    } catch (ex) {
      assert.include(ex.message, 'This auction is already stopped!');
    }
  });

  it('successfully returns last bid index', async () => {
    await this.auctions.placeBid(2, 5, { from: accounts[1] });
    const bid = await this.auctions.getLastBidIndex(1);
    assert.equal(bid.toNumber(), 1);
  });
});