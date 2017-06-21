import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import defaultOption from './option'
import Vcharts from '../../chart/charts'
import Text from '../../widget/text'
import Rect from '../../widget/Rect'
import mathUtils from 'cad/math'
class Legend extends Component {
	constructor(props){
		super(props);
		this.state = this.getRenderData(props);
	}
	getRenderData(props,oldState){
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
			var dependencies = Chart.dependencies||{};
			var legend = dependencies.legend;
			if(!legend) {
				return;
			}
			var showInLegend = serie.showInLegend;
			if(!legend.multiple) {
				items.push({
					x:0,
					y:0,
					name:serie.name|| ('serie' + index),
					icon:legend.icon,
					selected:true,
					multiple:false,
					seriesIndex:index
				})
			} else {
				serie.data.map(function(val){
					items.push({
						x:0,
						y:0,
						name:serie.name,
						icon:legend.icon,
						selected:true,
						multiple:true,
						seriesIndex:index
					})
				});
			}
		});
		if(oldState) {
			items.map(function(item,index){
				var oldItem = oldState.items[index];
				if(oldItem) {
					item.x = oldItem.x;
					item.y = oldItem.y;
					item.width = oldItem.width;
					if(props.updateType === 'newProps') {
						item.selected = oldItem.selected;
					}
				}
			})
		}
		return {
			isAdjusted:false,
			legendOption:legend,
			items:items,
			hasInited:oldState?true:false
		}
	}
	render(){
		var that = this;
		var {props,state} = this;
		var {hasInited,isAdjusted,items,legendOption} = state;
		var {chartOption,chartWidth,chartHeight} = props;
		var {legend} = chartOption;
		var {
			enabled,layout,align,verticlAlign,borderColor,
			borderWidth,borderRadius,background,formatter,
			margin,itemWidth,itemGap,itemPadding,selectMode,inactiveColor,labelStyle
		} = legendOption;
		return (
			<g className="vcharts-legend">
				{
					items.map(function(item,index){
						var Icon = item.icon;
						var {x,y,width,selected} = item;
						return (
							<g 	className="vcharts-legend-item" 
								key={index} 
								opacity={!hasInited&&!isAdjusted?0:1} 
								style={{cursor:'pointer'}}
								onClick={that.toggleItem.bind(that,index)}
								>
								<Rect animation={hasInited} x={x} y={y} width={width} height={50} fill={selected?'blue':'gray'} stroke={borderColor} strokeWidth={borderWidth} r1={borderRadius} r2={borderRadius} />
								<Icon animation={hasInited} x={x} y={y} width={50} height={50} color="red"/>
								<Text animation={hasInited} x={x + 50} y={y} fill="red" style={{textBaseLine:'middle'}}>{item.name}</Text>
							</g>
						)
					})
				}
			</g>
		)
	}
	toggleItem(index){
		var {props,state} = this;
		var {items} = state;
		var item = items[index];
		item.selected = !item.selected;
		this.setState({items:items,updateType:'toggle'});
		this.sendLegendData();
	}
	sendLegendData(){
    	var {props,state} = this;
    	var {onDependceReady} = props;
    	var {items} = this.state;
    	var groupedItems = {};
    	items.map(function(item,index){
    		var {seriesIndex,selected,multiple} = item;
    		if(!multiple) {
    			groupedItems[seriesIndex] = {selected:selected};
    		} else {
    			groupedItems[seriesIndex] = groupedItems[seriesIndex] || [];
    			groupedItems[seriesIndex].push({selected:selected});
    		}
    	})
    	for(var index in groupedItems) {
    		onDependceReady('legend',index,groupedItems[index]);
    	}
    }
    adjustPosition(){
    	var {props,state} = this;
    	var {isAdjusted,items,legendOption} = state;
		var {chartOption,chartWidth,chartHeight} = props;
		var {legend} = chartOption;
		var {
			enabled,layout,align,verticlAlign,borderColor,
			borderWidth,borderRadius,background,formatter,
			margin,itemWidth,itemGap,itemPadding,selectMode,inactiveColor,labelStyle
		} = legendOption;
		var useItemWidth = typeof itemWidth === 'number' && itemWidth > 0;
    	var el = findDOMNode(this);
    	var itemWidths = [],blockWidth = 0,blockHeight = 0;
    	$(el).find(".vcharts-legend-item").each(function(index,dom){
			var bbox = dom.getBBox();
			var {width,height} = bbox;
			itemWidths.push(width);
			items[index].width = useItemWidth ? itemWidth : width;
    	});
		var rows = [[]];
		var rowIndex = 0;
		items.reduce(function(prev,item,index){
			var width = item.width;
			var currentRow = rows[rowIndex];
			var totalWidth = prev + width + itemGap;
			if(totalWidth > chartWidth) {
				if(currentRow.length === 0) {
					currentRow.push(item);
				} else {
					rows.push([]);
					rowIndex++;
				}
			} else {
				currentRow.push(item);
			}
		},0);
		var rowsWidth = rows.map(function(row,rowIndex){
			var rowWidth = 0;
			row.map(function(item,index){
				rowWidth += item.width;
				if(index!=0) {
					rowWidth += itemGap;
				}
			});
			blockWidth = Math.max(rowWidth,blockWidth);
			blockHeight += 20;// todo
			return rowWidth;
		});
		rows.map(function(row,rowIndex){
			var startX;
			if(align === 'left') {
				startX = 0;
			} else if(align === 'center') {
				startX = chartWidth/2 - rowsWidth[rowIndex]/2;
			} else if (align === 'right') {
				startX = chartWidth - rowWidth;
			} else {
				startX = chartWidth/2 - rowsWidth[rowIndex]/2;
			}
			row.reduce(function(prev,item,index){
				var x = prev,y;
				if(index !== 0) {
					x += itemGap;
				}
				item.x = x;
				item.y = rowIndex * 60;
				return x + item.width;
			}, startX );
		});
		this.setState({
			items:items,
			isAdjusted:true,
			updateType:'adjust'
		});
		this.sendLegendData();
    }
	shouldComponentUpdate(nextProps,nextState){
        return !nextProps.isReady || nextState.updateType==='adjust'||nextState.updateType=='toggle';
    }
    componentWillReceiveProps(nextProps){
    	if(nextProps.updateType === 'newProps') {
    		var state = this.state;
        	this.setState(this.getRenderData(nextProps,state));
    	}
    }
    componentDidMount(){
    	this.adjustPosition();
    }
    componentDidUpdate(){
    	if(!this.state.isAdjusted) {
    		this.adjustPosition();
    	}
    }
}

module.exports = Legend;