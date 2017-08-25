import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Circle from '../../elements/circle'
import colorHelper from 'cad/color/index'

export default class ScatterPoint extends Component {
	constructor(props) {
		super(props);
		this.handleMouseOver = this.handleMouseOver.bind(this);
		this.handleMouseOut = this.handleMouseOut.bind(this);
		this.state = {
			isHover:false
		}
	}
	render(){
		var {props,state} = this;
		var {isHover,updateType} = state;
		var {cx,cy,size,fill} = props;
		if(isHover) {
			size += 5;
			fill = colorHelper.brighten(fill,0.5); 
		}
		var animation = {
			during:400,
			ease:updateType==='hoverChange'?'elasticOut':'easeOut',
			delay:0	
		}
		return (
			<Circle animation={animation} {...props}  cx={cx} cy={cy} r={size} fill={fill} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} />
		)
	}
	componentWillReceiveProps(){
		this.setState({updateType:'newProps'});
	}
	handleMouseOver(event){
		var target = event.target;
		this.setState({isHover:true,updateType:'hoverChange'});
		target.parentNode.appendChild(target);
	}
	handleMouseOut(event){
		var target = event.target;
		var index = this.props.index;
		var children = target.parentNode.children;
		target.parentNode.insertBefore(target,children[index]);
		this.setState({isHover:false,updateType:'hoverChange'});
	}
}