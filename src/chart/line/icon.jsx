import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'
import Line from '../../elements/line'
import Circle from '../../elements/circle'

class LineIcon extends Component {
	render(){
		var {props,state} = this;
		var {x,y,width,height,color,animation} = props;
		var cy = y + height/2;
		var cx = x + width/2;
		var r = height/2.5;
		var end1 = cx  -r;
		var end2 = cx + r;
		return (
			<g className="vcharts-legend-icon line-legend-icon" stroke={color} fill="none" strokeWidth="1">
				<Line animation={animation} x1={x} y1={cy} x2={end1} y2={cy} stroke={color}/>
				<Circle animation={animation} cx={cx} cy={cy} r={r} />
				<Line animation={animation} x1={end2} y1={cy} x2={x+width} y2={cy} stroke={color}/>
			</g>
		)

	}
}
LineIcon.defaultProps = {
	x:null,
	y:null,
	width:100,
	height:100,
	color:'#333'
}
module.exports = LineIcon;