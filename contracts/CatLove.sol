pragma solidity >=0.4.22 <0.9.0;

import "./CatHelper.sol";

contract CatLove is CatHelper{
    uint randNonce = 0;
    uint inviteLevel = 20;
    uint loveLevel = 40;
    uint[3] visitSuccessProbability = [60,80,100];

    event becomeFriend(uint _catId, uint _targetId);

    function randMod(uint _modules) internal returns(uint){
        randNonce ++;
        return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modules;
    }

    function setVisitSuccessProbability(uint _visitSuccessProbability, uint i) public onlyOwner{
        visitSuccessProbability[i] = _visitSuccessProbability;
    }

    function setInviteLevel(uint _inviteLevel) public onlyOwner{
        inviteLevel = _inviteLevel;
    }

    function setLoveLevel(uint _loveLevel) public onlyOwner{
        loveLevel = _loveLevel;
    }

    function _becomeFriend(uint _catId, uint _targetId) external aboveLevel(2, _catId) onlyOwnerOf(_catId){
        Cat storage myCat = cats[_catId];
        Cat storage ReceiveCat = cats[_targetId];
        myCat.likeLevels[_targetId] = likeLevel({catId:_targetId, like:1});
        ReceiveCat.likeLevels[_catId] = likeLevel({catId:_catId, like:1});
        emit becomeFriend(_catId, _targetId);
    }

    function sendGift(uint _catId, uint _targetId) external onlyOwnerOf(_catId){
        require(cats[_catId].hairBall >= 1, "You don't have any hairBall!");
        Cat storage myCat = cats[_catId];
        Cat storage ReceiveCat = cats[_targetId];
        require(ReceiveCat.likeLevels[_catId].like >= 1, "You haven' t become friends!");
        myCat.hairBall --;
        ReceiveCat.hairBall ++;
        ReceiveCat.likeLevels[_catId].like ++;
        ReceiveCat.likeLevels[_catId].like ++;
        ReceiveCat.likeLevels[_catId].like ++;
        ReceiveCat.likeLevels[_catId].like ++;
        ReceiveCat.likeLevels[_catId].like ++;
    }

    function visit(uint _catId, uint _targetId) external onlyOwnerOf(_catId){
        Cat storage myCat = cats[_catId];
        Cat storage visitCat = cats[_targetId];
        require(visitCat.likeLevels[_catId].like >= 1, "You haven' t become friends!");
        uint rand = randMod(100);
        
        if (myCat.level < 5){
            uint prob = visitSuccessProbability[0];
            if (rand <= prob){
                visitCat.likeLevels[_catId].like ++;
            }
        }
        else{
            if (myCat.level < 15){
                uint prob = visitSuccessProbability[1];
                if (rand <= prob){
                    visitCat.likeLevels[_catId].like ++;
                }
            }
            else{
                uint prob = visitSuccessProbability[2];
                if (rand <= prob){
                    visitCat.likeLevels[_catId].like ++;
                }
            }
        }
        _triggerCooldown(myCat);
    }

    function invite(uint _catId, uint _targetId) external onlyOwnerOf(_catId){
        Cat storage myCat = cats[_catId];
        Cat storage visitCat = cats[_targetId];
        require(visitCat.likeLevels[_catId].like >= inviteLevel, "The cats are not so close :(");
        if (visitCat.likeLevels[_catId].like >= loveLevel){
            myCat.level ++;
            visitCat.level ++;
            _breed(_catId, visitCat.dna);
        }
        else{
            if (myCat.level >= visitCat.level){
                uint rand = randMod(100);
                if (rand > 50){
                    _breed(_catId, visitCat.dna);
                }
                else{
                    _triggerCooldown(myCat);
                    visitCat.likeLevels[_catId].like --;
                }
            }
            else{
                uint rand = randMod(100);
                if (rand > 50){
                    _triggerCooldown(myCat);
                    visitCat.likeLevels[_catId].like --;
                }
                else{
                    _triggerCooldown(myCat);
                    myCat.level --;
                    visitCat.likeLevels[_catId].like --;
                }
            }
        }
    }

}