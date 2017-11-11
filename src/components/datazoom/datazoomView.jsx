import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Slider from './slider'
import Panning from './panning'
import _ from 'lodash'

export default class DataZoom extends Component {
	constructor(props) {
		super(props);
		this.onGridReady = this.onGridReady.bind(this);
		this.zoomAxis = _.throttle(this.zoomAxis.bind(this),150);
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
						var {sliderOpt,gridAxis} = slider;
						if(!gridAxis) {
							return;
						}
						return <g key={'datazoom'+index}>
							<Panning 
							index={index} 
							zoomAxis={that.zoomAxis}
							sliderOpt={sliderOpt}
							gridAxis={gridAxis}
							/>
							<Slider 
								index={index} 
								zoomAxis={that.zoomAxis}
								sliderOpt={sliderOpt}
								gridAxis={gridAxis.cloneAsSlider()}
							/>
							</g>
					})
				}
			</g>
		)
	}
	onGridReady(grid){
		var {props,state} = this;
		var {sliders}  = state;
		var {axis,includeSeries} = grid;
		sliders.map(function(slider){
			var {sliderOpt} = slider;
			var {xAxis,yAxis} = sliderOpt;
			axis.map(function(gridAxis){
				if(gridAxis.axis === slider.axis) {
					//TODO index也应当一样
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
	zoomAxis(gridAxis,min,max){
		var {props,state} = this;
		var {chartModel,chartEmitter} = props;
		var index = gridAxis.option.index;
		var axis = gridAxis.axis;
		var msg = [];
		msg.push({index,axis,min,max});
		chartEmitter.emit("axisZoom",msg);
	}
}