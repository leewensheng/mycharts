import mathUtils from 'cad/math'
import colorHelper from 'cad/color/index'
function getPieSeriesData(data) {
	return data.map((point,index) => {
		var name,value,visible,selected;
		if(typeof point === 'object') {
			name = point.name || ('slice' + index);
			value = point.value ||point.y;
			selected = point.selected
			visible = typeof point.selected === 'undefined' ? true : point.visible;
		} else if(!isNaN(point)) {
			name = 'slice' + index;
			value = point || 0 ;
			visible = true;
			selected = false;
		} else {
			name = 'slice' + index;
			value = 0;
			visible = true;
			selected = false;
		}
		return {name,value,selected,visible};
	})
}
export function getRenderData(props,oldState){
		var {series,width,height,option} = props;
		var colors = option.colors;
		var {data,color} = series;
		if(series.colors) {
			colors = series.colors;
		}
		data = getPieSeriesData(data);
		data.map(function(point,index){
		if(oldState&&oldState.points[index]) {
				point.selected =  oldState.points[index].selected;
				point.visible =  oldState.points[index].visible;
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
	        	y:curData.value,
	        	percent:percent.toFixed(2),
	        	visible:curData.visible,
	        	selected:curData.selected
	        };
	        if(color) {
	        	//颜色差以和平均值差对比
	        	if(max_num - min_num > 0) {
	        		obj.color = colorHelper.brighten(color,(value - mean_num)/(max_num - min_num )*0.5);
	        	} else {
	        		obj.color = color;
	        	}
	        } else {
	        	obj.color = colors[index%colors.length];
	        }
	        obj.radius = radius;
	        if(roseType === "radius" || roseType === "area") {
	        	obj.radius  = value/max_num*radius;
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
