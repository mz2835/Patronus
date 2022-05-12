import React, { Component } from 'react'
import PatronusCard from "./PatronusCard";
import './static/ZombiePreview.css';
import MyWeb3 from './MyWeb3'
import {
    BrowserRouter as 
    Route,
    Link
  } from "react-router-dom"
import Page from "./Page";

class PatronusKingdom extends Component {
    constructor(props) {
        super(props);
        this.state = { patronusCount:"",patronuss:[] }
    }
        
    componentDidMount(){
        let that = this
        let ethereum = window.ethereum
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.patronusKingdom()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
 
    patronusKingdom(){
        let that = this
        MyWeb3.patronusCount().then(function(result){
            if(result > 0){
                for(let i=0;i<result;i++){
                    MyWeb3.patronuss(i).then(function (result) {
                        let _patronuss = that.state.patronuss
                        result.patronusId = i
                        _patronuss.push(result);
                        that.setState({patronuss:_patronuss})
                    })
                }
            }
        })
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }
    render() { 
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
                </div> 
            )
        }else{
            return ( <div></div>)
        }
    }
}
 
export default PatronusKingdom;