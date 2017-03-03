import $ from 'jquery'
import React from '../../../../src/virtual-dom/react.js'
module.exports = React.createClass({
	getDefaultProps(){
		return {
			series: {
				color:null,//主色
				colors:null,//系列色
				center:[0.5,0.5],//中心位置
				borderColor:"#fff",//描边颜色
				borderWidth:0,//描边
				data:[], //数据{name:'slcie1',value:1,color:'#fff',selected:true}
				dataLabels:{
					enabled:true,
					show:false,
					inside:false,
					distance:30
				},
				roseType:false,//南丁格尔玫瑰'radius'：同时半径和角度按比例变化,'area'角度相同，半径不同
				selectMode:"single",//多选模式
				size:0.75,//外径
				minSize:40,//最小半径
				innerSize:0,//内径
				startAngle:0,//起始角度，以上向为0
				endAngle:null,//不写则始终角差360，指定则按指定的来
				sliceOffset:10,//选中时的偏移量
				states:{
					hover:{
					}
				}
			}
		}
	},
	getInitialState(nextProps){
		var {series,chart} = nextProps || this.props;
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
	    	var percent = curData.value/sum
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
	        	label:data[index].name,
	        	x:index,
	        	y:curData.value,
	        	percent:percent.toFixed(2)
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
	render(){
		var that = this;
		var {chart,series} = this.props;
		var paper  = chart.getPaper();
		var points = this.state.points;
		var {width,height} = chart;
		var {center,size,dataLabels,borderColor,borderWidth,sliceOffset} = series;
		var {cx,cy,radius,innerRadius} = this.state;
		var virtualDOM = React.createElement("g");
		paper.switchLayer(virtualDOM);
		var pointLayer = paper.g({className:"points-group"});
		paper.switchLayer(pointLayer);
		points.map(function(point,index){
			var slice =
			paper.addShape("sector",cx,cy,{
				startAngle:point.startAngle,
				endAngle:point.endAngle,
				radius:point.radius,
				innerRadius:innerRadius
			});
			slice.attr("transform","translate(0,0)");
			slice.attr("fill",point.color)
			  .attr("stroke",borderColor)
			  .attr("stroke-width",borderWidth)
			  .on("click",function(){
			  	that.selectPoint(index);
			  })
			  .on("mouseover",that.handleHover.bind(that,index,true))
			  .on("mouseout",that.handleHover.bind(that,index,false))
		});
		paper.switchLayer(virtualDOM);
		var labelLayer = paper.g({className:"label-layer"}).css("font-family","Microsoft Yahei, sans-serif")
		paper.switchLayer(labelLayer);
		points.map(function(p,index){
			var textPoint;
			var hide  = false;
			var midAngle  = p.midAngle;
			if(dataLabels.inside) {
				textPoint = {x:cx,y:cy};
				hide = true;
			} else {
				textPoint = cad.Point(cx,cy).angleMoveTo(midAngle,radius + dataLabels.distance);
			}
			var textOption = {
				fontSize:13,
				textBaseLine:"middle"
			};
			if(dataLabels.inside || dataLabels.distance < 0 ) {
				textOption.textAlign = "center";
			} else {
				textOption.textAlign = (midAngle>-90&&midAngle<90)?"left":"right";
			}
			var 
			label = paper.text(textPoint.x,textPoint.y,p.label,textOption);
			label
			.css("display",hide?"none":"")
			.attr("fill","#fff");
			if(dataLabels.distance < 0) {
				label.css("pointer-events","none");
			}
		});
		return virtualDOM;
	},
	handleHover(index,isHover){
		var points = this.state.points;
		var point = points[index];
		var {cx,cy,innerRadius} = this.state;
		var sliceOffset = this.props.series.sliceOffset;
		var {startAngle,endAngle} = point;
		var color = point.color;
		var radius = point.radius;
		var hoverRadius = radius + 15;
		var $slices = $(this.findDOMNode()).find(".points-group path");
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
		if(this.props.series.dataLabels.inside) {
			var $labels = $(this.findDOMNode()).find(".label-layer text");
				$labels.hide();
			if(isHover) {
				$labels.eq(index).show();
			} else {
				points.map(function(p,key){
					if(p.selected) {
						$labels.eq(key).show();
					}
				})
			}
		} 
	},
	selectPoint(index){
		var {points,cx,cy,radius} = this.state;
		var point = points[index];
		var {sliceOffset,selectMode,dataLabels} = this.props.series;
		var {startAngle,endAngle} = point;
		var that = this;
		var $slices = $(this.findDOMNode()).find(".points-group path");
		var $labels = $(this.findDOMNode()).find(".label-layer text");
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
		var chart = this.props.chart;
		var {cx,cy,radius,startAngle,endAngle} = this.state;
		radius = Math.min(chart.width,chart.height);
		var paper = chart.getPaper();
		var group = $(this.findDOMNode());
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
	},
	componentWillReceiveProps(nextProps){
		this.setState(this.getInitialState(nextProps));
	},
	componentWillUpdate(){
		//停止动画
		var group = $(this.findDOMNode());
		group.find(".points-group path").stopTransition();
	}
})
