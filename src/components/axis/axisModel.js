import ComponentModel from '../../model/componentModel'
import $  from 'jquery'
import mathUtils from 'cad/math'

export default class Axis extends ComponentModel {
	constructor(chartModel){
		super(chartModel);
		this.initOption();
	}
	type = 'axis';
	defaultOption = {
    	type:null,//value category time log
        grid:0,//所属网格区域
	    min:null,
	    max:null,//对于分类轴来说仍然是有意义的
	    minRange:null,
	    splitNumber:5,//分割段数
	    categories:null,//分类轴用到
	    opposite:false,
	    inverse:false,//数值反转
	    title:{
	        enabled:true,
	        align:"end",//start middle end
	        //@margin start end是指距另一相邻轴线的距离,middle是指距当前轴线的距离
	        margin:15,
	        rotation:0,
	        style:{
	            color:"#666",
	            fontSize:12
	        },
	        text:""
	    },
	    axisLine:{
	    	onZero:true,
	        enabled:true,
	        lineColor:'blue',
	        lineWidth:1,
	        lineDash:false,
	        style:{

	        }
	    },
	    gridLine:{
	    	enabled:true,
	        lineColor:'red',
	        lineWidth:1,
	        lineDash:false,
	    	style:{
	    
	    	}
	    },
	    axisTick:{
	        enabled:true,
	        interval:"auto",
	        inside:false,
	        length:5,
	        lineColor:'red',
	        lineWidth:1,
	        lineDash:false,
	        style:{

	        }
	    },
	    axisLabel:{
	        enabled:true,
	        interval:'auto',
	        inside:false,
	        rotate:0,
	        margin:8,
	        rotation:'auto',
	        textWidth:null,//强制宽度
	        formatter:null,
	        style:{
	            color:'#333',
	            fontSize:12,
	            textAlign:"center",
	            textBaseLine:"bottom"
	        }
	    }
    };
	initOption() {
		var {defaultOption,chartModel} = this;
		var option= chartModel.getOption();
		var {xAxis,yAxis} = option;
		xAxis = this.normalLizeToArray(xAxis);
		yAxis = this.normalLizeToArray(yAxis);
		xAxis = xAxis.map(function(axisOpt,index){
			var option = $.extend(true,{},defaultOption,axisOpt);
			option.index = index;
			if(option.categories) {
				option.type = 'category';
			} else {
				option.type = 'value';
			}
			return option;
		})
		yAxis = yAxis.map(function(axisOpt,index){
			var option = $.extend(true,{},defaultOption,axisOpt);
			option.index = index;
			if(option.categories) {
				option.type = 'category';
			} else {
				option.type = 'value';
			}
			return option;
		})
		var grids = [];
		xAxis.map(function(axisOpt){
			var gridIndex = axisOpt.grid;
			if(!grids[gridIndex]) {
				grids[gridIndex] = {
					xAxis:[],
					yAxis:[]
				}
			}
			grids[gridIndex].xAxis.push(axisOpt);
		})
		yAxis.map(function(axisOpt){
			var gridIndex = axisOpt.grid;
			if(!grids[gridIndex]) {
				grids[gridIndex] = {
					xAxis:[],
					yAxis:[]
				}
			}
			grids[gridIndex].yAxis.push(axisOpt);
		})
		grids.map(function(grid){
			var {xAxis,yAxis} = grid;
			if(xAxis.length > 1) {
				xAxis[1].opposite = !xAxis[0].opposite;
			}
			if(yAxis.length > 1) {
				yAxis[1].opposite = !yAxis[0].opposite;
			}
		})
		chartModel.eachSeriesByDependency('grid',function(seriesModel){
			var option = seriesModel.getOption();
			var xAxisIndex = option.xAxis;
			var yAxisIndex = option.yAxis;
			if(xAxis[xAxisIndex].type === 'value' && yAxis[yAxisIndex].type === 'category') {
				xAxis[xAxisIndex].reversed = true;
				yAxis[yAxisIndex].reversed = true;
			}
		})
		option.xAxis = xAxis;
		option.yAxis = yAxis;
	}
	getAxisDataByGrid(axis,gridIndex) {
		var that = this;
		var option = this.chartModel.getOption();
		return option[axis].filter(function(axisOpt){
			return axisOpt.grid == gridIndex;
		}).map(function(axisOpt,indexInGrid){
			var {index} = axisOpt;
			var includeSeries = that.getSeriesByAxis(axis,index);
			var stackedData = includeSeries.map(function(seriesModel){
				return seriesModel.getStackedData();
			})
			var stackedX = [],stackedY = [];
			stackedData.map(function(data){
				data.map(function(point){
					var {x,y} = point;
					stackedX.push(x);
					stackedY.push(y);
				})
			});
			var minX = mathUtils.min(stackedX);
			var maxX = mathUtils.max(stackedX);
			var minY = mathUtils.min(stackedY);
			var maxY = mathUtils.max(stackedY);
			var reversed = axisOpt.reversed,min,max
			if(axis === 'xAxis') {
				if(reversed) {
					min = minY;
					max = maxY;
				} else {
					min = minX;
					max = maxX;
				}
			} else {
				if(reversed) {
					min = minX;
					max = maxX;
				} else {
					min = minY;
					max = maxY;
				}
			}
			min = typeof axisOpt.min === 'number' ? axisOpt.min : min;
			max = typeof axisOpt.max === 'number' ? axisOpt.max : max;
			var {type} =  axisOpt;
			var splitData;
			if(type === 'value') {
				splitData = that.getSplitArray(min,max,axisOpt.splitNumber);
				min = splitData[0];
				max = splitData[splitData.length-1];
			}
			return {
				type:axisOpt.type,
				option:axisOpt,
				min:min,
				max:max,
				axis:axis,
				indexInGrid:indexInGrid,
				splitData:splitData,
				includeSeries:includeSeries.map(function(seriesModel){
					return {
						type:seriesModel.type,
						seriesIndex:seriesModel.seriesIndex,
						stack:seriesModel.stack
					}
				})
			}
		})
	}
	getSeriesByAxis(axis,index) {
		var {chartModel} = this;
		var series = [];
		chartModel.eachSeriesByDependency('grid',function(seriesModel){
			var option = seriesModel.getOption();
			 if(option[axis] == index && seriesModel.visible) {
			 	series.push(seriesModel);
			 }
		})
		return series;
	}
	getSplitArray(min,max,splitNumber) {
        if(min === max) {
        	if(min === null) {
            	return [];
        	} else {
        		return [min];
        	}
        }
        var gap =  max - min;
        var data = [];
        var realMax,realMin;
        var tick = gap /(splitNumber-1);
        var k = Math.ceil(Math.log(tick)/Math.log(10));
        var minTick = 0.25*Math.pow(10,k);
        var n   = Math.log(tick/minTick)/Math.log(2);
        n = Math.round(n);
        tick = Math.pow(2,n)*minTick;
        realMax = Math.round(max/tick)*tick;
        realMin = Math.round(min/tick)*tick;
        if(realMax < max) {
            realMax += tick;
        } 
        if(realMin > min) {
            realMin -= tick;
        }
        splitNumber = (realMax - realMin) / tick +1;
        for(var i = 0;i < splitNumber; i++){
            data.push(realMin + tick*i);
        }
        return data;
    }
}