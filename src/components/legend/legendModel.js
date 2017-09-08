import ComponentModel from '../../model/componentModel'
import $  from 'jquery'
export default class LegendModel extends ComponentModel {
	constructor(chartModel){
		super(chartModel);
		this.initOption();
	}
	type = 'legend';
	defaultOption = {
		enabled:true,
		animation:true,
		layout:'horizontal',
		align:'center',
		verticlAlign:'top',
		borderColor:'transparent',//图例区域边框
		borderWidth:1,//
		borderRadius:0,
		background:'transparent',//图例背景色
		formatter:null,
		margin:12,
		padding:8,
		selectMode:'multiple',
		inactiveColor:'#ccc',

		itemWidth:'auto',
		itemHeight:16,
		itemGap:10,
		itemStyle:{
			fontSize:12,
			textBaseLine:'middle'
		},
		symbol:{
			width:20,
			padding:5,
			height:null,//默认和fontSize一致
			radius:5
		}
	};
	getLegendData(prevLegendData){
		var {chartModel} = this;
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
		if(prevLegendData) {
		    items.map(function(item,index){
		        var oldItem = prevLegendData.items[index];
		        if(oldItem) {
		            item.x = oldItem.x;
		            item.y = oldItem.y;
		            item.width = oldItem.width;
		        } else {
		        	item.isAdd = true;
		        }
		    })
		}
		return {
		    isAdjusted:false,
		    items:items,
		    hasInited:prevLegendData?true:false,
		    updateType:'newProps'
		}
	}
}