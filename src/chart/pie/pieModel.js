import SeriesModel from '../../model/seriesModel'
import colorHelper from 'cad/color/index'
import mathUtils from 'cad/math'
import $ from 'jquery'
import PieIcon from './pieIcon'
class PieModel extends SeriesModel {
	//默认配置
	constructor(chartModel,seriesOpt){
		super(chartModel,seriesOpt);
		this.initOption();
	}
	icon = PieIcon;
	dependencies=['legend'];
	multipleLegend = true;
	defaultOption =  {
		animation:{
			during:1000,
			ease:'easeOut'
		},
		color:null,//主色
		colors:null,//系列色
		center:['50%','50%'],//中心位置
		borderColor:"#fff",//描边颜色
		borderWidth:0,//描边
		itemStyle:{

		},
		data:[], //数据{name:'slcie1',value:1,color:'#fff',selected:true}
		dataLabels:{
			enabled:true,
			show:false,
			inside:false,
			distance:30,
			style:{
				fontSize:12,
			}
		},
		connectLine:{
			enabled:true,
			leadLength:20,
			lineColor:'',
			lineWidth:1,
			lineDash:false,
			lineStyle:{

			}
		},
		roseType:false,//南丁格尔玫瑰'radius'：同时半径和角度按比例变化,'area'角度相同，半径不同
		selectMode:"single",//多选模式
		size:'75%',//外径
		minSize:40,//最小半径
		innerSize:0,//内径
		startAngle:0,//起始角度，以上向为0
		endAngle:null,//不写则始终角差360，指定则按指定的来
		sliceOffset:10,//选中时的偏移量
		visible:true,
		states:{
			hover:{
			}
		}
	};
	normalLizeData(){
		var option = this.getOption();
		var {data,colors} = option;
		var chartModel = this.chartModel;
		data = data.map(function(point,index){
			var obj = {
				name:'slice'+(index + 1),
				value:null,
				visible:true,
				selected:false
			}
			var color = chartModel.getColorByIndex(index);
			if(colors) {
				color  = colors[index%colors.length];
			}
			obj.color = color;
			if(point instanceof Array) {
				obj.name= point[0];
				obj.value = point[1];
				if(point[2]) {
					obj.color = point[3]
				}
			} else if (typeof point === 'object') {
				obj = $.extend(obj,point);
			} else if(typeof point === 'number') {
				obj.value = point;
			}
			return obj;
		})
		option.data = data;
	}
	getLegendColors(){
		var seriesOpt = this.getOption();
		var {roseType} = seriesOpt;
		var {data,color} = seriesOpt;
		var arr_value = data.map(function(point,index){
			return point.visible?point.value:0;
		})
		var sum = mathUtils.sum(arr_value);
		if(sum === 0) {
			sum = 1e-6;
		}
		var max_num = mathUtils.max(arr_value)||1e-6;
		var min_num = mathUtils.min(arr_value);
		var mean_num = mathUtils.mean(arr_value);
		return data.map(function(point,index){
			var {value} = point;
			if(color) {
	        	//颜色差以和平均值差对比
	        	if(max_num - min_num > 0) {
	        		return colorHelper.brighten(color,(value - mean_num)/(max_num - min_num )*0.5);
	        	} else {
	        		return color;
	        	}
	        } else {
				return point.color;
			}
		});
	}
	getRenderData(width,height,oldState){
		var seriesOpt = this.getOption();
		var vmin = Math.min(width,height);
		var {center,size,minSize,innerSize,startAngle,endAngle,roseType} = seriesOpt;
		var {data,color} = seriesOpt;
		data.map(function(point,index){
		if(oldState&&oldState.points[index]) {
				point.selected =  oldState.points[index].selected;
			} 
		})
		var arr_value = data.map(function(point,index){
			return point.visible?point.value:0;
		})
		
		var sum = mathUtils.sum(arr_value);
		if(sum === 0) {
			sum = 1e-6;
		}
		var max_num = mathUtils.max(arr_value)||1e-6;
		var min_num = mathUtils.min(arr_value);
		var mean_num = mathUtils.mean(arr_value);
	    var cx = this.getPercentMayBeValue(center[0],width);
		var cy = this.getPercentMayBeValue(center[1],height);
		var radius =this.getPercentMayBeValue(size,vmin) / 2;
		radius = Math.max(radius,minSize);
		var innerRadius = this.getPercentMayBeValue(innerSize,radius);
		if(innerRadius > innerRadius) {
			let mid = innerRadius;
			innerRadius = mid;
			radius = innerRadius;
		}
	    var startAngle = startAngle - 90;
	    var points = [];
	    var endAngle = endAngle?(endAngle - 90):(startAngle+360);
		var totalAngle = endAngle - startAngle;
	    data.reduce(function(startAngle,curData,index){
	    	var percent,endAngle,value;
	    	value = arr_value[index];
	    	if(!curData.visible) {
	    		percent = 0;
	    	} else {
	    		percent = value/sum;
	    	}
	        if(roseType !== "area") {
	       		endAngle = startAngle + percent*totalAngle;
	        } else {
	        	endAngle = startAngle + totalAngle/(data.length);
	        }
	        //point state
	        var obj = {
	        	startAngle:startAngle,
	        	endAngle:endAngle,
	        	midAngle:(startAngle + endAngle)/2,
	        	name:curData.name,
	        	x:curData.index,
	        	y:curData.y,
	        	percent:percent.toFixed(2),
	        	visible:curData.visible,
	        	selected:curData.selected,
	        	color:curData.color,
	        	radius:radius
	        };
	        if(color) {
	        	//颜色差以和平均值差对比
	        	if(max_num - min_num > 0) {
	        		obj.color = colorHelper.brighten(color,(value - mean_num)/(max_num - min_num )*0.5);
	        	} else {
	        		obj.color = color;
	        	}
	        }
	        if(roseType === "radius" || roseType === "area") {
	        	obj.radius  = innerRadius +  value/max_num*(radius - innerRadius);
	        } 
	        if(oldState) {
	        	if(!oldState.points[index]) {
	        		obj.isAdd = true;
	        	}
	        }
	        points.push(obj);
	        return endAngle;
	    },startAngle);

	    if(roseType === "radius" || roseType === "area")  {
	     	innerSize = 0;
		}
		return {cx,cy,radius,innerRadius,startAngle,endAngle,points};
	}

}

module.exports = PieModel;