pragma solidity ^0.5.0;

contract Auctions {
  uint public auctionCount = 0;

  struct Auction {
    uint id;
    string title;
    string description;
    uint256 startPrice;
    uint256 currentPrice;
    bool end;
  }
}
