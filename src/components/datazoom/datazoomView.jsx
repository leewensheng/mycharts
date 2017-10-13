import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Slider from './slider'
export default class DataZoom extends Component {
	constructor(props) {
		super(props);
		this.onGridReady = this.onGridReady.bind(this);
		this.zoomAxis = this.zoomAxis.bind(this);
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
						return <Slider key={index} zoomAxis={that.zoomAxis} {...slider} />
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
	zoomAxis(axis,min,max){
		var {props,state} = this;
		var {chartModel,chartEmitter} = props;
		var index = axis.axisData.option.index;
		var axis = axis.axisData.axis;
		var msg = {
			xAxis:[],
			yAxis:[]
		};
		if(axis === 'xAxis') {
			msg.xAxis.push({index,min,max});
		}
		chartEmitter.emit("axisZoom",msg);
	}
}