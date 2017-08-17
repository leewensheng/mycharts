import ComponentModel from '../../model/componentModel'
import $  from 'jquery'
export default class LegendModel extends ComponentModel {
	constructor(chartModel){
		super();
		this.initOption();
	}
	type = 'tooltip';
	defaultOption = {
		enabled:true,
	};
	initOption() {
		var {chartModel,defaultOption} = this;
		var option = chartModel.getOption();
		var {tooltip} = option;
		tooltip = $.extend(true,{},defaultOption,option.legend);
		option.tooltip = tooltip;
	}
}