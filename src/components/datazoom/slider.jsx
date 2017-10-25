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
		this.state = {
			startValue:props.gridAxis.startValue,
			endValue:props.gridAxis.endValue
		}
	}
	static defaultProps = {
		gridAxis:null,
		index:null,
		sliderOpt:null,
		zoomAxis(){

		}
	}
	render(){
		var that = this;
		var {props,state} = this;
		var {gridAxis,sliderOpt} = props;
		const size = 40;
		var {axis,start,end,other,includeSeries} = gridAxis;
		var {startValue,endValue} = state;
		var {background} = sliderOpt;
		var handleStart = gridAxis.getPositionByValue(startValue);
		var handleEnd = gridAxis.getPositionByValue(endValue);
		if(axis === 'xAxis') {
			var x = Math.min(start,end);
			var y = other;
			var width = Math.abs(start-end);
			var height = 40;
			return (
			<g className="vcharts-slider">
				<Rect onClick={this.onQuickPanning} animation={false} className="datazoom-slider" x={x} y={y} width={width} height={height} fill={background} stroke="none"/>
				{
				includeSeries.length
				&&
				<g>
					<Draggable key="pan" axis={axis} onDragMove={that.onPanning} onDragEnd={that.onPanning}>
						<Rect animation={false} className="datazoom-pan" x={handleStart-size/2} y={other} width={handleEnd - handleStart} height={height} fill={background} stroke="none" />
					</Draggable>
					<Draggable key="start"  axis={axis} onDragMove={that.startHandleMove} onDragEnd={that.startHandleMove}>
						<Rect animation={false}className="datazoom-handle" x={handleStart-size/2} y={other} width={size} height={height} fill="blue" stroke="none" />
					</Draggable>
					<Draggable key="end" axis={axis} onDragMove={that.endHandleMove} onDragEnd={that.endHandleMove}>
						<Rect animation={false} className="datazoom-handle" x={handleEnd-size/2} y={other} width={size} height={height} fill="blue" stroke="none" />
					</Draggable>
				</g>
				}
			</g>
			)
		}
	}
	onQuickPanning(event) {
		//计算出平移的距离
	}
	onPanning(dx,dy){
		var {props,state} = this;
		var {gridAxis,sliderOpt,zoomAxis} = props;
		var {axis,min,max} = gridAxis;
		var {startValue,endValue} = state;
		var change = axis === 'xAxis' ? dx:dy;
		var changeValue = gridAxis.getChangeByDistance(change);
		startValue += changeValue;
		endValue += changeValue;
		if(startValue < min) {
			endValue -= (startValue - min);
			startValue = min;
		}
		if(endValue > max) {
			startValue -= (endValue - max);
			endValue = max;
		}
		this.setState({startValue,endValue});
		zoomAxis(gridAxis,Math.min(startValue,endValue),Math.max(startValue,endValue));
	}
	startHandleMove(dx,dy){
		var {props,state} = this;
		var {gridAxis,sliderOpt,zoomAxis} = props;
		var {startValue,endValue} = state;
		var {axis,min,max} = gridAxis;
		var change = axis === 'xAxis' ? dx:dy;
		var changeValue = gridAxis.getChangeByDistance(change);
		startValue += changeValue;
		if(startValue < min) {
			startValue = min;
		}
		if(startValue > max) {
			startValue = max;
		}
		this.setState({startValue,endValue});
		zoomAxis(gridAxis,Math.min(startValue,endValue),Math.max(startValue,endValue));
	}
	endHandleMove(dx,dy){
		var {props,state} = this;
		var {gridAxis,sliderOpt,zoomAxis} = props;
		var {startValue,endValue} = state;
		var {axis,min,max} = gridAxis;
		var change = axis === 'xAxis' ? dx:dy;
		var changeValue = gridAxis.getChangeByDistance(change);
		endValue += changeValue;
		if(endValue < min) {
			endValue = min;
		}
		if(endValue > max) {
			endValue = max;
		}
		this.setState({startValue,endValue});
		zoomAxis(gridAxis,Math.min(startValue,endValue),Math.max(startValue,endValue));
	}
	componentWillReceiveProps(nextProps){
		var {gridAxis} = nextProps;
		var {startValue,endValue} = gridAxis;
		this.setState({startValue,endValue});
	}
}