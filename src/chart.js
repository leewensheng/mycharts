import $ from 'jquery'
import default_option from './option/index'
import Core from './chart/index'
import cad from '../../src/index'
import Paper from 'cad/paper'
import React from 'react'
import {render} from 'react-dom'
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
	},
	initPaper(el,option = {}){
		var width,height,paper;
		width = option.width || $(el).width();
		height = option.height || $(el).height();
		this.container = $(el).get(0);
		this.width = width;
		this.height = height;
	},
	render(){
		var option = $.extend(true,{},default_option,this.option);
		this.option = option;
		var container = this.container;
		var width = this.width;
		var height = this.height;
		var vchart = <Core chart={this} option={option} width={width} height={height} />;
		render(vchart,$(container)[0]);
		this.componentDidMount();
	},
	setOption(option){
		var oldOption = this.option;
		if(oldOption) {
			var newOption = $.extend(true,oldOption,option);
			this.option = newOption;
			this.debounceUpdate();
		} else {
			this.option = option;
			this.render();
		}
	},
	debounceUpdate(){
		var timer = this.__lastRefreshTimer;
		clearTimeout(timer);
		this.__lastRefreshTimer =  setTimeout((function(){
			this.refresh();
		}).bind(this),80);
	},
	refresh(){
		var option = this.option;
		var width = this.width;
		var height = this.height;
		var nextProps = {option,width,height};
		this.vchart.props = nextProps;
		this.vchart.setOption(nextProps);
	},
	resize(width,height){
		var that = this;
		var oldWidth = this.width;
		var oldHeight = this.height;
		this.width = width;
		this.height = height;
		this.debounceUpdate();
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
