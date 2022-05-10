//pragma solidity ^0.5.12;
pragma solidity >=0.4.22 <0.9.0;

import "./Ownable.sol";
import "./SafeMath.sol";

contract CatFactory is Ownable{
    using SafeMath for uint256;

    uint dnaNum = 16;
    uint dnaModules = 10** dnaNum;
    uint public coolingTime = 1 seconds;
    uint public catPrice = 0.01 ether; 
    uint public catCount = 0;

    struct likeLevel{
        uint catId;
        uint like;
    }

    struct Cat{
        string name;
        uint dna;
        uint16 winCount;
        uint16 hairBall;
        uint32 level;
        uint32 readyTime;
        mapping (uint => likeLevel) likeLevels;
    }

    Cat[] public cats;
    mapping (uint => address) public catToOwner;
    // ownCatCount to ownerCatCount
    mapping (address => uint) ownerCatCount;
    // searching for feeding times through ID
    mapping (uint => uint) public catFeedTimes;

    event NewCat(uint catId, string name, uint dna);


    //produce random dna
    function generateRandomDna(string memory _name) private view returns (uint){
        return uint(keccak256(abi.encodePacked(_name, block.timestamp))) % dnaModules;
    }
    // create cat
    function createCat(string memory _name, uint randomDna) internal{
        uint id = cats.push(Cat(_name, randomDna, 0, 0, 1, 0)) - 1;
        // cats.push(Cat(_name, randomDna, 0, 0, 1, 0));
        // uint id = cats.length - 1;
        catToOwner[id] = msg.sender;
        ownerCatCount[msg.sender] = ownerCatCount[msg.sender].add(1);
        catCount = catCount.add(1);
        emit NewCat(id, _name, randomDna);
    }
    //create random cat
    function createRandomCat(string memory _name) public{
        // every account can only produce a cat for free
        require(ownerCatCount[msg.sender] == 0);
        uint randomDna = generateRandomDna(_name);
        // change the last digit of Dna to 1 to mark the bought cat
        randomDna = randomDna - randomDna % 10 ;
        createCat(_name, randomDna);
    }

    //buy random cat
    function buyRandomCat(string memory _name) public payable{
        // check there is no cat in the account
        require(ownerCatCount[msg.sender]>0);
        // check the value is enough to buy
        require(msg.value >= catPrice, "Your balance is not enough!");
        uint randomDna = generateRandomDna(_name);
        randomDna = randomDna - randomDna % 10 + 1;
        createCat(_name, randomDna);
    }

    //change the price of cat(only feasible to owner
    function changeCatPrice(uint price) external onlyOwner{
        catPrice = price;
    }

    

}