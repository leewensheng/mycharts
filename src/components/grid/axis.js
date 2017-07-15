import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import gridService from './gridService'
import Text from '../../elements/text'
import Line from '../../elements/line'
class  Axis extends Component {
    constructor(props){
        super(props);
        this.state = this.getRenderData(props);      
    }
    getRenderData(props,oldState){
        var {top,left,right,bottom,width,height,axis,option,containLabel} = props;
        var {opposite,type,min,max,dataRange,minRange,splitNumber,data,inverse,title,axisLabel,axisTick} = option;
        var start,end,other;
        if(axis === 'x') {
            start = left;
            end = right;
            other = opposite?top:bottom;
        } else if(axis === 'y') {
            start = bottom;
            end = top;
            other = opposite?right:left;
        }
        if(type === 'value') {
            var axismin = typeof(min)==='number'?min:dataRange.min;
            var axismax = typeof(max)==='number'?max:dataRange.max;
            if(axismin === null||axismax === null) {
                data = [];
            } else {
                data = gridService.getSplitArray(axismin,axismax,splitNumber);
            }
        }
        var points = [];
        var gap = end - start;
        /*
            需要计算数字宽度时，会连续更新两次，导致动画失效，在前一次保持状态
         */
        var keepState = oldState && containLabel&&props.updateType!='adjust';
        data.map(function(value,index){
           var x,y,text;
           if(axis === 'x') {
                x = start + gap*index/(data.length-1);
                y = other;
           } else {
                y = start + gap*index/(data.length-1);
                x = other;
           }
           if(oldState&&oldState.points[index]) {
                if(keepState) {
                    x = oldState.points[index].x;
                    y = oldState.points[index].y;
                }
           }
           points.push({x,y,value});
        });
        if(keepState) {
            start = oldState.start;
            end = oldState.end;
            other = oldState.other;
        }
        var isLabelAdjusted = false;
        if(!containLabel||props.updateType==='adjust') {
            isLabelAdjusted = true;
        }
        var isFirstTime = !oldState;
        return {isLabelAdjusted,points:points,start,end,other,isFirstTime};
    }
    render(){
        var props = this.props;
        var {hasOpposite,top,left,right,bottom,width,height,axis,min,max,option,containLabel,updateType} = props;
        var {opposite,type,min,max,dataRange,minRange,splitNumber,inverse,title,axisLine,gridLine,axisLabel,axisTick} = option;
        var state = this.state;
        var {isLabelAdjusted,points,start,end,other,isFirstTime} = state;
        var x1,y1,x2,y2;
        if(axis === 'x') {
            y1 = y2 = other;
            x1 = start;
            x2 = end;
        } else {
            x1 = x2 = other;
            y1 = start;
            y2 = end;
        };
        var labels = [],ticks = [],gridLines = [];
        var labelFlag = 1,tickFlag = 1,gridFlag = 1;
        if(axisLabel.inside) {
            labelFlag *= -1;
        }
        if(axisTick.inside) {
            tickFlag *= -1;
        }
        if(opposite) {
            labelFlag *= -1;
            tickFlag *= -1;
            gridFlag *= -1;
        }
        points.map(function(point,index){
            var {x,y,value} = point;
            var x1,x2,y1,y2;
            var tickStart,tickEnd;
            if(axis === 'x') {
                y = other + axisLabel.margin*labelFlag;
            } else {
                x = other - axisLabel.margin*labelFlag;
            }
            labels.push({x,y,value});
            if(axis === 'x') {
                x1  = x2 = x;
                y1 = other;
                y2 = other + axisTick.length*tickFlag;
            } else {
                y1 = y2 = y;
                x1 = other;
                x2 = other - axisTick.length*tickFlag;
            }
            ticks.push({x1,x2,y1,y2});
            if(axis === 'x') {
                x1  = x2 = x;
                y1 = other;
                y2 = other - height*gridFlag;
            } else {
                y1 = y2 = y;
                x1 = other;
                x2 = other + width*gridFlag;
            }
            gridLines.push({x1,y1,x2,y2});
        })
        var className = 'vcharts-grid-axis';
        if(axis === 'x') {
            axisLabel.style.textBaseLine = labelFlag==1 ? 'top':'bottom';
            axisLabel.style.textAlign ='center';
            className += ' xAxis';
        } else {
            className += ' yAxis';
            axisLabel.style.textAlign = labelFlag==1 ?'right':'left';
            axisLabel.style.textBaseLine = 'middle';
        };
        if(isFirstTime && containLabel) {
            gridLines = [];
            ticks = [];
        }
        return (
            <g className={className}>
                {
                (!isFirstTime||!containLabel)&&axisLine.enabled
                &&
                <Line  
                        update={updateType==='newProps'&&containLabel?false:true}
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
                            if(index === 0) {
                                return;
                            }
                            if(index === gridLines.length-1&&hasOpposite) {
                                return;
                            }
                            return <Line  
                                    update={updateType==='newProps'&&containLabel?false:true}
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
                                    update={updateType==='newProps'&&containLabel?false:true}
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
        var {option} = props;
        var {setAxisData,axis,indexInGrid,labelRoation} = props;
        var {index,opposite,axisLabel,rotation} = option;
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
            if(axis === "x") {
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
        var {points} = state;
        setAxisData(axis,indexInGrid,{
            data:points.map(function(p){return p.value}),
            index:index,
            labelPlace:labelPlace
        })
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
Axis.defaultProps = {
    hasOpposite:false,
    top:null,
    left:null,
    right:null,
    bottom:null,
    width:null,
    height:null,
    axis:'x',
    labelRoation:0,
    indexInGrid:null,
    option:null
} 
module.exports = Axis;