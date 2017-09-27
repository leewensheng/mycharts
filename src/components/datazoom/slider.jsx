import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Draggable from '../../elements/draggable'
import Rect from '../../elements/rect'
export default class Slider extends Component {
	constructor(props) {
		super(props);
		this.onPanning = this.onPanning.bind(this);
		this.onQuickPanning = this.onQuickPanning.bind(this);
		this.startHandleMove = this.startHandleMove.bind(this);
		this.endHandleMove = this.endHandleMove.bind(this);
		this.state = this.getSliderState(props);
	}
	getSliderState(props){
		var {axis,top,left,right,bottom,gridAxis,sliderOpt} = props;
		var {axisData} = gridAxis;
		var {min,max,realMin,realMax,includeSeries} = axisData;
		if(min < realMin) {
			min = realMin;
		}
		if(max > realMax) {
			max = realMax;
		}
		var {inverse} = axisData.option;
		var {margin,height,handle,background} = sliderOpt;
		var sliderStart,sliderEnd,sliderOther,handleStart,handleEnd;
		if(axis === 'xAxis') {
			sliderStart = inverse ? right:left;
			sliderEnd = inverse ? left : right;
			sliderOther = bottom +margin;
		} else if(axis  === 'yAxis') {
			sliderStart = inverse ? top:bottom;
			sliderEnd  = inverse ? bottom : top;
			sliderOther = right + margin;
		}
		if(realMin === realMax) {
			handleStart = handleEnd = (sliderStart + sliderEnd)/2;
		} else {
			handleStart = sliderStart + (sliderEnd - sliderStart)*(min - realMin)/ (realMax - realMin);
			handleEnd = sliderStart + (sliderEnd - sliderStart	)*(max - realMin) / (realMax - realMin);
		}
		return {
			sliderStart,
			sliderEnd,
			sliderOther,
			min,
			max,
			realMin,
			realMax
		}
	}
	getPositionByValue(val){
		var {state} = this;
		var {sliderStart,sliderEnd,realMin,realMax} = state;
		if(realMin === realMax) {
			return (sliderStart + sliderEnd) /2;
		} else {
			return sliderStart + (sliderEnd - sliderStart	)*(val - realMin) / (realMax - realMin);
		}
	}
	getValueByPosition(position){
		var {state} = this;
		var {sliderStart,sliderEnd,realMin,realMax} = state;
		return realMin + (realMax - realMin)*(position - sliderStart)/(sliderEnd - sliderStart);
	}
	render(){
		var that = this;
		var {props,state} = this;
		var {axis,top,left,right,bottom,gridAxis,sliderOpt} = props;
		var {axisData} = gridAxis;
		var {realMin,realMax,includeSeries} = axisData;
		var {margin,height,handle,background} = sliderOpt;
		var {min,max,sliderStart,sliderEnd,sliderOther} = state;
		var handleStart = this.getPositionByValue(min);
		var handleEnd = this.getPositionByValue(max);
		var size = height;
		if(axis === 'xAxis') {
			return (
			<g className="vcharts-slider">
				<Rect onclick={this.onQuickPanning} animation={false} className="datazoom-slider" x={left} y={sliderOther} width={right-left} height={height} fill={background} stroke="none"/>
				{
				includeSeries.length
				&&
				<g>
					<Draggable containment={[left - handleStart,0,right - handleEnd,0]} axis={axis} onDragMove={that.onPanning} onDragEnd={that.onPanning}>
						<Rect animation={false} className="datazoom-pan" x={handleStart-size/2} y={sliderOther} width={handleEnd - handleStart} height={height} fill={background} stroke="none" />
					</Draggable>
					<Draggable key="start" containment={[left - handleStart,0,right - handleEnd,0]} axis={axis} onDragMove={that.startHandleMove} onDragEnd={that.startHandleMove}>
						<Rect animation={false}className="datazoom-handle" x={handleStart-size/2} y={sliderOther} width={size} height={height} fill="blue" stroke="none" />
					</Draggable>
					<Draggable key="end" containment={[left - handleStart,0,right - handleEnd,0]} axis={axis} onDragMove={that.endHandleMove} onDragEnd={that.endHandleMove}>
						<Rect animation={false} className="datazoom-handle" x={handleEnd-size/2} y={sliderOther} width={size} height={height} fill="blue" stroke="none" />
					</Draggable>
				</g>
				}
			</g>
			)
		}
	}
	onQuickPanning(event) {
		var {props,state} = this;
		var {sliderStart,sliderEnd} = this;
		//计算出平移的距离
	}
	onPanning(dx,dy){
		var {props,state} = this;
		var {min,max,realMin,realMax} = state;
		if(min === realMin && dx < 0) {
			return;
		}
		if(max === realMax && dx > 0) {
			return;
		}
		var {axis} = props;
		var handleStart = this.getPositionByValue(min);
		var handleEnd = this.getPositionByValue(max);
		handleStart += axis === 'xAxis' ? dx:dy;
		handleEnd +=  axis === 'xAxis' ? dx:dy;
		min = this.getValueByPosition(handleStart);
		max = this.getValueByPosition(handleEnd);
		if(min <= realMin ) {
			min = realMin;
		}
		if(max >= realMax) {
			max = realMax;
		}
		this.setState({min,max,updateType:'zoom'});
	}
	startHandleMove(dx,dy){
		var {props,state} = this;
		var {min,max,realMin,realMax} = state;
		if(min === realMin && dx < 0) {
			return;
		}
		var {axis} = props;
		var handleStart = this.getPositionByValue(min);
		handleStart += axis === 'xAxis' ? dx:dy;
		var nextMin = this.getValueByPosition(handleStart);
		if(nextMin < realMin) {
			nextMin = realMin;
		}
		this.setState({
			min:Math.min(nextMin,max),
			max:Math.max(nextMin,max),
			updateType:'zoom'
		});
	}
	endHandleMove(dx,dy){
		var {props,state} = this;
		var {min,max,realMin,realMax} = state;
		if(max === realMax && dx > 0) {
			return;
		}
		var {axis} = props;
		var handleEnd = this.getPositionByValue(max);
		handleEnd += axis === 'xAxis' ? dx:dy;
		var nextMax = this.getValueByPosition(handleEnd);
		if(nextMax > realMax) {
			nextMax = realMax;
		}
		this.setState({
			max:nextMax,
			updateType:'zoom'
		});
	}
	componentWillReceiveProps(nextProps){
		var nextState = this.getSliderState(nextProps);
		nextState.updateType = 'newProps';
		this.setState(nextState);
	}
	componentDidUpdate(){
		var {state} = this;
		var {min,max,realMin,realMax} = state;
		if(state.updateType === 'zoom') {
			this.props.zoomAxis(this.props.gridAxis,min,max);
		}
	}
}