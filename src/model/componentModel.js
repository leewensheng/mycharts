import BaseModel from './baseModel'
export default class ComponentModel extends BaseModel {
	constructor(chartModel){
		super();
		this.chartModel = chartModel;
	}
	zIndex = 1;
	dependencies= {};
	useHTML = false;
	defaultOption = null;
	initOption(){
	}
}