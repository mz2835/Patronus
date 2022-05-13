pragma solidity ^0.5.12;
import "./CatHelper.sol";

contract Game is CatHelper {


    uint randNonce = 0;

    uint attackVicttoryProbability = 70;

    // 生成指定位数的随机数
    function randMod(uint modulus) internal returns (uint) {
        randNonce++;
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % modulus;
    }

    // 设置攻击胜利概率
    function setAttackVicttoryProbability(uint probability) external onlyOwner {
        attackVicttoryProbability = probability;
    }

    // 攻击
    function attack(uint _catId) external onlyOwnerOf(_catId) {
        Cat storage myCat = cats[_catId];
        // 生成战斗结果随机数
        uint rand = randMod(100);
        if (rand < attackVicttoryProbability) {
            // 战斗胜利
            myCat.winCount++;
            myCat.level++;
            createRandomCat('NoName');
        } else {
            // 战斗失败
            _triggerCooldown(myCat);
        }
    }
}