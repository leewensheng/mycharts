import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'
//todo 多行支持tspan
class  Rect extends Component{
    constructor(props){
        super(props);
        var {x,y,width,height} = props;
        this.state = {x,y,width,height};
    }
    render(){
        var {props,state} = this;
        var {x,y,width,height} = state;
        var defaultStyle = {shapeRendering:'optimizeSpeed'};
        $.extend(defaultStyle,props.style);
        if(typeof width === 'number') {
            width = Math.abs(width);
        }
        if(typeof height === 'number') {
            height = Math.abs(height);
        }
        return <rect {...props} x={x} y={y} width={width} height={height} style={defaultStyle}/>
    }
    animate(prevProps){
        var {state,props} = this;
        var {animation,x,y,width,height} = props;
        width = Math.abs(width);
        height = Math.abs(height);
        var el = findDOMNode(this);
        var during = 400,ease = 'easeOut';
        if(animation) {
            if(typeof animation === 'object') {
                during = animation.during || during;
                ease = animation.ease || ease;
            }
            $(el).stopTransition().transition({x,y,width,height},during,ease);        
        } else {
            $(el).stopTransition().attr({x,y,width,height});        
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({update:nextProps.update!==false});
    }
    shouldComponentUpdate(nextProps,nextState){
        return nextState.update?true:false;
    }
    componentDidUpdate(prevProps){
        var {props} = this;
        var {x,y,width,height} = props;
        var update = false;
        this.animate(prevProps);
        this.setState({x,y,width,height,update});
    }
}
Rect.defaultProps =
 {
    animation:true,
    x:0,
    y:0,
    width:0,
    height:0,
    style:{
     
    }
}
module.exports = Rect;