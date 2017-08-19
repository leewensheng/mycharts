import BaseModel from './baseModel'
import $ from 'jquery'
export default class ComponentModel extends BaseModel {
	constructor(chartModel){
		super();
		this.chartModel = chartModel;
	}
	type = null;
	zIndex = 1;
	dependencies= [];
	useHTML = false;
	defaultOption = null;
	initOption(){
		var option = this.chartModel.getOption();
		var type = this.type;
		var defaultOption = this.defaultOption;
		var componentOpt = $.extend(true,{},defaultOption,option[type]);
		option[type] = componentOpt;
	}
	getOption(){
		var option = this.chartModel.getOption();
		var type = this.type;
		return option[type];
	}
}