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
		animation:true,
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
		var {xAxis,yAxis,width,height,reversed} = grid;
		var points = this.getPointsOnGrid(grid);
		var stackedOnPoints = this.getStackedOnPoints(grid);
		var categoryAxis = reversed?yAxis:xAxis;
		var valueAxis = reversed? xAxis:yAxis;
		var groupBars = categoryAxis.axisData.includeSeries.filter(function(series){
			return series.type === 'bar';
		});
		//考虑特殊场景，比如只有一个类目
		var categories = categoryAxis.axisData.option.categories;
		var interval =  Math.abs((categoryAxis.end - categoryAxis.start)/(categories.length));
		var {start,end} = categoryAxis;	
		var other = valueAxis.start||valueAxis.zeroPosition;
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
		return this.mapData(function(point,dataIndex){
			var stackPoint = stackedOnPoints[dataIndex];
			var {x,y,color} = point;
			var plotX = points[dataIndex].x;
			var plotY = points[dataIndex].y;
			var center = reversed?plotY:plotX;
			var plotWidthStart = center - realGroupWidth*flag/2 + 
							(barWidth+barGap)*currentStackIndex*flag;
			var plotWidthEnd = plotWidthStart + barWidth*flag;
			var pointOtherStart = reversed ? plotX : plotY;
			var pointOtherEnd = reversed? stackPoint.x:stackPoint.y;
			var barLength = Math.abs(pointOtherEnd - pointOtherStart);
			if(barLength < minBarLength) {
				barLength = minBarLength;
				if(!reversed) {
					pointOtherEnd = pointOtherStart - barLength;
				} else {
					pointOtherEnd = pointOtherStart + barLength;
				}
			}
			var rectX,rectY,rectWidth,rectHeight;
			if(!reversed) {
				rectX = Math.min(plotWidthStart,plotWidthEnd);
				rectY = Math.min(pointOtherStart,pointOtherEnd);
				rectWidth = barWidth;
				rectHeight = barLength;
			} else {
				rectY = Math.min(plotWidthStart,plotWidthEnd);
				rectX = Math.min(pointOtherStart,pointOtherEnd);
				rectWidth = barLength;
				rectHeight = barWidth;
			}
			return  {color,barWidth,barLength,plotX,plotY,x,y,rectX,rectY,rectWidth,rectHeight};
		})
	}
}
