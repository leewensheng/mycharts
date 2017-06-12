import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Path from 'cad/path'
import {interpolate} from 'cad/interpolate'
class  Polyline extends Component {
	constructor(props){
		super(props);
		this.state = {
			prevPoints:null
		}
	}
	render(){
		var {props,state} = this;
		var {points} = props;
		var {prevPoints}  = state;
		var d = new Path().LineToAll(prevPoints||points).toString();
		return <path d={d} fill="none" {...props}/>
	}
	animate(){
		var {points} = this.props;
		var {prevPoints} = this.state;
		var interpolateFunc = interpolate(prevPoints,points);
		var el = findDOMNode(this);
		$(el).stopTransition(true).transition({
			from:0,
			to:1,
			during:400,
			ease:'easeOut',
			onUpdate(k){
				var pts = interpolateFunc(k);
				var d = new Path().LineToAll(pts).toString();
				$(el).attr('d',d);
			}
		})
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			prevPoints:this.props.points
		});
	}
	componentDidUpdate(){
		this.animate();
	}
}
Polyline.defaultProps = {
	animation:true,
	points:[]
}
module.exports = Polyline;

