pragma solidity ^0.5.0;

contract Auctions {
  uint public auctionCount = 0;

  struct Bid {
    uint auctionId;
    address bidder;
    uint256 amount;
  }

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
    uint256 startPrice
  );

  event PlacedBid (
    uint id,
    address bidder,
    uint256 oldPrice,
    uint256 currentPrice
  );

  constructor () public {
    createAuction('Example Auction', 'Item details...', 1);
  }

  mapping(uint => Auction) public auctions;
  mapping(uint => Bid[]) public bids;

  function createAuction (string memory _title, string memory _description, uint256 _startPrice) public {
    auctionCount++;
    Bid[] memory newBids = new Bid[](0);
    auctions[auctionCount] = Auction(auctionCount, msg.sender, _title, _description, _startPrice, _startPrice, false);
    emit AuctionCreated(auctionCount, msg.sender, _title, _description, _startPrice);
  }

  function PlaceBid (uint _id, uint256 _amount) public {
    require(msg.sender != auctions[auctionCount].owner, "You cannot bid your own auctions!");
    uint256 oldPrice = auctions[auctionCount].currentPrice;
    require(_amount - oldPrice > 1, "Bid amounts should be greater by at least 1 unit!");

    Bid memory newBid = Bid(_id, msg.sender, _amount);
    bids[_id].push(newBid);
    auctions[auctionCount].currentPrice = _amount;
    emit PlacedBid(_id, msg.sender, oldPrice, _amount);
  }
}
