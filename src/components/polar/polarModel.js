import ComponentModel from '../../model/componentModel'
import $  from 'jquery'
export default class GridModel extends ComponentModel {
	constructor(chartModel){
		super(chartModel);
		this.initOption();
	}
	type = 'polar';
	dependencies = ['axis'];
	defaultOption = {
        center:['50%','50%'],
        size:'50%',
        startAngle:0,
        endAngle:null,
        background:'transparent',
	};
	initOption() {
		var {defaultOption,chartModel} = this;
		var option= chartModel.getOption();
		var polar = option.polar;
		polar = this.normalLizeToArray(polar);
		polar = polar.map(function(polarOpt){
			return $.extend(true,{},defaultOption,polarOpt);
		})
		option['polar'] = polar;
	}
	getSeriesByPolarIndex(polarIndex){
		var {chartModel} = this;
		var polarSeries = [];
		chartModel.eachSeriesByDependency('cord',function(seriesModel){
			if(!seriesModel.visible) {
				return;
			}
			var seriesOpt = seriesModel.getOption();
			var {seriesIndex} = seriesModel;
			var {type,xAxis,yAxis} = seriesOpt;
			var series =  {type,seriesIndex,xAxis,yAxis}
			polarSeries.push(series);
		})
		return polarSeries;
	}
	getPolars(){
		var that = this;
		var {chartModel} = this;
		var option= this.chartModel.getOption();
		var axisModel = this.chartModel.getComponent('axis');
		var {polar} = option;
		var chartWidth = chartModel.getWidth();
		var chartHeight = chartModel.getHeight();
		return grid.map(function(gridOpt,polarIndex){
			var xAxis = axisModel.getAxisDataByGrid('xAxis',polarIndex);
			var yAxis = axisModel.getAxisDataByGrid('yAxis',polarIndex);
			var includeSeries = that.getSeriesByGrid(polarIndex);
            var {top,left,bottom,right,background,containLabel} = gridOpt;
            var width = chartWidth - right - left;
            var height = chartHeight - bottom - top;
			return {top,left,right,bottom,background,width,height,containLabel,xAxis,yAxis,includeSeries};
		})
	}
}