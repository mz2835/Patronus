import React,{Component} from 'react'

class PatronusPreview extends Component  {
    constructor(props){
        super(props)
        this.state = { patronus:this.props.patronus,_style:this.props._style,_className:this.props._className}
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps!==this.props){
            this.setState({ 
                
                patronus:nextProps.patronus,
                _style:nextProps._style,
                _className:nextProps._className,
            })
            return true
        }else{
            return false
        }
    }
    render(){
        var _style = this.state._style || []
        var _className = this.state._className
        if(this.state.patronus !== undefined){
            _style['color'] = {filter:"hue-rotate(0deg)"}
            _style['skin'] = {filter:"hue-rotate(0deg)"}
            _style['eye_color'] = {filter:"hue-rotate(0deg)"}
            _className = "zombie-parts head-visible-1 eye-visible-1 shirt-visible-1"
            if(this.state.patronus.dna !== undefined){
                var dna = this.state.patronus.dna
                var _head = dna.substring(0,2) % 8 +1
                _className = "zombie-parts head-visible-"+_head

            }
        }
        return (
                    <div className={_className} id="zombie-parts">
                       {/*  head */}
                        
                        
                        <img alt="" src="./xunlu.png" className="head head-part-1" style={_style['skin']}/>
                        <img alt="" src="./weasel.png" className="head head-part-2" style={_style['skin']}/>
                        <img alt="" src="./vole.png" className="head head-part-3" style={_style['skin']}/>
                        <img alt="" src="./tonkinese cat.png" className="head head-part-4" style={_style['skin']}/>
                        <img alt="" src="./robin.png" className="head head-part-5" style={_style['skin']}/>
                        <img alt="" src="./lion.png" className="head head-part-6" style={_style['skin']}/>
                        <img alt="" src="./hippogriff.png" className="head head-part-7" style={_style['skin']}/>
                        <img alt="" src="./dragon.png" className="head head-part-8" style={_style['skin']}/>
                        <img alt="" src="./grey squirrel.png" className="head head-part-9" style={_style['skin']}/> 
                        <img alt="" src="./erumpent.png" className="head head-part-10" style={_style['skin']}/> 
                        <img alt="" src="./thestral.png" className="head head-part-11" style={_style['skin']}/> 
                    </div>
        );
      }
    }
    
    
export default PatronusPreview;
