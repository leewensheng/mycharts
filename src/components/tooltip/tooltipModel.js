import ComponentModel from '../../model/componentModel'
export default class TooltipModel extends ComponentModel {
	constructor(chartModel){
		super(chartModel);
		this.initOption();
	}
	useHTML = true;
	type = 'tooltip';
	defaultOption = {
		enabled:true,
	};
}