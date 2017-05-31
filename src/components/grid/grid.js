import $ from 'jquery'
import preact,{Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import Axis from './axis'

class Grid extends Component {
	getDefaultProps(){
		return {
			left:null,
			right:null,
			bottom:null,
			top:null,
			width:null,
			height:null,
			fill:'transparent',
			xAxis:[],
			yAxis:[]
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
		var {top,left,right,bottom,background,width,height,xAxis,yAxis} = props;
		var {leftLabelWidth,rightLabelWidth,bottomLabelHeight,topLabelHeight} = this.state;
		var axis = xAxis.concat(yAxis);
		return (
			<g className="vcharts-grid">
				<rect  className="vcharts-grid-backgrould" x="0" y="0" width={width} height={height} fill={background}/>
				{
					axis.map(function(val){
						return <Axis />
					})
				}
			</g>
		)
	}
	componentDidMount(){

	}
	componentWillReceiveProps(){

	}
}

module.exports = Grid;