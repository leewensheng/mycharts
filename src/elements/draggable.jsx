import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'react'
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
			endY:0,
			x:x,
			y:y
		}
	}
	render(){
		return 
		(<g onMouseDown={this.dragStart}>
			{this.props.children}
		</g>)
	}
	dragStart(event){
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
	}
	dragMove(event){
		var {clientX,clientY} = event;
		this.setState({
			endX:clientX,
			endY:clientY
		});
	}
	dragEnd(event){
		var {clientX,clientY} = event;
		this.setState({
			isDragging:false,
			endX:clientX,
			endY:clientY
		});
		$(document).off("mousemove",this.dragMove);
		$(document).off("mouseup",this.dragEnd);
	}
}