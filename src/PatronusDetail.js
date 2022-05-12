import React, { Component } from 'react'

import PatronusPreview from "./PatronusPreview"
import './static/ZombiePreview.css'
import MyWeb3 from './MyWeb3'
import moment from "moment"
import {
    BrowserRouter as 
    Route,
    Link
  } from "react-router-dom"
  import Page from "./Page";

class Patronusdetail extends Component {
    constructor(props) {
        super(props)
        const searchParams = new URLSearchParams(window.location.search)
        
        const id = searchParams.get('id')   
        this.state = {
            id:id ,
            
            patronus:{},owner:'',
            patronusFeedTimes:0,

            myPrice:0,
            minPrice:0,
            AttackBtn: () =>{return(<div></div>)}, 
            RenameArea: () =>{return(<div></div>)},
            patronusNewname:'',
            FeedArea: () =>{return(<div></div>)},
            LevelupArea: () =>{return(<div></div>)},
            SaleArea: () =>{return(<div></div>)},
            BuyArea: () =>{return(<div></div>)},
            
            onShop:false,
            shopInfo:{}
        }
        this.patronusChangeName = this.patronusChangeName.bind(this)
        this.changeName = this.changeName.bind(this)
        this.feed = this.feed.bind(this)
        this.levelUp = this.levelUp.bind(this)
        this.salePatronus = this.salePatronus.bind(this)
        this.buyShopPatronus = this.buyShopPatronus.bind(this)
        this.setPrice = this.setPrice.bind(this)
    }
     
    componentDidMount(){
        let that = this
        let ethereum = window.ethereum
        if (typeof  ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.getPatronus(that.state.id)
                that.getPatronusFeedTimes(that.state.id)
                that.getMinPrice()
                that.getPatronusShop(that.state.id)
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
    getPatronusShop(patronusId){
        let that = this
        MyWeb3.patronusShop(patronusId).then(function (shopInfo) {
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
    getPatronusFeedTimes(patronusId){
        let that = this
        MyWeb3.patronusFeedTimes(patronusId).then(function (result) {
            if(result>0){
                that.setState({patronusFeedTimes:result})
            }
        })
    }
    setPrice(event){
        this.setState({
            myPrice:event.target.value
        })
    }
   patronusChangeName(event){
        this.setState({
            patronusNewname:event.target.value
        })
    }
    changeName(){
        let that = this
        if(window.defaultAccount !== undefined){
            MyWeb3.changeName(this.state.id,this.state.patronusNewname)
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
    salePatronus(){
        let that = this
        if(window.defaultAccount !== undefined 
            && this.state.myPrice*this.state.minPrice>0 
            && this.state.myPrice>=this.state.minPrice){
            MyWeb3.saleMyPatronus(this.state.id,this.state.myPrice)
            .then(function(transactionHash){
                that.setState({SaleArea : () =>{
                    return(<div>{transactionHash}</div>)
                    }
                })
            })
        }
    }
    buyShopPatronus(){
        let that = this
        if(window.defaultAccount !== undefined){
            MyWeb3.buyShopPatronus(this.state.id,this.state.shopInfo.price)
            .then(function(transactionHash){
                that.setState({BuyArea : () =>{
                    return(<div>{transactionHash}</div>)
                    }
                })
            })
        }
    }

    getPatronus(patronusId){
        let that = this
        MyWeb3.patronuss(patronusId).then(function (result) {
            that.setState({patronus:result})
            that.setState({patronusNewname:result.name})
            MyWeb3.patronusToOwner(patronusId).then(function (patronusOwner) {
                that.setState({owner:patronusOwner})
            
                
//  if user is not the owner of current patronus, then show attack button
                if(window.defaultAccount !== undefined &&
                    patronusOwner !== window.defaultAccount){
                    that.setState({AttackBtn : () =>{
                        return(
                        <button className="attack-btn">
                            <span>
                                <Link to={`?PatronusFriend&id=`+that.state.id} >make friend</Link>
                            </span>
                        </button>)
                        }
                    })
//📌 if current patronus is in shop that can be bought, show buy 
                    if(that.state.onShop){
                        that.setState({BuyArea : () =>{
                            return(
                                <div>
                                    <div className='zombieInput'>
                                        cost: {that.state.shopInfo.price} ether
                                    </div>
                                    <div>
                                        <button className="pay-btn pay-btn-last" onClick={that.buyShopPatronus}>
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
//  if user is owner of current patronus 
                }else{
                    that.setState({AttackBtn : () =>{return(<div></div>)}})
        //📌  if current patronus level is higher than 1, you are able to change name
                    if(that.state.patronus.level > 1){
                        that.setState({RenameArea : () =>{
                            return(
                                <div>
                                    <div className='zombieInput'>
                                        <input 
                                            type="text" 
                                            id='patronusName' 
                                            placeholder={that.state.patronus.name} 
                                            value={that.state.patronusNewname}
                                            onChange={that.patronusChangeName}>
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
        //📌  if patronus is ready, you can feed it 
                    if(that.state.patronus.readyTime === 0 || moment().format('X')>that.state.patronus.readyTime){
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
    //  if patronus is not on shop, you can have a sell button to sell it 
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
                                        <button className="pay-btn pay-btn-last" onClick={that.salePatronus}>
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
        if(this.state.patronus.readyTime !== undefined && moment().format('X')<this.state.patronus.readyTime){
            readyTime = moment(parseInt(this.state.patronus.readyTime)*1000).format('YYYY-MM-DD')
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
                                <PatronusPreview patronus={this.state.patronus}></PatronusPreview>
                            <div className="hide">
                                <div className="card-header bg-dark hide-overflow-text">
                                    <strong ></strong></div>
                                <small className="hide-overflow-text">level 1</small>
                            </div>
                        </div>
                    </div>
                    <div className="zombie-detail">
                        <dl>
                            <dt>{this.state.patronus.name}</dt>
                            <dt>Master</dt>
                            <dd>{this.state.owner}</dd>
                            <dt>Level</dt>
                            <dd>{this.state.patronus.level}</dd>
                            {/* <dt>Victory</dt>
                            <dd>{this.state.patronus.winCount}</dd> */}
                            <dt>Hairball</dt>
                            <dd>{this.state.patronus.hairBall}</dd>
                            <dt>Cool down time</dt>
                            <dd>{readyTime}</dd>
                            <dt>Feeding</dt>
                            <dd>{this.state.patronusFeedTimes}</dd>
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

export default Patronusdetail;