import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Axis from '../axis/axisView'
import Rect from '../../elements/rect'
export default class Grid extends Component {
	constructor(props){
		super(props);
		var {xAxis,yAxis,containLabel} = props;
		this.state =  {
			hasInited:containLabel?false:true,
			leftLabelWidth:0,
			rightLabelWidth:0,
			bottomLabelHeight:0,
			topLabelHeight:0,
			xAxis:xAxis.map(function(){}),
			yAxis:yAxis.map(function(){})
		}
	}
	render(){
		var props = this.props;
		var setAxisData = this.setAxisData.bind(this);
		var {top,left,right,bottom,width,height,background,xAxis,yAxis,containLabel} = props;
		var {leftLabelWidth,rightLabelWidth,bottomLabelHeight,topLabelHeight,hasInited,updateType} = this.state;
		var axisLeft = left + leftLabelWidth,
			axisTop = top +  topLabelHeight,
			axisRight = right - rightLabelWidth,
			axisBottom = bottom  - bottomLabelHeight,
			axisWidth = axisRight - axisLeft,
			axisHeight = axisBottom - axisTop;
		return (
			<g className="vcharts-grid">
				{
					hasInited
					&&
					<Rect  className="vcharts-grid-backgrould" x={axisLeft} y={axisTop} width={axisWidth} height={axisHeight} fill={background}/>
				}
				{
					xAxis.concat(yAxis).map(function(axis,index){
						return <Axis 	
									containLabel={containLabel}
									key={'xaxis'+index}
									hasOpposite={yAxis.length>=2}
									gridLeft={left}
									gridRight={right}
									gridBottom={bottom}
									gridTop={top}
									gridLeft={left}
									left={axisLeft} 
									right={axisRight} 
									bottom={axisBottom}
									top={axisTop}
									width={axisWidth}
									height={axisHeight}
									axisData={axis}
									setAxisData={setAxisData}
									updateType={updateType}
									/>
					})
				}
			</g>
		)
	}
	setAxisData(axis,index,data){
		var {xAxis,yAxis} = this.state;
		if(axis==='xAxis') {
			xAxis[index] = data;
		} else {
			yAxis[index] = data;
		}
		var isReady = true;
		xAxis.map(function(val){
			if(!val) isReady = false;
		})
		yAxis.map(function(val){
			if(!val) isReady = false;
		})
		if(isReady) {
			this.onAxisReady();
		}
	}
	onAxisReady(){
		var {props,state} = this;
		var {containLabel} = props;
		var {chartEmitter,includeSeries,top,left,right,bottom,width,height} = props;
		var {xAxis,yAxis} = state;
		var  
		topLabelHeight=0,
		bottomLabelHeight=0,
		rightLabelWidth=0,
		leftLabelWidth=0;
		if(containLabel) {
			xAxis.concat(yAxis).map(function(axis){
			 	topLabelHeight += axis.labelPlace.top;
			 	bottomLabelHeight += axis.labelPlace.bottom;
			 	rightLabelWidth += axis.labelPlace.right;
			 	leftLabelWidth += axis.labelPlace.left;
			 });		
		}
		var axisLeft = left + leftLabelWidth,
			axisTop = top +  topLabelHeight,
			axisRight = right - rightLabelWidth,
			axisBottom = bottom  - bottomLabelHeight,
			axisWidth = axisRight - axisLeft,
			axisHeight = axisBottom - axisTop;
		includeSeries.map(function(series){
			var seriesIndex = series.seriesIndex;
			var xAxisIndex= series.xAxis;
			var yAxisIndex = series.yAxis;
			var xAxisData,yAxisData;
			for(var i = 0; i < xAxis.length;i++) {
				if(xAxis[i].index === xAxisIndex) {
					xAxisData = xAxis[i];
				}
			}
			for(var i = 0; i < yAxis.length;i++) {
				if(yAxis[i].index === yAxisIndex) {
					yAxisData = yAxis[i];
				}
			}
			chartEmitter.emit('grid',
				{	
					seriesIndex:seriesIndex,
					stackedOnData:series.stackedOnData,
					reversed:series.reversed,
					top:axisTop,
					left:axisLeft,
					right:axisRight,
					bottom:axisBottom,
					width:axisWidth,
					height:axisHeight,
					xAxis:xAxisData,
					yAxis:yAxisData,
					visibleSeries:includeSeries.filter(function(series){
						return series.visible;
					})
				}
			)
		})
		if(containLabel) {
			var updateType = 'adjust';
			var hasInited = true;
			this.setState({hasInited,topLabelHeight,bottomLabelHeight,rightLabelWidth,leftLabelWidth,updateType});
		}
	}
	componentWillReceiveProps(nextProps){
		var {xAxis,yAxis,containLabel} = nextProps;
		xAxis = xAxis.map(function(){}),
		yAxis = yAxis.map(function(){})
		var updateType = 'newProps';
		this.setState({xAxis,yAxis,updateType});
	}
	shouldComponentUpdate(nextProps,nextState){
		var {updateType} = nextState;
		return updateType === 'newProps' || updateType === 'adjust';
	}
}