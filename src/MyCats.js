import React, { Component } from 'react'
import CatCard from "./CatCard"
import './static/ZombiePreview.css'
import Page from "./Page"
import MyWeb3 from './MyWeb3'
import {
    BrowserRouter as 
    Route,
    Link
  } from "react-router-dom"

class MyCat extends Component {
    constructor(props) {
        super(props);

        this.state = {catCount:"",cats:[],catName:'',transactionHash:'',buyAreaDisp:1,createAreaDisp:1,txHashDisp:0}
        this.createCat=this.createCat.bind(this)
        this.buyCat=this.buyCat.bind(this)
        this.inputChange=this.inputChange.bind(this)
    }
        
    componentDidMount(){
        let that = this
        let ethereum = window.ethereum
        if (typeof  ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.myCats()
                // that.catGarten()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
    
    myCats(){
        let that = this
        MyWeb3.getCatsByOwner().then(function(cats){
            if(cats.length > 0){
                
                for(let i=0;i<cats.length;i++){
                    MyWeb3.cats(cats[i]).then(function (result) {
                        let _cats = that.state.cats
                        result.catId = cats[i]
                        _cats.push(result);
                        that.setState({cats:_cats})
                    })
                }
            }
        })
    }


    createCat(){
        let that = this
        let _name = this.state.catName
        MyWeb3.createCat(_name).then(function(transactionHash){
            that.setState({
                transactionHash:transactionHash,
                createAreaDisp:0,
                txHashDisp:1
            })
        })
    }
    buyCat(){
        let that = this
        let _name = this.state.catName
        MyWeb3.buyCat(_name).then(function(transactionHash){
            that.setState({
                transactionHash:transactionHash,
                buyAreaDisp:0,
                txHashDisp:1
            })
        })
    }
    inputChange(){
        this.setState({
            catName:this.input.value
        })
    }


    render() {
        //  already got at least one 
        if(this.state.cats.length>0) {
            return ( 
                <div className="cards">
                    {this.state.cats.map((item,index)=>{
                        var name = item.name
                        var level = item.level
                        return(
                            // <Link to={`?CatDetail&id=`+item.catId} key={index}>
                            <Link to={`?CatDetail&id=`+item.catId} key={index}>
                                <CatCard cat={item} name={name} level={level} key={index}></CatCard>
                                
                            </Link>
                        )
                    })}
                    <Route path="*" component={Page}></Route>
                    <div className='buyArea' display={this.state.buyAreaDisp}>
                        <div className='zombieInput'>
                            <input 
                                type="text" 
                                id='catName' 
                                placeholder='Pick a name' 
                                ref={(input)=>{this.input=input}} 
                                value={this.state.catName}
                                onChange={this.inputChange}>
                            </input>
                        </div>
                        <div>
                            <button className="attack-btn" onClick={this.buyCat}>
                                <span>
                                    Buy a Patronus    
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className='transactionHash' display={this.state.txHashDisp}>{this.state.transactionHash}<br></br>waiting for confirmation...</div>
                </div>
            )
        //  have no kitty on account
        }else{
            return(<div>
                <div className='createArea' display={this.state.createAreaDisp}>
                    <div className='zombieInput'>
                        <input 
                            type="text" 
                            id='catName' 
                            placeholder='Pick a name' 
                            ref={(input)=>{this.input=input}} 
                            value={this.state.catName}
                            onChange={this.inputChange}>
                        </input>
                    </div>
                    <div>
                        <button className="attack-btn" onClick={this.createCat}>
                            <span>
                                Adopt a Patronus   
                            </span>
                        </button>
                    </div>
                </div>
                <div className='transactionHash' display={this.state.txHashDisp}>{this.state.transactionHash}<br></br>waiting for confirmation...</div>
            </div>)
        }
    }
}  
export default MyCat;