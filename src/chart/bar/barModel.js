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
		name:'',
		color:'',
		style:{
			cursor:'default'
		},
		animation:{
			during:1000
		},
		borderColor:'#fff',
		borderRadius:1,
		borderType:'solid',
		borderWidth:1,

		barGap:'10%',
		barWidth:null,//number percent of category interval
		maxBarWidth:null,
		minBarLength:0,//防止过小不显示
		groupIng:true,//是挤在一块还是分开放在一个类目间
		groupPadding:'20%',

		xAxis:0,
		yAxis:0,
		data:[],
		dataLabels:{
			enabled:true,

		},
		stack:null,
		visible:true,
		showInLegend:true
	};
	getBars(grid){
		var {chartModel,seriesIndex,visible} = this;
		if(!visible) return [];
		var seriesOpt = this.getOption();
		var visible = this.visible;
		var {xAxis,yAxis,reversed} = grid;
		var data = this.getData();
		var stackedOnData = this.getStackedOnData();
		var stackedData = this.getStackedData();
		var startPoints = grid.getPointsByData(stackedOnData);
		var endPoints = grid.getPointsByData(stackedData);

		var categoryAxis = reversed?yAxis:xAxis;
		var groupBars = categoryAxis.includeSeries.filter(function(series){
			return series.type === 'bar';
		});
		//考虑特殊场景，比如只有一个类目
		var interval = Math.abs(categoryAxis.interval);
		var {start,end} = categoryAxis;	
		//不同stack的 bar 数量
		var stackArray = [],currentStackIndex,uniqueStackNumber;
		groupBars.map(function(barSeries){
			var {stack} = barSeries;
			if(!stack) {
				stackArray.push(barSeries.stack);
			} else {
				if(stackArray.indexOf(stack) === -1) {
					stackArray.push(stack);
				}
			}
			if(barSeries.seriesIndex === seriesIndex) {
				currentStackIndex = stackArray.length - 1;
			}
		});
		uniqueStackNumber = stackArray.length;
		var {
				barGap,
				barWidth,
				maxBarWidth,
				minBarLength,
				groupIng,
				groupPadding
			} =  seriesOpt;
		if(!groupIng) {
			uniqueStackNumber = 1;
			currentStackIndex = 0;
			barGap = 0;
		}
		groupPadding = this.getPercentMayBeValue(groupPadding,interval);
		if(!barWidth) {
			var groupWidth = (interval - groupPadding);
			if(this.isPercent(barGap)) {
				barWidth = groupWidth/(uniqueStackNumber + (uniqueStackNumber - 1) * parseInt(barGap)/100);
			} else {
				barWidth = (groupWidth - barGap*(uniqueStackNumber - 1))/uniqueStackNumber;
			}
		} else {
			if(this.isPercent(barWidth)) {
				barWidth = this.getPercentMayBeValue(barWidth,interval);
			}
		}
		maxBarWidth = this.getPercentMayBeValue(maxBarWidth,interval);
		if(barWidth > maxBarWidth) {
			barWidth = maxBarWidth;
		}
		if(this.isPercent(barGap)) {
			barGap = this.getPercentMayBeValue(barGap,barWidth);
		}
		var realGroupWidth = barWidth*uniqueStackNumber + barGap*(uniqueStackNumber - 1);
		var flag = end > start ? 1: -1;
		var align = !reversed?'vertical':'horizontal';
		return startPoints.map(function(startPoint,index){
			var endPoint = endPoints[index];
			var {x,y,plotX,plotY} = endPoint;
			var pointData = data[x];
			var {color} = pointData;
			var plotStart,plotEnd;
			var groupStart,barCenter;
			if(!reversed) {
				groupStart = plotX - realGroupWidth/2*flag;
				barCenter = groupStart + ((barWidth+barGap) * currentStackIndex + barWidth/2)*flag;
				plotStart = {
					x:barCenter,
					y:startPoint.plotY
				}
				plotEnd = {
					x:barCenter,
					y:endPoint.plotY
				}
			} else {
				groupStart = plotY - realGroupWidth/2*flag;
				barCenter = groupStart + ((barWidth+barGap) * currentStackIndex + barWidth/2)*flag;
				plotStart = {
					x:startPoint.plotX,
					y:barCenter
				}
				plotEnd = {
					x:endPoint.plotX,
					y:barCenter
				}
			}
			return {
				x,
				y,
				color,
				plotX,
				plotY,
				plotStart,
				plotEnd,
				barWidth,
				align,
				startFromAxis:!startPoint.y
			}
		})
	}
}
