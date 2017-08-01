import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Grid from './grid'
import defaultOption  from './option'
import charts from '../../chart/charts'
import gridService from './gridService'
class  Grids extends Component {
    constructor(props) {
        super(props);
        this.state = this.getRenderData(props),
        this.onLegendChange = this.onLegendChange.bind(this);
        props.chartEmitter.on("legendVisibleChange",this.onLegendChange);
    }
    getRenderData(props,oldState){
    	//todo 计算出grid的大小，和各axis的值范围
        var {chartWidth,chartHeight,chartOption} = props;
        var {grid,xAxis,yAxis,series} = chartOption;
        var grids = [];
        if(!grid) {
            grid = defaultOption.grid;
        }
        if(!xAxis) {
            xAxis = defaultOption.axis;
        }
        if(!yAxis) {
            yAxis = defaultOption.axis;
        };
        if(!grid.length) {
            grids = [{option:grid,xAxis:[],yAxis:[],includeSeries:{}}];
        } else {
            grids = grid.map(function(val){
                return {
                    option:val,
                    xAxis:[],
                    yAxis:[],
                    includeSeries:{}
                }
            })
        };
        if(!xAxis.length) {
            xAxis = [xAxis]
        } 
        xAxis = xAxis.map(function(val,index){
            val = $.extend(true,{},defaultOption.axis,val);
            if(!val.type && !val.data) {
                val.type = 'value';
            } else {
                val.type = val.type || 'category';
            }
            var gridIndex = val.gridIndex;
            val.index = index;
            grids[gridIndex].xAxis.push(val);
            
            return val;
        })
        if(!yAxis.length) {
            yAxis = [yAxis];
        }
        yAxis = yAxis.map(function(val,index){
            val = $.extend(true,{},defaultOption.axis,val);
            if(!val.type && !val.data) {
                val.type = 'value';
            } else {
                val.type = val.type || 'value';
            }
            var gridIndex = val.gridIndex;
            val.index = index;
            grids[gridIndex].yAxis.push(val);
            return val;
        });
        grids.forEach(function(grid){
            var {xAxis,yAxis,option} = grid;
            grid.option = $.extend({},defaultOption.grid,option);
            if(xAxis.length >= 2) {
                xAxis[1].opposite  =  !xAxis[0].opposite;
            }
            if(yAxis.length >= 2) {
                yAxis[1].opposite = !xAxis[0].opposite;
            }
        });
        var visibleSeries  = {};
        series.map(function(val,seriesIndex){
            visibleSeries[seriesIndex] = typeof val.visible === 'undefined' ? true: val.visible;
        })
        if(oldState) {
            $.extend(visibleSeries,oldState.visibleSeries);
        }
        series.map(function(seriesConfig,seriesIndex){
            var type =seriesConfig.type;
            var chart = charts[type];
            if(!chart) {
                return;
            }
            var dependencies = chart.dependencies ||{};
            if(!dependencies.grid) {
                return;
            }
            var xAxisIndex = seriesConfig.xAxis || 0;
            var yAxisIndex = seriesConfig.yAxis || 0;
            var xaxis = xAxis[xAxisIndex]
            var yaxis = yAxis[yAxisIndex];
            var gridIndex = xaxis.gridIndex;
            var max = null;
            var min = null;
            var reversed = false;
            if(!(xaxis.type === 'category' && yaxis.type === 'category')) {
                min = 0;
                max = 5;
            }
            if(xaxis.type === 'category' && yaxis.type === 'value') {
                yaxis.dataRange = {min,max}
            } else if(xaxis.type === 'value' && yaxis.type === 'category') {
                xaxis.dataRange = {min,max};
                reversed = true;
            } else if(xaxis.type === 'value' && yaxis.type === 'value') {
                yaxis.dataRange = {min,max};
            }
            
            grids[gridIndex].includeSeries[seriesIndex] = {
                xAxis:xAxisIndex,
                yAxis:yAxisIndex,
                reversed : reversed
            }
        });
        return {grids,visibleSeries};
    }
    render(){
        var props = this.props;
        var {chartWidth,chartHeight,chartOption,chartEmitter} = props;
        var {grids} = this.state;
        return (
        	<g className='vcharts-grids'>
	        {
	        	grids.map(function(grid,index){
	        	var {xAxis,yAxis,option,includeSeries} = grid;
                var {top,left,bottom,right,background,containLabel} = option;
                var width = chartWidth - right - left;
                var height = chartHeight - bottom - top;
		        return <Grid 
                            key={index}
		        			background={background}
		        			top={top}
		        			left={left}
                            right={left + width}
                            bottom={top + height}
		        			width={width}
		        			height={height}
                            containLabel={containLabel}
		        			xAxis={xAxis}
		        			yAxis={yAxis}
                            chartEmitter={chartEmitter}
                            includeSeries={includeSeries}
                            />
	        	})
	        }
        	</g>);
    }
    onLegendChange(data){
        var {props,state} = this;
        var {visibleSeries} = state;
        $.extend(visibleSeries,data.visible);
        var nextState = this.getRenderData(props,state);
        this.setState(nextState);
    }
    componentDidMount(){
        var {props,state} = this;
        var {chartEmitter} = props;
    }
    componentWillReceiveProps(nextProps){
        var nextState = this.getRenderData(nextProps,this.state);
        this.setState(nextState);
    }
    componentWillUnmount(){
        this.props.chartEmitter.removeListener('legendVisibleChange',this.onLegendChange);
    }
}
Grids.defaultProps = {
    chartOption:null,
    chartWidth:null,//图表宽度
    chartHeight:null,//图表高度
    chartEmitter:null,
    isReady:false
}
module.exports = Grids;