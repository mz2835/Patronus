import React, { Component } from 'react';
import PatronusPreview from "./PatronusPreview"

class PatronusCard extends Component {
    constructor(props) {
        super(props)
        this.state = { patronus:this.props.patronus,name:this.props.name,level:this.props.level}
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
                <PatronusPreview patronus={this.state.patronus}></PatronusPreview>
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
 
export default PatronusCard;