pragma solidity >=0.4.22 <0.9.0;

import "./CatMarket.sol";
import "./CatLove.sol";
import "./CatFeeding.sol";
import "./CatFactory2.sol";


contract CatCore is CatFactory, CatMarket, CatFeeding, CatLove {
    string public constant name = "OneECryptoCat";
    string public constant symbol = "OCC";
 
    function() external payable {

    }

    function withdraw() external onlyOwner {
        owner.transfer(address(this).balance);
    }

    function checkBalance() external view onlyOwner returns(uint) {
        return address(this).balance;
    }

}