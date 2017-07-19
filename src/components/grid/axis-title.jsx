import React,{Component} from 'react'
import Text from '../../elements/text'

class AxisTitle extends Component{
	constructor(props){
		super(props);
	}
	render(){
		var {props} = this;
		var {animation,axis,axisOption,top,left,right,bottom} = props;
		var {title,opposite} = axisOption;
		var {enabled,align,margin,rotation,style,text} = title;
		var x,y,transform;
		if(axis === 'x') {
			y = opposite?top:bottom;
			if(align === 'start') {
				x = right;
			} else if(align === 'middle') {
				x = (left + right) / 2;
			} else {
				x = right;
			}
			style.textBaseLine = 'top';
			style.textAlign = 'center';
		} else if(axis === 'y') {
			x = opposite?right:left;
			if(align === 'start') {
				y = bottom;
			} else if(align === 'middle') {
				y= (top + bottom) / 2;
			} else {
				y = top;
			}
			y -= 20;
			style.textBaseLine = 'bottom';
			style.textAlign = 'right';
		}
		return (
			<Text className="vcharts-axis-title" animation={animation} x={x} y={y}  style={style}>{text||''}</Text>
		)
	}
}
module.exports = AxisTitle;
