import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'

import Paper from 'cad/paper/index'
import shape from 'cad/shape'
import Point from 'cad/point'
import mathUtils from 'cad/math'
import Text from '../../elements/text'
import ConnectLine from './connect-line'

import defaultOption from './option'
import Slice from './slice'
import Icon from './icon'

import {getRenderData} from './helper'
class  Pie extends Component{
	constructor(props) {
		super(props);
		this.onLegendChange = this.onLegendChange.bind(this);
		props.chartEmitter.on('legendVisibleToggle',this.onLegendChange);
		var state = getRenderData(props);
		this.state = state;
	}

	render(){
		var that = this;
		var {props,state} = this;
		var {width,height,series,option} = props;
		var {points} = state;
		var {center,size,dataLabels,connectLine,borderColor,borderWidth,sliceOffset,visible} = series;
		var {cx,cy,radius,innerRadius,selectedPointsMap,updateType} = this.state;
		var onSlice = this.onSlice;
		return (
			<g className="vcharts-series vcharts-pie-series" style={{display:visible?'':'none'}}>
				<g className="vcharts-points vcharts-pie-points">
				{
				points.map(function(point,index){
					var {startAngle,midAngle,endAngle,radius,color,selected,isAdd} = point;
					return <Slice
							key={index}
							animation={option.chart.animation}
							cx={cx}
							cy={cy}
							startAngle={startAngle}
							endAngle={endAngle}
							radius={radius}
							innerRadius={innerRadius}
							midAngle={midAngle}
							borderWidth={borderWidth}
							borderColor={borderColor}
							color={color}
							index={index}
							selected={selected}
							sliceOffset={sliceOffset}
							onSlice={onSlice.bind(that,index)}
							isAdd={isAdd}
							updateType={updateType}
						/>
					})			
				}
				</g>
				<g className="vcharts-labels">
					{
						points.map((p ,index) => {

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
							var leadLength = connectLine.leadLength;//水平引线长度,需要考虑超出最大长度
							//三角形正弦定理 2*sin(A)/a = 1/R;其中A为角,a为对边长,R为外接圆半径;
							/*var maxleadLength = 3
							var startPoint = Point(cx,cy).angleMoveTo(midAngle,p.radius);
							var hline = new Line(startPoint.x,startPoint.y,startPoint.x+5,startPoint.y);
							var crossPoints = hline.getPointWithCircle(cx,cy,p.radius);*/
							if(!(dataLabels.inside || dataLabels.distance < 0 )) {
								var rotate = mathUtils.asin(mathUtils.sin(midAngle)*leadLength/(radius + dataLabels.distance));
								if(textOption.textAlign === "left") {
									rotate*= -1;
								}
								textPoint.rotate(rotate,cx,cy);
							};
							return (
							<g className="vcharts-pie-labels" key={index} style={{display:p.visible?'':'none'}}>
								{
									dataLabels.enabled
									&&
									<Text 
									animation={option.chart.animation}
									x={textPoint.x + dx}
									y={textPoint.y}
									style={{
										fontSize:dataLabels.style.fontSize,
										color:dataLabels.style.color||p.color,
										display:hide?"none":undefined,
										pointerEvents:"none",
										textAlign:textOption.textAlign,
										textBaseLine:"middle"
									}}>{p.name}</Text>
								}
								{
									connectLine.enabled && !dataLabels.inside && dataLabels.distance>0
									&&
									<ConnectLine
										animation={option.chart.animation}
										cx={cx}
										cy={cy}
										radius={p.radius}
										midAngle={p.midAngle}
										x={textPoint.x}
										y={textPoint.y}
										textAlign={textOption.textAlign}
										updateType={p.updateType}
										leadLength={connectLine.leadLength}
										lineColor={connectLine.lineColor||p.color}
										lineWidth={connectLine.lineWidth}
										lineDash={connectLine.lineDash}
										style={connectLine.style}
									 />
								}
							</g>
							)
						})
					}
				</g>
			</g>
		)
	}
	onSlice(selectedIndex){
		var {props,state} = this;
		var {points} = state;
		var {selectMode} = props;
		var selected = !points[selectedIndex].selected;
		points[selectedIndex].selected= selected;
		if(selectMode !== 'multiple') {
			points.map((point,index) => {
				if(selected && index !== selectedIndex) {
					point.selected = false;;
				}
			})
		}
		this.setState({points,updateType:'select'});
	}
	onLegendChange(msg){
		var {state,props} = this;
		var {points} = state;
		if(msg.seriesIndex == this.props.seriesIndex) {
			var visiblePoints = msg.visible;
			visiblePoints.map(function(visible,index){
				points[index].visible = visible;
			})
			var nextState = getRenderData(props,state);
			this.setState(nextState);
		}
	}
	animate(){
		var {width,height,option,series,seriesIndex} = this.props;
		var sliceOffset = series.sliceOffset;
		var {cx,cy,radius,startAngle,endAngle} = this.state;
		var el = findDOMNode(this);
		var svg = $(el).closest("svg").get(0);
		var paper = new Paper(svg);
		var group = $(findDOMNode(this));
		var clip = paper.clipPath(function(){
			paper.addShape("sector",{
							cx,
							cy,
							radius:radius + sliceOffset,
							startAngle:startAngle,
							endAngle:startAngle + 1e-6
						});
		});
		var clipId = 'pie-clip' + Math.random();
		clip.attr("id",clipId);
		group.attr("clip-path","url(#"+ clipId +")");
		var path = clip.find("path");
		$(el).find('.vcharts-labels').css("display","none");
		path.transition({
			from:startAngle,
			to:endAngle,
			ease:'easeOutIn',
			during:600,
			callback(){
				clip.remove();
				group.removeAttr("clip-path");
				$(el).find('.vcharts-labels').css("display","");
			},
			onUpdate:function(val){
				path.attr("d",shape.getShapePath("sector",{
					cx,
					cy,
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
		var state = getRenderData(nextProps,this.state);
		state.updateType = 'newProps';
		this.setState(state);
	}
	componentWillUnmount(){
		var {props,state} = this;
		props.chartEmitter.removeListener('legendVisibleToggle',this.onLegendChange);
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