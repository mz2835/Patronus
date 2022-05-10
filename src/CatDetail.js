import React, { Component } from 'react'

import CatPreview from "./CatPreview"
import './static/ZombiePreview.css'
import MyWeb3 from './MyWeb3'
import moment from "moment"
import {
    BrowserRouter as 
    Route,
    Link
  } from "react-router-dom"
  import Page from "./Page";

class Catdetail extends Component {
    constructor(props) {
        super(props)
        const searchParams = new URLSearchParams(window.location.search)
        
        const id = searchParams.get('id')   
        this.state = {
            id:id ,
            
            cat:{},owner:'',
            catFeedTimes:0,

            myPrice:0,
            minPrice:0,
            AttackBtn: () =>{return(<div></div>)}, 
            RenameArea: () =>{return(<div></div>)},
            catNewname:'',
            FeedArea: () =>{return(<div></div>)},
            LevelupArea: () =>{return(<div></div>)},
            SaleArea: () =>{return(<div></div>)},
            BuyArea: () =>{return(<div></div>)},
            
            onShop:false,
            shopInfo:{}
        }
        this.catChangeName = this.catChangeName.bind(this)
        this.changeName = this.changeName.bind(this)
        this.feed = this.feed.bind(this)
        this.levelUp = this.levelUp.bind(this)
        this.saleCat = this.saleCat.bind(this)
        this.buyShopCat = this.buyShopCat.bind(this)
        this.setPrice = this.setPrice.bind(this)
    }
     
