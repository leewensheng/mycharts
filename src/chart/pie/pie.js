import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'

import shape from 'cad/shape'
import Point from 'cad/point'
import mathUtils from 'cad/math'

import Path from  '../../elements/path'
import Text from '../../elements/text'
import Shape from '../../elements/shape'
import ConnectLine from './connect-line'
import Slice from './slice'

export default class  Pie extends Component{
	constructor(props) {
		super(props);
		var state = props.seriesModel.getRenderData(props.width,props.height);
		this.state = state;
		this.toggleToolTip = this.toggleToolTip.bind(this);
		this.onSlice = this.onSlice.bind(this);
	}

	render(){
		var that = this;
		var {props,state} = this;
		var {width,height,seriesModel,option} = props;
		var seriesOpt = seriesModel.getOption();
		var {visible,seriesId} = seriesModel
		var {points} = state;
		var {cx,cy,startAngle,endAngle,radius,innerRadius,selectedPointsMap,updateType,hasInited} = state;
		var {animation,center,size,itemStyle,dataLabels,connectLine,borderColor,borderWidth,sliceOffset} = seriesOpt;
		var toggleToolTip = this.toggleToolTip;
		return (
			<g clipPath={'url(#'+ seriesId +')'} className="vcharts-series vcharts-pie-series" style={{display:visible?'':'none'}}>
				<clipPath id={seriesId}>
					<Shape animation={animation} name="sector" cx={cx} cy={cy} radius={Math.min(width,height)} startAngle={startAngle} endAngle={hasInited?endAngle:startAngle+1e-6} />
				</clipPath>
				<g className="vcharts-points vcharts-pie-points">
				{
				points.map(function(point,index){
					var {startAngle,midAngle,endAngle,radius,color,selected,isAdd} = point;
					return <Slice
							style={itemStyle}
							key={index}
							index={index}
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
							selected={selected}
							sliceOffset={sliceOffset}
							onSlice={that.onSlice}
							isAdd={isAdd}
							updateType={updateType}
							toggleToolTip={toggleToolTip}
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
    toggleToolTip(dataIndex,isShow,mouseEvent){
		var {props,state} = this;
        var {seriesModel} = props;
        var data = seriesModel.getData();
        var {cx,cy} = state;
        props.chartEmitter.emit('toggleToolTip',{
            show:isShow,
            point:data[dataIndex],
            plotX:cx,
            plotY:cy,
            event:mouseEvent
        });
	}
	componentDidMount(){
		var el = $(findDOMNode(this));
		var animation = this.props.seriesModel.getOption().animation;
		this.setState({hasInited:true});
		setTimeout(function(){
			el.removeAttr('clip-path');
		},animation.during?animation.during:400)
	}
	componentWillReceiveProps(nextProps){
		var {width,height} = nextProps;
		var state = nextProps.seriesModel.getRenderData(width,height,this.state);
		state.updateType = 'newProps';
		this.setState(state);
	}
}