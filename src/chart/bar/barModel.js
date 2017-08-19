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
		xAxis:0,
		yAxis:0
	};
	getBars(grid,barWidth){
		var {top,left,width,height,bottom,right,xAxis,yAxis} = grid;
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
