import $ from 'jquery'
import React,{Component} from 'react'
import Path from 'cad/path'
import PathElement from './path'
class  Polyline extends Component {
	constructor(props){
		super(props);
	}
	render(){
		var {props} = this;
		var {points} = props;
		var d = new Path().LineToAll(points);
		return <PathElement d={d} fill="none" {...props}/>
	}
}
Polyline.defaultProps = {
	animation:true,
	points:[]
}
module.exports = Polyline;

