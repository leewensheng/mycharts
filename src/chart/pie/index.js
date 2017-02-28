import $ from 'jquery'
module.exports = Pie;
function Pie(chart,seriesGroup,series) {
	this.chart = chart;
	this.seriesGroup = seriesGroup;
	var default_series = this.getDefaultSeries(series);
	this.series  = $.extend(default_series,series);
	this.state = this.getInitialState();
	var virtualDOM = this.render();
	var group = $(virtualDOM.render());
	this.virtualDOM = virtualDOM;
	seriesGroup.append(group);
	this.group = group;
	this.componentDidMount();
	return this;
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
	        //point state
	        var obj = {
	        	startAngle:startAngle,
	        	endAngle:endAngle,
	        	midAngle:(startAngle + endAngle)/2,
	        	selected:curData.selected,
	        	label:data[index].name
	        };
	        if(!colors && color) {
	        	//颜色差以和平均值差对比
	        	if(max_num - min_num > 0) {
	        		obj.color = cad.brighten(color,(curData.value - mean_num)/(max_num - min_num )*0.5);
	        	} else {
	        		obj.color = color;
	        	}
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
		var that = this;
		var {chart,seriesGroup,series} = this;
		var paper  = chart.getPaper();
		var points = this.state.points;
		var {width,height} = chart;
		var {center,size,dataLabels,borderColor,borderWidth} = series;
		var {cx,cy,radius,innerRadius} = this.state;
		var virtualDOM = paper.createVirtualDOM("g");
		paper.switchLayer(virtualDOM);
		var slice = paper.g({className:"points-group"});
		paper.switchLayer(slice);
		points.map(function(point,index){
			paper.addShape("sector",cx,cy,{
				startAngle:point.startAngle,
				endAngle:point.endAngle,
				radius:point.radius,
				innerRadius:innerRadius
			}).attr("fill",point.color)
			  .attr("stroke",borderColor)
			  .attr("stroke-width",borderWidth)
			  .on("click",function(){
			  	that.selectPoint(index);
			  })
			  .on("mouseover",function(){
			  	that.handleHover(index,true);
			  })
			  .on("mouseout",function(){
			  	that.handleHover(index,false);
			  })
		});
		paper.switchLayer(virtualDOM);
		var labelLayer = paper.g();
		paper.switchLayer(labelLayer);
		points.map(function(p,index){
			var textPoint;
			var hide  = false;
			var midAngle  = p.midAngle;
			if(dataLabels.inside) {
				textPoint = {x:cx,y:cy};
				hide = true;
			} else {
				textPoint = cad.Point(cx,cy).angleMoveTo(midAngle,radius*1.1);
			}
			var label = paper.text(textPoint.x,textPoint.y,p.label);
				 label
				 .css("display",hide?"none":"")
				 .attr("fill","red")
				 .attr("text-anchor",(midAngle >= -90 && midAngle <= 90) ? "start" : "end")
				 .attr("dy",10)
		});
		
		return virtualDOM;
	},
	handleHover(index,isHover){
		var point = this.state.points[index];
		var {cx,cy,innerRadius} = this.state;
		var sliceOffset = this.series.sliceOffset;
		var {startAngle,endAngle} = point;
		var color = point.color;
		var radius = point.radius;
		var hoverRadius = radius + 15;
		var $slices = this.group.find(".points-group path");
		var $slice = $slices.eq(index);
		if(isHover) {
			var hoverColor = cad.brighten(color,0.1);
			 $slice.fill(hoverColor);
			if(!point.isAnimating) {
				 $slice.stopTransition();
			}
			$slice.transition({
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
			 $slice.fill(color);
			if(!point.isAnimating) {
				 $slice.stopTransition();
			}
			 $slice.transition({
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
		return;
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
		var $slices = this.group.find(".points-group path");
		var $slice = $slices.eq(index);
		if(!point.selected) {
			var offset = cad.Point(0,0).angleMoveTo(point.midAngle,sliceOffset);
			if(sliceOffset > 0) {
				point.isAnimating = true;
				$slices.eq(index).stopTransition(true)
						    .transition({transform:"translate("+ offset.x+","+ offset.y +")"},200,null,function(){
						    	point.isAnimating = false;
						    });
				point.selected = true;
			}
			//退回其他
			points.map(function(p,key){
				if(key!==index&&selectMode==='single') {
					that.unselectPoint($slices.eq(key),p);
				}
			})		
		} else {
			this.unselectPoint($slice,point);
		}

	},
	unselectPoint($slice,point){
		if(point.selected) {
			point.isAnimating = true;
			$slice.stopTransition(true).transition({transform:"translate(0,0)"},200,null,function(){
				point.isAnimating = false;
			});
		} else {
			$slice.translate(0,0);
		}
		point.selected = false;
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
		this.animate();
		window.pie = this;
		var points = this.state.points;
		for(var i = 0; i < points.length;i++) {
			if(points[i].selected) {
				this.selectPoint(i);
			}
		}
	},
	componentWillUnmount(){

	},
	update(series){
		this.series = series;
		this.state = this.getInitialState();
		var virtualDOM = this.render();
		this.virtualDOM = virtualDOM;
		this.group.remove();
		var group = $(virtualDOM.render());
		this.seriesGroup.append(group);
	},
	destroy(){

	}
}