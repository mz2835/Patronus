import React,{Component,Fragment} from 'react'
import './static/App.css'
import Page from "./Page";
import {
    BrowserRouter as Router,
    Route,
    Link
  } from "react-router-dom"


class App extends Component {
    constructor(props) {
        super(props);
        this.state = { AdminArea:()=>{return(<Fragment></Fragment>)} }
    }
    
    componentDidMount(){
        var Web3 = require('web3')
        let ethereum = window.ethereum
        // my add
        let web3 = window.web3
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
          } else {
            // 如果没有检测到注入的web3实例，则退回到Ganache网络。
            App.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:7545');
            web3 = new Web3(App.web3Provider);
          }



        if (typeof  ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            ethereum.on('accountsChanged', function (accounts) {
                console.log("accountsChanged:"+accounts)
                //window.location.reload()
            })
            ethereum.on('chainChanged', function (chainId) {
                console.log("chainChanged:"+chainId)
                //window.location.reload()
            })
            ethereum.on('networkChanged', function (networkVersion) {
                console.log("networkChanged:"+networkVersion)
                //window.location.reload()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
    
    render() { 
        let AdminArea = this.state.AdminArea
        return (
            <Fragment>
                <Router>
                    <section className="zombies-hero no-webp block app-block-intro pt-5 pb-2">
                        <div className="container">
                            <div className="menu">
                                {/* list  */}
                                <ul>
                                    <li>
                                        <button className="start-course-btn">
                                            <span><Link to="?CatGarten">Patronus Kingdom</Link></span>
                                        </button>
                                    </li> 

                                    <li>
                                        <button className="start-course-btn">
                                            <span><Link to="?MyCat">My Patronus</Link></span>
                                        </button>
                                    </li>

                                    <li>
                                        <button className="start-course-btn">
                                            <span><Link to="?CatMarket">Patronus Market</Link></span>
                                        </button>
                                    </li>

                                    {/* <li>
                                        <button className="start-course-btn">
                                            <span><Link to="?ZombieSimulator">Simu</Link></span>
                                        </button>
                                    </li>  */}
                                    <AdminArea></AdminArea> 
                                </ul>
                            </div>
                        </div>
                    </section>
                    {/* 下半截 僵尸preview */}
                    <section className="zombie-container block bg-walls no-webp">
                        <div className="container">
                            <div className="area">
                                <Route path="*" component={Page}></Route>
                            </div>
                        </div>
                    </section>
                </Router>
            </Fragment>
            );
    }
}


export default App
