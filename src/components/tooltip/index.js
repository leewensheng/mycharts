import React,{Component} from 'react'
import defaultOption  from './option'
class Tooltip extends Component {
	constructor(props){
		super(props);
		this.showPoint = this.showPoint.bind(this);
		this.hidePoint = this.hidePoint.bind(this);
		this.state = {
			show:false,
			points:[]
		}
	}
	render(){
		var {props,state} = this;
		var {chartWidth,chartHeight,chartOption} = props;
		var {show,points} = state;
		var style = {};
		style.position = 'absolute';
		style.background ='rgba(0,0,0,0.7)';
		style.zIndex = 11;
		style.left = 0;
		style.top = 0;
		style.padding = "5px 10px";
		style.display = show?'block':'none';
		style.fontSize = 14;
		style.color = "#fff";
		style.borderRadius = 5;
		return (
			<div className="vcharts-tooltip" style={style}>
				<ul style={{margin:0,padding:0}}>
					{
						points.map((point,index) => {
							return (
								<li key={index}>{point.name}</li>
							)
						})
					}
				</ul>
			</div> 
		)
	}
	showPoint(point){
		var state = this.state;
		var points = [point];
		this.setState({
			show:true,
			points:points
		})
	}
	hidePoint(point) {

	}
	componentDidMount(){
		this.props.chartEmitter.on('tooltip.showPoint',this.showPoint);
		this.props.chartEmitter.on('tooltip.hidePoint',this.hidePoint);
	}
	componentWillUnmount(){
		this.props.chartEmitter.removeListener('showPoint',this.showPoint);
		this.props.chartEmitter.removeListener('hidePoint',this.hidePoint);
	}
}
Tooltip.useHTML = true;
module.exports = Tooltip;