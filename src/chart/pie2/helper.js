import mathUtils from 'cad/math'
import colorHelper from 'cad/color/index'

export function getRenderData(props,showPoints){
		var {series,width,height,option} = props;
		var colors = option.colors;
		var {data,color} = series;
		if(series.colors) {
			colors = series.colors;
		}
		var arr_value = data.map(function(val,index){
			if(showPoints&&!showPoints[index]) {
				return 0;
			}
			return val.value;
		})
		var sum = mathUtils.sum(arr_value);
		var max_num = mathUtils.max(arr_value);
		var min_num = mathUtils.min(arr_value);
		var mean_num = mathUtils.mean(arr_value);
	    var cx = series.center[0]*width;
	    var cy = series.center[1]*height;
	    var innerSize = series.innerSize;
	    var size = series.size;
	    var radius = Math.min(width,height)*size/2;
	    radius = Math.max(radius,series.minSize);
	    var startAngle = series.startAngle - 90;
	    var points = [];
	    var endAngle = series.endAngle?(series.endAngle - 90):(startAngle+360);
	    var totalAngle = endAngle - startAngle;
	    var roseType = series.roseType;
	    data.reduce(function(startAngle,curData,index){
	    	var percent,endAngle;
	    	if(showPoints&&!showPoints[index]) {
	    		percent = 0;
	    	} else {
	    		percent = curData.value/sum;
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
	        	y:curData.value,
	        	percent:percent.toFixed(2)
	        };
	        if(color) {
	        	//颜色差以和平均值差对比
	        	if(max_num - min_num > 0) {
	        		obj.color = colorHelper.brighten(color,(curData.value - mean_num)/(max_num - min_num )*0.5);
	        	} else {
	        		obj.color = color;
	        	}
	        } else {
	        	obj.color = colors[index%colors.length];
	        }
	        obj.radius = radius;
	        if(roseType === "radius" || roseType === "area") {
	        	obj.radius  = curData.value/max_num*radius;
	        } 
	        points.push(obj);
	        return endAngle;
	    },startAngle);

	    if(roseType === "radius" || roseType === "area")  {
	     	innerSize = 0;
	    }
	    return {
	    	points:points,
	    	cx:cx,
	    	cy:cy,
	    	radius:radius,
	    	startAngle:startAngle,
	    	endAngle:endAngle,
	    	innerRadius:radius*innerSize
	    }
	}

export function getSelectedPointsMap(props) {
	var {series} = props;
	var {data} = series;
	var selectedPointsMap = {};
	data.map(function(point,index){
		if(typeof point.selected !== 'undefined') {
			selectedPointsMap[index] = point.selected?true:false;
		}
	})
	return  selectedPointsMap;
}