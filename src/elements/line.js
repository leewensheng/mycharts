import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'
import browser from 'cad/browser'
import PathElement from './path'
import Path from 'cad/path'
//todo 多行支持tspan
class  Line extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        var {props} = this;
        var style = this.props.style||{color:"#333",width:1,type:'solid'};
        var className = this.props.className;
        var {x1,y1,x2,y2,animation} = props;
        var d = new Path().M(x1,y1).L(x2,y2);
        var transform = "";
        if(browser.msie) {
            transform = 'translate(0.5,0.5)';
        }
        return <PathElement animation={animation} transform={transform} style={{shapeRendering:"optimizeSpeed"}} d={d} stroke={style.color} fill="none" strokeWidth={style.width}/> 
    }
}
Line.defaultProps = 
{
    animation:true,
    x1:0,
    y1:0,
    x2:0,
    y2:0,
    style:{
        color:'#333',
        width:1,
        type:'solid'
    }
}
module.exports = Line;