import React, { Component } from 'react';
import MyWeb3 from './MyWeb3'
import PatronusCard from "./PatronusCard";
import {
    BrowserRouter as 
    Route,
    Link
  } from "react-router-dom"
import Page from "./Page";

class PatronusMarket extends Component {
    constructor(props) {
        super(props);
        this.state = {shopPatronuss:[]  }
    }
     
    componentDidMount(){
        //console.log(window.web3._extend.utils)
        let that = this
        let ethereum = window.ethereum
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.patronusShop()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }

    patronusShop(){
        let that = this
        MyWeb3.getShopPatronuss().then(function(patronusIds){
            if(patronusIds.length>0){
                for(var i=0;i<patronusIds.length;i++){
                    let patronusId = patronusIds[i]
                    if(patronusId>=0){
                        MyWeb3.patronuss(patronusId).then(function(patronuss) {
                            let _shopPatronuss = that.state.shopPatronuss
                            patronuss.patronusId = patronusId
                            _shopPatronuss.push(patronuss);
                            that.setState({shopPatronuss:_shopPatronuss})
                        })
                    }
                }
            }
        })
    }
    
    render() { 
        if(this.state.shopPatronuss.length>0) {
            return ( 
                <div className="cards">
                    {this.state.shopPatronuss.map((item,index)=>{
                        var name = item.name
                        var level = item.level
                        return(
                            <Link to={`?PatronusDetail&id=`+item.patronusId} key={index}>
                                <PatronusCard patronus={item} name={name} level={level} key={index}></PatronusCard>
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
 
export default PatronusMarket;