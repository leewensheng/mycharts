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
		var chart = this.chart;
		var {data,color,colors} = series;
		if(chart.option.colors) {
			colors = chart.option.colors;
		}
		var arr_value = data.map(function(val){
			return val.value;
		})
		var sum = cad.sum(arr_value);
		var max_num = cad.max(arr_value);
		var min_num = cad.min(arr_value);
		var mean_num = cad.mean(arr_value);
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
	    var roseType = series.roseType;
	    data.reduce(function(startAngle,curData,index){
	    	var percent = curData.value/sum;
	    	var endAngle;
	        if(roseType !== "area") {
	       		endAngle = startAngle + percent*totalAngle;
	        } else {
	        	endAngle = startAngle + totalAngle/(data.length);
	        }
	        var obj = {
	        	startAngle:startAngle,
	        	endAngle:endAngle,
	        	selected:curData.selected
	        };
	        if(!colors && color) {
	        	//颜色差以和平均值差对比
	        	obj.color = cad.brighten(color,(curData.value - mean_num)/(max_num - min_num )*0.5);
	        } else {
	        	obj.color = colors[index%colors.length];
	        }
	        obj.radius = radius;
	        if(roseType === "radius" || roseType === "area") {
	        	obj.radius  = curData.value/max_num*radius;
	        } 
	        points.push(obj);
	        return endAngle;
	    },startAngle);

	    if(roseType === "radius" || roseType === "area")  {
	     	innerSize = 0;
	    }
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
			color:null,//主色
			colors:null,//系列色
			center:[0.5,0.5],//中心位置
			borderColor:"#fff",//描边颜色
			borderWidth:0,//描边
			data:[], //数据{name:'slcie1',value:1,color:'#fff',selected:true}
			dataLabels:{
				enabled:true,
				inside:false
			},
			roseType:false,//南丁格尔玫瑰'radius'：同时半径和角度按比例变化,'area'角度相同，半径不同
			selectMode:"single",//多选模式
			size:0.75,//外径
			minSize:80,//最小直径
			innerSize:0,//内径
			startAngle:0,//起始角度，以上向为0
			endAngle:null,//不写则始终角差360，指定则按指定的来
			sliceOffset:10,//选中时的偏移量
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
		this.componentDidMount();
		window.pie = this;
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
				radius:p.radius,
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
			p.slice.on("click",that.selectPoint.bind(that,index,false));
			p.slice.on("mouseover",that.handleHover.bind(that,index,true));
			p.slice.on("mouseout",that.handleHover.bind(that,index,false));
		})
	},
	handleHover(index,isHover){
		var point = this.state.points[index];
		var {cx,cy,innerRadius} = this.state;
		var sliceOffset = this.series.sliceOffset;
		var {startAngle,endAngle} = point;
		var color = point.color;
		var radius = point.radius;
		var hoverRadius = radius + 15;
		if(isHover) {
			var hoverColor = cad.brighten(color,0.12);
			point.slice.fill(hoverColor);
			if(!point.isAnimating) {
				point.slice.stopTransition();
			}
			point.slice.transition({
				from:radius,
				to:hoverRadius,
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
				from:hoverRadius,
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
	selectPoint(index,initialSelect){
		var {points,cx,cy,radius} = this.state;
		var point = points[index];
		var {sliceOffset,selectMode} = this.series;
		var {startAngle,endAngle} = point;
		var that = this;
		if(!point.selected||initialSelect) {
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
		var points = this.state.points;
		for(var i = 0; i < points.length;i++) {
			if(points[i].selected) {
				this.selectPoint(i,true);
			}
		}
	},
	componentWillUnmount(){

	},
	update(chart,series){
		
	},
	destroy(){

	}
}