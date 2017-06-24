import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Paper from 'cad/paper'
import mathUtils from 'cad/math'
import colorHelper from 'cad/color/index'
import shape from 'cad/shape'
import Point from 'cad/point'

import Slice from './slice'
import Text from '../../elements/text'
import ConnectLine from './connect-line'
import defaultOption from './option'
import Icon from '../line/icon'
class  Pie extends Component{
	constructor(props) {
		super(props);
		this.onSlice = this.onSlice.bind(this);
		this.onLegendChange = this.onLegendChange.bind(this);
		props.chartEmitter.on('legend',this.onLegendChange);
		this.state = this.getRenderData(props);
	}
	getRenderData(props,oldState){
		var {series,width,height,option} = props;
		var colors = option.colors;
		var {data,color} = series;
		data.forEach(function(point,index){
			point.x = index;
		})
		if(oldState&&oldState.legend) {
			data = data.filter(function(point,index){
				point.x = index;
				return oldState.legend[index].selected!==false;
			})
		}
		if(series.colors) {
			colors = series.colors;
		}
		var arr_value = data.map(function(val){
			return val.value;
		})
		var sum = mathUtils.sum(arr_value);
		var max_num = mathUtils.max(arr_value);
		var min_num = mathUtils.min(arr_value);
		var mean_num = mathUtils.mean(arr_value);
	    var cx = series.center[0]*width;
	    var cy = series.center[1]*height;
	    var innerSize = series.innerSize;
	    var size = series.size;
	    var radius = Math.min(width,height)*size/2;
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
	        	label:curData.name,
	        	x:curData.x,
	        	y:curData.value,
	        	percent:percent.toFixed(2)
	        };
	        if(color) {
	        	//颜色差以和平均值差对比
	        	if(max_num - min_num > 0) {
	        		obj.color = colorHelper.brighten(color,(curData.value - mean_num)/(max_num - min_num )*0.5);
	        	} else {
	        		obj.color = color;
	        	}
	        } else {
	        	obj.color = colors[curData.x%colors.length];
	        }
	        obj.radius = radius;
	        if(roseType === "radius" || roseType === "area") {
	        	obj.radius  = curData.value/max_num*radius;
	        } 
	        points.push(obj);
	        return endAngle;
	    },startAngle);
	    //保留已选中的状态
	    if(oldState) {
	    	points.map(function(p,index){
	    		var oldP = oldState.points[index];
	    		if(oldP) {
	    			p.selected = oldP.selected;
	    			p.isAdded = false;
	    		} else {
	    			//新增的节点
	    			p.isAdded = true;
	    			p.prevOption = {
	    				cx:oldState.cx,
	    				cy:oldState.cy,
	    				radius:oldState.radius,
	    				innerRadius:oldState.innerRadius
	    			}
	    		}
	    	})
	    }
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
	}

	render(){
		var that = this;
		var {props,state} = this;
		var {width,height,series,option} = props;
		var {points} = state;
		var {center,size,dataLabels,connectLine,borderColor,borderWidth,sliceOffset} = series;
		var {cx,cy,radius,innerRadius} = this.state;
		var onSlice = this.onSlice;
		var slices = [],labels = [],lines = [];
		dataLabels.enabled
		&&
		points.map(function(p,index){
			var textPoint;
			var hide  = false;
			var midAngle  = p.midAngle;
			if(dataLabels.inside) {
				textPoint = {x:cx,y:cy};
				hide = true;
			} else {
				textPoint = Point(cx,cy).angleMoveTo(midAngle,radius + dataLabels.distance);
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
			//文本略微偏移
			var dx = 0;
			if(textOption.textAlign === "left") {
				dx = 3;
			} else if(textOption.textAlign === "right") {
				dx = -3;
			}
			var length2 = connectLine.length2;//水平引线长度,需要考虑超出最大长度
			//三角形正弦定理 2*sin(A)/a = 1/R;其中A为角,a为对边长,R为外接圆半径;
			/*var maxLength2 = 3
			var startPoint = Point(cx,cy).angleMoveTo(midAngle,p.radius);
			var hline = new Line(startPoint.x,startPoint.y,startPoint.x+5,startPoint.y);
			var crossPoints = hline.getPointWithCircle(cx,cy,p.radius);*/
			if(!(dataLabels.inside || dataLabels.distance < 0 )) {
				var rotate = mathUtils.asin(mathUtils.sin(midAngle)*length2/(radius + dataLabels.distance));
				if(textOption.textAlign === "left") {
					rotate*= -1;
				}
				textPoint.rotate(rotate,cx,cy);
			};
			labels.push({
				animation:option.chart.animation,
				x:textPoint.x + dx,
				y:textPoint.y,
				text:p.label,
				style:{
					fontSize:dataLabels.style.fontSize,
					color:dataLabels.style.color||p.color,
					display:hide?"none":undefined,
					pointerEvents:"none",
					textAlign:textOption.textAlign,
					textBaseLine:"middle"
				}
			})
			if(connectLine.enabled && !dataLabels.inside && dataLabels.distance>0) {
				lines.push({
					animation:option.chart.animation,
					width:width,
					cx:cx,
					cy:cy,
					radius:p.radius,
					midAngle:p.midAngle,
					x:textPoint.x,
					y:textPoint.y,
					textAlign:textOption.textAlign,
					updateType:p.updateType,
					length2:connectLine.length2,
					lineStyle:{
						color:connectLine.lineStyle.color||p.color,
						width:connectLine.lineStyle.width,
						dash:connectLine.lineStyle.dash
					}
				})
			}
		});
		return (
			<g className="vcharts-series vcharts-pie-series">
				<g className="pie-connect-line" fill="none">
				{
					lines.map(function(line,index){
						return <ConnectLine key={index} {...line} />
					})
				}
				</g>
				<g className="vcharts-points vcharts-pie-points">
				{
				points.map(function(point,index){
					return <Slice
							key={point.x}
							animation={option.chart.animation}
							cx={cx}
							cy={cy}
							startAngle={point.startAngle}
							endAngle={point.endAngle}
							radius={point.radius}
							innerRadius={innerRadius}
							selected={point.selected}
							midAngle={point.midAngle}
							borderWidth={borderWidth}
							borderColor={borderColor}
							color={point.color}
							index={index}
							selected={point.selected}
							sliceOffset={sliceOffset}
							onSlice={onSlice}
							isAdded={point.isAdded}
							updateType={point.updateType || "newProps"}
							prevOption={point.prevOption}
						/>
				})			
			}
				</g>
				<g className="vchart-pie-labels">
				{
					labels.map(function(label,index){
						return <Text 
									key={'labels'+index} 
									animation={label.animation}
									x={label.x}
									y={label.y}
									style={label.style}>{label.text}</Text>
					})
				}
				</g>
			</g>
		)
	}
	onSlice(e){
		var index = $(e.target).index();
		var points = this.state.points;
		var selectMode = this.props.series.selectMode;
		var sliced = !points[index].selected;
		points.map(function(point,key){
			if(key === index) {
				point.selected = sliced;
			} else {
				if(sliced) {
					if(selectMode === "single") {
						point.selected = false;
					}
				}
			}
			point.updateType = "select";
		})
		this.setState({points:points,updateType:'select'});
	}
	onLegendChange(msg){
		var {state,props} = this;
		if(msg.index == this.props.serieIndex) {
			state.legend = msg.data
			var nextState = this.getRenderData(props,state);
			this.setState(nextState);
		}
	}
	animate(){
		var {width,height,option,series} = this.props;
		var serieIndex = series.index;
		var sliceOffset = series.sliceOffset;
		var {cx,cy,radius,startAngle,endAngle} = this.state;
		var el = findDOMNode(this);
		var svg = $(el).closest("svg").get(0);
		var paper = new Paper(svg);
		var group = $(findDOMNode(this));
		var clip = paper.clipPath(function(){
			paper.addShape("sector",cx,cy,{
							radius:radius + sliceOffset,
							startAngle:startAngle,
							endAngle:startAngle + 1e-6
						});
		});
		clip.attr("id","pie-clip"+serieIndex);
		group.attr("clip-path","url(#pie-clip"+ serieIndex +")");
		var path = clip.find("path");
		$(".pie-connect-line,.vchart-pie-labels").css("display","none");
		path.transition({
			from:startAngle,
			to:endAngle,
			ease:'easeOutIn',
			during:600,
			callback(){
				clip.remove();
				group.removeAttr("clip-path");
				$(".pie-connect-line,.vchart-pie-labels").css("display","");
			},
			onUpdate:function(val){
				path.attr("d",shape.getShapePath("sector",cx,cy,{
					startAngle:startAngle,
					endAngle:val,
					radius:radius + sliceOffset
				}));
			}
		})
		paper.destroy();
	}
	componentDidMount(){
		this.animate();
	}
	componentWillReceiveProps(nextProps){
		var nextState = this.getRenderData(nextProps,this.state);
		nextState.updateType = 'newProps';
		this.setState(nextState);
	}
	componentWillUnmount(){
		var {props,state} = this;
		props.chartEmitter.removeListener('legend',this.onLegendChange);
	}
}
Pie.defaultOption = defaultOption;
Pie.dependencies = {
	legend:{
		must:false,
		multiple:true,
		icon:Icon
	}
}
module.exports = Pie;