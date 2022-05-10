pragma solidity >=0.4.22 <0.9.0;

import "./CatHelper.sol";
import "./ERC721.sol";

contract CatOwnership is CatHelper, ERC721{
    
    mapping (uint => address) catApprovals;

    function balanceOf(address _owner) public view returns (uint256 _balance){
        return ownerCatCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address _owner){
        return catToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) internal{
        ownerCatCount[_to] = ownerCatCount[_to].add(1);
        ownerCatCount[_from] = ownerCatCount[_from].sub(1);
        catToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) public{
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public{
        catApprovals[_tokenId] = _to;
        emit Approval(msg.sender, _to, _tokenId);

    }

    // receive
    function takeOwnership(uint256 _tokenId) public{
        require(catApprovals[_tokenId] == msg.sender, "You are not approved!");
        // inquire past owner
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }
}

