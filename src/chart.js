import $ from 'jquery'
import default_option from './option/index'
import Pie from './chart/pie/index'
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
		var wrapper = $("<div>").addClass("mychart-container").css("position","relative");
		width = option.width || $(el).width();
		height = option.height || $(el).height();
		wrapper.width(width).height(height);
		$(el).append(wrapper);
		paper = cad.init(wrapper.get(0),{width,height});
		this.__paper = paper;
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
		paper.temporarySwitchLayer(seriesGroup,function(){
			for(var i = 0; i <series.length;i++) {
				var type = series.type;
				var group =paper.g();
				instance.push(new Pie(that,group,series[i]));
			}
		});
		this.series = instance;
	},
	setOption(option){
		if(this.option) {
			this.option = $.extend(this.option,option);
			this.refresh();
		} else {
			this.option = option;
			this.render();
		}
	},
	refresh(){

	},
	destroy(){

	}
}