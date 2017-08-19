import SeriesModel from '../../model/seriesModel'
import LineIcon from './lineIcon'
export default class LineModel extends SeriesModel {
	constructor(chartModel,seriesOpt){
		super(chartModel,seriesOpt);
		this.initOption();
	}
	//依赖
	dependencies = ['grid','legend'];
	//默认配置
	icon  = LineIcon;
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