    componentDidMount(){
        let that = this
        let ethereum = window.ethereum
        if (typeof  ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.getCat(that.state.id)
                that.getCatFeedTimes(that.state.id)
                that.getMinPrice()
                that.getCatShop(that.state.id)
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
    getCatShop(catId){
        let that = this
        MyWeb3.catShop(catId).then(function (shopInfo) {
            if(shopInfo.price>0){
                that.setState({onShop:true,shopInfo:shopInfo})
            }
        })
    }
    getMinPrice(){
        let that = this
        MyWeb3.minPrice().then(function (minPrice) {
            if(minPrice>0){
                MyWeb3.tax().then(function (tax) {
                    if(tax>0){
                        that.setState({myPrice:parseFloat(minPrice)+parseFloat(tax),minPrice:parseFloat(minPrice)+parseFloat(tax)})
                    }
                })
            }
        })
    }
    getCatFeedTimes(catId){
        let that = this
        MyWeb3.catFeedTimes(catId).then(function (result) {
            if(result>0){
                that.setState({catFeedTimes:result})
            }
        })
    }
    setPrice(event){
        this.setState({
            myPrice:event.target.value
        })
    }
   catChangeName(event){
        this.setState({
            catNewname:event.target.value
        })
    }
    changeName(){
        let that = this
        if(window.defaultAccount !== undefined){
            MyWeb3.changeName(this.state.id,this.state.catNewname)
            .then(function(transactionHash){
                that.setState({RenameArea : () =>{
                    return(<div>{transactionHash}</div>)
                    }
                })
            })
        }
    }
    feed(){
        let that = this
        if(window.defaultAccount !== undefined){
            MyWeb3.feed(this.state.id)
            .then(function(transactionHash){
                that.setState({FeedArea : () =>{
                    return(<div>{transactionHash}</div>)
                    }
                })
            })
        }
    }
    levelUp(){
        let that = this
        if(window.defaultAccount !== undefined){
            MyWeb3.levelUp(this.state.id)
            .then(function(transactionHash){
                that.setState({LevelupArea : () =>{
                    return(<div>{transactionHash}</div>)
                    }
                })
            })
        }
    }
    saleCat(){
        let that = this
        if(window.defaultAccount !== undefined 
            && this.state.myPrice*this.state.minPrice>0 
            && this.state.myPrice>=this.state.minPrice){
            MyWeb3.saleMyCat(this.state.id,this.state.myPrice)
            .then(function(transactionHash){
                that.setState({SaleArea : () =>{
                    return(<div>{transactionHash}</div>)
                    }
                })
            })
        }
    }
    buyShopCat(){
        let that = this
        if(window.defaultAccount !== undefined){
            MyWeb3.buyShopCat(this.state.id,this.state.shopInfo.price)
            .then(function(transactionHash){
                that.setState({BuyArea : () =>{
                    return(<div>{transactionHash}</div>)
                    }
                })
            })
        }
    }

    getCat(catId){
        let that = this
        MyWeb3.cats(catId).then(function (result) {
            that.setState({cat:result})
            that.setState({catNewname:result.name})
            MyWeb3.catToOwner(catId).then(function (catOwner) {
                that.setState({owner:catOwner})
            
                
//  if user is not the owner of current cat, then show attack button
                if(window.defaultAccount !== undefined &&
                    catOwner !== window.defaultAccount){
                    that.setState({AttackBtn : () =>{
                        return(
                        <button className="attack-btn">
                            <span>
                                <Link to={`?CatFriend&id=`+that.state.id} >make friend</Link>
                            </span>
                        </button>)
                        }
                    })
//📌 if current cat is in shop that can be bought, show buy 
                    if(that.state.onShop){
                        that.setState({BuyArea : () =>{
                            return(
                                <div>
                                    <div className='zombieInput'>
                                        cost: {that.state.shopInfo.price} ether
                                    </div>
                                    <div>
                                        <button className="pay-btn pay-btn-last" onClick={that.buyShopCat}>
                                            <span>
                                                Buy It
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                )
                            }
                        })
                    }
//  if user is owner of current cat 
                }else{
                    that.setState({AttackBtn : () =>{return(<div></div>)}})
        //📌  if current cat level is higher than 1, you are able to change name
                    if(that.state.cat.level > 1){
                        that.setState({RenameArea : () =>{
                            return(
                                <div>
                                    <div className='zombieInput'>
                                        <input 
                                            type="text" 
                                            id='catName' 
                                            placeholder={that.state.cat.name} 
                                            value={that.state.catNewname}
                                            onChange={that.catChangeName}>
                                        </input>
                                    </div>
                                    <div>
                                        <button className="pay-btn pay-btn-last" onClick={that.changeName}>
                                            <span>
                                                Change Name
                                            </span>
                                        </button>
                                    </div>
                                </div>)
                            }
                        })
                    }
        //📌  if cat is ready, you can feed it 
                    if(that.state.cat.readyTime === 0 || moment().format('X')>that.state.cat.readyTime){
                        that.setState({FeedArea : () =>{
                            return(
                                <div>
                                    <button className="pay-btn" onClick={that.feed}>
                                        <span>
                                            Feed
                                        </span>
                                    </button>
                                </div>)
                            }
                        })
                    }
    // click to upgrage
                    that.setState({LevelupArea : () =>{
                        return(
                            <div>
                                <button className="pay-btn" onClick={that.levelUp}>
                                    <span>
                                        Pay to Upgrade
                                    </span>
                                </button>
                            </div>)
                        }
                    })
    //  if cat is not on shop, you can have a sell button to sell it 
                    if(!that.state.onShop){
                        that.setState({SaleArea : () =>{
                            return(
                                <div>
                                    <div className='zombieInput'>
                                        <input 
                                            type="text" 
                                            id='salePrice' 
                                            placeholder={that.state.minPrice} 
                                            value={that.state.myPrice}
                                            onChange={that.setPrice}>
                                        </input>
                                    </div>
                                    <div>
                                        <button className="pay-btn pay-btn-last" onClick={that.saleCat}>
                                            <span>
                                                Sell It
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                )
                            }
                        })
                    }
                } 
            })
        })
    }

    render() { 
        var readyTime = 'Ready'                                
        if(this.state.cat.readyTime !== undefined && moment().format('X')<this.state.cat.readyTime){
            readyTime = moment(parseInt(this.state.cat.readyTime)*1000).format('YYYY-MM-DD')
        }
        var AttackBtn = this.state.AttackBtn
        var RenameArea = this.state.RenameArea
        var FeedArea = this.state.FeedArea
        var LevelupArea = this.state.LevelupArea
        var SaleArea = this.state.SaleArea
        var BuyArea = this.state.BuyArea
        return ( 
            <div className="App">
                <div  className="row zombie-parts-bin-component" authenticated="true" lesson="1" lessonidx="1">
                    <div  className="zombie-preview" id="zombie-preview">
                        <div className="zombie-char">
                            <div className="zombie-loading zombie-parts" style={{display:"none"}}></div>
                                <CatPreview cat={this.state.cat}></CatPreview>
                            <div className="hide">
                                <div className="card-header bg-dark hide-overflow-text">
                                    <strong ></strong></div>
                                <small className="hide-overflow-text">level 1</small>
                            </div>
                        </div>
                    </div>
                    <div className="zombie-detail">
                        <dl>
                            <dt>{this.state.cat.name}</dt>
                            <dt>Master</dt>
                            <dd>{this.state.owner}</dd>
                            <dt>Level</dt>
                            <dd>{this.state.cat.level}</dd>
                            {/* <dt>Victory</dt>
                            <dd>{this.state.cat.winCount}</dd> */}
                            <dt>Hairball</dt>
                            <dd>{this.state.cat.hairBall}</dd>
                            <dt>Cool down time</dt>
                            <dd>{readyTime}</dd>
                            <dt>Feeding</dt>
                            <dd>{this.state.catFeedTimes}</dd>
                            <dt></dt>
                            <dd>
                                <AttackBtn></AttackBtn>
                                <RenameArea></RenameArea>
                                <FeedArea></FeedArea>
                                <LevelupArea></LevelupArea>
                                <SaleArea></SaleArea>
                                <BuyArea></BuyArea>
                            </dd>
                        </dl>
                    </div>
                    <Route path="*" component={Page}></Route>
                </div>
            </div>
        );
    }
}

export default Catdetail;