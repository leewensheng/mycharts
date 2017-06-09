import $ from 'jquery'
import preact,{Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import Axis from './axis'
import Rect from '../../widget/rect'
class Grid extends Component {
	getDefaultProps(){
		return {
			left:null,
			top:null,
			bottom:null,
			right:null,
			width:null,
			height:null,
			background:'transparent',
			containLabel:false,
			xAxis:[],
			yAxis:[],
			includeSeries:[],
			onDependceReady:null
		}
	}
	getInitialState(){
		var {xAxis,yAxis} = this.props;
		return {
			leftLabelWidth:0,
			rightLabelWidth:0,
			bottomLabelHeight:0,
			topLabelHeight:0,
			xAxis:xAxis.map(function(){}),
			yAxis:yAxis.map(function(){})
		}
	}
	render(){
		var props = this.props;
		var setAxisData = this.setAxisData.bind(this);
		var {top,left,right,bottom,width,height,background,xAxis,yAxis} = props;
		var {leftLabelWidth,rightLabelWidth,bottomLabelHeight,topLabelHeight} = this.state;
		var axisLeft = left - leftLabelWidth,
			axisTop = top +  topLabelHeight,
			axisRight = right - rightLabelWidth,
			axisBottom = bottom  - bottomLabelHeight,
			axisWidth = axisRight - axisLeft,
			axisHeight = axisBottom - axisTop;
		return (
			<g className="vcharts-grid">
				<Rect  className="vcharts-grid-backgrould" x={left} y={top} width={width} height={height} fill={background}/>
				{
					xAxis.map(function(axis,index){
						return <Axis 	
									left={axisLeft} 
									right={axisRight} 
									bottom={axisBottom}
									top={axisTop}
									width={axisWidth}
									height={axisHeight}
									option={axis}
									axis="x"
									indexInGrid={index}
									setAxisData={setAxisData}
									/>
					})
				}{
					yAxis.map(function(axis,index){
						return <Axis 	
									left={axisLeft} 
									right={axisRight} 
									bottom={axisBottom}
									top={axisTop}
									width={axisWidth}
									height={axisHeight}
									option={axis}
									axis="y"
									indexInGrid={index}
									setAxisData={setAxisData}
									/>
					})
				}
			</g>
		)
	}
	setAxisData(axis,index,data){
		var {xAxis,yAxis} = this.state;
		if(axis==='x') {
			xAxis[index] = data;
		} else {
			yAxis[index] = data;
		}
		var isReady = true;
		xAxis.map(function(val){
			if(!val) isReady = false;
		})
		yAxis.map(function(val){
			if(!val) isReady = false;
		})
		if(isReady) {
			this.onAxisReady();
		}
	}
	onAxisReady(){
		var {props,state} = this;
		var {onDependceReady,includeSeries,top,left,right,bottom,width,height} = props;
		var {xAxis,yAxis} = state;
		onDependceReady('grid',includeSeries,{
			top:top,
			left:left,
			right:right,
			bottom:bottom,
			width:width,
			height:height,
			xAxis:xAxis,
			yAxis:yAxis
		});
	}
	componentWillReceiveProps(){
		this.setState({updateType:'newProps'});
	}
	shouldComponentUpdate(nextProps,nextState){
		return nextState.updateType === 'newProps';
	}
}

module.exports = Grid;