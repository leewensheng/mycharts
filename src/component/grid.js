import $ from 'jquery'
import {Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'

class  Grid extends Component {
    getDefaultProps(){
        return {
            option:{
                    show:false,
                    left:'auto',
                    top:60,
                    right:'10%',
                    bottom:60,
                    width:'auto',
                    height:'auto',
                    background:'transparent'
                    labelWidth:null,
            },
            width:null,
            height:null,
            xAxis:[],
            yAxis:[]
        }
    }
    getInitialState(){
        
    }
    render(){

    }
    componentDidMount(){

    }
}
