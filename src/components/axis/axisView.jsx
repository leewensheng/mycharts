import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Text from '../../elements/text'
import Line from '../../elements/line'
import AxisTitle from './axis-title'
import PathElement from '../../elements/path'

import Path from 'cad/path'
import shape from 'cad/shape'
export default class  Axis extends Component {
    constructor(props){
        super(props);
        var ticks = [];
        var {axisData} = props;
        this.state = {
            renderCount:0,
            labels:axisData.getLabels(),
            ticks:[],
            gridLines:[],
            axisLinePosition:null
        }    
    }
    render(){
        var {props,state} = this;
        var {axisData,updateType,containLabel} = props;
        var {axis,option,includeSeries,min,max,splitData} = axisData;
        var {opposite,startOnTick,type,dataRange,
            minRange,splitNumber,categories,inverse,title,axisLine,
            axisLabel,axisTick,gridLine} = option;
        var {renderCount,labels,ticks,gridLines} = state;
        var labelFlag = 1,tickFlag = 1;
        if(axisLabel.inside) {
            labelFlag *= -1;
        }
        if(opposite) {
            labelFlag *= -1;
        }
        var axisLinePosition = axisData.getAxisLinePosition();
        var className = 'vcharts-grid-axis';
        if(axis === 'xAxis') {
            axisLabel.style.textBaseLine = labelFlag==1 ? 'top':'bottom';
            axisLabel.style.textAlign ='center';
            className += ' xAxis';
        } else {
            className += ' yAxis';
            axisLabel.style.textAlign = labelFlag==1 ?'right':'left';
            axisLabel.style.textBaseLine = 'middle';
        };
        var update = updateType === 'adjust'|| !containLabel;
        var tickPath  = shape.getShapesPath(ticks);
        var gridPath = shape.getShapesPath(gridLines);
        return (
            <g className={className}>
                {
                    renderCount > 0 
                    && 
                    <AxisTitle update={update} axisData={axisData}/>
                }
                {
                    renderCount > 0 
                    &&
                <Line   
                    update={update}
                    className="vcharts-axis-line" 
                    x1={axisLinePosition.x1} 
                    y1={axisLinePosition.y1} 
                    x2={axisLinePosition.x2} 
                    y2={axisLinePosition.y2} 
                    stroke={axisLine.lineColor}
                    strokeWidth={axisLine.lineWidth}
                    style={axisLine.style}/>                
                }
                {
                    gridLine.enabled
                    &&
                    <PathElement  
                    className="vhcart-axis-gridline"
                    d={gridPath}
                    stroke={gridLine.lineColor}
                    strokeWidth={gridLine.lineWidth}
                    style={gridLine.style}
                    />
                }
                <g className="vcharts-axis-labels">
                {
                    axisLabel.enabled
                    &&
                    labels.map(function(label,index){
                        var {x,y,text,isAdd} = label;
                        return <Text 
                                    key={index} 
                                    animation={renderCount>1&&!isAdd}
                                    x={label.x} 
                                    y={label.y} 
                                    opacity={renderCount==0&&containLabel?0:1}
                                    style={axisLabel.style}>{label.text}</Text>
                    })
                }
                </g>
                {
                    axisTick.enabled
                    &&
                    <PathElement   
                        d={tickPath}
                        className="vcharts-axis-tick"
                        stroke={axisTick.lineColor}
                        strokeWidth={axisTick.lineWidth}
                        style={axisTick.style} />
                }
            </g>
        )
    }
    componentWillReceiveProps(nextProps){
        var {props,state} = this;
        var {axisData} = nextProps;
        var {renderCount} = this.state;
        var {gridLines,ticks,labels} = state;
        renderCount++;
        if(nextProps.updateType === 'adjust') {
            labels = axisData.getLabels().map(function(label,index){
                if(labels[index]) {
                    label.isAdd = labels[index].isAdd;
                }
                return label;
            });
            ticks = axisData.getTicks().map(function(tick,index){
                if(ticks[index]) {
                    tick.isAdd = ticks[index].isAdd
                } else {
                    tick.isAdd = true;
                }
                return tick;
            });
            gridLines = axisData.getGridLines().map(function(gridLine,index){
                if(gridLines[index]) {
                    gridLine.isAdd = gridLines[index].isAdd;
                } else {
                    gridLine.isAdd = true;
                }
                return gridLine;
            });
        } else if(nextProps.updateType==='newProps' && axisData.includeSeries.length){
            labels = axisData.getLabels().map(function(label,index){
                if(!labels[index]){
                    label.isAdd = true;
                } else {
                    label.x = labels[index].x;
                    label.y = labels[index].y;
                    label.isAdd = false;
                }
                return label;
            });
        }
        this.setState({renderCount,labels,ticks,gridLines});
    }
    sendAxisData(){
        var {props,state} = this;
        var {setAxisData,axisData,containLabel,updateType,gridAxisIndex} = props;
        var {axis,option,includeSeries,min,max,splitData} = axisData;
        var {index,opposite,type,dataRange,minRange,splitNumber,categories,inverse,title,axisLine,axisLabel,axisTick,gridLine} = option;
        var labelSize;
        var el = findDOMNode(this);
        if(axisLabel.inside||!axisLabel.enabled) {
            labelSize = 0;
        } else {
            var labelSize = 0;
            $(el).find('.vcharts-axis-labels text').each(function(index,label){
                var size = label.getComputedTextLength();
                labelSize = Math.max(labelSize,size);
            })
        };
        var labelPlace = {
            top:0,
            left:0,
            right:0,
            bottom:0
        };
        if(!axisLabel.inside) {
            if(axis === "xAxis") {
                if(!opposite) {
                    labelPlace.bottom = axisLabel.style.fontSize + axisLabel.margin;
                } else {
                    labelPlace.top = axisLabel.style.fontSize + axisLabel.margin;
                }   
            } else {
                if(!opposite) {
                    labelPlace.left = labelSize + axisLabel.margin;
                } else {
                    labelPlace.right = labelSize + axisLabel.margin;
                } 
            }
        } 
        //应当使用轴的极值
        setAxisData(gridAxisIndex,labelPlace);
    }
    componentDidMount(){
        this.sendAxisData();
    }
    componentDidUpdate(){
        if(this.props.updateType==='newProps') {
            this.sendAxisData();
        }
    }
}
