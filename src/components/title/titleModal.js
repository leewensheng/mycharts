import ComponentModel from '../../model/componentModel'
import $  from 'jquery'
export default class LegendModel extends ComponentModel {
	constructor(chartModel){
		super(chartModel);
		this.initOption();
	}
	type = 'title';
	defaultOption = {
		align:'center',
		verticalAlign:'middle',
		margin:15,
		text:'',
		style:{
			color:'#333',
			fontSize:18,
			fontWeight:'bold'
		},
		subTitle:{
			text:'',
			style:{
				color:'#666'
			}
		}
	};
}