import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Slider from './slider'
export default class DataZoom extends Component {
	constructor(props) {
		super(props);
		this.onGridReady = this.onGridReady.bind(this);
		this.props.chartEmitter.on('gridReady',this.onGridReady);
		var sliders = props.componentModel.getSliders();
		this.state = {
			sliders:sliders
		};
	}   
	render(){
		var {props,state} = this;
		var {grid} = state;
		var {sliders} = state;
		if(!grid) return <g></g>;
		var xAxis = grid.axis[0];
		return (
			<Slider grid={grid} />
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
}