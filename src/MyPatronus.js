import React, { Component } from 'react'
import PatronusCard from "./PatronusCard"
import './static/ZombiePreview.css'
import Page from "./Page"
import MyWeb3 from './MyWeb3'
import {
    BrowserRouter as 
    Route,
    Link
  } from "react-router-dom"

class MyPatronus extends Component {
    constructor(props) {
        super(props);

        this.state = {patronusCount:"",patronuss:[],patronusName:'',transactionHash:'',buyAreaDisp:1,createAreaDisp:1,txHashDisp:0}
        this.createPatronus=this.createPatronus.bind(this)
        this.buyPatronus=this.buyPatronus.bind(this)
        this.inputChange=this.inputChange.bind(this)
    }
        
    componentDidMount(){
        let that = this
        let ethereum = window.ethereum
        if (typeof  ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.myPatronuss()
                // that.patronusGarten()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
    
    myPatronuss(){
        let that = this
        MyWeb3.getPatronussByOwner().then(function(patronuss){
            if(patronuss.length > 0){
                
                for(let i=0;i<patronuss.length;i++){
                    MyWeb3.patronuss(patronuss[i]).then(function (result) {
                        let _patronuss = that.state.patronuss
                        result.patronusId = patronuss[i]
                        _patronuss.push(result);
                        that.setState({patronuss:_patronuss})
                    })
                }
            }
        })
    }


    createPatronus(){
        let that = this
        let _name = this.state.patronusName
        MyWeb3.createPatronus(_name).then(function(transactionHash){
            that.setState({
                transactionHash:transactionHash,
                createAreaDisp:0,
                txHashDisp:1
            })
        })
    }
    buyPatronus(){
        let that = this
        let _name = this.state.patronusName
        MyWeb3.buyPatronus(_name).then(function(transactionHash){
            that.setState({
                transactionHash:transactionHash,
                buyAreaDisp:0,
                txHashDisp:1
            })
        })
    }
    inputChange(){
        this.setState({
            patronusName:this.input.value
        })
    }


    render() {
        //  already got at least one kitty
        if(this.state.patronuss.length>0) {
            return ( 
                <div className="cards">
                    {this.state.patronuss.map((item,index)=>{
                        var name = item.name
                        var level = item.level
                        return(
                            
                            <Link to={`?PatronusDetail&id=`+item.patronusId} key={index}>
                                <PatronusCard patronus={item} name={name} level={level} key={index}></PatronusCard>
                                
                            </Link>
                        )
                    })}
                    <Route path="*" component={Page}></Route>
                    <div className='buyArea' display={this.state.buyAreaDisp}>
                        <div className='zombieInput'>
                            <input 
                                type="text" 
                                id='patronusName' 
                                placeholder='Pick a name' 
                                ref={(input)=>{this.input=input}} 
                                value={this.state.patronusName}
                                onChange={this.inputChange}>
                            </input>
                        </div>
                        <div>
                            <button className="attack-btn" onClick={this.buyPatronus}>
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
                            id='patronusName' 
                            placeholder='Pick a name' 
                            ref={(input)=>{this.input=input}} 
                            value={this.state.patronusName}
                            onChange={this.inputChange}>
                        </input>
                    </div>
                    <div>
                        <button className="attack-btn" onClick={this.createPatronus}>
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
export default MyPatronus;