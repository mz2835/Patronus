import React, { Component } from 'react';
import CatPreview from "./CatPreview"

class CatCard extends Component {
    constructor(props) {
        super(props)
        this.state = { cat:this.props.cat,name:this.props.name,level:this.props.level}
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps!==this.props){
            this.setState({ _className:nextProps._className,_style:nextProps._style})
            return true
        }else{
            return false
        }
    }
    render() { 
        return ( 
            <div className="game-card home-card selectable">
                <div className="zombie-char">
                <CatPreview cat={this.state.cat}></CatPreview>
                    <div className="zombie-card card bg-shaded">
                        <div className="card-header bg-dark hide-overflow-text">
                            <strong>{this.state.name}</strong>
                        </div>
                        <small className="hide-overflow-text">level {this.state.level} </small>
                    </div>
                </div>
            </div>            
        )
    }
}
 
export default CatCard;