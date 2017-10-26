
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
					if(!isNaN(stackedY) && stackedY*y > 0) {
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
		var seriesIndex = this.seriesIndex;
		var type = this.type;
		var data = this.getData();
		var stackedOnData = [];
		var ret = data.map(function(val){
			return {x:val.x,y:null};
		});
		if(!stack) {
			return ret;
		}
		this.chartModel.eachSeriesByType(type,function(seriesModel){
			var seriesOpt = seriesModel.getOption();
			if(seriesOpt.stack === stack && seriesModel.seriesIndex < seriesIndex && seriesModel.visible) {
				stackedOnData.push(seriesModel.getData());
			}
		});
		
		return ret;
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
	getLegendColors(){
		var seriesColor = this.seriesColor;
		return this.mapData(function(point){
			return point.color||seriesColor;
		})
	}
}
