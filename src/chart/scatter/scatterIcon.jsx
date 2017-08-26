import React,{Component} from 'react'
import Circle from '../../elements/circle'

export default class ScatterIcon extends Component {
	render(){
		var {props,state} = this;
		var {x,y,width,height,color,animation} = props;
		var cx = x + width /2;
		var cy = y + height/2;
		var r = Math.min(width,height)/2;
		return (
			<Circle animation={animation} fill={color} cx={cx} cy={cy} r={r}/>
		)
	}
}