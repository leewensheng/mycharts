import ComponentModel from '../../model/componentModel'
import $  from 'jquery'
export default class LegendModel extends ComponentModel {
	constructor(chartModel){
		super(chartModel);
		this.initOption();
	}
	type = 'tooltip';
	defaultOption = {
		enabled:true,
	};
}