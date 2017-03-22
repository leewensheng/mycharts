import {Component,VNode,findDOMNode} from 'preact'
import $ from 'jquery'
//todo 多行支持tspan
class  DataLabel extends Component{
    getDefaultProps(){
        return {
            x1:0,
            y1:0,
            x2:0,
            y2:0,
            angle:null,
            length:null,
            style:{
                color:'#333',
                width:1,
                type:'solid'
            }
        }
    }
    getInitialState(){
    }
    render(){

    }
    animate(){

    }
    componentWillReceiveProps(){

    }
    componentWillUpdate(){
        $(findDOMNode(this)).stopTransition(true);
    }
    shouldComponentUpdate(nextProps,nextState){
        return false;
    }
}
module.exports = DataLabel;