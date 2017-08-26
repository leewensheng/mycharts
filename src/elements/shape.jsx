import React,{Component} from 'react'
import Path from 'cad/path'
import PathElement from './path'
import {getShapePath} from 'cad/shape'
export default class Shape extends Component {
	render(){
		var {props} = this;
		var {name} = props;
		var d = getShapePath(name,props);
		return <PathElement {...props} d={d} pathShape={{name,config:props}} />
	}
}