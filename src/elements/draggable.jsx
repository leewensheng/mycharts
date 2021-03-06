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
		this.start = this.start.bind(this);
		this.state = {
			isDragging:false,
			preventDefault:false,
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
		if(this.props.containment) {
			return <g className="draggable draggable-area"></g>;
		}
		return (<g onMouseDown={this.dragStart} onTouchStart={this.dragStart}>
			{this.props.children}
		</g>)
	}
	dragStart(event){
		var mouse = $.mouse(event);
		var {clientX,clientY} = mouse;
		this.setState({
			isDragging:true,
			startX:clientX,
			startY:clientY,
			endX:clientX,
			endY:clientY
		});
		$(document).on("mousemove",this.dragMove);
		$(document).on("touchmove",this.dragMove);
		$(document).on("mouseup",this.dragEnd);
		$(document).on("touchend",this.dragEnd);
		this.props.onDragStart();
	}
	dragMove(event){
		event.preventDefault();
		event.stopPropagation();
		var {props,state} = this;
		var mouse = $.mouse(event);
		var {clientX,clientY} = mouse;
		var {startX,startY,preventDefault} = state;
		var dx = clientX - startX;
		var dy = clientY - startY;
		if(!preventDefault) {
			if(props.axis === 'xAxis') {
				if(Math.abs(dx / dy) > 1) {
					preventDefault = true;
				}
			} else {
				if(Math.abs(dy / dx) > 1) {
					preventDefault = true;
				}
			}
		}
		if(preventDefault) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.setState({
			endX:clientX,
			endY:clientY,
			preventDefault:preventDefault
		});
		this.props.onDragMove(clientX - startX,clientY - startY);
	}
	dragEnd(event){
		event.preventDefault();
		event.stopPropagation();
		$(document).off("mousemove",this.dragMove);
		$(document).off("touchmove",this.dragMove);
		$(document).off("mouseup",this.dragEnd);
		$(document).off("touchend",this.dragEnd);
		this.props.onDragEnd();
		this.setState({
			preventDefault:false
		})
	}
	start(event){
		var {props} = this;
		var {containment} = props;
		var offset = $(findDOMNode(this)).getOffsetMouse(event);
		var {x,y} = offset;
		var {left,right,bottom,top} = containment;
		if(x >= left && x <= right && y > top && y <= bottom) {
			this.dragStart(event);
		}
	}
	componentDidMount(){
		var that = this;
		if(this.props.containment) {
			var containment = this.props.containment;
			var {top,left,right,bottom} = containment;
			$(document).on('mousedown',this.start);
			$(document).on('touchstart',this.start);
		}
	}
	componentWillReceiveProps(){
		var {endX,endY} = this.state;
		this.setState({
			startX:endX,
			startY:endY
		});
	}
	componentWillUnmount(){
		$(document).off('mousedown',this.start);
		$(document).off('touchstart',this.start);
	}
}