import ComponentModel from '../../model/componentModel'
import $  from 'jquery'
export default class GridModel extends ComponentModel {
	constructor(chartModel){
		super(chartModel);
		this.initOption();
	}
	type = 'grid';
	dependencies = ['axis'];
	defaultOption = {
        left:30,
        top:30,
        bottom:30,
        right:30,
        background:'transparent',
        containLabel:true
	};
	initOption() {
		var {defaultOption,chartModel} = this;
		var option= chartModel.getOption();
		var grid = option.grid;
		grid = this.normalLizeToArray(grid);
		grid = grid.map(function(gridOption){
			return $.extend(true,{},defaultOption,gridOption);
		})
		option.grid = grid;
	}
	getSeriesByGrid(gridIndex){
		var {chartModel} = this;
		var gridSeries = [];
		chartModel.eachSeriesByDependency('grid',function(seriesModel){
			var seriesOpt = seriesModel.getOption();
			var {seriesIndex,visible} = seriesModel;
			var {type,xAxis,yAxis} = seriesOpt;
			var series =  {type,seriesIndex,xAxis,yAxis,visible}
			gridSeries.push(series);
		})
		return gridSeries;
	}
	getGridsData(){
		var that = this;
		var {chartModel} = this;
		var option= this.chartModel.getOption();
		var axisModel = this.chartModel.getComponent('axis');
		var {grid} = option;
		var chartWidth = chartModel.getWidth();
		var chartHeight = chartModel.getHeight();
		return grid.map(function(gridOpt,gridIndex){
			var xAxis = axisModel.getAxisDataByGrid('xAxis',gridIndex);
			var yAxis = axisModel.getAxisDataByGrid('yAxis',gridIndex);
			var includeSeries = that.getSeriesByGrid(gridIndex);
            var {top,left,bottom,right,background,containLabel} = gridOpt;
            var width = chartWidth - right - left;
            var height = chartHeight - bottom - top;
			return {top,left,right,bottom,background,width,height,containLabel,xAxis,yAxis,includeSeries};
		})
	}
}