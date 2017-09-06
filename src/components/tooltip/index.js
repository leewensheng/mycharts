import React,{Component} from 'react'
export default class Tooltip extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show:false,
			x:null,
			y:null,
			points:[]
		}
		this.toggleToolTip = this.toggleToolTip.bind(this);
	}
	render(){
		var {props,state} = this;
		var {chartModel} = props;
		var {show,x,y,points} = state;
		var style = {};
		style.position = 'absolute';
		style.zIndex = 1;
		style.borderRadius = '5px';
		style.borderWidth = '3';
		style.borderColor = 'transparent';
		style.background = 'rgba(0,0,0,0.3)';
		style.padding = '5px';
		style.fontSize ='12px';
		style.color = '#fff';
		style.left = x;
		style.top = y;
		style.display = show?'block':'none';
		return (
			<div className="vcharts-tooltip" style={style}>
				<ul>
				{
					points.map(function(point,index){
						var {name,value} = point;
						return <li key={index}>{point.name +' : ' + point.value}</li>
					})	
				}
				</ul>
			</div>
		)
	}
	toggleToolTip(data){
		var {show,event,point} = data; 
		var x =event.clientX;
		var y = event.clientY;
		this.setState({
			show:show,
			x:x,
			y:y,
			points:show?[point]:[]
		});
	}
	componentDidMount(){
		this.props.chartEmitter.on('toggleToolTip',this.toggleToolTip)
	}
	componentWillUnmount(){
		this.props.chartEmitter.removeListener('toggleToolTip',this.toggleToolTip);
	}
}