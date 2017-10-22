import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Axis from '../axis/axisView'
import Rect from '../../elements/rect'

import GridClass from './gridClass'
export default class Grid extends Component {
	constructor(props){
		super(props);
		var {left,top,right,bottom,width,height} = props;
		this.setAxisData = this.setAxisData.bind(this);
		var gridAxis = this.getGridAxis(props,top,left,right,bottom);
		this.state =  {
			top,left,right,bottom,width,height,gridAxis
		}
	}
	getGridAxis(props,top,left,right,bottom){
		var {xAxis,yAxis,includeSeries} = props;
		var gridAxis = xAxis.concat(yAxis).map(function(axis,indexInGrid){
			return axis.computedAxisPosition({top,left,right,bottom});
		});
		//支持轴在零上
		includeSeries.map(function(series){
			var xAxisIndex = series.xAxis;
			var yAxisIndex = series.yAxis;
			var xAxisData = gridAxis.filter(function(axis){
				return axis.index === xAxisIndex && axis.axis === 'xAxis';
			})[0];
			var yAxisData = gridAxis.filter(function(axis){
				return axis.index === yAxisIndex && axis.axis === 'yAxis';
			})[0];
			if(xAxisData.type === 'value' && yAxisData.option.axisLine.onZero) {
				if(xAxisData.min*xAxisData.max < 0) {
					yAxisData.other = xAxisData.getPositionByValue(0);
				}
			}
			if(yAxisData.type === 'value' && xAxisData.option.axisLine.onZero) {
				if(yAxisData.min*yAxisData.max < 0) {
					xAxis.other = yAxisData.getPositionByValue(0);
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
					gridAxis.map(function(axisData,gridAxisIndex){
						return <Axis 	
									key={'xaxis'+gridAxisIndex}
									containLabel={containLabel}
									axisData={axisData}
									setAxisData={setAxisData}
									updateType={updateType}
									gridAxisIndex={gridAxisIndex}
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
        gridAxis = that.getGridAxis(props,top,left,right,bottom);
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
				return axis.option.index === xAxisIndex && axis.axis === 'xAxis';
			})[0];
			var yAxisData = gridAxis.filter(function(axis){
				return axis.option.index === yAxisIndex && axis.axis === 'yAxis';
			})[0];
			var isEmpty = !includeSeries.length;
			var reversed = false;
			if(xAxisData.type === 'value' && yAxisData.type === 'category') {
				reversed = true;
			}
			var grid = new GridClass(seriesIndex,xAxisData,yAxisData,reversed,includeSeries);
			grid.setGridRect(top,left,right,bottom);
			chartEmitter.emit('grid',grid);
		});
		/* chartEmitter.emit('gridReady',{
			axis:gridAxis,
			top,left,right,
			bottom,width,height,
			includeSeries:includeSeries
		}); */
	}
	componentWillReceiveProps(nextProps){
		var {left,top,right,bottom} = nextProps;
		var gridAxis = this.getGridAxis(nextProps,top,left,right,bottom);
		var updateType = 'newProps';
		this.setState({updateType,gridAxis});
	}
	componentDidUpdate(){
		if(this.state.updateType === 'adjust') {
			this.sendGridInfo();
		}
	}
}