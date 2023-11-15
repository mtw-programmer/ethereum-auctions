pragma solidity ^0.8.0;

contract Auctions {
  uint public auctionCount = 0;

  struct Bid {
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

  event AuctionStopped (
    uint id,
    string title,
    string description,
    address owner,
    address bidder,
    uint256 startPrice,
    uint256 endPrice
  );

  constructor () {
    createAuction('Example Auction', 'Item details...', 1);
  }

  mapping(uint => Auction) public auctions;
  mapping(uint => Bid[]) public bids;
  mapping(uint => uint) public bidLastIndex;

  function createAuction (string memory _title, string memory _description, uint256 _startPrice) public {
    auctionCount++;
    auctions[auctionCount] = Auction(auctionCount, msg.sender, _title, _description, _startPrice, _startPrice, false);
    bidLastIndex[auctionCount] = 0;
    emit AuctionCreated(auctionCount, msg.sender, _title, _description, _startPrice);
  }

  function placeBid (uint _id, uint256 _amount) public {
    require(_id > 0 && _id <= auctionCount, "Invalid auction ID");
    require(msg.sender != auctions[_id].owner, "You cannot bid your own auctions!");
    uint256 oldPrice = auctions[_id].currentPrice;
    require(_amount - oldPrice >= 1, "Bid amounts should be greater by at least 1 unit!");
    require(!auctions[_id].end, "Auction is expired!");

    Bid memory newBid = Bid(msg.sender, _amount);
    bids[_id].push(newBid);
    bidLastIndex[_id] += 1;
    auctions[_id].currentPrice = _amount;
    emit PlacedBid(_id, msg.sender, oldPrice, _amount);
  }

  function getLastBidIndex (uint _id) public view returns (uint) {
    require(_id > 0 && _id <= auctionCount, "Invalid auction ID");
    return bidLastIndex[_id];
  }

  function stopAuction (uint _id) public {
    require(_id > 0 && _id <= auctionCount, "Invalid auction ID");
    require(msg.sender == auctions[_id].owner, "You can stop only your auctions!");
    require(!auctions[_id].end, "This auction is already stopped!");
    auctions[_id].end = true;
    if (getLastBidIndex(_id) > 0) {
      Bid storage bid = bids[_id][getLastBidIndex(_id) - 1];
      emit AuctionStopped(_id, auctions[_id].title, auctions[_id].description, auctions[_id].owner, bid.bidder, auctions[_id].startPrice, auctions[_id].currentPrice);
    } else {
      emit AuctionStopped(_id, auctions[_id].title, auctions[_id].description, auctions[_id].owner, address(0), auctions[_id].startPrice, 0);
    }
  }
}
