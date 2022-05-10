import React, { Component } from 'react';
import MyWeb3 from './MyWeb3'
import CatCard from "./CatCard";
import {
    BrowserRouter as 
    Route,
    Link
  } from "react-router-dom"
import Page from "./Page";

class CatMarket extends Component {
    constructor(props) {
        super(props);
        this.state = {shopCats:[]  }
    }
     
    componentDidMount(){
        //console.log(window.web3._extend.utils)
        let that = this
        let ethereum = window.ethereum
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.catShop()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }

    catShop(){
        let that = this
        MyWeb3.getShopCats().then(function(catIds){
            if(catIds.length>0){
                for(var i=0;i<catIds.length;i++){
                    let catId = catIds[i]
                    if(catId>=0){
                        MyWeb3.cats(catId).then(function(cats) {
                            let _shopCats = that.state.shopCats
                            cats.catId = catId
                            _shopCats.push(cats);
                            that.setState({shopCats:_shopCats})
                        })
                    }
                }
            }
        })
    }
    
    render() { 
        if(this.state.shopCats.length>0) {
            return ( 
                <div className="cards">
                    {this.state.shopCats.map((item,index)=>{
                        var name = item.name
                        var level = item.level
                        return(
                            <Link to={`?CatDetail&id=`+item.catId} key={index}>
                                <CatCard cat={item} name={name} level={level} key={index}></CatCard>
                            </Link>
                        )
                    })}
                    <Route path="*" component={Page}></Route>
                </div> 
            )
        }else{
            return ( <div></div>)
        }
    }
}
 
export default CatMarket;