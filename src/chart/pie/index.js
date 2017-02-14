import $ from 'jquery'
function Pie(chart,group,seires) {
	this.chart = chart;
	this.group = group;
	var default_series = this.getDefaultSeries(seires);
	this.seires  = $.extend(true,default_props,seires);
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
		return {
			
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
			size::"75%",
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
		var paper = this.props.chart.getPaper();
		var seires = this.props.seires;
		paper.temporarySwitchLayer(this.props.group,function(){
			
		});
		return this;
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