import React, { Component } from 'react'
import CatCard from "./CatCard";
import './static/ZombiePreview.css';
import MyWeb3 from './MyWeb3'
import {
    BrowserRouter as 
    Route,
    Link
  } from "react-router-dom"
import Page from "./Page";

class CatGarten extends Component {
    constructor(props) {
        super(props);
        this.state = { catCount:"",cats:[] }
    }
        
    componentDidMount(){
        let that = this
        let ethereum = window.ethereum
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.catGarten()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
 
    catGarten(){
        let that = this
        MyWeb3.catCount().then(function(result){
            if(result > 0){
                for(let i=0;i<result;i++){
                    MyWeb3.cats(i).then(function (result) {
                        let _cats = that.state.cats
                        result.catId = i
                        _cats.push(result);
                        that.setState({cats:_cats})
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
        if(this.state.cats.length>0) {
            return ( 
                <div className="cards">
                    {this.state.cats.map((item,index)=>{
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
 
export default CatGarten;