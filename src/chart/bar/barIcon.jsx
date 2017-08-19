import React,{Component} from 'react'
import Rect from '../../elements/rect'

export default class PieIcon extends Component {
	render(){
		var {props,state} = this;
		var {x,y,width,height,color,animation} = props;
		return (
			<Rect animation={animation} fill={color} x={x} y={y} width={width} height={height} rx={5} ry={5}/>
		)
	}
}