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
		if(!hasInited) {
			size = 0;
		}
		if(updateType ==='animation') {
			animation.during = 1000;
		}
		return (
			<g onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
				<Circle animation={animation} {...props}  cx={cx} cy={cy} r={size} fill={fill}/>
			</g>
		)
	}
	componentDidMount(){
		//动画
		this.setState({hasInited:true,updateType:'animation'});
	}
	componentWillReceiveProps(){
		this.setState({updateType:'newProps'});
	}
	handleMouseOver(event){
		var elem = findDOMNode(this);
		this.setState({isHover:true,updateType:'hoverChange'});
		elem.parentNode.appendChild(elem);
	}
	handleMouseOut(event){
		var elem = findDOMNode(this);
		var index = this.props.index;
		var children = elem.parentNode.children;
		elem.parentNode.insertBefore(elem,children[index]);
		this.setState({isHover:false,updateType:'hoverChange'});
	}
}