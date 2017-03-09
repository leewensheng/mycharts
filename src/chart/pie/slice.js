import $ from 'jquery'
import cad from 'cad'
import {h,Component,findDOMNode} from 'preact'
//the radius will be more when mouserover
var HOVER_RADIUS_ADD = 10;
class  Slice extends Component{
	getDefaultProps(){
		return {
			paper:null,
			startAngle:null,
			endAngle:null,
			cx:null,
			cy:null,
			radius:null,
			innerRadius:0,
			selected:null,
			color:null,
			sliceOffset:20,
			borderColor:null,
			borderWidth:null,
			index:null,
			isAdded:false, //是新增过来的，需要动画
			prevOption:{
				radius:0,
				innerRadius:0
			}
		}
	}
	getInitialState(){
		return {
			isAnimating:false,
			isHover:false,
			option:this.props
		}
	}
	render(){
		var {selected,cx,cy,startAngle,midAngle,endAngle,radius,innerRadius,sliceOffset} = this.state.option;
		var {color,borderColor,borderWidth} = this.props;
		var {isHover} = this.state;
		var path =	h("path");
		var that = this;
		if(isHover) {
			radius += HOVER_RADIUS_ADD;
		}
		var d = cad.getShapePath("sector",cx,cy,{
				startAngle:startAngle,
				endAngle:endAngle,
				radius:radius,
				innerRadius:innerRadius
			});
		path.attr("d",d)
			.attr("fill",color)
			.attr("stroke",borderColor)
			.attr("stroke-width",borderWidth)
			.on("click",this.props.onSlice)
			.on("mouseover",this.handleMouseOver.bind(this))
			.on("mouseout",this.handleMouseOut.bind(this));
			var offset = cad.Point(0,0).angleMoveTo(midAngle,sliceOffset);
		return path;
	}
	handleClick(){
		var index = this.props.index;
		if(typeof this.props.onSlice === 'function') {
			this.props.onSlice(index);
		}
	}
	offset(moveOut){
		var {cx,cy,startAngle,midAngle,endAngle,radius,innerRadius,color,borderColor,borderWidth,sliceOffset} = this.props;
		var offset = cad.Point(0,0).angleMoveTo(midAngle,sliceOffset);
		var el = findDOMNode(this)
		var that = this;
		var offsetX = moveOut?offset.x:0;
		var offsetY = moveOut?offset.y:0;
		var that = this;
		if(sliceOffset > 0) {
			this.setState({isAnimating:true});
			$(el).stopTransition(true)
				 .transition({
				 		transform:"translate("+ offsetX+","+ offsetY +")"
				 },100,null,function(){
				 	that.setState({isAnimating:false});
			    });
		}

	}
	handleHover(isHover){
		var {cx,cy,startAngle,endAngle,radius,innerRadius,color,borderColor,borderWidth,sliceOffset} = this.props;
		var isAnimating = this.state.isAnimating;
		var selected = this.state.selected;
		var el = findDOMNode(this);
		var hoverColor = cad.brighten(color,0.1);
		var hoverRadius = radius + HOVER_RADIUS_ADD;
		this.setState({isHover:isHover})
		if(isHover) {
			$(el).fill(hoverColor);
		} else {
			$(el).fill(color);
		}
		var from,to;
		if(isHover) {
			from = radius;
			to = hoverRadius;
		} else {
			from = hoverRadius;
			to = radius;
		}
		if(!isAnimating) {
		 	$(el).stopTransition();
		} 
		$(el).transition({
			from:from,
			to:to,
			during:400,
			ease:'elasticOut',
			onUpdate(val){
				var path = cad.getShapePath("sector",cx,cy,{startAngle:startAngle,endAngle:endAngle,radius:val,innerRadius:innerRadius})
				$(el).attr("d",path);
			}
		})
	}
	handleMouseOver(){
		this.handleHover(true);
	}
	handleMouseOut(){
		this.handleHover(false);
	}
	AngleAnimate(prevProps,props){
		var el = findDOMNode(this);
		if(!prevProps) {
			prevProps = cad.extend(true,{},props);
			prevProps = cad.extend(prevProps,props.prevOption);
		}
		var isHover = this.state.isHover;
		var interpolate = cad.interpolate(prevProps,props);
		$(el).transition({
			from:0,
			to:1,
			onUpdate(tick){
				var val = interpolate(tick);
				var {cx,cy,startAngle,endAngle,radius,innerRadius,sliceOffset} = val;
				var path = cad.getShapePath("sector",cx,cy,{
					startAngle:startAngle,
					endAngle:endAngle,
					radius:isHover?radius+ HOVER_RADIUS_ADD:radius,
					innerRadius:innerRadius
				});
				$(el).attr("d",path);
			}
		})
	}
	componentDidMount() {
		if(this.props.isAdded) {
			this.AngleAnimate(null,this.props);
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			update:true
		})
	}
	shouldComponentUpdate(nextProps,nextState){
		if(nextState.update) {
			return true;
		} else {
			return false;
		}
	}
	componentWillUpdate(){
		$(findDOMNode(this)).stopTransition(true);
	}
	componentDidUpdate(prevProps,prevState){
		if(this.props.selected !== prevProps.selected) {
			this.offset(this.props.selected);
		} else {
			if(this.props.selected) {
				this.offset(true);
			} else {
				this.offset(false)
			}
		}
		this.AngleAnimate(prevProps,this.props);
		this.setState({
			update:false,
			option:this.props
		})
	}
}
module.exports = Slice;