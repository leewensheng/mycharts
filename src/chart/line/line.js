import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Paper from 'cad/paper'
import Text from '../../widget/text'
import Polyline from './polyline'
import Circle from '../../widget/circle'
import defaultOption from './option'
import LineIcon from './icon';
class Linechart extends Component {
    constructor(props){
        super(props);
        this.onLegendChange = this.onLegendChange.bind(this);
        this.onGridChange = this.onGridChange.bind(this);
        props.chartEmitter.on('grid',this.onGridChange);
        props.chartEmitter.on('legend',this.onLegendChange);
        this.state = {
            hasInited:false,
            isGridReady:false
        };
    }
    render(){
        var that = this;
        var props = this.props;
        var state = this.state;
        var {width,height,series,option,serieIndex} = props;
        var {color,lineWidth,linecap,lineDash,data,xAxis,yAxis,dataLabels,marker} = series;
        var {isGridReady,grid,legend,hasInited} = this.state;
        if(!isGridReady) {
            return <g></g>;
        }
        var {left,top,right,bottom,width,height,width} = grid;
        var points = [];
        var color = series.color||option.colors[serieIndex];
        var xAxisData = grid.xAxis[xAxis],yAxisData = grid.yAxis[yAxis];
        var min = yAxisData.data[0],max = yAxisData.data[yAxisData.data.length-1];
        var scale = (max - min)/height;
        var len = xAxisData.data.length;
        data.map(function(val,index){
            var x = left + index*width/(len-1);
            var y = bottom  - (val-min)/scale;
            points.push({x,y});
        });
        return (
            <g className="vcharts-series vcharts-line-series" style={{display:legend&&legend.selected===false?'none':''}}>
                <Polyline points={points}  stroke={color} fill='none' strokeLinecap={linecap} strokeDasharray={lineDash=='solid'?'':'5,5'} strokeWidth={lineWidth}/>
                <g className="series-line-labels">
                    {
                        dataLabels.enabled
                        &&
                        data.map(function(value,index){
                            var x = points[index].x;
                            var y = points[index].y;
                            return <Text  
                                    key={index}
                                    x={x} 
                                    y={y - 10} 
                                    style={dataLabels.style} 
                                    >{value}</Text>
                        })
                    }
                </g>
                <g className="series-symbols">
                    {
                        marker.enabled
                        &&
                        data.map(function(value,index){
                            var x = points[index].x;
                            var y = points[index].y;
                            return <Circle  
                                        key={index}
                                        cx={x} 
                                        cy={y} r={4} 
                                        fill="#fff" 
                                        stroke={color} 
                                        strokeWidth="1" 
                                        onMouseOver={that.animateSymbol}
                                        onMouseOut={that.animateSymbol} />
                        })
                    }
                </g>
            </g>
        );
    }
    animateSymbol(e){
        var r = 4;
        if(e.type === 'mouseover') {
            r = 6;
        }
        $(e.target).stopTransition().transition({r:r},400,'elasticOut');
    }
    getDependenyData(){
        var props = this.props;
        var {grid,series} = props;
        var {dataLabels} = series;
        var xAxisIndex = series.xAxis;
        var yAxisIndex = series.yAxis;
        var {xAxis,yAxis} = grid;
        var yAxisData,xAxisData;
        yAxis.map(function(axis){
            if(axis.index === yAxisIndex) {
                yAxisData = axis;
            }
        });
        xAxis.map(function(axis){
            if(axis.index === xAxisIndex) {
                xAxisData = axis;
            }
        })
        return {xAxisData,yAxisData};
    }
    onLegendChange(msg){
        if(msg.index == this.props.serieIndex) {
            this.setState({legend:msg.data});
        }
    }
    onGridChange(grid){
        if(grid.index == this.props.serieIndex) {
            this.setState({grid,isGridReady:true,hasInited:true});
        }
    }
    animate(){
        var {props,state} = this;
        var {option} = props;
        var {grid} = state;
        var {top,left,width,height} = grid;
        var el = findDOMNode(this);
        var {serieIndex} = props;
        var svg = $(el).closest("svg").get(0);
        var paper = new Paper(svg);
        var clip = paper.clipPath(function(){
            paper.rect(left,top,0,height);
        });
        clip.attr("id","line-clip"+serieIndex);
        $(el).attr("clip-path","url(#line-clip"+ serieIndex +")");
        var rect = clip.find("rect");
        $(el).find('.series-line-labels').hide();
        rect.transition({width:width},600,'linear',function(){
            clip.remove();
            $(el).removeAttr('clip-path');
            $(el).find('.series-line-labels').show();
        });
        paper.destroy();
    }
    componentWillReceiveProps(){
        this.setState({isGridReady:false});
    }
    shouldComponentUpdate(nextProps,nextState){
        return nextState.isGridReady?true:false;
    }
    componentDidUpdate(prevProps,prevState){
        var {props,state} = this;
        if(state.hasInited != prevState.hasInited) {
            this.animate();
        }
    }
    componentWillUnmount(){
        var {props,state} = this;
        props.chartEmitter.off('legend',this.onLegendChange);
        props.chartEmitter.off('grid',this.onGridChange);
    }
}
Linechart.defaultOption = defaultOption;
Linechart.dependencies = {
    grid:{
        must:true
    },
    legend:{
        must:false,
        icon:LineIcon
    }
};
module.exports = Linechart;