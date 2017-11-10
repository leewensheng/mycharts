import $ from 'jquery'
import React,{Component} from 'react'
import Draggable from '../../elements/draggable'
export default class Panning extends Component {
	constructor(props) {
        super(props);
        var {gridAxis} = props;
        this.onPanning = this.onPanning.bind(this);
        var {min,max,option} = gridAxis;
        if(typeof option.min === 'number') {
            min = option.min;
        }
        if(typeof option.max === 'number') {
            max = option.max;
        }
        this.state = {min,max};
	}
	static defaultProps = {
		gridAxis:null,
		index:null,
		sliderOpt:null,
		zoomAxis(){

		}
	}
	render(){
		var that = this;
		var {props,state} = this;
		var {gridAxis,sliderOpt} = props;
		var {axis,start,end,other,includeSeries} = gridAxis;
		var {min,max} = gridAxis;
        var grid = gridAxis.grid;
        return (
            <Draggable key="start" containment={grid} axis={axis} onDragMove={that.onPanning}>
			</Draggable>
        )
	}
	onPanning(dx,dy){
		var {props,state} = this;
		var {gridAxis,sliderOpt,zoomAxis} = props;
        var {axis,realMin,realMax} = gridAxis;
        var {min,max}  = state;
        var change = axis === 'xAxis' ? dx:dy;
        change *= -1;
        var changeValue = gridAxis.getChangeByDistance(change);
		min += changeValue;
        max += changeValue;
		if(min < realMin) {
            min = realMin;
            return;
        }
        if(max > realMax) {
            max = realMax;
            return;
        }
        this.setState({min,max});
		zoomAxis(gridAxis,min,max);
    }
    componentWillReceiveProps(nextProps){
        var {gridAxis} = nextProps;
        var {min,max,option} = gridAxis;
        if(typeof option.min === 'number') {
            min = option.min;
        }
        if(typeof option.max === 'number') {
            max = option.max;
        }
		this.setState({min,max});
    }
}