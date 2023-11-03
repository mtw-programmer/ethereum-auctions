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
    const bidResult = await this.auctions.PlaceBid(1, 2, { from: accounts[1] });
    const { currentPrice } = bidResult.logs[0].args;

    const event = bidResult.logs[0].args;

    assert.equal(event.id.toNumber(), 1);
    assert.equal(event.bidder.toLowerCase(), accounts[1].toLowerCase());
    assert.equal(event.oldPrice.toNumber(), 1);
    assert.equal(currentPrice.toNumber(), 2);
    assert.equal(event.currentPrice.toNumber(), 2);
  });

  it('successfully stops an auction', async () => {
    const result = await this.auctions.stopAuction(1, { from: accounts[0] });
    const event = result.logs[0].args;
    const auction = await this.auctions.auctions(1);

    assert.equal(event.id.toNumber(), 1);
    assert.equal(auction.end, true);
  });

  it('successfully returns last bid index', async () => {
    await this.auctions.PlaceBid(2, 5, { from: accounts[1] });
    const bid = await this.auctions.getLastBidIndex(1);
    assert.equal(bid.toNumber(), 1);
  });
});