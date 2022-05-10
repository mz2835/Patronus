import React, { Component } from 'react';

import CatGarten from "./CatGarten"
import MyCat from "./MyCat"
import CatDetail from "./CatDetail"

import  CatMarket  from "./CatMarket"
import CatFriend from "./CatFriend";
import ContractAdmin from "./ContractAdmin"

class Page extends Component {
    constructor(props) {
        super(props)
        this.state = {page:'',id:0 }
    }
    componentDidMount(){
        let search = this.props.location.search.replace(/\?/,'').split("&")
        let page = search[0]
        this.setState({page:page})
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps!==this.props){
            this.setState({nextProps})
            let search = nextProps.location.search.replace(/\?/,'').split("&")
            let page = search[0] === '' ?  'CatGarten' : search[0]
            this.setState({page:page})
            return true
        }else{
            return false
        }
    }
    render() { 
        switch (this.state.page){


            case 'CatGarten':
                return(<CatGarten></CatGarten>)
            case 'MyCat':
                return(<MyCat></MyCat>)
            case 'CatMarket':
                return(<CatMarket></CatMarket>)
 
            case 'CatDetail':
                return(<CatDetail></CatDetail>)
            case 'CatFriend':
                return(<CatFriend></CatFriend>)

            case 'ContractAdmin':
                return(<ContractAdmin></ContractAdmin>)
            default:
                return(<CatGarten></CatGarten>)
        }
    }
}
 
export default Page;