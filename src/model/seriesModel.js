
import mathUtils from 'cad/math'
import $ from 'jquery'
import BaseModel from './baseModel'
export default class SeriesModel extends BaseModel {
	constructor(chartModel,seriesOpt){
		super();
		this.chartModel = chartModel;
		this.type = seriesOpt.type;
		this.option = seriesOpt;
		this.seriesIndex = seriesOpt.seriesIndex;
		this.seriesColor = seriesOpt.seriesColor;
		this.seriesName = seriesOpt.seriesName;
		this.seriesId = chartModel.chartId + 'seires' + seriesOpt.seriesIndex;
		this.visible = seriesOpt.visible;
		this.stack = seriesOpt.stack;
	}
	icon = null;
	userHTML = false;
	defaultOption = null;
	zIndex = 0;
	dependencies = [];
	multipleLegend = false;
	initOption(){
		this.mergeDefaultOption();
		this.normalLizeData();
	}
	getOption(){
		return this.option;
	}
	mergeDefaultOption(){
		var {option,defaultOption} = this;
		this.option = $.extend(true,{},defaultOption,option);
	}
	normalLizeData(){
		var option = this.getOption();
		var {data} = option;
		var {seriesColor} = this;
		data = data.map(function(point,index){
			var obj = {
				x:index,
				y:null,
				color:seriesColor
			}
			if(point instanceof Array) {
				obj.x = point[0];
				obj.y = point[1];
			} else if (typeof point === 'object') {
				obj = $.extend(obj,point);
				obj.y = obj.y||obj.value;
			} else if(typeof point === 'number') {
				obj.y = point;
			}
			return obj;
		})
		option.data = data;
	}
	getStackedData(){
		var data = this.getData();
		var option = this.getOption();
		var {stack} = option;
		if(!stack) {
			return data;
		}
		var seriesIndex = this.seriesIndex;
		var type = this.type;
		var stackOnData = [];
		this.chartModel.eachSeriesByType(type,function(seriesModel){
			var seriesOpt = seriesModel.getOption();
			if(seriesOpt.stack === stack && seriesModel.seriesIndex < seriesIndex && seriesModel.visible) {
				stackOnData.push(seriesModel.getData());
			}
		});
		return this.mapData(function(point,dataIndex){
			var {x,y} = point;
			stackOnData.map(function(data){
				if(data[dataIndex]) {
					var stackedY = data[dataIndex].y;
					if(!isNaN(stackedY)) {
						if(!isNaN(y)) {
							y += stackedY;
						} else {
							y = stackedY;
						}
					}
				}
			});
			return  {x,y};
		})
	}
	getStackedOnData(){
		var option = this.getOption();
		var {stack} = option;
		if(!stack) {
			return null;
		}
		var seriesIndex = this.seriesIndex;
		var type = this.type;
		var stackOnData = [];
		this.chartModel.eachSeriesByType(type,function(seriesModel){
			var seriesOpt = seriesModel.getOption();
			if(seriesOpt.stack === stack && seriesModel.seriesIndex < seriesIndex && seriesModel.visible) {
				stackOnData.push(seriesModel.getData());
			}
		});
		if(stackOnData.length === 0) {
			return null;
		} else {
			var fristData =stackOnData[0];
			return fristData.map(function(point,dataIndex){
				var {x,y} = point;
				stackOnData.slice(1).map(function(data){
					if(data[dataIndex]) {
						var stackedY = data[dataIndex].y;
						if(!isNaN(stackedY)) {
							if(!isNaN(y)) {
								y += stackedY;
							} else {
								y = stackedY;
							}
						}
					}
				});
				return {x,y};
			})
		}
		return stackOnData;
	}
	getData(){
		var {option} = this;
		return option.data;
	}
	getVisibleDataOnGrid(grid){
		var {xAxis,yAxis} = grid;
		var xmin = xAxis.axisData.min;
		var xmax = xAxis.axisData.max;
		var ymin = yAxis.axisData.min;
		var ymax = yAxis.axisData.max;
		if(xAxis.axisData.option.type === 'category') {
			let intMin = Math.round(xmin);
			let intMax = intMin + Math.round(xmax - xmin);
			xmin = intMin;
			xmax = intMax;
		}
		if(yAxis.axisData.option.type === 'category') {
			let intMin = Math.round(ymin);
			let intMax = intMin + Math.round(ymax - ymin);
			ymin = intMin;
			ymax = intMax;
		}
		return this.getData().filter(function(point){
			var {x,y} = point;
			return !(x < xmin || x > xmax || y < ymin || y > ymax);
		})
	}
	getMin(){
		var extreme = this.getExtreme();
		return {
			x:extreme.x[0],
			y:extreme.y[0]
		}
	}
	getMax(){
		var extreme = this.getExtreme();
		return {
			x:extreme.x[1],
			y:extreme.y[1]
		}
	}
	getMaxValue(){
		return mathUtils.max(this.mapData(function(point){
			return point.value;
		}))
	}
	getExtreme(){
		var option = this.getOption();
		var {data} = option;
		var x = [],y = [];
		var minx,miny,maxx,maxy;
		data.map(function(point){
			x.push(point.x);
			y.push(point.y);
		});
		minx = mathUtils.min(x);
		miny = mathUtils.min(y);
		maxx = mathUtils.max(x);
		maxy = mathUtils.max(y);
		return {
			x:[minx,maxx],
			y:[miny,maxy]
		}
	}
	mapData(callback) {
		var option = this.getOption();
		var {data} = option;
		return data.map(callback);
	}
	getPercentWith(num){
		var option = this.getOption();
		var {data} = option;
		return data.map(function(point){
			var y = point.y || 0;
			return y/num;
		})
	}
	getPointsOnGrid(grid) {
		var data = this.getStackedData();
		return this.getDataPointsOnGrid(data,grid);
	}
	getStackedOnPoints(grid){
		var that = this;
		var seriesOpt = this.getOption();
		var {stack}  = seriesOpt;
		var data = this.getData();
		var {xAxis,yAxis,reversed,isEmpty} = grid;
		var stackedOnData = this.getStackedOnData();
		var categoryAxis = reversed ? yAxis : xAxis;
		var valueAxis = reversed ? xAxis : yAxis;
		if(!stackedOnData) {
			//有零时在0上，无0时，在轴线上
			var {start,end,interval,other,axisData} = categoryAxis;
			return data.map(function(point,dataIndex){
				var x,y;
				x =  that.getPositionOnAxis(dataIndex,categoryAxis);
				if(valueAxis.min*valueAxis.max <= 0) {
					y =  that.getPositionOnAxis(0,valueAxis);
				} else {
					y = other;
				}
				return {
					x:reversed?y:x,
					y:reversed?x:y
				}
			})
		} else {
			return this.getDataPointsOnGrid(stackedOnData,grid);
		}
	}
	getDataPointsOnGrid(data,grid){
		var that = this;
		var {xAxis,yAxis,isEmpty,reversed} = grid;
		if(isEmpty) {
			return [];
		}
		return data.map(function(point){
			var x = that.getPositionOnAxis(reversed?point.y:point.x,xAxis);
			var y = that.getPositionOnAxis(reversed?point.x:point.y,yAxis);
			return {x,y};
		});
	}
	getPositionOnAxis(value,axis) {
		var {start,end,axisData} = axis;
		var {splitData} = axisData;
		var min = splitData[0];
		var max = splitData[splitData.length -1];
		if(min === max) {
			return (start + end) / 2;
		}
		return start + (end-start)*(value - min)/(max - min);
	}
}
