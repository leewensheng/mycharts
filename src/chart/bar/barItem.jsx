import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Text from '../../elements/text'
import Rect from '../../elements/rect'

import colorHelper from 'cad/color/index'

export default class BarItem extends Component {
    constructor(props) {
        super(props);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.state = {
            renderCount:0
        };
    }
    render(){
        var {props,state} = this;
        var {animated,updateType} = state;
        var {animation,isAdd,visible,inCord,label,plotStart,plotEnd,startFromAxis,reversed,barWidth,attrs} = props;
        if(animation && !animated) {
            plotEnd = plotStart;
        }
        if(!inCord) {
            plotEnd = plotStart;
        }
        if(updateType === 'newProps' || isAdd) {
            animation = true;
        }
        var x,y,width,height;
        if(!reversed) {
            x = Math.min(plotStart.x - barWidth/2,plotStart.x + barWidth/2);
            y = Math.min(plotStart.y,plotEnd.y);
            width = barWidth;
            height = Math.abs(plotStart.y - plotEnd.y);
        } else {
            x = Math.min(plotStart.x,plotEnd.x);
            y = Math.min(plotStart.y - barWidth/2,plotEnd.y + barWidth/2);
            width = Math.abs(plotStart.x - plotEnd.x);
            height = barWidth;
        }
        if(!visible) {
            if(!reversed) {
                width = 0;
            } else {
                height = 0;
            }
        }

        //datalabel 
        var {dataLabels,valueAxis} = props;
        var {enabled,inside,rotation,padding,align} = dataLabels;
        var labelX,labelY,labelTransform,labelStyle = {};
        var reversed = valueAxis.axis === 'yAxis';
        if(align === 'start') {
            if(inside) {
                labelX = plotStart.x;
                labelY = plotStart.y;
            } else {
                labelX = plotEnd.x;
                labelY = plotEnd.y;
            }
        } else if(align === 'middle') {
            if(inside) {
                labelX = reversed ? (plotStart.x + plotEnd.x)/2:plotStart.x;
                labelY = reversed ? plotStart.y:(plotStart.y + plotEnd.y)/2;
            }
        } else if(align === 'end') {
            if(inside) {
                labelX = plotEnd.x;
                labelY = plotEnd.y;
            } else {
            }
        }
        labelTransform = 'rotate('+ rotation + labelX + ',' + labelY +')';
        return (
        <g>
            <Rect   
                {...attrs}
                animation={animation}
                x={x}
                y={y}
                width={width}
                height={height}
                onMouseOver={this.handleMouseOver} 
                onMouseMove={this.handleMouseMove} 
                onMouseOut={this.handleMouseOut} 
            />
            <Text  
                animation={animation}
                x={plotEnd.x} 
                y={plotEnd.y} 
                style={{color:"#fff",textAlign:'center',textBaseLine:'middle',display:visible&&inCord?'':'none'}}>
                {label}
            </Text>
        </g>
        )

    }
    handleMouseOver(event){
        var {props,state} = this;
        var fillColor = this.props.attrs.fill;
        var hoverColor = colorHelper.brighten(fillColor,0.3);
        var el = findDOMNode(this);
        $(el).find('rect').attr('fill',hoverColor);
        props.toggleToolTip(props.index,true,event);
    }
    handleMouseMove(event){
        var {props,state} = this;
        props.toggleToolTip(props.index,true,event);
    }
    handleMouseOut(event){
        var {props,state} = this;
        var fillColor = props.attrs.fill;
        var el = findDOMNode(this);
        $(el).find('rect').attr('fill',fillColor);
        props.toggleToolTip(props.index,false,event);
    }
    componentDidMount(){
        this.setState({animated:true});
    }
    componentWillReceiveProps(){
        this.setState({updateType:'newProps'});
    }
}