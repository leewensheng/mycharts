import SeriesModel from '../../model/seriesModel'
import BarIcon from './icon'
class BarModel extends SeriesModel {
	constructor(chartModel,seriesOpt){
		super(chartModel,seriesOpt);
		this.initOption();
	}
	//依赖
	dependencies = {
	    grid:{
	        startOnTick:false,
	        stackAble:true
	    },
	    legend:{
	        icon:BarIcon
	    }
	};
	//默认配置
	defaultOption =  {

	}

}
module.exports = LineModel;