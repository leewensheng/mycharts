import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Slider from './slider'
export default class DataZoom extends Component {
	constructor(props) {
		super(props);
		this.state ={
			grid:null
		}
		this.onGridReady = this.onGridReady.bind(this);
		this.props.chartEmitter.on('gridReady',this.onGridReady);
	}   
	render(){
		var {props,state} = this;
		var {grid} = state;
		if(!grid) return <g></g>;
		var xAxis = grid.axis[0];
		return (
			<Slider grid={grid} />
		)
	}
	onGridReady(grid){
		var {props,state} = this;
		this.setState({
			grid
		})
	}
}