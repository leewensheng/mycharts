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
		var colors = series.colors ||chart.option.colors;
		var sum = cad.sum(data);
	    var cx = series.center[0]*chart.width;
	    var cy = series.center[1]*chart.height;
	    var innerSize = series.innerSize;
	    var size = series.size;
	    var radius = Math.min(chart.width,chart.height)*size/2;
	    radius = Math.max(radius,series.minSize);
	    var startAngle = series.startAngle - 90;
	    var points = [];
	    var endAngle = series.endAngle?(series.endAngle - 90):(startAngle+360);
	    var totalAngle = endAngle - startAngle;
	    data.reduce(function(start,end,index){
	        var startAngle = start;
	        var endAngle = startAngle + end/sum*(totalAngle);
	        points.push({
	        	startAngle:startAngle,
	        	endAngle:endAngle,
	        	selected:false,
	        	color:colors[index%colors.length]//此处应考虑点级的颜色
	        })
	        return endAngle;
	    },startAngle);
	    return {
	    	points:points,
	    	cx:cx,
	    	cy:cy,
	    	radius:radius,
	    	startAngle:startAngle,
	    	endAngle:endAngle,
	    	innerRadius:radius*innerSize
	    }
	},
	getDefaultSeries(){
		return {
			center:[0.5,0.5],
			borderColor:"#fff",
			borderWidth:0,
			data:[],
			dataLabels:{
				enabled:true,
				inside:false
			},
			selectMode:"single",
			size:0.75,
			minSize:80,
			innerSize:0,
			startAngle:0,
			endAngle:null,
			sliceOffset:10,
			states:{
				hover:{
				}
			}
		}
	},
	render(){
		var points = this.state.points;
		var paper = this.chart.getPaper();
		paper.switchLayer(this.group);
		var slice = paper.g();
		paper.switchLayer(slice);
		points.map(function(p){
			if(!p.slice) {
				p.slice = paper.path();
			} 
		});
		this.initDataLabel();
		this.animate();
		this.refreshAttr();
		this.attachEvent();
		return this;
	},
	initDataLabel(){
		var paper = this.chart.getPaper();
		var points = this.state.points;
		var group = this.group;
		paper.switchLayer(group)
		var labelLayer = paper.g();
		paper.switchLayer(labelLayer);
		points.map(function(p){
			if(!p.dataLabel) {
				p.dataLabel = {
					text:paper.text()
				}
			}
		});
	},
	refreshAttr(){
		var points = this.state.points;
		var chart = this.chart;
		var series = this.series;
		var paper = chart.getPaper();
		var {width,height} = chart;
		var {center,size,dataLabels,borderColor,borderWidth} = series;
		var cx = width*center[0];
		var cy = height*center[1];
		var {radius,innerRadius} =this.state;
		points.map(function(p,index){
			var {startAngle,endAngle,slice} = p;
			var path = cad.getShapePath("sector",cx,cy,{
				startAngle:p.startAngle,
				endAngle:p.endAngle,
				radius:radius,
				innerRadius:innerRadius
			});
			slice.attr("d",path)
				 .fill(p.color)
				 .stroke(borderColor,borderWidth);
			var textPoint;
			var dataLabel = p.dataLabel;
			if(!series.dataLabels.enabled) return;
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
		var {cx,cy,radius,innerRadius} = this.state;
		var sliceOffset = this.series.sliceOffset;
		var {startAngle,endAngle} = point;
		var color = point.color;
		if(isHover) {
			var hoverColor = cad.brighten(color,0.15);
			point.slice.fill(hoverColor);
			if(!point.isAnimating) {
				point.slice.stopTransition();
			}
			point.slice.transition({
				from:radius,
				to:radius+20,
				during:400,
				ease:'elasticOut',
				onUpdate(val){
					var path = cad.getShapePath("sector",cx,cy,{startAngle:startAngle,endAngle:endAngle,radius:val,innerRadius:innerRadius})
					$(this).attr("d",path);
				}
			})
		} else {
			point.slice.fill(color);
			if(!point.isAnimating) {
				point.slice.stopTransition();
			}
			point.slice.transition({
				from:radius+20,
				to:radius,
				during:400,
				ease:'elasticOut',
				onUpdate(val){
					var path = cad.getShapePath("sector",cx,cy,{startAngle:startAngle,endAngle:endAngle,radius:val,innerRadius:innerRadius})
					$(this).attr("d",path);
				}
			})
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
		var {sliceOffset,selectMode} = this.series;
		var {startAngle,endAngle} = point;
		var that = this;
		if(!point.selected) {
			var offset = cad.Point(0,0).angleMoveTo((startAngle+endAngle)/2,sliceOffset);
			point.isAnimating = true;
			point.slice.stopTransition(true)
					    .transition({transform:"translate("+ offset.x+","+ offset.y +")"},200,null,function(){
					    	point.isAnimating = false;
					    });
			point.selected = true;
			//退回其他
			points.map(function(p,key){
				if(key!==index&&selectMode==='single') {
					that.unselectPoint(p);
				}
			})		
		} else {
			this.unselectPoint(point);
		}

	},
	unselectPoint(point){
		if(point.selected) {
			point.isAnimating = true;
			point.slice.stopTransition(true).transition({transform:"translate(0,0)"},200,null,function(){
				point.isAnimating = false;
			});
		} else {
			point.slice.translate(0,0);
		}
		point.selected = false;
	},
	alignDataLabels(){

	},
	animate(){
		var chart = this.chart;
		var {cx,cy,radius,startAngle,endAngle} = this.state;
		radius = Math.min(chart.width,chart.height);
		var paper = this.chart.getPaper();
		var group = this.group;
		var clip = paper.clipPath(function(){
			paper.addShape("sector",cx,cy,{
											radius:radius,
											startAngle:startAngle,
											endAngle:startAngle + 1e-6
										});
		});
		clip.attr("id","clip");
		group.attr("clip-path","url(#clip)");
		var path = clip.find("path");
		path.transition({
			from:startAngle,
			to:endAngle,
			ease:'easeIn',
			during:600,
			callback(){
				clip.remove();
				group.removeAttr("clip-path");
			},
			onUpdate:function(val){
				path.attr("d",cad.getShapePath("sector",cx,cy,{
					startAngle:startAngle,
					endAngle:val,
					radius:radius
				}));
			}
		})
	},
	componentDidMount(){

	},
	componentWillUnmount(){

	},
	update(chart,series){
		
	},
	destroy(){

	}
}