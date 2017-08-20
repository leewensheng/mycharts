import SeriesModel from '../../model/seriesModel'
import BarIcon from './barIcon'
export default class BarModel extends SeriesModel {
	constructor(chartModel,seriesOpt){
		super(chartModel,seriesOpt);
		this.initOption();
	}
	icon = BarIcon;
	//依赖
	dependencies = ['grid','legend'];
	//默认配置
	defaultOption =  {
		type:'bar',
		xAxis:0,
		yAxis:0,
		barWidth:30,
		maxBarWidth:null,
		minBarLength:0,
		groupPadding:30,
		barGap:"30%",
		groupWidth:30,
		borderWidth:0,
		borderColor:"#000",
		borderRadius:0,//考虑支持百分比
		borderType:'solid',
		itemStyle:{
			cursor:'pointer'
		},
		stack:null,
		data:[],
		dataLabels:{
			enabled:true,
			color:"#fff",
			inside:true,
			align:'middle',
			margin:30,
			formatter:null,
			style:{
				fontSize:12
			}
		}
	};
	getBars(grid){
		var {chartModel,seriesIndex} = this;
		var option = this.getOption();
		var visible = this.visible;
		var {barWidth} = option;
		var {xAxis,yAxis,width,height,reversed} = grid;
		var points = this.getPointsOnGrid(grid);
		var categoryAxis = reversed?yAxis:xAxis;
		var groupBars = categoryAxis.axisData.includeSeries.filter(function(series){
			return series.type === 'bar';
		})
		//需要考虑stack
		var groupNumber = groupBars.length;
		var groupIndex = 0 ;
		var groupWidth = 100;
		var groupPadding = 20;
		var barWidth = 20;
		groupBars.map(function(series,index){
			if(series.seriesIndex === seriesIndex) {
				groupIndex = index;
			}
		});
		return []
		return  this.mapData(function(point){

		})
		
	}
}
