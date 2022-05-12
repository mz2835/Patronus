import React, { Component } from 'react';

import PatronusKingdom from "./PatronusKingdom"
import MyPatronus from "./MyPatronus"
import PatronusDetail from "./PatronusDetail"

import  PatronusMarket  from "./PatronusMarket"
import PatronusFriend from "./PatronusFriend";
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
            let page = search[0] === '' ?  'PatronusKingdom' : search[0]
            this.setState({page:page})
            return true
        }else{
            return false
        }
    }
    render() { 
        switch (this.state.page){


            case 'PatronusKingdom':
                return(<PatronusKingdom></PatronusKingdom>)
            case 'MyPatronus':
                return(<MyPatronus></MyPatronus>)
            case 'PatronusMarket':
                return(<PatronusMarket></PatronusMarket>)
 
            case 'PatronusDetail':
                return(<PatronusDetail></PatronusDetail>)
            case 'PatronusFriend':
                return(<PatronusFriend></PatronusFriend>)

            case 'ContractAdmin':
                return(<ContractAdmin></ContractAdmin>)
            default:
                return(<PatronusKingdom></PatronusKingdom>)
        }
    }
}
 
export default Page;