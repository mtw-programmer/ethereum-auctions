pragma solidity ^0.5.0;

contract Auctions {
  uint public auctionCount = 0;
  address owner;

  struct Auction {
    uint id;
    string title;
    string description;
    uint256 startPrice;
    uint256 currentPrice;
    bool end;
  }

  event AuctionCreated (
    uint id,
    string title,
    string description,
    uint256 startPrice,
    uint256 currentPrice,
    bool end
  );

  mapping(uint => Auction) public auctions;

  function createAuction (string memory _title, string memory _description, uint256 memory _startPrice) public {
    auctionCount++;
    auctions[auctionCount] = Auction(auctionCount, _title, _description, _startPrice, _startPrice, false);
    emit AuctionCreated(auctionCount, _title, _description, _startPrice, _startPrice, false);
  }
}
