import $ from 'jquery'
module.exports = Pie;
function Pie(chart,group,series) {
	this.chart = chart;
	this.group = group;
	var default_series = this.getDefaultSeries(series);
	this.series  = $.extend(default_series,series);
	this.state = this.getInitialState();
	return this.render();
};
Pie.type = 'pie';
Pie.dependence = [];
Pie.legendSymbol = function(){

}
Pie.prototype = {
	constructor:Pie,
	getInitialState(){
		var series = this.series;
		var data = this.series.data;
		var chart = this.chart;
		var sum = cad.sum(data);
		var colors = ['#00A1A1',"#28FFBB","#DB1774","#F20000"];
	    var cx = series.center[0]*chart.width;
	    var cy = series.center[1]*chart.height;
	    var radius = Math.min(chart.width,chart.height)*0.5;
	    var startAngle = -90;
	    var points = [];
	    data.reduce(function(start,end,index){
	        var startAngle = start;
	        var endAngle = startAngle + end/sum*360;
	        points.push({
	        	startAngle:startAngle,
	        	endAngle:endAngle,
	        	selected:false,
	        	color:colors[index]
	        })
	        return endAngle;
	    },startAngle);
	    return {
	    	points:points
	    }
	},
	getDefaultSeries(){
		return {
			center:[0.5,0.5],
			borderColor:"#fff",
			borderWidth:1,
			data:[],
			dataLabels:{

			},
			size:"75%",
			startAngle:0,
			endAngle:null,
			states:{
				hover:{
					enable:true
				}
			}
		}
	},
	render(){
		var points = this.state.points;
		var paper = this.chart.getPaper();
		paper.switchLayer(this.group);
		points.map(function(p){
			p.el = paper.path();
		});
		this.refreshAttr();
		return this;
	},
	refreshAttr(){
		var points = this.state.points;
		var chart = this.chart;
		var paper = chart.getPaper();
		var {width,height} = chart;
		var {center,size} = this.series;
		var cx = width*center[0];
		var cy = height*center[1];
		var radius = Math.min(width,height)*0.335;//*size
		points.map(function(p){
			var path = cad.getShapePath("sector",cx,cy,{
				startAngle:p.startAngle,
				endAngle:p.endAngle,
				radius:radius,
				innerRadius:0
			});
			var el = p.el;
			el.attr("d",path).fill(p.color);
		})
	},
	alignDataLabels(){

	},
	animate(){

	},
	componentDidMount(){

	},
	componentWillUnmount(){

	},
	update(){

	},
	destroy(){

	}
}