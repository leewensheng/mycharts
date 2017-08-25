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
		xAxis:0,
		yAxis:0,
		data:[],
		marker:{
			symbol:'circle',
			size:20,
			borderWidth:0,
			borderColor:'#000',
			borderType:'solid',
			style:{
				
			}
		},
		maxSize:'20%',
		minSize:'8',
		sizeBy:'area',
		sizeByAbsoluteValue:false
	};
	normalLizeData(){
		var option = this.getOption();
		var {data,colors} = option;
		var chartModel = this.chartModel;
		data = data.map(function(point,index){
			var obj = {
				name:'point'+(index),
				x:index,
				y:null,
				value:null,
				color:chartModel.getColorByIndex(index)
			};
			if(colors) {
				obj.color  = colors[index%colors.length];
			}
			if(point instanceof Array) {
				obj.x= point[0];
				obj.y = point[1];
				if(point[2]) {
					obj.value = point[2]
				}
			} else if (typeof point === 'object') {
				obj = $.extend(obj,point);
			} else if(typeof point === 'number') {
				obj.y = 0;
				obj.value = point;
			}
			return obj;
		});
		option.data = data;
	}
	getScatterPoints(grid){
		var points = this.getPointsOnGrid(grid);
		return this.mapData(function(point,dataIndex){
			var {x,y} = point;
			var plotX = points[dataIndex].x;
			var plotY = points[dataIndex].y; 
			var size = 20;
			return {x,y,plotX,plotY,size}
		})
	}
}
