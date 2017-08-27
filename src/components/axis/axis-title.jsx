import React,{Component} from 'react'
import Text from '../../elements/text'

class AxisTitle extends Component{
	constructor(props){
		super(props);
	}
	render(){
		var {props} = this;
		var {axis,option,animation,start,end,other} = props;
		var {type,opposite,title,reversed} = option;
		var {enabled,align,margin,rotation,style,text} = title;
		var x,y,transform;
		if(axis === 'xAxis') {
			if(align === 'start') {
				x = start;
				y = other;
			}else if( align === 'middle') {
				x = (start + end) / 2;
				y = other + margin;
			} else if( align === 'end') {
				x = end;
				y = other;
			}
		} else if(axis === 'yAxis') {
			if(align === 'start') {
				x = other;
				y = start;
			}else if( align === 'middle') {
				x = other + margin;
				y = (start + end) /2;
			} else if( align === 'end') {
				x = other;
				y = end;
			}
		}
		transform = 'rotate(' + rotation + ',' + x+ ',' + y + ')';
		return (
			<Text transform={transform} className="vcharts-axis-title" animation={animation} x={x} y={y}  style={style}>{text||''}</Text>
		)
	}
}
module.exports = AxisTitle;
