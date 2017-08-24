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
        return <rect {...props} x={x} y={y} width={Math.abs(width)} height={Math.abs(height)} style={defaultStyle}/>
    }
    animate(prevProps){
        var {state,props} = this;
        var {animation,x,y,width,height} = props;
        width = Math.abs(width);
        height = Math.abs(height);
        var el = findDOMNode(this);
        if(animation) {
            $(el).stopTransition().transition({x,y,width,height},400,'easeOut');        
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