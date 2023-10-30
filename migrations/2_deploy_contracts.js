const Auction = artifacts.require('./Auction.sol');

module.exports = (deployer) => {
  deployer.deploy(Auction);
};