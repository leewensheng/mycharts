import React,{Component} from 'react'
import Text from '../../elements/text'

class AxisTitle extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return <g></g>
		var {props} = this;
		var {animation,axis,axisOption,top,left,right,bottom} = props;
		var {gridTop,gridLeft,gridRight,gridBottom} = props;
		var {title,opposite} = axisOption;
		var {enabled,align,margin,rotation,style,text} = title;
		var x,y,transform;
		if(axis === 'xAxis') {
			y = opposite?top:bottom;
			if(align === 'start') {
				x = gridLeft;
				style.textAlign = 'right';
				style.textBaseLine = 'middle';
				x -= margin;
			} else if(align === 'middle') {
				x = (left + right) / 2;
				y = opposite ? gridTop : gridBottom;
				style.textAlign = 'center';
				style.textBaseLine = opposite?'bottom':'top';
				opposite ? (y -= margin) : (y  += margin);
			} else if(align === 'end'){
				x = gridRight;
				style.textAlign = 'left';
				style.textBaseLine = 'middle';
				x += margin;
			}
		} else if(axis === 'yAxis') {
			x = opposite?right:left;
			if(align === 'start') {
				y = gridBottom;
				style.textBaseLine = 'top';
				y += margin;
				style.textAlign = 'center';
			} else if(align === 'middle') {
				x = opposite ? gridRight : gridLeft;
				opposite ? (x += margin) : (x  -= margin);
				y= (top + bottom) / 2;
				style.textBaseLine = 'bottom';
				style.textAlign = opposite?'left':'right';
			} else if(align === 'end') {
				y = gridTop;
				style.textBaseLine = 'bottom';
				y -= margin;
				style.textAlign = 'center';
			}
		}
		transform = 'rotate(' + rotation + ',' + x+ ',' + y + ')';
		return (
			<Text transform={transform} className="vcharts-axis-title" animation={animation} x={x} y={y}  style={style}>{text||''}</Text>
		)
	}
}
module.exports = AxisTitle;
