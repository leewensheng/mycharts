import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'
import PathElement from './path'
import Path from 'cad/path'
import browser from 'cad/browser'
//todo 多行支持tspan
class  Line extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        var {props} = this;
        var {x1,y1,x2,y2} = props;
        if(browser.msie) {
        	x1 = parseInt(x1);
        	x2 = parseInt(x2);
        	y1 = parseInt(y1);
        	y2 = parseInt(y2);
            //ie下水平竖直线坐标为整数时，渲染线宽实为2px，需要错开至像素中间点
            if(x1===x2) {
                    x1 += 0.5;
                    x2 += 0.5;
            } 
            if(y1 === y2) {
                y1 += 0.5;
                y2 += 0.5;
            }
        }
        var d = new Path().M(x1,y1).L(x2,y2);
        //  https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/shape-rendering
        //  auto | optimizeSpeed | crispEdges | geometricPrecision | inherit
        var defaultStyle = {shapeRendering:'optimizeSpeed'};
        $.extend(defaultStyle,props.style);
        return <PathElement {...props} style={defaultStyle} d={d} /> 
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