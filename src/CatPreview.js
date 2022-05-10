import React,{Component} from 'react'

class CatPreview extends Component  {
    constructor(props){
        super(props)
        this.state = { cat:this.props.cat,_style:this.props._style,_className:this.props._className}
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps!==this.props){
            this.setState({ 
                
                cat:nextProps.cat,
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
        if(this.state.cat !== undefined){
            _style['color'] = {filter:"hue-rotate(0deg)"}
            _style['skin'] = {filter:"hue-rotate(0deg)"}
            _style['eye_color'] = {filter:"hue-rotate(0deg)"}
            _className = "zombie-parts head-visible-1 eye-visible-1 shirt-visible-1"
            if(this.state.cat.dna !== undefined){
                var dna = this.state.cat.dna
                var _head = dna.substring(0,2) % 8 +1
                _className = "zombie-parts head-visible-"+_head

            }
        }
        return (
                    <div className={_className} id="zombie-parts">
                       {/*  head */}
                        
                        {/* <img alt="" src="./head-3@2x.png" className="head head-part-3" style={_style['skin']}/>
                        <img alt="" src="./head-4@2x.png" className="head head-part-4" style={_style['skin']}/>
                        <img alt="" src="./head-5@2x.png" className="head head-part-5" style={_style['skin']}/>
                        <img alt="" src="./head-6@2x.png" className="head head-part-6" style={_style['skin']}/>
                        <img alt="" src="./head-7@2x.png" className="head head-part-7" style={_style['skin']}/>
                        <img alt="" src="./head-8@2x.png" className="head head-part-8" style={_style['skin']}/> */}
                        <img alt="" src="./cat1.png" className="head head-part-1" style={_style['skin']}/>
                        <img alt="" src="./cat2.png" className="head head-part-2" style={_style['skin']}/>
                        <img alt="" src="./cat3.png" className="head head-part-3" style={_style['skin']}/>
                        <img alt="" src="./cat4.png" className="head head-part-4" style={_style['skin']}/>
                        <img alt="" src="./cat5.png" className="head head-part-5" style={_style['skin']}/>
                        <img alt="" src="./cat6.png" className="head head-part-6" style={_style['skin']}/>
                        <img alt="" src="./cat7.png" className="head head-part-7" style={_style['skin']}/>
                        <img alt="" src="./cat8.png" className="head head-part-8" style={_style['skin']}/>
                        <img alt="" src="./cat9.png" className="head head-part-9" style={_style['skin']}/> 
                        
                        {/* <img alt="" src="./head-2@2x.png" className="head head-part-2" style={_style['skin']}/> */}
                    </div>
        );
      }
    }
    
    
export default CatPreview;
