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
	getBars(grid,oldState){
		var option = this.getOption();
		var visible = this.visible;
		var {barWidth} = option;
		var {bottom} = grid;
		var points = this.getPointsOnGrid(grid);
		return points.map(function(point){
			var {x,y} = point;
			var barHeight = y - bottom;
			return {
				x,y,barWidth,barHeight
			}
		})
	}
}
