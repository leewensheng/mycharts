import ComponentModel from '../../model/componentModel'
import $ from 'jquery'

export default class DataZoomModel extends ComponentModel {
	constructor(chartModel){
		super(chartModel);
		this.initOption();
	}
	type = 'dataZoom';
	dependencies=['grid'];
	defaultOption = {
		enabled:true,
		type:'slider',
		realTime:true,
		xAxis:0,
		yAxis:null,
		opposite:false,
		margin:20,
		background:"rgba(33,33,33,0.7)"
	};
	initOption(){
		var that = this;
		var {defaultOption,chartModel} = this;
		var option= chartModel.getOption();
		var {dataZoom} = option;
		dataZoom = this.normalLizeToArray(dataZoom).map(function(zoomOpt){
			zoomOpt =  $.extend(true,{},defaultOption,zoomOpt);
			var {xAxis,yAxis} = zoomOpt;
			xAxis = that.normalLizeToArray(xAxis).filter(function(axis){
				return typeof axis === 'number';
			});
			yAxis = that.normalLizeToArray(yAxis).filter(function(axis){
				return typeof axis === 'number';
			});
			zoomOpt.xAxis = xAxis;
			zoomOpt.yAxis = yAxis;
			return zoomOpt;
		});
		option['dataZoom'] = dataZoom;
	}
	getSliders(){
		var dataZoomOpt = this.getOption();
		var that = this;
		return dataZoomOpt.map(function(zoomOpt){
			var {xAxis,yAxis} = zoomOpt;
			 var axis;
			 if(xAxis.length) {
			 	axis  = 'xAxis';
			 } else if(yAxis.length) {
			 	axis = 'yAxis';
			 }
			return {
				sliderOpt:zoomOpt,
				axis:axis,
				gridAxis:null,
				top:null,
				right:null,
				bottom:null,
				left:null
			}
		})
	}
}