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
});