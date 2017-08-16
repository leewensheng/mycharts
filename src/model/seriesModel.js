import mathUtils from 'cad/math'
import $ from 'jquery'
import BaseModel from './baseModel'
class SeriesModel extends BaseModel {
	constructor(seriesOpt){
		super();
		this.type = seriesOpt.type;
		this.option = seriesOpt;
		this.seriesIndex = seriesOpt.seriesIndex;
		this.seriesColor = seriesOpt.seriesColor;
		this.visible = seriesOpt.visible;
	}
	userHTML = false;
	defaultOption = null;
	zIndex = 0;
	dependencies = {};
	initOption(){
		this.mergetDefaultOption();
		this.normalLizeData();
	}
	getOption(){
		return this.option;
	}
	mergetDefaultOption(){
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
	getStackedPoints(){

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
		var minx,miny,maxx = null,maxy = null;
		data.map(function(point){
			x.push(point.x);
			y.push(point.y);
		});
		minx = mathUtils.min(x);
		miny = mathUtils.max(y);
		maxx = mathUtils.max(x);
		maxy = mathUtils.max(y);
		return {
			x:[minx,maxx],
			y:[miny,maxy]
		}
	}
	getPercentWith(num){
		var option = this.getOption();
		var {data} = option;
		return data.map(function(point){
			var y = point.y || 0;
			return y/num;
		})
	}
}
module.exports = SeriesModel;