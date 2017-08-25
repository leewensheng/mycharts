import React,{Component} from 'react'
import Circle from './circle'

export default Maker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isHover:false
		}
	}
	static defaultProps = {
		cx:null,
		cy:null,
		marker:{
			symbol:'circle',
			size:4,
			fillColor:null,
			borderColor:'#000',
			borderWidth:0,
			borderType:'solid',
			style:{},
			state:{
				hover:{

				}
			}
		}
	}
	render() {
		var {props,state} = this;
		var {cx,cy,marker} = props;
		var {symbol,size,fillColor,borderColor,borderWidth,borderType,style} = marker;
		return (
			<Circle cx={cx} cy={cy} r={size}
		)
	}
}