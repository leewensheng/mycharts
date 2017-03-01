import $ from 'jquery'
import default_option from './option/index'
import Pie from './chart/pie/index'
import cad from '../../src/index'

var charts = {
	pie:Pie
}
module.exports = Chart;
function Chart(el,option){
	return this.init(el,option);
}
Chart.prototype = {
	constructor:Chart,
	init:function(el,option) {
		this.container = el;
		this.initPaper(el,option);
	},
	initPaper(el,option){
		var width,height,paper;
		var wrapper = $("<div>").addClass("mychart-container").css("position","relative").css("overflow","hidden");
		width = option.width || $(el).width();
		height = option.height || $(el).height();
		wrapper.height(height);
		$(el).append(wrapper);
		paper = cad.init(wrapper.get(0),{width,height});
		this.__paper = paper;
		this.container = $(el);
		this.width = width;
		this.height = height;
	},
	getPaper(){
		return this.__paper;
	},
	render(){
		this.initOption();
		this.initChart();
	},
	initOption(){
		this.option = $.extend(default_option,this.option);
	},
	initChart(){
		var option = this.option;
		var paper = this.getPaper();
		var background = option.chart.background;
		paper.rect(0,0,"100%","100%").fill(background).stroke("none");
		this.initTitle();
		this.initLegend();
		this.initAxis();
		this.initSeires();
		this.componentDidMount();
	},
	initTitle(){

	},
	initLegend(){

	},
	initAxis(){

	},
	initSeires(){
		var paper = this.getPaper();
		var option = this.option;
		var series = option.series;
		var instance = [];
		var seriesGroup = paper.addLayer().addClass('mychart-series');
		var that = this;
		for(var i = 0; i <series.length;i++) {
			paper.switchLayer(seriesGroup);
			var type = series.type;
			var group =paper.g();
			instance.push(new Pie(that,seriesGroup,series[i]));
		}
		this.series = instance;
	},
	setOption(option){
		var oldOption = this.option;
		if(oldOption) {
			this.oldOption = cad.extend(true,{},oldOption);
			var newOption = cad.extend(true,oldOption,option);
			this.option = newOption;
			this.refresh();
		} else {
			this.option = option;
			this.render();
		}
	},
	refresh(){
		var {option,series,width,height} = this;
		var paper = this.getPaper();
		paper.width(width);
		paper.height(height);
		for(var i = 0 ; i < series.length; i ++) {
			var chart = series[i];
			var seriesData = option.series[i];
			chart.update(seriesData);
		}
	},
	resize(width,height){
		var that = this;
		var oldWidth = this.width;
		var oldHeight = this.height;
		this.width = width;
		this.height = height;
		this.refresh();
	},
	componentDidMount(){
		var that = this;
		window.addEventListener("resize",function(){
			var width = that.container.width();
			var height = that.container.get(0).clientHeight;
			that.resize(width,height);

		})
	},
	destroy(){

	}
}