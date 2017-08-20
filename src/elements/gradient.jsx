import React,{Component} from 'react'
export default class Gradient extends Component{
	constructor(props) {
		super(props);
	}
	static defaultProps = {
		type:'linearGradient',
		x1:"0%",
		x2:"0%",
		y1:"0%",
		y2:"100%",
		cx:'50%',
		cy:'50%',
		r:'50%',
		stops:[]
	}
	render(){
		var {props} = this;
		var {type,id} = props;
		if(type === 'linearGradient') {
			var {x1,y1,x2,y2,stops} = props;
			return (
				<linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2} >
				{
					stops.map(function(stop,index){
						var offset = stop[0];
						var color = stop[1];
						return <stop key={index} stopColor={color} offset={offset} />
					})
				}
				</linearGradient>
			)
		} else if(type === 'radialGradient') {
			var {cx,cy,r,stops} = props;
			return (
				<radialGradient id={id} cx={cx} cy={cy} r={r}>
				{
					stops.map(function(stop,index){
						var offset = stop[0];
						var color = stop[1];
						return <stop key={index} stopColor={color} offset={offset} />
					})
				}
				</radialGradient>
			) 
		}
	}
}