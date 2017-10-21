import $ from 'jquery'
import 'cad/dom'
import Core from './chart/core'
import Paper from 'cad/paper/index'
import React from 'react'
import {render} from 'react-dom'
import _ from 'lodash'
function Chart(el,option){
	this.container = null;
	this.width = null;
	this.height = null;
	this.option = null;
	this.__paper = null;
	this.vchart = null;
	return this.init(el,option);
}
Chart.prototype = {
	constructor:Chart,
	init:function(el,option) {
		this.container = el;
		this.initPaper(el,option);
		this.refresh  = _.throttle(this.refresh,200);
	},
	initPaper(el,option = {}){
		var width,height,paper;
		width = option.width || $(el).width();
		height = option.height || $(el).height();
		if(option.width) {
			$(el).width(width);
		}
		if(option.height) {
			$(el).height(height);
		}
		this.container = $(el).get(0);
		this.width = width;
		this.height = height;
	},
	render(){
		var {option,container,width,height} = this;
		var vchart = <Core chart={this} option={option} width={width} height={height} />;
		render(vchart,$(container)[0]);
		this.componentDidMount();
	},
	setOption(option){
		var oldOption = this.option;
		if(oldOption) {
			var newOption = $.extend(true,oldOption,option);
			this.option = newOption;
			this.updateType = 'newProps';
		} else {
			this.option = option;
			this.render();
		}
	},
	refresh(){
		var option = this.option;
		var width = this.width;
		var height = this.height;
		var updateType = this.updateType;
		var nextProps = {option,width,height,updateType};
		if(updateType === 'resize') {
			this.vchart.resize(width,height);
		} else {
			this.vchart.setOption(nextProps);
		}
	},
	resize(width,height){
		this.width = width;
		this.height = height;
		this.updateType = 'resize';
		this.refresh();
	},
	downloadImage(name){
		this.$$paper.downloadImage(name);
	},
	componentDidMount(){
		var that = this;
		var svg = $(this.container).find("svg");
		var paper = new Paper();
		paper.svg = svg;
		window.chart = this;
		this.$$paper = paper;
		window.addEventListener("resize",function(){
			var width = $(that.container).width();
			var height = that.container.clientHeight;
			that.resize(width,height);
		})
	},
	destroy(){

	}
}
module.exports = Chart;
