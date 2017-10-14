import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Slider from './slider'
import _ from 'lodash'
export default class DataZoom extends Component {
	constructor(props) {
		super(props);
		this.onGridReady = this.onGridReady.bind(this);
		this.zoomAxis = _.throttle(this.zoomAxis.bind(this),50);
		this.props.chartEmitter.on('gridReady',this.onGridReady);
		var sliders = props.componentModel.getSliders();
		this.state = {
			sliders:sliders
		};
	}   
	render(){
		var that = this;
		var {props,state} = this;
		var {grid} = state;
		var {sliders} = state;
		return(
			<g>
				{
					sliders.map(function(slider,index){
						var {sliderOpt,gridAxis,top,left,right,bottom,width,height} = slider;
						if(!gridAxis) {
							return;
						}
						return <Slider key={'slider'+index} index={index} zoomAxis={that.zoomAxis} {...slider} />
					})
				}
			</g>
		)
	}
	onGridReady(grid){
		var {props,state} = this;
		var {sliders}  = state;
		var {top,left,right,bottom,width,height,axis,includeSeries} = grid;
		sliders.map(function(slider){
			var {sliderOpt} = slider;
			var {xAxis,yAxis} = sliderOpt;
			axis.map(function(gridAxis){
				if(gridAxis.axisData.axis === slider.axis) {
					slider.gridAxis = gridAxis;
					slider.top = top;
					slider.left = left;
					slider.right = right;
					slider.bottom = bottom;
				}
			})
		});
		this.setState({sliders});
		this.forceUpdate();
	}
	shouldComponentUpdate(){
		return false;
	}
	componentWillReceiveProps(nextProps){
		var sliders = nextProps.componentModel.getSliders();
		this.setState({sliders});
	}
	componentWillUnmount(){
		this.props.chartEmitter.removeListner('gridReady',this.onGridReady);
	}
	zoomAxis(gridAxis,min,max){
		var {props,state} = this;
		var {chartModel,chartEmitter} = props;
		var index = gridAxis.axisData.option.index;
		var axis = gridAxis.axisData.axis;
		var msg = [];
		msg.push({index,axis,min,max});
		chartEmitter.emit("axisZoom",msg);
	}
}