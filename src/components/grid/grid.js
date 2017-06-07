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
		return {
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
				<Rect  className="vcharts-grid-backgrould" x={left} y={top} width={width} height={height} fill={background}/>
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
		var props = this.props;
		var {onDependceReady,includeSeries,top,left,right,bottom,width,height,background,xAxis,yAxis} = props;
		onDependceReady('grid',includeSeries,{
			top:top,
			left:left,
			right:right,
			bottom:bottom,
			width:width,
			height:height,
			xAxis:[],
			yAxis:[]
		});
	}
	componentDidMount(){
		this.computeTextWidth();
	}
	componentDidUpdate(){
		this.computeTextWidth();
	}
}

module.exports = Grid;