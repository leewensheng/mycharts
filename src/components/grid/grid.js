import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Axis from '../axis/axisView'
import Rect from '../../elements/rect'
export default class Grid extends Component {
	constructor(props){
		super(props);
		var {left,top,right,bottom,width,height} = props;
		this.setAxisData = this.setAxisData.bind(this);
		var gridAxis = this.getGridAxis(props,left,top,right,bottom);
		this.state =  {
			top,left,right,bottom,width,height,gridAxis
		}
	}
	getGridAxis(props,left,top,right,bottom){
		var {xAxis,yAxis,includeSeries} = props;
		var gridAxis = xAxis.concat(yAxis).map(function(axis,indexInGrid){
			var {type,min,max,splitData,option,includeSeries} = axis;
			var {opposite}  = option;
			var start ,end , other,interval,zeroPoisition = null;
			if(axis.axis === 'xAxis') {
	            start = left;
	            end = right;
	            other = opposite?top:bottom;
	        } else if(axis.axis === 'yAxis') {
	            start = bottom;
	            end = top;
	            other = opposite?right:left;
	        }
	        if(option.inverse) {
	        	var tempVar =  start;
	        	start = end;
	        	end = tempVar;
	        }
	       if(type === 'value' && min * max < 0) {
	       		zeroPoisition = start + (0 - min)/(max - min)*(end  - start);
	       }
	       if(type === 'value') {
	        	if(splitData.length === 1) {
	        		interval = end - start;
	        	} else {
	        		interval = (end - start)/(splitData.length - 1);
	        	}
	       } else if(type === 'category') {
	       		if(option.categories.length === 1) {
	       			interval = end - start;
	       		} else {
	       			interval = (end - start) / (option.categories.length - 1);
	       		}
	       }
	       return {
	       		start,end,interval,other,zeroPoisition,axisData:axis,labelPlace:{}
	       }
		})
		includeSeries.map(function(series){
			var xAxisIndex = series.xAxis;
			var yAxisIndex = series.yAxis;
			var xAxisData = gridAxis.filter(function(axis){
				var {axisData} = axis;
				return axisData.option.index === xAxisIndex && axisData.axis === 'xAxis';
			})[0];
			var yAxisData = gridAxis.filter(function(axis){
				var {axisData} = axis;
				return axisData.option.index === yAxisIndex && axisData.axis === 'yAxis';
			})[0];
			if(xAxisData.axisData.type === 'value' && yAxisData.axisData.option.axisLine.onZero) {
				if(xAxisData.zeroPoisition !== null) {
					yAxisData.other = xAxisData.zeroPoisition;
				}
			}
			if(yAxisData.axisData.type === 'value' && xAxisData.axisData.option.axisLine.onZero) {
				if(yAxisData.zeroPoisition !== null) {
					xAxisData.other = yAxisData.zeroPoisition;
				}
			}
			xAxisData.otherAxisPosition = yAxisData.other;;
			yAxisData.otherAxisPosition = xAxisData.other;
		})
		return gridAxis;
	}
	render(){
		var {props,state} = this;
		var setAxisData = this.setAxisData;
		var {background,xAxis,yAxis,containLabel} = props;
		var {gridAxis,updateType,left,top,right,bottom,width,height,hasInited}  = state;
		return (
			<g className="vcharts-grid">
				{
                    hasInited
                    &&
                    <Rect update={containLabel?updateType==='adjust':true} className="vcharts-grid-backgrould" x={left} y={top} width={width} height={height} fill={background}/>
				}
				{
					gridAxis.map(function(axis,gridAxisIndex){
						var hasOpposite;
						var {start,end,other,axisData,zeroPoisition,otherAxisPosition} = axis;
						return <Axis 	
									key={'xaxis'+gridAxisIndex}
									start = {start}
									end={end}
									other={other}
									top={top}
									left={left}
									right={right}
									bottom={bottom}
									axisData={axisData}
									containLabel={containLabel}
									hasOpposite={false}
									setAxisData={setAxisData}
									updateType={updateType}
									gridAxisIndex={gridAxisIndex}
									zeroPoisition={zeroPoisition}
									otherAxisPosition={otherAxisPosition}
									/>
					})
				}
			</g>
		)
	}
	setAxisData(index,data){
		var {gridAxis} = this.state;
		var axis = gridAxis[index];
		axis.computed = true;
		axis.labelPlace = data;
		var isNotReady = gridAxis.some(function(axis){
			return !axis.computed;
		})
		if(!isNotReady) {
			this.onAxisReady();
		}
	}
	onAxisReady(){
		var that = this;
		var {props,state} = this;
		var {top,left,right,bottom,width,height,containLabel} = props;
		var {gridAxis} = state;
		var 
			leftLabelWidth = 0,
			rightLabelWidth = 0,
			bottomLabelHeight = 0,
			topLabelHeight = 0;
		if(containLabel) {
            gridAxis.map(function(axis){
		        topLabelHeight += axis.labelPlace.top;
		        bottomLabelHeight += axis.labelPlace.bottom;
		        rightLabelWidth += axis.labelPlace.right;
		        leftLabelWidth += axis.labelPlace.left;
		    });        
        }
        left += leftLabelWidth,
        top +=  topLabelHeight,
        right -= rightLabelWidth,
        bottom  -= bottomLabelHeight,
        width = right - left;
        height = bottom - top;
        gridAxis = that.getGridAxis(props,left,top,right,bottom);
        var updateType = 'adjust';
        var hasInited  = true;
        this.setState({left,right,top,bottom,width,height,gridAxis,updateType,hasInited});
	}
	sendGridInfo(){
		var {props,state} = this;
		var {includeSeries,chartEmitter} = props;
		var {top,left,right,bottom,width,height,gridAxis} = state;
		includeSeries.map(function(series) {
			var  {seriesIndex} = series;
			var xAxisIndex = series.xAxis;
			var yAxisIndex = series.yAxis;
			var xAxisData = gridAxis.filter(function(axis){
				return axis.axisData.option.index === xAxisIndex && axis.axisData.axis === 'xAxis';
			})[0];
			var yAxisData = gridAxis.filter(function(axis){
				return axis.axisData.option.index === yAxisIndex && axis.axisData.axis === 'yAxis';
			})[0];
			var isEmpty = !includeSeries.length;
			var reversed = false;
			if(xAxisData.axisData.type === 'value' && yAxisData.axisData.type === 'category') {
				reversed = true;
			}
			chartEmitter.emit('grid',{
				seriesIndex:seriesIndex,
				xAxis:xAxisData,
				yAxis:yAxisData,
				top,left,right,
				bottom,width,height,
				reversed,
				isEmpty
			});
		})
	}
	componentWillReceiveProps(nextProps){
		var {left,top,right,bottom} = nextProps;
		var gridAxis = this.getGridAxis(nextProps,left,top,right,bottom);
		var updateType = 'newProps';
		this.setState({updateType,gridAxis});
	}
	componentDidUpdate(){
		if(this.state.updateType === 'adjust') {
			this.sendGridInfo();
		}
	}
}