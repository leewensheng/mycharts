import ComponentModel from '../../model/componentModel'
import $  from 'jquery'
export default class GridModel extends ComponentModel {
	constructor(chartModel){
		super();
		this.initOption();
	}
	type = 'grid';
	dependencies = {axis:true};
	defaultOption = {
        left:30,
        top:30,
        bottom:30,
        right:30,
        background:'transparent',
        containLabel:true
	};
	initOption() {
		var {defaultOption,chartModel} = this;
		var option= chartModel.getOption();
		var grid = option.grid;
		grid = this.normalLizeToArray(grid);
		grid = grid.map(function(gridOption){
			return $.extend(true,{},defaultOption,gridOption);
		})
		option.grid = grid;
	}
}