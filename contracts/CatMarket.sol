//pragma solidity ^0.5.12;
pragma solidity >=0.4.22 <0.9.0;

import "./CatOwnership.sol";

contract CatMarket is CatOwnership{
    struct CatSales{
        address payable seller;
        uint price;
    }
    
    
    mapping (uint => CatSales) public catShop;
    uint public tax = 0.0001 ether;
    uint public minPrice = 0.0001 ether;

    //  add
    uint shopCatCount;

    event SaleCat(uint indexed _catId, address indexed seller);
    event BuyShopCat(uint indexed _catId, address indexed buyer, address indexed seller);

    function setTax(uint _tax) external onlyOwner{
        tax = _tax;
    }

    function setMinPrice(uint _minPrice) external onlyOwner{
        minPrice = _minPrice;
    }

    function saleMyCat(uint _catId, uint _price) external onlyOwnerOf(_catId){
        require(_price >= tax + minPrice, "Your price is too low!");
        // address payable owner = msg.sender;
        catShop[_catId] = CatSales(msg.sender, _price);       
        shopCatCount = shopCatCount.add(1);//  add     
        emit SaleCat(_catId, msg.sender);// change from price to msg.sender
    }

    function buyShopCat(uint _catId) public payable{ // change form externel to public
        require(msg.value >= catShop[_catId].price, "You need to add price!");
        _transfer(catShop[_catId].seller,msg.sender, _catId);
        catShop[_catId].seller.transfer(msg.value - tax);

        // CatSales memory catSales = catShop[_catId];
        // require(address(0) != catSales.seller);

        // transfer cat
        // _transfer(catSales.seller, msg.sender, _catId);
        // transfer money(sub tax)
        // catSales.seller.transfer(msg.value - tax);
        delete catShop[_catId];
        //  add
        shopCatCount = shopCatCount.sub(1);
        emit BuyShopCat(_catId, msg.sender, catShop[_catId].seller);
    }

    function getShopCats() external view returns(uint[] memory) {
        uint[] memory result = new uint[](shopCatCount);
        uint counter = 0;
        for (uint i = 0; i < cats.length; i++) {
            if (catShop[i].price != 0) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}