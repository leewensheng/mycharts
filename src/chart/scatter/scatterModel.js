import SeriesModel from '../../model/seriesModel'
import $ from 'jquery'
import ScatterIcon from './scatterIcon'
export default class Scatter extends SeriesModel {
	//默认配置
	constructor(chartModel,seriesOpt){
		super(chartModel,seriesOpt);
		this.initOption();
	}
	icon = ScatterIcon;
	dependencies=['legend','grid'];
	defaultOption =  {
		animation:{
			during:1000,
			ease:'easeOut'
		},
		xAxis:0,
		yAxis:0,
		data:[],
		symbol:'circle',
		borderWidth:0,
		borderColor:'#000',
		borderType:'solid',
		style:{

		},
		size:20,
		maxSize:'20%',//图表vmin的百分比
		minSize:8,
		sizeBy:'area'//根据面积成比例，还是根据size成比例
	};
	normalLizeData(){
		var option = this.getOption();
		var {seriesColor} = this;
		var {type,data,colors} = option;
		var chartModel = this.chartModel;
		data = data.map(function(point,index){
			var obj = {
				name:'point'+(index),
				x:index,
				y:null,
				value:null,
				color:seriesColor
			};
			if(point instanceof Array) {
				obj.x= point[0];
				obj.y = point[1];
				if(point[2]) {
					obj.value = point[2]
				}
				if(point[3]) {
					obj.name = point[3];
				}
			} else if (typeof point === 'object') {
				obj = $.extend(obj,point);
			} else if(typeof point === 'number') {
				if(type === 'bubble') {
					obj.y = 0;
					obj.value = point;
				} else if(type === 'scatter') {
					obj.y = point;
				}
			}
			return obj;
		});
		option.data = data;
	}
	getScatterPoints(grid){
		var width = this.chartModel.getWidth();
		var height = this.chartModel.getHeight();
		var data = this.getData();
		var option = this.getOption();
		var {type,size,minSize,maxSize,sizeBy} = option;
		var points = grid.getPointsByData(data);
		var maxValue = this.getMaxValue();
		maxSize = this.getPercentMayBeValue(maxSize,Math.min(width,height));
		return points.map(function(point,index){
			var {x,y,plotX,plotY,inCord} = point;
			var pointSize;
			var pointData = data[index];
			var {value,name,color} = pointData;
			if(type === "scatter") {
				if(typeof size === 'function') {
					pointSize = size(value);
				} else {
					pointSize = size;
				}
			} else {
				if(typeof size === 'function') {
					pointSize = size(value);
				} else {
					if(sizeBy === 'area') {
						pointSize = Math.sqrt(value/maxValue)*maxSize;
					} else {
						pointSize = (value/maxValue)*maxSize;
					}
					if(pointSize < minSize) {
						pointSize = minSize;
					}
				}
			}
			return {name,value,x,y,plotX,plotY,size:pointSize,color,inCord}
		})
	}
}
