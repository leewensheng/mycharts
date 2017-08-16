import SeriesModel from '../../model/seriesModel'
import LineIcon from './icon'
class LineModel extends SeriesModel {
	constructor(seriesOpt){
		super(seriesOpt);
		this.initOption();
	}
	//依赖
	dependencies = {
	    grid:{
	        startOnTick:true,
	        stackAble:true
	    },
	    legend:{
	        icon:LineIcon
	    }
	};
	//默认配置
	defaultOption =  {
	    animation:true,
	    color:null,//主色
	    name:'',
	    xAxis:0,
	    yAxis:0,
	    lineWidth:2,
	    linecap:'round',
	    lineDash:'solid',
	    dataLabels:{
	    	enabled:true,
	        style:{
	            fontSize:12,
	            color:"#333",
	            textAlign:'center'
	        }
	    },
	    marker:{
	        enabled:true,
	        symbol:'circle',//rect,roundRect,triangle,diamond,pin arrow
	        size:4,
	        offset:[0,0],
	    },
	    showInLegend:true,
	    visible:true
	}
}
module.exports = LineModel;