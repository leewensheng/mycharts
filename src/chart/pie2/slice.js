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
		this.state = {
			isHover:false,
			isAnimating:false
		}
	}
	render(){
		var {props,state} = this;
		var {selected,cx,cy,startAngle,midAngle,endAngle,radius,innerRadius,sliceOffset} = props;
		var {color,borderColor,borderWidth} = props;
		var {isHover} = state
		var that = this;
		var offsetX = 0, offsetY = 0;
		if(selected) {
			var offset = Point(0,0).angleMoveTo(midAngle,sliceOffset);
			offsetX = offset.x;
			offsetY = offset.y;
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
				d={d}
				fill={color}
				stroke={borderColor}
				strokeWidth={borderWidth}
				transform={'translate('+offsetX + ',' + offsetY + ')'}
				onClick={this.props.onSlice}
				pathShape={{name:'sector',config:{cx,cy,startAngle,endAngle,radius,innerRadius}}}
				onAnimationEnd={this.onAnimationEnd.bind(this)}
				onMouseOver={this.handleMouseOver.bind(this,true,false)}
				onMouseOut={this.handleMouseOver.bind(this,false,false)}
			/>
		)
	}
	onAnimationEnd(isAnimating){
		this.setState({
			isAnimating:isAnimating,
			update:false
		})
	}
	handleMouseOver(isHover,forceSelected,forceValue){
		var {props,state} = this;
		var {selected,cx,cy,startAngle,midAngle,
			endAngle,radius,innerRadius,color,sliceOffset} = props;
		if(state.isAnimating) {
			return;
		}
		if(forceSelected) {
			selected = forceValue;
		}
		var $el = $(findDOMNode(this));
		var d = $el.attr('d');
		if(isHover) {
			radius += HOVER_RADIUS_ADD;
			color = colorHelper.brighten(color,0.1);
		}
		var transform = $el.attr('transform');
		var offsetX = 0, offsetY = 0;
		if(selected) {
			var offset = Point(0,0).angleMoveTo(midAngle,sliceOffset);
			offsetX = offset.x;
			offsetY = offset.y;
		}
		var d2 = shape.getShapePath('sector',{cx,cy,startAngle,endAngle,radius,innerRadius},true);
		var pathEase = interpolatePath(d,d2);
		var transformEase = interpolateTransform(transform,'translate('+offsetX+ ',' + offsetY + ')');
		$el.attr('fill',color).stopTransition().transition({
			from:0,
			to:1,
			ease:forceSelected?'easeOut':'elastic',
			during:400,
			onUpdate(k){
				$el.attr('d',pathEase(k));
				$el.attr('transform',transformEase(k));
			}
		});
		this.setState({isHover:isHover,update:false});
	}
	offset(selected){
		this.handleMouseOver(this.state.isHover,true,selected);
	}
	componentWillReceiveProps(nextProps){
	 	if(nextProps.updateType === 'select') {
			if(this.props.selected != nextProps.selected) {
				this.offset(nextProps.selected);
			}
			this.setState({update:false});
		} else {
			this.setState({update:true});
		}

	}
	shouldComponentUpdate(nextProps,nextState){
		return nextProps.updateType !== 'select' && nextState.update;
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