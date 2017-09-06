import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Circle from '../../elements/circle'
import colorHelper from 'cad/color/index'
import browser from 'cad/browser'
export default class ScatterPoint extends Component {
	constructor(props) {
		super(props);
		this.handleMouseOver = this.handleMouseOver.bind(this);
		this.handleMouseOut = this.handleMouseOut.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.state = {
			isHover:false,
			hasInited:false
		}
	}
	render(){
		var {props,state} = this;
		var {isHover,hasInited,updateType} = state;
		var {cx,cy,size,fill} = props;
		if(isHover) {
			size += 5;
			fill = colorHelper.brighten(fill,0.2); 
		}
		
		var animation = {
			during:400,
			ease:updateType==='hoverChange'?'elasticOut':'easeOut',
			delay:0	
		}
		if(!hasInited&&props.animation) {
			size = 0;
		}
		if(updateType ==='animation') {
			animation.during = 1000;
		}
		return (
			<g onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} onMouseMove={this.handleMouseMove}>
				<Circle {...props} animation={animation}   cx={cx} cy={cy} r={size/2} fill={fill}/>
			</g>
		)
	}
	componentDidMount(){
		//动画
		this.props.animation&&this.setState({hasInited:true,updateType:'animation'});
	}
	componentWillReceiveProps(){
		this.setState({updateType:'newProps'});
	}
	handleMouseOver(event){
		var elem = findDOMNode(this);
		if(!browser.msie) {
			elem.parentNode.appendChild(elem);
		}
		this.setState({isHover:true,updateType:'hoverChange'});
	}
	handleMouseMove(event){
		var {props} = this;
		var {index,toggleToolTip} = props;
		var {clientX,clientY} = event;
		props.toggleToolTip(index,true,event);
	}
	handleMouseOut(event){
		var {props} = this;
		var {index,toggleToolTip} = props;
		var elem = findDOMNode(this);
		var index = this.props.index;
		var children = elem.parentNode.children;
		if(!browser.msie) {
			elem.parentNode.insertBefore(elem,children[index]);
		}
		props.toggleToolTip(index,false,event);
		this.setState({isHover:false,updateType:'hoverChange'});
	}
}