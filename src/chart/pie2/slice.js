import $ from 'jquery'
import React from '../../../../src/virtual-dom/react.js'
//import cad
var Slice = React.createClass({
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
			index:null
		}
	}, 
	getInitialState(){
		var selected = this.props.selected;
		return {
			selected:selected||false,
			isAnimating:false,
			isHover:false
		}
	},
	render(){
		var {cx,cy,startAngle,midAngle,endAngle,radius,innerRadius,color,borderColor,borderWidth,sliceOffset} = this.props;
		var {selected,isHover} = this.state;
		var path = React.createElement("path");
		var that = this;
		if(isHover) {
			radius += 15;
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
			.on("click",this.handleClick.bind(this))
			.on("mouseover",this.handleMouseOver.bind(this))
			.on("mouseout",this.handleMouseOut.bind(this));
			var offset = cad.Point(0,0).angleMoveTo(midAngle,sliceOffset);
		return path;
	},
	handleClick(){
		var selected = this.state.selected;
		var index = this.props.index;
		if(typeof this.props.onSlice === 'function') {
			this.props.onSlice(index,!selected);
		}
	},
	offset(moveOut){
		var {cx,cy,startAngle,midAngle,endAngle,radius,innerRadius,color,borderColor,borderWidth,sliceOffset} = this.props;
		var offset = cad.Point(0,0).angleMoveTo(midAngle,sliceOffset);
		var el = this.findDOMNode();
		var that = this;
		var offsetX = moveOut?offset.x:0;
		var offsetY = moveOut?offset.y:0;
		var that = this;
		if(sliceOffset > 0) {
			this.setState({isAnimating:true});
			$(el).stopTransition(true)
				 .transition({
				 		transform:"translate("+ offsetX+","+ offsetY +")"
				 },200,null,function(){
				 	that.setState({isAnimating:false});
			    });
		}

	},
	handleHover(isHover){
		var {cx,cy,startAngle,endAngle,radius,innerRadius,color,borderColor,borderWidth,sliceOffset} = this.props;
		var isAnimating = this.state.isAnimating;
		var selected = this.state.selected;
		var el = this.findDOMNode();
		var hoverColor = cad.brighten(color,0.1);
		var hoverRadius = radius + 15;
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
	},
	handleMouseOver(){
		this.handleHover(true);
	},
	handleMouseOut(){
		this.handleHover(false);
	},
	componentWillReceiveProps(nextProps){
		this.setState({
			update:true,
			selected:nextProps.selected
		})
	},
	shouldComponentUpdate(nextProps,nextState){
		if(nextState.update) {
			return true;
		} else {
			return false;
		}
	},
	componentDidUpdate(prevProps,prevState){
		this.setState({
			update:false
		})
		if(this.state.selected !== prevState.selected) {
			this.offset(this.state.selected);
		} else {
			if(this.state.selected) {
				this.offset(true);
			} else {
				this.offset(false)
			}
		}
	}
})
module.exports = Slice;