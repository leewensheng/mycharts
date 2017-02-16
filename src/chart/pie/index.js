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
		var colors = ['#00A1A1',"#28FFBB","#DB1774","#F20000","blue"];
	    var cx = series.center[0]*chart.width;
	    var cy = series.center[1]*chart.height;
	    var innerSize = series.innerSize;
	    var size = series.size;
	    var radius = Math.min(chart.width,chart.height)*size/2;
	    var startAngle = series.startAngle - 90;
	    var points = [];
	    var totalAngle = series.endAngle - series.startAngle;
	    data.reduce(function(start,end,index){
	        var startAngle = start;
	        var endAngle = startAngle + end/sum*(totalAngle);
	        points.push({
	        	startAngle:startAngle,
	        	endAngle:endAngle,
	        	selected:false,
	        	color:colors[index]
	        })
	        return endAngle;
	    },startAngle);
	    return {
	    	points:points,
	    	cx:cx,
	    	cy:cy,
	    	radius:radius,
	    	innerRadius:radius*innerSize
	    }
	},
	getDefaultSeries(){
		return {
			center:[0.5,0.5],
			borderColor:"#fff",
			borderWidth:1,
			data:[],
			dataLabels:{
				enable:true,
				inside:false
			},
			size:0.75,
			innerSize:0,
			startAngle:0,
			endAngle:360,
			sliceOffset:10,
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
		//slice layer
		var slice = paper.g();
		var label = paper.g(); 
		paper.switchLayer(slice);
		points.map(function(p){
			p.slice = paper.path();
		});
		paper.switchLayer(label);
		points.map(function(p){
			p.dataLabel = {
				path:paper.path(),
				text:paper.text()
			}
		});
		this.refreshAttr();
		this.animate();
		this.attachEvent();
		return this;
	},
	refreshAttr(){
		var points = this.state.points;
		var chart = this.chart;
		var paper = chart.getPaper();
		var {width,height} = chart;
		var {center,size,dataLabels} = this.series;
		var cx = width*center[0];
		var cy = height*center[1];
		var {radius,innerRadius} =this.state;
		points.map(function(p,index){
			var {startAngle,endAngle} = p;
			var path = cad.getShapePath("sector",cx,cy,{
				startAngle:p.startAngle,
				endAngle:p.endAngle,
				radius:radius,
				innerRadius:innerRadius
			});
			var slice = p.slice;
			slice.attr("d",path).fill(p.color);
			var textPoint;
			var dataLabel = p.dataLabel;
			if(dataLabels.inside) {
				textPoint = {x:cx,y:cy};
				p.dataLabel.text.hide();
			} else {
				textPoint = cad.Point(cx,cy).angleMoveTo((startAngle+endAngle)/2,radius*1.3);
			}
			p.dataLabel.text.text(index)
					 .attr("x",textPoint.x)
					 .attr("y",textPoint.y)
					 .attr("text-anchor","middle");
		})
	},
	attachEvent(){
		var that = this;
		this.state.points.map(function(p,index){
			p.slice.on("click",that.selectPoint.bind(that,index));
			p.slice.on("mouseover",that.handleHover.bind(that,index,true));
			p.slice.on("mouseout",that.handleHover.bind(that,index,false));
		})
	},
	handleHover(index,isHover){
		var point = this.state.points[index];
		var color = point.color;
		if(isHover) {
			var hoverColor = cad.brighten(color,0.2);
			point.slice.fill(hoverColor);
		} else {
			point.slice.fill(color);
		}
		if(this.series.dataLabels.inside) {
			if(isHover) {
				point.dataLabel.text.show();
			} else {
				point.dataLabel.text.hide();
			}
		} 
	},
	selectPoint(index){
		var {points,cx,cy,radius} = this.state;
		var point = points[index];
		var {sliceOffset} = this.series;
		var {startAngle,endAngle} = point;
		if(!point.selected) {
			var offset = cad.Point(0,0).angleMoveTo((startAngle+endAngle)/2,sliceOffset);
			point.slice.translate(offset.x,offset.y);
			point.selected = true;
			points.map(function(p,key){
				if(key!==index) {
					p.slice.translate(0,0);
					p.selected = false;
				}
			})		
		} else {
			point.selected = false;
			point.slice.translate(0,0);
		}

	},
	alignDataLabels(){

	},
	animate(){
		var chart = this.chart;
		var {cx,cy,radius} = this.state;
		var {startAngle,endAngle} = this.series;
		radius = Math.min(chart.width,chart.height);
		var paper = this.chart.getPaper();
		startAngle -= 90;
		endAngle -= 90;
		var group = this.group;
		var clip = paper.clipPath(function(){
			paper.sector(cx,cy,radius,startAngle,startAngle);
		});
		clip.attr("id","clip");
		group.attr("clip-path","url(#clip)");
		var path = clip.find("path");
		path.transition({
			from:startAngle,
			to:endAngle,
			ease:'easeOut',
			during:1000,
			onUpdate:function(val){
				path.attr("d",cad.getShapePath("sector",cx,cy,{
					startAngle:startAngle,
					endAngle:val,
					radius:radius
				}));
			},
			callback:function(){
			}
		})
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