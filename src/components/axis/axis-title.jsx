import React,{Component} from 'react'
import Text from '../../elements/text'

class AxisTitle extends Component{
	constructor(props){
		super(props);
	}
	render(){
		var {props} = this;
		var {update,axis,option,animation,start,end,other} = props;
		var {type,opposite,title,inverse} = option;
		var {enabled,align,margin,rotation,style,text} = title;
		var x,y,transform;
		if(axis === 'xAxis') {
			if(align === 'start') {
				x = start + margin*(inverse?1:-1);
				y = other;
				inverse ? style.textAlign = 'left':style.textAlign = 'right';
				style.textBaseLine = 'middle';
			} else if( align === 'middle') {
				x = (start + end) / 2;
				y = other + margin*(opposite?-1:1);
				style.textAlign = 'center';
				style.textBaseLine = opposite ? 'bottom' : 'top';

			} else if( align === 'end') {
				x = end + margin*(inverse?-1:1);
				y = other;
				style.textBaseLine = 'middle';
				inverse ? style.textAlign = 'right':style.textAlign = 'left';
			}
		} else if(axis === 'yAxis') {
			if(align === 'start') {
				x = other;
				y = start + margin*(inverse?-1:1);
				style.textAlign = 'center';
				style.textBaseLine = inverse?'bottom':'top';
			}else if( align === 'middle') {
				x = other + margin*(opposite?1:-1);
				y = (start + end) /2;
				style.textAlign = 'center';
				style.textBaseLine = 'middle';
			} else if( align === 'end') {
				x = other;
				y = end + margin*((inverse?1:-1));
				style.textAlign = 'center';
				style.textBaseLine = inverse?'top':'bottom';
			}
		}
		transform = 'rotate(' + rotation + ',' + x+ ',' + y + ')';
		return (
			<Text update={update} animation={animation} transform={transform} className="vcharts-axis-title" animation={animation} x={x} y={y}  style={style}>{text||''}</Text>
		)
	}
}
module.exports = AxisTitle;
