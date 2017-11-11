import $ from 'jquery'
import React,{Component} from 'react'
import Zoom from '../../elements/zoom'
export default class WheelZoom extends Component {
	constructor(props) {
        super(props);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.state = {
            min:props.gridAxis.min,
            max:props.gridAxis.max
        }
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
            <Zoom  containment={grid} onWheel={this.onMouseWheel} />
        )
	}
	onMouseWheel(delta){
		var {props,state} = this;
		var {gridAxis,sliderOpt,zoomAxis} = props;
        var {axis,realMin,realMax} = gridAxis;
        var {min,max}  = state;
        this.setState({min,max});
		zoomAxis(gridAxis,min,max);
    }
    componentDidMount(){

    }
    componentWillReceiveProps(nextProps){
        var {gridAxis} = nextProps;
		var {min,max} = gridAxis;
		this.setState({min,max});
    }
}