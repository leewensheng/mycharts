import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Vcharts from '../../chart/charts'
import Text from '../../elements/text'
import Rect from '../../elements/rect'
import mathUtils from 'cad/math'
export default class Legend extends Component {
	constructor(props){
		super(props);
		this.state = this.getRenderData(props);
	}
	getRenderData(props,oldState){ 
		var {chartModel} = props;
		var chartOption = chartModel.getOption();
		var {legend} = chartOption;
		var items = [];
		chartModel.eachSeriesByDependency('legend',function(seriesModel){
			var {visible,icon,seriesColor,seriesIndex,seriesName,multipleLegend} = seriesModel;
			if(!seriesModel.getOption().showInLegend) {
				return;
			}
			if(!multipleLegend) {
				items.push({
					x:0,
					y:0,
					name:seriesName,
					color:seriesColor,
					icon:icon,
					visible:visible,
					multiple:false,
					seriesIndex:seriesIndex
				})
			} else {
				seriesModel.mapData(function(point,dataIndex){
					items.push({
						x:0,
						y:0,
						name:point.name,
						color:point.color,
						icon:icon,
						visible:point.visible,
						multiple:true,
						seriesIndex:seriesIndex,
						dataIndex:dataIndex
					})
				})
			}
			
		})
		if(oldState) {
			items.map(function(item,index){
				var oldItem = oldState.items[index];
				if(oldItem) {
					item.x = oldItem.x;
					item.y = oldItem.y;
					item.width = oldItem.width;
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
		var {chartModel} = props;
		var {hasInited,isAdjusted,items,legendOption,legendX,legendY,legendWidth,legendHeight} = state;
		var chartOption = chartModel.getOption();
		var {legend} = chartOption;
		var {
			enabled,animation,layout,align,verticlAlign,borderColor,
			borderWidth,borderRadius,background,formatter,
			margin,padding,itemWidth,itemHeight,itemGap,itemPadding,itemStyle,selectMode,inactiveColor,symbol
		} = legend;
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
						var {x,y,color,width,visible} = item;
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
								<Icon animation={animation} x={x} y={symbolY} width={symbol.width} height={symbolHeight} color={visible!==false?color:'gray'}/>
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
		var {chartEmitter} = props;
		var item = state.items[index];
		var {seriesIndex,dataIndex} = item;
		chartEmitter.emit('legendVisibileToggle',{
			seriesIndex,dataIndex
		});
	}
	handleMouseEvent(index,isHover){

	}
    alignItems(){
    	var {props,state} = this;
    	var {isAdjusted,items,legendOption} = state;
		var {chartModel} = props;
		var chartOption = chartModel.getOption();
		var chartWidth = chartModel.getWidth();
		var chartHeight = chartModel.getHeight();
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