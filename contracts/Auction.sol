pragma solidity ^0.5.0;

contract Auctions {
  uint public auctionCount = 0;

  struct Auction {
    uint id;
    address owner;
    string title;
    string description;
    uint256 startPrice;
    uint256 currentPrice;
    bool end;
  }

  event AuctionCreated (
    uint id,
    address owner,
    string title,
    string description,
    uint256 startPrice,
    uint256 currentPrice,
    bool end
  );

  constructor () public {
    createAuction('Example Auction', 'Item details...', 1);
  }

  mapping(uint => Auction) public auctions;

  function createAuction (string memory _title, string memory _description, uint256 _startPrice) public {
    auctionCount++;
    auctions[auctionCount] = Auction(auctionCount, msg.sender, _title, _description, _startPrice, _startPrice, false);
    emit AuctionCreated(auctionCount, msg.sender, _title, _description, _startPrice, _startPrice, false);
  }
}
