import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import defaultOption from './option'
import Vcharts from '../chart/charts'
class Legend extends Component {
	constructor(props){
		super(props);
		this.state = getRenderData(props);
	}
	getRenderData(props){
		var {chartWidth,chartHeight,chartOption} = props;
		var {series,legend} = chartOption;
		legend = $.extend(true,{},defaultOption,legend);
		var items = [];
		series.map(function(serie,index){
			var type = serie.type;
			var Chart = Vcharts[type];
			if(!Chart) {
				return;
			}
			var dependencies = Chart.dependencies;
			var legend = dependencies.lengend;
			if(!lengend) {
				return;
			}
			var showInLegend = serie.showInLegend;
			if(!legend.multiple) {
				items.push({
					name:serie.name,
					icon:legend.icon,
					selected:serie.selected,
					seriesIndex:index
				})
			} else {
				serie.data.map(function(val){
					items.push({
						name:serie.name,
						icon:legend.icon,
						selected:true,
						seriesIndex:index
					})
				})
			}
		})
		return {
			items:items
		}
	}
	render(){
		var {props,state} = this;
	}
}

module.exports = Legend;