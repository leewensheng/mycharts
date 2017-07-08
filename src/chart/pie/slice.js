import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'

import mathUtils from 'cad/math'
import colorHelper from 'cad/color/index'
import shape from 'cad/shape'
import Point from 'cad/point'
import utils from 'cad/utils'
import {interpolate} from 'cad/interpolate'

//the radius will be more when mouserover
var HOVER_RADIUS_ADD = 10;

class  Slice extends Component{
	constructor(props) {
		super(props);
		this.state = {
			isAnimating:false,
			isHover:false
		};
	}
	render(){
		var {selected,cx,cy,startAngle,midAngle,endAngle,radius,innerRadius,sliceOffset} = this.props;
		var {color,borderColor,borderWidth} = this.props;
		var {isHover} = this.state;
		var that = this;
		if(isHover) {
			radius += HOVER_RADIUS_ADD;
		}
		var d = shape.getShapePath("sector",{
				cx,cy,
				startAngle,
				endAngle,
				radius,
				innerRadius
			});
		return (
			<path 
				d={d}
				fill={color}
				stroke={borderColor}
				strokeWidth={borderWidth}
				onClick={this.props.onSlice}
				onMouseOver={this.handleMouseOver.bind(this)}
				onMouseOut={this.handleMouseOut.bind(this)}
			/>

		)
	}
	offset(moveOut){
		var {cx,cy,startAngle,midAngle,endAngle,radius,innerRadius,color,borderColor,borderWidth,sliceOffset} = this.props;
		var offset = Point(0,0).angleMoveTo(midAngle,sliceOffset);
		var el = findDOMNode(this)
		var that = this;
		var offsetX = moveOut?offset.x:0;
		var offsetY = moveOut?offset.y:0;
		var that = this;
		if(sliceOffset > 0) {
			this.setState({isAnimating:true});
			$(el).stopTransition(true)
				 .transition({
				 		transform:"translate("+ offsetX+","+ offsetY +")"
				 },100,null,function(){
				 	that.setState({isAnimating:false});
			    });
		}

	}
	handleHover(isHover){
		var {cx,cy,startAngle,endAngle,radius,innerRadius,color,borderColor,borderWidth,sliceOffset} = this.props;
		var isAnimating = this.state.isAnimating;
		var selected = this.state.selected;
		var el = findDOMNode(this);
		var hoverColor = colorHelper.brighten(color,0.1);
		var hoverRadius = radius + HOVER_RADIUS_ADD;
		this.setState({isHover:isHover})
		if(isHover) {
			$(el).fill(hoverColor);
		} else {
			$(el).fill(color);
		}
		var from,to;
		if(isHover) {
			from = radius;
			to = hoverRadius;
		} else {
			from = hoverRadius;
			to = radius;
		}
		if(!isAnimating) {
		 	$(el).stopTransition();
		} 
		$(el).transition({
			from:from,
			to:to,
			during:400,
			ease:'elasticOut',
			onUpdate(val){
				var path = shape.getShapePath("sector",{cx,cy,startAngle,endAngle,radius:val,innerRadius})
				$(el).attr("d",path);
			}
		})
	}
	handleMouseOver(){
		this.handleHover(true);
	}
	handleMouseOut(){
		this.handleHover(false);
	}
	animate(prevProps,props){
		if(props.updateType === "select") {
			if(prevProps.selected == props.selected) {
				return;
			}
			this.offset(props.selected);
			return;
		}
		var el = findDOMNode(this);
		if(!prevProps) {
			//新增成员的动画
			prevProps = utils.extend(true,{},props);
			prevProps.startAngle = prevProps.endAngle;
			prevProps.cx = props.prevOption.cx;
			prevProps.cy = props.prevOption.cy;
			prevProps.radius = props.radius;
		}
		var isHover = this.state.isHover;
		var interpolateFunc = interpolate(prevProps,props);
		var {animation,midAngle,color,borderWidth,borderColor,sliceOffset} = props;
		$(el).attr('fill',color).attr("stroke",borderColor).attr("stroke-width",borderWidth);
		var that = this;
		var x = 0, y = 0;
		if(props.selected) {
			x = mathUtils.cos(midAngle) * sliceOffset;
			y = mathUtils.sin(midAngle) * sliceOffset;
		}
		var transform = "translate(" + x + "," + y +")";
		$(el).attr("transform",transform);
		$(el).stopTransition(true);
		if(!animation) {
			onUpdate.call(el,1);
			return;
		}
		this.setState({isAnimating:true});
		$(el).transition({
			from:0,
			to:1,
			ease:"easeout",
			during:400,
			onUpdate:onUpdate,
			callback(){
				that.setState({isAnimating:false});
			}
		});
		function onUpdate(tick){
			var val = interpolateFunc(tick);
			var {cx,cy,startAngle,endAngle,radius,innerRadius,sliceOffset} = val;
			var path = shape.getShapePath("sector",{
				cx,cy,
				startAngle:startAngle,
				endAngle:endAngle,
				radius:isHover?radius+ HOVER_RADIUS_ADD:radius,
				innerRadius:innerRadius
			});
			$(el).attr("d",path);
		}
	}
	componentDidMount() {
		if(this.props.isAdded) {
			this.animate(null,this.props);
		}
		if(this.props.selected){
			this.offset(true);
		}
	}
	componentWillReceiveProps(nextProps){
		//this.offset(nextProps.selected);
		this.animate(this.props,nextProps);
	}
	shouldComponentUpdate(nextProps,nextState){
		return false;
	}
}
Slice.defaultProps = {
			animation:false,
			paper:null,
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
			index:null,//饼块的顺序
			onSlice:null,
			isAdded:false, //是新增过来的，需要动画
			updateType:"newProps", // newprops or select
			prevOption:{ //上一次的状态
				radius:0,
				innerRadius:0
			}
		};
module.exports = Slice;