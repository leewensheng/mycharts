import React,{Component} from 'react'
import Rect from '../../elements/rect'

class PieIcon extends Component {
	render(){
		var {props,state} = this;
		var {x,y,width,height,color,animation} = props;
		var cy = y + height/2;
		var cx = x + width/2;
		var r = width/4;
		var end1 = cx  - width/4;
		var end2 = cx + width/4;
		return (
			<Rect animation={animation} fill={color} x={x} y={y} width={width} height={width/2} rx={5} ry={5} />
		)

	}
}
PieIcon.defaultProps = {
	x:null,
	y:null,
	width:100,
	height:100,
	color:'#333'
}
module.exports = PieIcon;