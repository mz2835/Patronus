import React, { Component } from 'react';
import MyWeb3 from './MyWeb3'
import PatronusPreview from "./PatronusPreview"
import './static/ZombiePreview.css'
import moment from "moment"

class NewPatronus extends Component {
    constructor(props) {
        super(props);
        const searchParams = new URLSearchParams(window.location.search)
        const id = searchParams.get('id')   
        this.state = {
            targetId:id ,
            targetPatronus:{},
            myPatronuss:[],
            myPatronus:{},
            myPatronusId:'',
            active: {},
            buttonTxt:'',
            modalDisplay:'none',
            transactionHash:'',
            AttackBtn:()=>{
                return( <button className="attack-btn">
                            <span role="img" aria-label="zombie">
                                Choose a Patronus! 
                            </span>
                        </button>
                )
            }
        }
        this.selectPatronus = this.selectPatronus.bind(this)
        this.patronusAttack = this.patronusAttack.bind(this)
        this.sendGift = this.sendGift.bind(this)

    }
    componentDidMount(){
        let that = this
        let ethereum = window.ethereum
        if (typeof  ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.getPatronus(that.state.targetId)
                that.getMyPatronuss()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
    
    getPatronus(patronusId){
        let that = this
        MyWeb3.patronuss(patronusId).then(function (result) {
            that.setState({targetPatronus:result})
        })
    }
    getMyPatronuss(){
        let that = this
        MyWeb3.getPatronussByOwner().then(function(patronuss){
            if(patronuss.length > 0){
                for(let i=0;i<patronuss.length;i++){
                    MyWeb3.patronuss(patronuss[i]).then(function (result) {
                        let _patronuss = that.state.myPatronuss
                        result.patronusId = patronuss[i]
                        if(result.readyTime === 0 || moment().format('X')>result.readyTime){
                            _patronuss.push(result)
                        }
                        that.setState({myPatronuss:_patronuss})
                    })
                }
            }
        })
    }
    selectPatronus = index => {
        var _active = this.state.active
        var prev_active = _active[index]
        for(var i=0;i<this.state.myPatronuss.length;i++){
            _active[i] = 0
        }
        _active[index] = prev_active === 0 || prev_active === undefined ? 1 : 0
        this.setState({
            active:_active,buttonTxt:'Use'+this.state.myPatronuss[index].name,
            myPatronus:this.state.myPatronuss[index],
            myPatronusId:this.state.myPatronuss[index].patronusId,
            AttackBtn:()=>{
                return( <button className="attack-btn" onClick={this.sendGift}>
                            <span role="img">
                                
                                Use {this.state.myPatronuss[index].name}
                            </span>
                        </button>
                )
            }
        })
    }

    patronusAttack(){
        let that = this
        if(this.state.myPatronus !== undefined){
            this.setState({modalDisplay:''})
            MyWeb3.attack(this.state.myPatronusId,this.state.targetId)
            .then(function(transactionHash){
                that.setState({
                    transactionHash:transactionHash,
                    AttackBtn : () =>{
                    return(<div></div>)
                    }
                })
            })
        }
    }
    sendGift(){
        let that = this
        if(this.state.myPatronus !== undefined){
            this.setState({modalDisplay:''})
            MyWeb3.sendGift(this.state.myPatronusId, this.state.targetId)
            .then(function(transactionHash){
                that.setState({
                    transactionHash:transactionHash,
                    AttackBtn : () =>{
                        return(<div></div>)
                        }
                })
            })
        }
    }
    
    render() { 
        let AttackBtn = this.state.AttackBtn
//  如果我的猫超过0只
        if(this.state.myPatronuss.length>0) {
            return ( 
                <div className="App zombie-attack">
                {/* <div
                    className="modal"
                    style={{
                        display:this.state.modalDisplay
                    }}
                > 
                {/* vs 框框 */}
                
                    {/* <div className='battelArea'>
                        <div className='targetZombie'>
                            <PatronusPreview patronus={this.state.targetPatronus}></PatronusPreview>
                        </div>
                        <div className='vs'>
                            VS
                        </div>
                
                        <div className='myZombie'>
                            <PatronusPreview patronus={this.state.myPatronus}></PatronusPreview>
                        </div>
                    </div> */}
                     {/* <div><h2>{this.state.transactionHash}</h2></div> */}
               {/* </div> */} 
                    <div  className="row zombie-parts-bin-component" >
                        <div  className="game-card home-card target-card" >
                            <div className="zombie-char">
                                <PatronusPreview patronus={this.state.targetPatronus}></PatronusPreview>
                            </div>
                        </div>
                        <div className="zombie-detail">
                            <div className="flex">
                                {this.state.myPatronuss.map((item,index)=>{
                                    var name = item.name
                                    var level = item.level
                                    return(
                                        <div className="game-card home-card selectable" key={index} active={this.state.active[index] || 0} onClick={() => this.selectPatronus(index)} >
                                            <div className="zombie-char">
                                            <PatronusPreview patronus={item}></PatronusPreview>
                                                <div className="zombie-card card bg-shaded">
                                                    <div className="card-header bg-dark hide-overflow-text">
                                                        <strong>{name}</strong>
                                                    </div>
                                                    <small className="hide-overflow-text">Grade {level}</small>
                                                </div>
                                            </div>
                                        </div>  
                                    )
                                })}
                            </div>
                            <AttackBtn></AttackBtn>
                        </div>
                    </div>
                </div>
            );
        }else{
            return(
                <div>No Kitty Available</div>
            )
        }
    }
}
 
export default NewPatronus;