import $ from 'jquery'
import React,{Component} from 'react'
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
		var {align,verticlAlign,margin,text,style,subTitle} = titleOpt;
		var x,y;
		style.textAlign = align;

		return (
			<Text>{text}</Text>
		)
	}
	componentDidUpdate(){

	}
}