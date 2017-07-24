import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Paper from 'cad/paper/index'
import Text from '../../elements/text'
import Polyline from '../../elements/polyline'
import Circle from '../../elements/circle'
import defaultOption from './option'
import LineIcon from './icon';
class Linechart extends Component {
    constructor(props){
        super(props);
        this.onLegendChange = this.onLegendChange.bind(this);
        this.onGridChange = this.onGridChange.bind(this);
        this.onLegendHover = this.onLegendHover.bind(this);
        props.chartEmitter.on('grid',this.onGridChange);
        props.chartEmitter.on('legendVisibleToggle',this.onLegendChange);
        props.chartEmitter.on('legend.hoverChange',this.onLegendHover);
        this.state = {
            hasInited:false,
            isGridReady:false,
            visible:props.series.visible
        };
    }
    render(){
        var that = this;
        var {props,state} = this;
        var {width,height,series,option,seriesIndex} = props;
        var {color,lineWidth,linecap,lineDash,data,xAxis,yAxis,dataLabels,marker} = series;
        var {isGridReady,grid,legend,hasInited,visible} = this.state;
        if(!isGridReady) {
            return <g></g>;
        }
        var {left,top,right,bottom,width,height} = grid;
        var points = [];
        var color = series.color||option.colors[seriesIndex];
        var xAxisData = grid.xAxis,yAxisData = grid.yAxis;
        var min = yAxisData.data[0],max = yAxisData.data[yAxisData.data.length-1];
        var scale = (max - min)/height;
        var len = xAxisData.data.length;
        data.map(function(val,index){
            var x = left + index*width/(len-1);
            var y = bottom  - (val-min)/scale;
            points.push({x,y});
        });
        if(typeof visible === 'undefined') {
            visible = true;
        }
        return (
            <g className="vcharts-series vcharts-line-series" style={{display:visible?'':'none'}}>
                <Polyline className="vcharts-series-polyline" points={points}  stroke={color} fill='none' strokeLinecap={linecap} strokeDasharray={lineDash=='solid'?'':'5,5'} strokeWidth={lineWidth}/>
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
    onLegendChange(msg){
        if(msg.seriesIndex == this.props.seriesIndex) {
            this.setState({visible:msg.visible});
        }
    }
    onGridChange(grid){
        if(grid.seriesIndex == this.props.seriesIndex) {
            this.setState({grid,isGridReady:true,hasInited:true});
            this.forceUpdate();
        }
    }
    onLegendHover(msg){
        var {index,eventType} = msg;
        if(index === this.props.seriesIndex) {
            if(eventType === 'mouseover') {
            } else {
            }
        }
    }
    animate(){
        var {props,state} = this;
        var {option} = props;
        var {grid} = state;
        var {top,left,width,height} = grid;
        var el = findDOMNode(this);
        var {seriesIndex} = props;
        var svg = $(el).closest("svg").get(0);
        var paper = new Paper(svg);
        var clip = paper.clipPath(function(){
            paper.rect(left,top,0,height);
        });
        clip.attr("id","line-clip"+seriesIndex);
        $(el).attr("clip-path","url(#line-clip"+ seriesIndex +")");
        var rect = clip.find("rect");
        $(el).find('.series-line-labels').hide();
        rect.transition({width:width},600,'linear',function(){
            clip.remove();
            $(el).removeAttr('clip-path');
            $(el).find('.series-line-labels').show();
        });
        paper.destroy();
    }
    componentDidMount(){
        var el = findDOMNode(this);
        var that = this;
        setInterval(function(){
           that.props.chartEmitter.emit('tooltip.showPoint',{
                name:'test'
            }); 
        },1000)
        
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
        props.chartEmitter.off('legendVisibleToggle',this.onLegendChange);
        props.chartEmitter.off('grid',this.onGridChange);
    }
}
Linechart.defaultOption = defaultOption;
Linechart.dependencies = {
    grid:{
        startOnTick:true
    },
    legend:{
        icon:LineIcon
    }
};
module.exports = Linechart;