
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
		this.visible = seriesOpt.visible;
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
		var data = this.getData;
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
	getData(){
		var {option} = this;
		return option.data;
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
		var that = this;
		var data = this.getStackedData();
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
		var {min,max} = axisData;
		if(min === max) {
			return (start + end) / 2;
		}
		return start + (end-start)*(value - min)/(max - min);
	}
}
