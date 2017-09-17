import ComponentModel from '../../model/componentModel'


export default class DataZoomModel extends ComponentModel {
	constructor(chartModel){
		super(chartModel);
		this.initOption();
	}
	type = 'dataZoom';
	dependencies=['grid'];
	defaultOption = 
		{
			type:'slider',
			xAxis:0,
			margin:20
		}
	
}