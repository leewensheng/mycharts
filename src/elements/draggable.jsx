import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'
export default class Draggable extends Component {
	constructor(props) {
		super(props);
		var {x,y} = props;
		this.dragStart = this.dragStart.bind(this);
		this.dragMove = this.dragMove.bind(this);
		this.dragEnd = this.dragEnd.bind(this);
		this.state = {
			isDragging:false,
			startX:0,
			startY:0,
			endX:0,
			endY:0
		}
	}
	static defaultProps = {
		x:0,
		y:0,
		axis:null,
		cursor:'pointer',
		disabled:false,
		containment :null,//限制区域
		onDragStart(){

		},
		onDragMove(){

		},
		onDragEnd(){

		}
	};
	render(){
		return (<g onMouseDown={this.dragStart}>
			{this.props.children}
		</g>)
	}
	dragStart(event){
		event.preventDefault();
		event.stopPropagation();
		var {clientX,clientY} = event;
		this.setState({
			isDragging:true,
			startX:clientX,
			startY:clientY,
			endX:clientX,
			endY:clientY
		});
		$(document).on("mousemove",this.dragMove);
		$(document).on("mouseup",this.dragEnd);
		this.props.onDragStart();
	}
	dragMove(event){
		event.preventDefault();
		event.stopPropagation();
		var {props,state} = this;
		var {clientX,clientY} = event;
		var {startX,startY} = state;
		this.setState({
			endX:clientX,
			endY:clientY
		});
		this.props.onDragMove(clientX - startX,clientY - startY);
	}
	dragEnd(event){
		event.preventDefault();
		event.stopPropagation();
		var {startX,startY} = this.state;
		var {clientX,clientY} = event;
		this.setState({
			isDragging:false,
			endX:clientX,
			endY:clientY
		});
		$(document).off("mousemove",this.dragMove);
		$(document).off("mouseup",this.dragEnd);
		this.props.onDragEnd(clientX - startX,clientY - startY);
	}
	componentWillReceiveProps(){
		var {endX,endY} = this.state;
		this.setState({
			startX:endX,
			startY:endY
		});
	}
}