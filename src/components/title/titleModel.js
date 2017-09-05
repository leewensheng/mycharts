import ComponentModel from '../../model/componentModel'
import $  from 'jquery'
export default class TitleModel extends ComponentModel {
	constructor(chartModel){
		super(chartModel);
		this.initOption();
	}
	type = 'title';
	defaultOption = {
		align:'center',
		verticalAlign:'top',
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
				color:'#666',
				fontSize:13,
				textBaseLine:'top'
			}
		}
	};
}