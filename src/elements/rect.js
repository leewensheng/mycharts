import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'
//todo 多行支持tspan
export default class Rect extends Component{
    constructor(props){
        super(props);
        var {x,y,width,height} = props;
        this.state = {x,y,width,height};
    }
    static defaultProps =  {
        animation:true,
        x:0,
        y:0,
        width:0,
        height:0,
        style:{
         
        }
    };
    render(){
        var {props,state} = this;
        var {x,y,width,height} = state;
        var defaultStyle = {shapeRendering:'optimizeSpeed'};
        $.extend(defaultStyle,props.style);
        if(width < 0) {
            width = Math.abs(width);
            x = x - width;
        }
        if(height < 0) {
            height = Math.abs(height);
            y = y - height;
        }
        return <rect {...props} x={x} y={y} width={width} height={height} style={defaultStyle}/>
    }
    animate(prevProps){
        var {state,props} = this;
        var {animation,x,y,width,height} = props;
        if(width < 0) {
            width = Math.abs(width);
            x = x - width;
        }
        if(height < 0) {
            height = Math.abs(height);
            y = y - height;
        }
        var el = findDOMNode(this);
        var during = 400,ease = 'easeOut',group;
        if(animation) {
            if(typeof animation === 'object') {
                during = animation.during || during;
                ease = animation.ease || ease;
                group = animation.group;
            }
            $(el).stopTransition().transition({x,y,width,height},during,ease,null,group);        
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
    componentWillUnmount(){
        $(findDOMNode(this)).stopTransition();
    }
    componentDidUpdate(prevProps){
        var {props} = this;
        var {x,y,width,height} = props;
        var update = false;
        this.animate(prevProps);
        this.setState({x,y,width,height,update});
    }
}