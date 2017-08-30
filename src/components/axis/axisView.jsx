import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Text from '../../elements/text'
import Line from '../../elements/line'
import AxisTitle from './axis-title'
export default class  Axis extends Component {
    constructor(props){
        super(props);
        this.state = this.getRenderData(props);      
    }
    getRenderData(props,oldState){
        var {start,end,other,axisData,containLabel,updateType} = props;
        var {axis,option,includeSeries,min,max,splitData} = axisData;
        var {opposite,type,dataRange,minRange,splitNumber,categories,inverse,title,axisLine,axisLabel,axisTick,gridLine} = option;
        var points = [];
        var gap = end - start;
        var data = [];
        if(type === 'category') {
            data = categories;
        } else {
            data = splitData;
        }
        /*
            需要计算数字宽度时，会连续更新两次，导致动画失效，在前一次保持状态
         */
        var keepState = oldState&&props.updateType!='adjust';
        data.map(function(value,index){
           var x,y,text;
           if(axis === 'xAxis') {
                if(data.length > 1) {
                    x = start + gap*index/(data.length-1);
                } else {
                    x  = (start + end) / 2;
                }

                y = other;
           } else {
                if(data.length > 1) {
                    y = start + gap*index/(data.length-1);
                } else {
                    y = (start + end ) / 2;
                }
                
                x = other;
           }
           if(oldState&&oldState.points[index]) {
                if(keepState) {
                    x = oldState.points[index].x;
                    y = oldState.points[index].y;
                }
           }
           points.push({x,y,value});
        })
        if(keepState) {
            start = oldState.start;
            end = oldState.end;
            other = oldState.other;
        }
        var isLabelAdjusted = false;
        if(props.updateType==='adjust') {
            isLabelAdjusted = true;
        }
        var isFirstTime = !oldState;
        return {isLabelAdjusted,points,isFirstTime};
    }
    render(){
        var {props,state} = this;
        var {axisData,start,end,other,zeroPoisition,otherAxisPosition,containLabel,updateType,hasOpposite,top,left,right,bottom,width,height} = props;
        var {axis,option,includeSeries,min,max,splitData} = axisData;
        var {opposite,type,dataRange,minRange,splitNumber,categories,inverse,title,axisLine,axisLabel,axisTick,gridLine} = option;
        var {isLabelAdjusted,points,isFirstTime} = state;
        var x1,y1,x2,y2;
        if(axis === 'xAxis') {
            y1 = y2 = other;
            x1 = start;
            x2 = end;
        } else {
            x1 = x2 = other;
            y1 = start;
            y2 = end;
        };
        var labels = [],ticks = [],gridLines = [];
        var labelFlag = 1,tickFlag = 1;
        if(axisLabel.inside) {
            labelFlag *= -1;
        }
        if(axisTick.inside) {
            tickFlag *= -1;
        }
        if(opposite) {
            labelFlag *= -1;
            tickFlag *= -1;
        }
        if(!includeSeries.length&&type === 'value') {
            points = [];
        }
        points.map(function(point,index){
            var {x,y,value} = point;
            var x1,x2,y1,y2;
            if(axis === 'xAxis') {
                y = (opposite?top:bottom) + axisLabel.margin*labelFlag;
            } else {
                x = (opposite?right:left) - axisLabel.margin*labelFlag;
            }
            labels.push({x,y,value});
            if(axis === 'xAxis') {
                x1  = x2 = x;
                y1 = other;
                y2 = other + axisTick.length*tickFlag;
            } else {
                y1 = y2 = y;
                x1 = other;
                x2 = other - axisTick.length*tickFlag;
            }
            ticks.push({x1,x2,y1,y2});
            if(axis === 'xAxis') {
                x1  = x2 = x;
                y1 = top;
                y2 = bottom;
            } else {
                y1 = y2 = y;
                x1 = left;
                x2 = right;
            }
            gridLines.push({x1,y1,x2,y2});
        })
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
        if(isFirstTime && containLabel) {
            //等文本宽度计算后再渲染
            gridLines = [];
            ticks = [];
        }
        return (
            <g className={className}>
                {
                    !isFirstTime&&title.enabled&&title.text
                    &&
                    <AxisTitle update={updateType==='newProps'&&containLabel?false:true} axis={axis} option={option} start={start} end={end} other={other} top={top} left={left} right={right} bottom={bottom}/>
                }
                {
                (!isFirstTime||!containLabel)&&axisLine.enabled
                &&
                <Line   update={updateType==='newProps'&&containLabel?false:true}
                        className="vcharts-axis-line" 
                        x1={x1} 
                        y1={y1} 
                        x2={x2} 
                        y2={y2} 
                        stroke={axisLine.lineColor}
                        strokeWidth={axisLine.lineWidth}
                        style={axisLine.style}/>                
                }

                <g className="vhcart-axis-gridline">
                    {
                        gridLine.enabled
                        &&
                        gridLines.map(function(grid,index){
                            var {x1,y1,x2,y2} = grid;
                            if(axis === 'yAxis' &&Math.abs(otherAxisPosition - y1)<1e-3) {
                                return;
                            }
                            if(axis === 'xAxis' &&Math.abs(otherAxisPosition - x1)<1e-3) {
                                return;
                            }
                            return <Line   
                                    key={index} 
                                    x1={x1} 
                                    y1={y1} 
                                    x2={x2} 
                                    y2={y2} 
                                    stroke={gridLine.lineColor}
                                    strokeWidth={gridLine.lineWidth}
                                    style={gridLine.style}
                                   />
                        })
                    }
                </g>
                <g className="vcharts-axis-labels">
                {
                    axisLabel.enabled
                    &&
                    labels.map(function(label,index){
                        return <Text 
                                    animation={isLabelAdjusted||!isFirstTime}
                                    key={index} 
                                    x={label.x} 
                                    y={label.y} 
                                    opacity={isFirstTime&&containLabel?0:1}
                                    style={axisLabel.style}>{label.value}</Text>
                    })
                }
                </g>
                <g className="vcharts-axis-tick">
                    {
                        axisTick.enabled
                        &&
                        ticks.map(function(tick,index){
                            var {x1,y1,x2,y2} = tick;
                            return <Line   
                                    update={updateType==='newProps'&&containLabel?false:true}
                                    key={index}
                                    x1={x1} 
                                    y1={y1} 
                                    x2={x2} 
                                    y2={y2} 
                                    stroke={axisTick.lineColor}
                                    strokeWidth={axisTick.lineWidth}
                                    style={axisTick.style} />
                        })
                    }
                </g>
            </g>
        )
    }
    componentWillReceiveProps(nextProps){
        var oldState = this.state;
        var nextState = this.getRenderData(nextProps,oldState);
        this.setState(nextState);
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
