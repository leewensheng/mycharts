import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'

import Paper from 'cad/paper/index'
import shape from 'cad/shape'
import Point from 'cad/point'

import Text from '../../elements/text'
import ConnectLine from './connect-line'

import defaultOption from './option'
import Slice from './slice'
import Icon from './icon'

import {getRenderData ,getSelectedPointsMap} from './helper'
class  Pie extends Component{
	constructor(props) {
		super(props);
		this.onLegendChange = this.onLegendChange.bind(this);
		props.chartEmitter.on('legend',this.onLegendChange);
		var state = getRenderData(props);
		var selectedPointsMap = getSelectedPointsMap(props);
		state.selectedPointsMap = selectedPointsMap;
		this.state = state;
	}

	render(){
		var that = this;
		var {props,state} = this;
		var {width,height,series,option} = props;
		var {points} = state;
		var {center,size,dataLabels,connectLine,borderColor,borderWidth,sliceOffset} = series;
		var {cx,cy,radius,innerRadius,selectedPointsMap,updateType} = this.state;
		var onSlice = this.onSlice;
		return (
			<g className="vcharts-series vcharts-pie-series">
				<g className="vcharts-points vcharts-pie-points">
				{
				points.map(function(point,index){
					return <Slice
							key={index}
							animation={option.chart.animation}
							cx={cx}
							cy={cy}
							startAngle={point.startAngle}
							endAngle={point.endAngle}
							radius={point.radius}
							innerRadius={innerRadius}
							midAngle={point.midAngle}
							borderWidth={borderWidth}
							borderColor={borderColor}
							color={point.color}
							index={index}
							selected={selectedPointsMap[index]}
							sliceOffset={sliceOffset}
							onSlice={onSlice.bind(that,index)}
							updateType={updateType}
						/>
					})			
				}
				</g>
			</g>
		)
	}
	onSlice(index){
		var {props,state} = this;
		var {selectedPointsMap} = state;
		var {selectMode} = props;
		var selected = !selectedPointsMap[index];
		if(selectMode === 'multiple') {
			selectedPointsMap[index] = selected;
		} else {
			selectedPointsMap = {};
			selectedPointsMap[index] = selected;
		}
		this.setState({selectedPointsMap,updateType:'select'});
	}
	onLegendChange(msg){
		var {state,props} = this;
		if(msg.seriesIndex == this.props.seriesIndex) {
			
		}
	}
	animate(){
		var {width,height,option,series,seriesIndex} = this.props;
		var sliceOffset = series.sliceOffset;
		var {cx,cy,radius,startAngle,endAngle} = this.state;
		var el = findDOMNode(this);
		var svg = $(el).closest("svg").get(0);
		var paper = new Paper(svg);
		var group = $(findDOMNode(this));
		var clip = paper.clipPath(function(){
			paper.addShape("sector",cx,cy,{
							radius:radius + sliceOffset,
							startAngle:startAngle,
							endAngle:startAngle + 1e-6
						});
		});
		clip.attr("id","pie-clip"+seriesIndex);
		group.attr("clip-path","url(#pie-clip"+ seriesIndex +")");
		var path = clip.find("path");
		$(".pie-connect-line,.vchart-pie-labels").css("display","none");
		path.transition({
			from:startAngle,
			to:endAngle,
			ease:'easeOutIn',
			during:600,
			callback(){
				clip.remove();
				group.removeAttr("clip-path");
				$(".pie-connect-line,.vchart-pie-labels").css("display","");
			},
			onUpdate:function(val){
				path.attr("d",shape.getShapePath("sector",cx,cy,{
					startAngle:startAngle,
					endAngle:val,
					radius:radius + sliceOffset
				}));
			}
		})
		paper.destroy();
	}
	componentDidMount(){
		this.animate();
	}
	componentWillReceiveProps(nextProps){
		var nextState = getRenderData(nextProps);
		var selectedPointsMap = this.state.selectedPointsMap;
		$.extend(selectedPointsMap,getSelectedPointsMap(nextProps));
		nextState.selectedPointsMap = selectedPointsMap;
		nextState.updateType = 'newProps';
		this.setState(nextState);
	}
	componentWillUnmount(){
		var {props,state} = this;
		props.chartEmitter.removeListener('legend',this.onLegendChange);
	}
}
Pie.defaultOption = defaultOption;
Pie.dependencies = {
	legend:{
		must:false,
		multiple:true,
		icon:Icon
	}
}
module.exports = Pie;