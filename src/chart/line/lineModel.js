import SeriesModel from '../../model/seriesModel'
import LineIcon from './lineIcon'
export default class LineModel extends SeriesModel {
	constructor(chartModel,seriesOpt){
		super(chartModel,seriesOpt);
		this.initOption();
	}
	//依赖
	dependencies = ['grid','legend'];
	//默认配置
	icon  = LineIcon;
	defaultOption =  {
	    animation:{
	    	during:1000,
	    	ease:'linear'
	    },
	    color:null,//主色
	    name:'',
	    xAxis:0,
	    yAxis:0,
	    lineWidth:2,
	    linecap:'round',
	    lineDash:'solid',
	    dataLabels:{
	    	enabled:true,
	        style:{
	            fontSize:12,
	            color:"#333",
	            textAlign:'center'
	        }
	    },
	    marker:{
	        enabled:true,
	        symbol:'circle',//rect,roundRect,triangle,diamond,pin arrow
	        size:4,
	        offset:[0,0],
	    },
	    showInLegend:true,
	    visible:true
	}
	getLinePoints(grid){
		//需要考虑不可见场景 
		var visible = this.visible;
		if(!visible) {
			return [];
		}
		var {xAxis,yAxis,isEmpty,reversed} = grid;
		var data = this.getData();
		var stackedData = this.getStackedData();
		var stackedOnData = this.getStackedOnData();
		var allPoints = true;
		var points = grid.getPointsByData(stackedData,allPoints);
		var stackedOnPoints = grid.getPointsByData(stackedOnData,allPoints);
		var name = this.seriesName;
		return points.map(function(point,index){
			var stackPoint = stackedOnPoints[index];
			var inCord = point.inCord && stackPoint.inCord;
			var {plotX,plotY} = point;
			var pointData  = data[index];
			var {color,x,y} = pointData;
			var stackX = stackPoint.plotX;
			var stackY = stackPoint.plotY;
			return {x,y,stackX,stackY,plotX,plotY,color,inCord};
		})
	}
}
