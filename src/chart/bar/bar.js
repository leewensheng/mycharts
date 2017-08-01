import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Paper from 'cad/paper/index'
import Text from '../../elements/text'
import Rect from '../../elements/rect'
import defaultOption from './option'
import BarIcon from './icon';
class Bar extends Component {
    constructor(props){
        super(props);
        this.onLegendChange = this.onLegendChange.bind(this);
        this.onGridChange = this.onGridChange.bind(this);
        this.onLegendHover = this.onLegendHover.bind(this);
        props.chartEmitter.on('grid',this.onGridChange);
        props.chartEmitter.on('legend',this.onLegendChange);
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
        data.map((val,index) => {
            var x = left + index*width/(len-1);
            var y = bottom  - (val-min)/scale;
            points.push({x,y,width:20,height:y-bottom});
        });
        if(typeof visible === 'undefined') {
            visible = true;
        }
        return (
            <g className="vcharts-series vcharts-bar-series" style={{display:visible?'':'none'}}>
            	<g>
            		{
            			points.map((point,index) => {
            				var {x,y,width,height} = point;
            				return <Rect 
            							x={x} 
            							y={y}
            							width={width}
            							height={height}
            							key={index}
            							fill={color}

            						/>
            			})
            		}
            	</g>
            </g>
        );
    }
    onLegendChange(msg){
        if(msg.seriesIndex == this.props.seriesIndex) {
            this.setState({visible:msg.data.selected});
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
    }
    componentDidMount(){
        var el = findDOMNode(this);
        var that = this;
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
Bar.defaultOption = defaultOption;
Bar.dependencies = {
    grid:{
        startOnTick:false,
        stackAble:true
    },
    legend:{
        must:false,
        icon:BarIcon
    }
};
module.exports = Bar;