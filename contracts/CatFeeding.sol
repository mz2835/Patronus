pragma solidity ^0.5.12;

// import "./safemath.sol";
import "./CatHelper.sol";

contract CatFeeding is CatHelper{

    function feed(uint _catId) public onlyOwnerOf(_catId){
        Cat storage myCat = cats[_catId];
        require(_isReady(myCat));
        catFeedTimes[_catId] = catFeedTimes[_catId].add(1);
        _triggerCooldown(myCat);
        // every 10 times of feeding will produce a new cat
        if (catFeedTimes[_catId]%1==0){ 
            //  change  to 1 for debugging
            // turn the last digit of dna to 8 to mark the feeding new cat
            cats[_catId].hairBall ++;
        }
    }
}

