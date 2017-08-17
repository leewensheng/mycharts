import ComponentModel from '../../model/componentModel'
import $  from 'jquery'
export default class Axis extends ComponentModel {
	constructor(chartModel){
		super();
		this.initOption();
	}
	type = 'axis';
	defaultOption = {
    	type:null,//value category time log
        gridIndex:0,//所属网格区域
	    min:null,
	    max:null,//对于分类轴来说仍然是有意义的
	    minRange:null,
	    splitNumber:5,//分割段数
	    data:null,//分类轴用到
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
		xAxis = xAxis.map(function(axisOption){
			return $.extend(true,{},defaultOption,axisOption);
		})
		yAxis = yAxis.map(function(axisOption){
			return $.extend(true,{},defaultOption,axisOption);
		})
		option.xAxis = xAxis;
		option.yAxis = yAxis;
	}
	getSeriesByAxis(type,index) {
		
	}
}