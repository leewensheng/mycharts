import $ from 'jquery'
import preact,{Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import Axis from './axis'

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
			xAxis:[],
			yAxis:[],
			includeSeries:[],
			onDependceReady:null
		}
	}
	getInitialState(){
		return {
			ready:false,
			leftLabelWidth:0,
			rightLabelWidth:0,
			bottomLabelHeight:0,
			topLabelHeight:0
		}
	}
	render(){
		var props = this.props;
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
				<rect  className="vcharts-grid-backgrould" x={left} y={top} width={width} height={height} fill={background}/>
				{
					xAxis.map(function(axis){
						return <Axis 	
									left={axisLeft} 
									right={axisRight} 
									bottom={axisBottom}
									top={axisTop}
									width={axisWidth}
									height={axisHeight}
									option={axis}
									axis="x"/>
					})
				}{
					yAxis.map(function(axis){
						return <Axis 	
									left={axisLeft} 
									right={axisRight} 
									bottom={axisBottom}
									top={axisTop}
									width={axisWidth}
									height={axisHeight}
									option={axis}
									axis="y"/>
					})
				}
			</g>
		)
	}
	computeTextWidth(){
		var {onDependceReady,includeSeries} = this.props;
		onDependceReady(includeSeries,{data:'test'});
	}
	componentDidMount(){
		this.computeTextWidth();
	}
	componentWillReceiveProps(){

	}
}

module.exports = Grid;