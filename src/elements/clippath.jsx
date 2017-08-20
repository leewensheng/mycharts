import $ from 'jquery'
import React,{Component} from 'react'

export default class ClipPath extends Component {
	constructor(props){
		super(props);
		this.state = {
			dom:null
		};
	}
	render(){
		return this.props.children;
	}
	componentDidMount(){
		var el = findDOMNode(this);
	}
	componentWillUnmount(){
		var dom = state.dom;
		state.dom = null;
		$(dom).remove();
	}
}