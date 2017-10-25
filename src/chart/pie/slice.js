import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'

import mathUtils from 'cad/math'
import colorHelper from 'cad/color/index'
import shape from 'cad/shape'
import Point from 'cad/point'
import utils from 'cad/utils'
import {interpolatePath,interpolateTransform} from 'cad/interpolate'
import PathElement from '../../elements/path'

//the radius will be more when mouserover
const HOVER_RADIUS_ADD = 10;

class  Slice extends Component{
	constructor(props) {
		super(props);
		this.handleMouseOver = this.handleMouseOver.bind(this);
		this.handleMouseOut = this.handleMouseOut.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.state = {
			isHover:false,
			isAnimating:false,
			addAnimationDone:false
		}
	}
	render(){
		var {props,state} = this;
		var {selected,cx,cy,startAngle,midAngle,endAngle,radius,innerRadius,sliceOffset,isAdd} = props;
		var {color,borderColor,borderWidth} = props;
		var {isHover,isAnimating,updateType,addAnimationDone} = state
		var that = this;
		var offsetX = 0, offsetY = 0,transform;
		var animation = {
			ease:'easeOut',
			during:400
		};
		if(selected) {
			var offset = Point(0,0).angleMoveTo(midAngle,sliceOffset);
			offsetX = offset.x;
			offsetY = offset.y;
		}
		transform = 'translate(' + offsetX + ',' + offsetY + ')';
		if(isAdd&&!addAnimationDone) {
			startAngle = endAngle;
		}
		if(isHover) {
			radius += HOVER_RADIUS_ADD;
			color = colorHelper.brighten(color,0.1);
		}
		if(updateType === 'hoverChange') {
			animation.ease = 'elasticOut';
		}
		var d = shape.getShapePath("sector" , {
				cx,
				cy,
				startAngle,
				endAngle,
				radius,
				innerRadius
			},true);

		return (
			<PathElement 
				animation={animation}
				transform={transform}
				d={d}
				fill={color}
				stroke={borderColor}
				strokeWidth={borderWidth}
				onClick={this.handleClick}
				pathShape={{name:'sector',config:{cx,cy,startAngle,endAngle,radius,innerRadius}}}
				onMouseOver={this.handleMouseOver}
				onMouseOut={this.handleMouseOut}
				onMouseMove={this.handleMouseMove}
			/>
		)
	}
	handleClick(event){
		event.preventDefault();
		event.stopPropagation();
		var index = this.props.index;
		this.props.onSlice(index);
	}
	handleMouseOver(){
		this.setState({
			isHover:true,
			updateType:'hoverChange'
		});
	}
	handleMouseMove(mouseEvent){
		var {props} = this;
		var {toggleToolTip,index} = props;
		toggleToolTip(index,true,mouseEvent)
	}
	handleMouseOut(mouseEvent){
		var {props} = this;
		var {toggleToolTip,index} = props;
		this.setState({
			isHover:false,
			updateType:'hoverChange'
		});
		toggleToolTip(index,false,mouseEvent);
	}
	componentDidMount(){
		if(this.props.isAdd) {
			this.setState({
				addAnimationDone:true,
				updateType:'animation'
			})
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			updateType:'newProps'
		});
	}
}
Slice.defaultProps = {
	animation:false,
	startAngle:null,
	endAngle:null,
	cx:null,
	cy:null,
	radius:null,
	innerRadius:0,
	selected:null,
	color:null,
	sliceOffset:20,
	borderColor:null,
	borderWidth:null,
	index:null,
	onSlice:null
};
module.exports = Slice;