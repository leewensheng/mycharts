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
		var {axis,start,end,other,includeSeries} = gridAxis;
		var {min,max} = gridAxis;
		var {startValue,endValue} = state;
		var {background} = sliderOpt;
		var handleStart = gridAxis.getPositionByValue(startValue);
		var handleEnd = gridAxis.getPositionByValue(endValue);
		var sliderX,sliderY,startX,startY,endX,endY,panX,panY;
		var sliderWidth,sliderHeight,startWidth,startHeight,endWidth,endHeight,panWidth,panHeight;
		const handleSize = 40;
		const sliderSize = 40;
		if(axis === 'xAxis') {
			sliderX = Math.min(start,end);
			sliderY = other;
			sliderWidth = Math.abs(start - end);
			sliderHeight = sliderSize;

			startX = Math.min(handleStart - handleSize/2*gridAxis.unit,handleStart);
			startY = other;
			startWidth = handleSize;
			startHeight = sliderSize;

			endX = Math.min(handleEnd - handleSize/2*gridAxis.unit,handleEnd);
			endY = other;
			endWidth = handleSize;
			endHeight = sliderSize;
			panX = Math.min(handleStart,handleEnd)
			panY = other;
			panWidth = Math.abs(handleStart - handleEnd);
			panHeight = sliderSize;
		} else {
			sliderX = other;
			sliderY = Math.min(start,end);
			sliderWidth = sliderSize;
			sliderHeight = Math.abs(start - end);

			startX = other;
			startY = Math.min(handleStart - handleSize/2*gridAxis.unit,handleStart);
			startWidth = sliderSize;
			startHeight = handleSize;

			endX = other;
			endY = Math.min(handleEnd - handleSize/2*gridAxis.unit,handleEnd);
			endWidth = sliderSize;
			endHeight = handleSize;

			panX = other;
			panY = Math.min(handleSize,handleEnd);
			panWidth = sliderSize;
			panHeight = Math.abs(handleStart - handleEnd);
		}
		return (
		<g className="vcharts-slider">
			<Rect onClick={this.onQuickPanning} animation={false} className="datazoom-slider" x={sliderX} y={sliderY} width={sliderWidth} height={sliderHeight} fill={background} stroke="none"/>
			{
			includeSeries.length
			&&
			<g>
			<Draggable key="pan" axis={axis} onDragMove={that.onPanning} onDragEnd={that.onPanning}>
				<Rect animation={false} className="datazoom-pan" x={panX} y={panY} width={panWidth} height={panHeight} fill={background} stroke="none" />
			</Draggable>
			<Draggable key="start"  axis={axis} onDragMove={that.startHandleMove} onDragEnd={that.startHandleMove}>
				<Rect animation={false}className="datazoom-handle" x={startX} y={startY} width={startWidth} height={startHeight} fill="blue" stroke="none" />
			</Draggable>
			<Draggable key="end" axis={axis} onDragMove={that.endHandleMove} onDragEnd={that.endHandleMove}>
				<Rect animation={false} className="datazoom-handle" x={endX} y={endY} width={endWidth} height={endHeight} fill="blue" stroke="none" />
			</Draggable>
			</g>
			}
		</g>
		)
		
	}
	onQuickPanning(event) {
		//计算出平移的距离
		var {props,state} = this;
		var {gridAxis} = props;
		var {startValue,endValue} = state;
		var el = findDOMNode(this);
		var point = $(el).getOffsetMouse(event);
		var {x,y} = point;
		var value = gridAxis.getValueByPosition(axis === 'xAxis' ? x : y);
		var panValue = endValue - startValue;
		if(value < startValue) {
			
		} else {
			if(value > endValue) {
				
			}
		}
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