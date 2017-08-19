import $ from 'jquery'
import React,{Component} from 'react'
import Path from 'cad/path'
import PathElement from './path'
export default class  Polyline extends Component {
	constructor(props){
		super(props);
	}
	static defaultOption = {
		animation:true,
		points:[]
	};
	render(){
		var {props} = this;
		var {points} = props;
		var d = new Path().LineToAll(points);
		return <PathElement d={d} fill="none" {...props} points={undefined}/>
	}
}

