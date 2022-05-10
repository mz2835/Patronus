pragma solidity >=0.4.22 <0.9.0;

import "./CatFactory2.sol";

contract CatHelper is CatFactory{
    //  add public 
    uint public levelUpFee = 0.001 ether;

    // ensure whether this happened
    modifier aboveLevel(uint _level, uint _catId){
        require(cats[_catId].level >= _level, "Your level is not enough, please upgrade!");
        _;
    }

    modifier onlyOwnerOf(uint _catId){
        require(msg.sender == catToOwner[_catId]);
        _;
    }

    function setLevelUpFee(uint _fee) external onlyOwner{
        levelUpFee = _fee;
    }

    function levelUp(uint _catId) external payable{
        require(msg.value >= levelUpFee, "Your balance is not enough!");
        cats[_catId].level++;
    }

    function changeName(uint _catId, string calldata _newName) external aboveLevel(2, _catId) onlyOwnerOf(_catId){
        cats[_catId].name = _newName;
    }

    function changeDna(uint _catId, uint dna) external aboveLevel(20, _catId) onlyOwnerOf(_catId){
        cats[_catId].dna = dna;
    }

    function getCatsByOwner(address _owner)external view returns(uint[] memory){
        uint[] memory result = new uint[](ownerCatCount[_owner]);
        uint counter = 0;
        for(uint i=0; i<cats.length;i++){
            if(catToOwner[i] == _owner){
                // change == to =
                result[counter] = i;
                counter ++;
            }
        }
        return result;
    }

    function _triggerCooldown(Cat storage _cat) internal{
        _cat.readyTime = uint32(block.timestamp + coolingTime) - uint32(block.timestamp + coolingTime)%1 days;
    }

    function _isReady(Cat storage _cat) internal view returns (bool){
        return block.timestamp >= _cat.readyTime;
    }

    function _breed(uint _catId, uint _targetDna) internal onlyOwnerOf(_catId){
        Cat storage myCat = cats[_catId];
        require(_isReady(myCat), "Your cat is cooling down!");
        _targetDna = _targetDna % dnaModules;
        uint newDna = (myCat.dna + _targetDna) / 2;

        newDna = newDna - newDna % 10 + 9;
        createCat("NoName", newDna);
        _triggerCooldown(myCat);
    }

}