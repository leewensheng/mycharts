import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Text from '../../elements/text'
export default class Title extends Component {
	constructor(props) {
		super(props);
		this.state = {
			adjusted:false
		}
	}
	render() {
		var {props,state} = this;
		var {chartModel,componentModel} = props;
		var titleOpt = componentModel.getOption();
		var width = chartModel.getWidth();
		var height = chartModel.getHeight();
		var {align,verticalAlign,margin,text,style,subTitle} = titleOpt;
		var x,y;
		style.textAlign = align;
		subTitle.style.textAlign = align;
		style.textBaseLine = verticalAlign;
		if(align === 'left') {
			x = margin;
		} else if (align === 'center') {
			x = width / 2;
		} else if(align === 'right') {
			x = width - margin;
		} else {
			x = width / 2;
		}
		if(verticalAlign === 'top') {
			y = 0 + margin;
		} else if (verticalAlign === 'middle') {
			y = height /2;
		} else if(verticalAlign === 'bottom') {
			y = height - margin;
		}
		return (
			<g>
				<Text className="vcharts-title" x={x} y={y} style={style}>{text}</Text>
				<Text className="vcharts-subtitle" x={x} y={y + 30} style={subTitle.style}>{subTitle.text}</Text>
			</g>
		)
	}
}