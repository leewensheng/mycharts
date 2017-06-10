import $ from 'jquery'
import preact,{Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
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
		var d = new cad.Path().LineToAll(prevPoints||points).toString();
		return <path d={d} fill="none" {...props}/>
	}
	animate(){
		var {points} = this.props;
		var {prevPoints} = this.state;
		var interpolate = cad.interpolate(prevPoints,points);
		var el = findDOMNode(this);
		$(el).stopTransition(true).transition({
			from:0,
			to:1,
			during:400,
			ease:'easeOut',
			onUpdate(k){
				var pts = interpolate(k);
				var d = new cad.Path().LineToAll(pts).toString();
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
	points:[]
}
module.exports = Polyline;

