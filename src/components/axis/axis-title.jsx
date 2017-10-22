import React,{Component} from 'react'
import Text from '../../elements/text'

class AxisTitle extends Component{
	constructor(props){
		super(props);
	}
	render(){
		var {props} = this;
		var {update,axisData} = props;
		var {axis,start,end,option,startEdge,endEdge,other,unit} = axisData;
		var {title,opposite,inverse} = option;
		var {enabled,align,margin,rotation,style,text} = title;
		var x,y,transform;
		var enumAlign = {
			start:1,
			end:1,
			middle:1
		};
		if(!enumAlign[align]) {
			align = 'end';
		}
		if(axis === 'xAxis') {
			if(align === 'start') {
				x = startEdge - unit*margin;
				y = other;
				style.textBaseLine = 'middle';
				style.textAlign = inverse?'left':'right';
			} else if(align === 'middle') {
				x = (start + end) / 2;
				y = other;
				style.textAlign ='middle';
				style.textBaseLine = opposite ? 'bottom':'top';
			} else if (align === 'end') {
				x = endEdge + unit*margin;
				y = other;
				style.textBaseLine = 'middle';
				style.textAlign = inverse?'right':'left';
			}
		} else if (axis === 'yAxis') {
			if(align === 'start') {
				y = startEdge - unit*margin;
				x = other;
				style.textAlign = 'center';
				style.textBaseLine = inverse ? 'bottom':'top';
			} else if(align === 'middle') {
				y = (start + end) / 2;
				x = other + margin*(opposite?1:-1);
				style.textBaseLine = 'middle';
				style.textAlign = 'center';
			} else if(align === 'end') {
				y = endEdge + unit*margin;
				x = other;
				style.textAlign = 'center';
				style.textBaseLine = inverse ? 'top' :'bottom';
			}
		}
		transform = 'rotate(' + rotation + ',' + x+ ',' + y + ')';
		return (
			<Text 
				update={update} 
				className="vcharts-axis-title"  
				transform={transform} 
				x={x} 
				y={y}  
				style={style}
			>
			{text||''}
			</Text>
		)
	}
}
module.exports = AxisTitle;
