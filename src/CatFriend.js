import React, { Component } from 'react';
import MyWeb3 from './MyWeb3'
import CatPreview from "./CatPreview"
import './static/ZombiePreview.css'
import moment from "moment"

class NewCat extends Component {
    constructor(props) {
        super(props);
        const searchParams = new URLSearchParams(window.location.search)
        const id = searchParams.get('id')   
        this.state = {
            targetId:id ,
            targetCat:{},
            myCats:[],
            myCat:{},
            myCatId:'',
            active: {},
            buttonTxt:'',
            modalDisplay:'none',
            transactionHash:'',
            AttackBtn:()=>{
                return( <button className="attack-btn">
                            <span role="img" aria-label="zombie">
                                Choose a kitty! 
                            </span>
                        </button>
                )
            }
        }
        this.selectCat = this.selectCat.bind(this)
        this.catAttack = this.catAttack.bind(this)
        this.sendGift = this.sendGift.bind(this)

    }
    componentDidMount(){
        let that = this
        let ethereum = window.ethereum
        if (typeof  ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.getCat(that.state.targetId)
                that.getMyCats()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
    
    getCat(catId){
        let that = this
        MyWeb3.cats(catId).then(function (result) {
            that.setState({targetCat:result})
        })
    }
    getMyCats(){
        let that = this
        MyWeb3.getCatsByOwner().then(function(cats){
            if(cats.length > 0){
                for(let i=0;i<cats.length;i++){
                    MyWeb3.cats(cats[i]).then(function (result) {
                        let _cats = that.state.myCats
                        result.catId = cats[i]
                        if(result.readyTime === 0 || moment().format('X')>result.readyTime){
                            _cats.push(result)
                        }
                        that.setState({myCats:_cats})
                    })
                }
            }
        })
    }
    selectCat = index => {
        var _active = this.state.active
        var prev_active = _active[index]
        for(var i=0;i<this.state.myCats.length;i++){
            _active[i] = 0
        }
        _active[index] = prev_active === 0 || prev_active === undefined ? 1 : 0
        this.setState({
            active:_active,buttonTxt:'Use'+this.state.myCats[index].name,
            myCat:this.state.myCats[index],
            myCatId:this.state.myCats[index].catId,
            AttackBtn:()=>{
                return( <button className="attack-btn" onClick={this.sendGift}>
                            <span role="img">
                                
                                Use {this.state.myCats[index].name}
                            </span>
                        </button>
                )
            }
        })
    }

    catAttack(){
        let that = this
        if(this.state.myCat !== undefined){
            this.setState({modalDisplay:''})
            MyWeb3.attack(this.state.myCatId,this.state.targetId)
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
        if(this.state.myCat !== undefined){
            this.setState({modalDisplay:''})
            MyWeb3.sendGift(this.state.myCatId, this.state.targetId)
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
        if(this.state.myCats.length>0) {
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
                            <CatPreview cat={this.state.targetCat}></CatPreview>
                        </div>
                        <div className='vs'>
                            VS
                        </div>
                
                        <div className='myZombie'>
                            <CatPreview cat={this.state.myCat}></CatPreview>
                        </div>
                    </div> */}
                     {/* <div><h2>{this.state.transactionHash}</h2></div> */}
               {/* </div> */} 
                    <div  className="row zombie-parts-bin-component" >
                        <div  className="game-card home-card target-card" >
                            <div className="zombie-char">
                                <CatPreview cat={this.state.targetCat}></CatPreview>
                            </div>
                        </div>
                        <div className="zombie-detail">
                            <div className="flex">
                                {this.state.myCats.map((item,index)=>{
                                    var name = item.name
                                    var level = item.level
                                    return(
                                        <div className="game-card home-card selectable" key={index} active={this.state.active[index] || 0} onClick={() => this.selectCat(index)} >
                                            <div className="zombie-char">
                                            <CatPreview cat={item}></CatPreview>
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
 
export default NewCat;