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
        var {x1,y1,x2,y2} = props;
        var d = new Path().M(x1,y1).L(x2,y2);
        //  https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/shape-rendering
        //  auto | optimizeSpeed | crispEdges | geometricPrecision | inherit
        var defaultStyle = {shapeRendering:'optimizeSpeed'};
        $.extend(defaultStyle,props.style);
        if(browser.msie&& x1===x2 || y1===y2) {
            return <PathElement transform='translate(0.5,0.5)' {...props} style={defaultStyle} d={d} /> 
        }
        return <PathElement {...props} style={{shapeRendering:"optimizeSpeed "}} d={d} /> 
    }
}
Line.defaultProps = 
{
    animation:true,
    x1:0,
    y1:0,
    x2:0,
    y2:0,
    strokeWidth:1,
    stroke:'#333'
}
module.exports = Line;