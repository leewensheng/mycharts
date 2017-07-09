import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import defaultOption from './option'
import Vcharts from '../../chart/charts'
import Text from '../../elements/text'
import Rect from '../../elements/rect'
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
		series.map(function(series,seriesIndex){
			var type = series.type;
			var Chart = Vcharts[type];
			if(!Chart) {
				return;
			}
			var dependencies = Chart.dependencies||{};
			var legend = dependencies.legend;
			if(!legend) {
				return;
			}
			if(series.showInLegend===false) {
				return;
			}
			if(!legend.multiple) {
				items.push({
					x:0,
					y:0,
					name:series.name|| ('series ' + seriesIndex),
					color:series.color || chartOption.colors[seriesIndex%chartOption.colors.length],
					icon:legend.icon,
					selected:true,
					multiple:false,
					seriesIndex:seriesIndex
				})
			} else {
				series.data.map(function(val,subIndex){
					items.push({
						x:0,
						y:0,
						name:series.name||('series ' + subIndex),
						color:series.color || chartOption.colors[subIndex%chartOption.colors.length],
						icon:legend.icon,
						selected:true,
						multiple:true,
						index:subIndex,
						seriesIndex:seriesIndex
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
					//todo 需要检测前后是否同一个系列
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
			hasInited:oldState?true:false,
			updateType:'newProps'
		}
	}
	render(){
		var that = this;
		var {props,state} = this;
		var {hasInited,isAdjusted,items,legendOption,legendX,legendY,legendWidth,legendHeight} = state;
		var {chartOption,chartWidth,chartHeight} = props;
		var {legend} = chartOption;
		var {
			enabled,animation,layout,align,verticlAlign,borderColor,
			borderWidth,borderRadius,background,formatter,
			margin,padding,itemWidth,itemHeight,itemGap,itemPadding,itemStyle,selectMode,inactiveColor,symbol
		} = legendOption;
		if(!enabled) return <g></g>;
		animation = animation&&hasInited;
		itemStyle.userSelect = 'none';
		return (
			<g className="vcharts-legend">
				{
					<Rect animation={animation} x={legendX} y={legendY} width={legendWidth} height={legendHeight} fill={background} stroke={borderColor} strokeWidth={borderWidth} rx={borderRadius} ry={borderRadius} />
				}
				{
					items.map(function(item,index){
						var Icon = item.icon;
						var {x,y,color,width,selected} = item;
						var symbolHeight = symbol.height||itemStyle.fontSize;
						var symbolY =  y + (itemHeight - symbolHeight)/2;
						var textX = x + symbol.width + symbol.padding;
						var textY = y + itemHeight/2;
						return (
							<g 	className="vcharts-legend-item" 
								key={index} 
								opacity={!hasInited&&!isAdjusted?0:1} 
								style={{cursor:'pointer'}}
								onClick={that.toggleItem.bind(that,index)}
								onMouseOver={that.handleMouseEvent.bind(that,index,true)}
								onMouseOut={that.handleMouseEvent.bind(that,index,false)}
								>
								<Rect animation={animation} fill="transparent" x={x} y={y} width={width} height={itemHeight} stroke="none"/>
								<Icon animation={animation} x={x} y={symbolY} width={symbol.width} height={symbolHeight} color={selected!==false?color:'gray'}/>
								<Text animation={animation} x={textX} y={textY} fill="red" style={itemStyle}>{item.name}</Text>
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
		item.selected = item.selected===false?true:false;
		this.setState({items});
		this.sendLegendData();
	}
	handleMouseEvent(index,isHover){
		var {props,state} = this;
		var {items} = state;
		var {chartEmitter} = props;
		var item = items[index];
		if(item.selected) {
			chartEmitter.emit("legend.hoverChange",{
				index:item.seriesIndex,
				eventType:isHover?'mouseover':'mouseout',
				data:item
			});
		}
	}
	sendLegendData(){
    	var {props,state} = this;
    	var {chartEmitter} = props;
    	var {items} = this.state;
    	var groupedItems = {};
 		var multipleItems = [];
    	items.map(function(item,index){
    		var {seriesIndex,selected,multiple,index} = item;
    		if(!multiple) {
    			groupedItems[seriesIndex] = {selected:selected};
    			multipleItems.push({
    				index:seriesIndex,
    				selected:selected
    			});
    		} else {
    			groupedItems[seriesIndex] = groupedItems[seriesIndex] || {};
    			groupedItems[seriesIndex][index] = selected;
    		}
    	})
    	for(let seriesIndex in groupedItems) {
    		chartEmitter.emit('legend',{
    			seriesIndex:seriesIndex,
    			data:groupedItems[seriesIndex]
    		})
    	}
    	chartEmitter.emit('legend.all',multipleItems);
    }
    alignItems(){
    	var {props,state} = this;
    	var {isAdjusted,items,legendOption} = state;
		var {chartOption,chartWidth,chartHeight} = props;
		var {legend} = chartOption;
		var {
			layout,align,verticlAlign,formatter,
			margin,padding,itemWidth,itemHeight,itemGap,itemStyle,symbol
		} = legendOption;
		var useItemWidth = typeof itemWidth === 'number' && itemWidth > 0;
    	var el = findDOMNode(this);
    	var blockWidth = 0,blockHeight = 0;
    	$(el).find(".vcharts-legend-item").each(function(index,dom){
			var textLen = $(dom).find('text').getComputedTextLength();
			var width = textLen + symbol.width + symbol.padding;
			items[index].width = useItemWidth ? itemWidth : width;
			items[index].plotWidth = width;
    	});
		var rows = [[]];
		var rowIndex = 0;
		var vFlag = 0,hFlag = 0;
		if(verticlAlign === 'bottom') {
			vFlag = -1;
		} else if(verticlAlign === 'top') {
			vFlag = 1;
		}
		if(align === 'right') {
			hFlag = -1;
		} else if(align === 'left') {
			hFlag = 1;
		}
		if(layout === 'horizontal') {
			items.reduce(function(prev,item,index){
				var width = item.width;
				var currentRow = rows[rowIndex];
				var totalWidth = prev + width + itemGap;
				if(totalWidth > (chartWidth - margin*2 - padding*2)) {
					if(currentRow.length === 0) {
						currentRow.push(item);
					} else {
						rows.push([item]);
						rowIndex++;
						return width;
					}
				} else {
					currentRow.push(item);
				}
				return totalWidth;
			},0);
		} else {
			rows = items.map(function(item){
				return [item];
			});
		}
		var rowsWidth = rows.map(function(row,rowIndex){
			var rowWidth = 0;
			row.map(function(item,index){
				rowWidth += item.width;
				if(index!=0) {
					rowWidth += itemGap;
				}
			});
			blockWidth = Math.max(rowWidth,blockWidth);
			blockHeight += itemHeight + (rowIndex!==0?itemGap:0);
			return rowWidth;
		});
		blockWidth += padding*2;
		blockHeight += padding*2;
		var legendX,legendY;
		if(align === 'left') {
			legendX = margin;
		} else if(align === 'right') {
			legendX = chartWidth - blockWidth - margin;
		} else {
			legendX = chartWidth/2 - blockWidth/2;
		}
		if(verticlAlign === 'top') {
			legendY = margin;
		} else if (verticlAlign === 'bottom') {
			 legendY = chartHeight - blockHeight - margin;
		} else {
			legendY = chartHeight/2 - blockHeight /2;
		}
		rows.map(function(row,rowIndex){
			var startX;
			if(align === 'left') {
				startX = 0;
			} else if(align === 'center') {
				startX = chartWidth/2 - rowsWidth[rowIndex]/2;
			} else if (align === 'right') {
				startX = chartWidth - rowsWidth[rowIndex];
			} else {
				startX = chartWidth/2 - rowsWidth[rowIndex]/2;
			}
			startX += (margin*hFlag);
			startX += padding*hFlag;
			row.reduce(function(prev,item,index){
				var x = prev,y;
				if(index !== 0) {
					x += itemGap;
				}
				item.x = x;
				item.y = rowIndex * (itemHeight + itemGap) + padding + vFlag * margin;
				return x + item.width;
			}, startX);
		});
		this.setState({
			items:items,
			isAdjusted:true,
			legendX:legendX,
			legendY:legendY,
			legendWidth:blockWidth ,
			legendHeight:blockHeight,
			updateType:'adjust'
		});
    }
    componentDidMount(){
    	this.alignItems();
    	//this.test();
    }
    test(){
    	var that = this;
    	setInterval(function(){
    		that.props.chartEmitter.emit('legend',{
    			seriesIndex:1,
    			data:[Math.random>0.3,Math.random()>0.4,Math.random()>0.25,true]
    		})
    	},300)
    }
    componentWillReceiveProps(nextProps){
		var state = this.state;
		var nextState = this.getRenderData(nextProps,state);
    	this.setState(nextState);
    }    
    componentDidUpdate(){
    	if(this.state.updateType !== 'adjust') {
    		this.alignItems();
    	}
    }
}

module.exports = Legend;