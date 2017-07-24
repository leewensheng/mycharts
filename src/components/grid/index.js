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
        setAxisDataRange(xAxis,'xAxis');
        setAxisDataRange(yAxis,'yAxis');

        function setAxisDataRange(someAxis,key){
            someAxis.map(function(axis){
                var type = axis.type;
                var axisIndex = axis.index;
                var gridIndex = axis.gridIndex;
                var grid = grids[gridIndex];
                var arr = [];
                var includeSeries = series.filter(function(serie,index){
                    if(!visibleSeries[index]) {
                        return false;
                    }
                    var type = serie.type;
                    var chart = charts[type];
                    if(!type||!chart) {
                        return;
                    }
                    var dependencies = chart.dependencies||{};
                    if(!dependencies.grid) {
                        return;
                    }
                    var isInclude = (serie[key]||0) === axisIndex;
                    if(isInclude) {
                        arr.push(index);
                        return isInclude;
                    }
                });
                if(type === 'value') {
                    var dataRange = gridService.getValueRange(includeSeries);
                    axis.dataRange = dataRange;
                } else if(type === 'category') {
                    //如果未设置data，则从系列中获取
                    if(!axis.data) {
                        axis.data = gridService.getCategories(includeSeries);
                    }
                }
                arr.map(function(index){
                   if(!grid.includeSeries[index]) {
                        grid.includeSeries[index] = {};
                   } 
                   grid.includeSeries[index][key] = axis.index;
                })
            });
        }
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