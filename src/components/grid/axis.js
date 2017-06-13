import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import gridService from './gridService'
import Text from '../../widget/text'
import Line from '../../widget/line'
class  Axis extends Component {
    constructor(props){
        super(props);
        var state = this.getRenderData(this.props);        
        if(props.containLabel) {
            state.hasInited = false;
        } else {
            state.hasInited = true;
        }
        this.state = state;
    }
    getRenderData(props){
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
            var axismin,axismax;
            if(typeof min === 'number') {
                axismin = min;
            } else {
                axismin = dataRange.min;
            }
            if(typeof max === 'number') {
                axismax = max;
            } else  {
                axismax = dataRange.max;
            }
            data = gridService.getSplitArray(axismin,axismax,splitNumber);
        }
        var splits = data.map(function(val,index){
            return start + (end - start)*index/(data.length - 1);
        });

        return {
            hasInited:true,
            start:start,
            end:end,
            other:other,
            splits:splits,
            data:data
        }
    }
    render(){
        var props = this.props;
        var {hasOpposite,top,left,right,bottom,width,height,axis,min,max,option} = props;
        var {opposite,type,min,max,dataRange,minRange,splitNumber,inverse,title,axisLine,gridLine,axisLabel,axisTick} = option;
        var state = this.state;
        var {start,end,other,splits,data} = state;
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
        var labelFlag = 1;
        if(axisLabel.inside) {
            labelFlag*= -1;
        }
        if(opposite) {
            labelFlag*= -1;
        }
        var labels = splits.map(function(val,index){
            var x,y,text;
            text = data[index];
            if(axis === 'x') {
                y = other + axisLabel.margin*labelFlag;
                x = val;
            } else {
                x = other - axisLabel.margin*labelFlag;
                y  = val;
            }
            return {x,y,text};
        });
        var tickFlag = 1;
        if(axisTick.inside) {
            tickFlag*= -1;
        }
        if(opposite) {
            tickFlag*= -1;
        }
        var ticks = splits.map(function(val,index){
            var x1,y1,x2,y2;
            if(axis === 'x') {
                x1  = x2 = val;
                y1 = other;
                y2 = other + axisTick.length*tickFlag;
            } else {
                y1 = y2 = val;
                x1 = other;
                x2 = other - axisTick.length*tickFlag;
            }
            return {x1,y1,x2,y2};
        })
        var gridFlag = 1;
        if(opposite) {
            gridFlag *= -1;
        }
        var gridLines = splits.map(function(val,index){
            var x1,y1,x2,y2;
            if(axis === 'x') {
                x1  = x2 = val;
                y1 = other;
                y2 = other - height*gridFlag;
            } else {
                y1 = y2 = val;
                x1 = other;
                x2 = other + width*gridFlag;
            }
            return {x1,y1,x2,y2};
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
        var {hasInited} = state;
        if(!hasInited) {
            gridLines = [];
            ticks = [];
        }
        return (
            <g className={className}>
                {
                hasInited
                &&
                <Line   className="vcharts-axis-line" 
                        x1={x1} 
                        y1={y1} 
                        x2={x2} 
                        y2={y2} 
                        style={axisLine.lineStyle} />                
                    }

                <g className="vhcart-axis-gridline">
                    {
                        gridLines.map(function(grid,index){
                            var {x1,y1,x2,y2} = grid;
                            if(index === 0) {
                                return;
                            }
                            if(index === gridLines.length-1&&hasOpposite) {
                                return;
                            }
                            return <Line  
                                    key={index} 
                                    x1={x1} 
                                    y1={y1} 
                                    x2={x2} 
                                    y2={y2} 
                                    style={gridLine.lineStyle} />
                        })
                    }
                </g>
                <g className="vcharts-axis-labels">
                {
                    labels.map(function(label,index){
                        return <Text 
                                    animation={false}
                                    key={index} 
                                    x={label.x} 
                                    y={label.y} 
                                    opacity={hasInited?1:0}
                                    style={axisLabel.style}>{label.text}</Text>
                    })
                }
                </g>
                <g className="vcharts-axis-tick">
                    {
                        ticks.map(function(tick,index){
                            var {x1,y1,x2,y2} = tick;
                            return <Line   
                                    key={index}
                                    x1={x1} 
                                    y1={y1} 
                                    x2={x2} 
                                    y2={y2} 
                                    style={axisTick.lineStyle} />
                        })
                    }
                </g>
            </g>
        )
    }
    componentWillReceiveProps(nextProps){
        var nextState = this.getRenderData(nextProps);
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
        var {data} = state;
        setAxisData(axis,indexInGrid,{
            data:data,
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