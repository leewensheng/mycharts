import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'

export default class ClipPath extends Component {
	constructor(props){
		super(props);
	}
	render(){
		var id = this.props.id;
		return <clipPath id={id}>{this.props.children}</clipPath>
	}
	componentDidMount(){
		return;
		var el = findDOMNode(this);
		var defs = $(el).closest('svg').find('defs');
		defs.append(el);
	}
}