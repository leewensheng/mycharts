import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Draggable from '../../elements/draggable'
import Rect from '../../elements/rect'
export default class Slider extends Component {
	constructor(props) {
		super(props);
	}
	render(){
		var {props,state} = this;
		var {grid} = props;
		var {top,left,right,bottom,width,height,axis} = grid;
		var xAxis = axis[0];
		var {start,end,other,axisData} = xAxis;
		var {min,max,realMin,realMax} = axisData;
		var sliderStart , sliderEnd;
		if(realMin === realMax) {
			sliderStart = sliderEnd = (start + end)/2;
		} else {
			sliderStart = start + (end - start) * (min - realMin)/(realMax - realMin);
			sliderEnd = start + (end - start) * (max - realMin)/(realMax - realMin);
		}
		return (
		<g>
			<Rect x={left} y={bottom+20} width={width} height={50} fill="red" />
			<Rect x={sliderStart -25} y={bottom + 20} width={50} height={50} fill="blue" />
			<Rect x={sliderEnd - 25} y={bottom + 20} width={50} height={50} fill="blue" />
		</g>
		)
	}
}