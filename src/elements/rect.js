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
        var {x,y,width,height} = this.state;
        return <rect {...this.props} x={x} y={y} width={Math.abs(width)} height={Math.abs(height)} style={{shapeRendering:"optimizeSpeed"}}/>
    }
    animate(prevProps){
        var {state,props} = this;
        var {animation,x,y,width,height} = props;
        width = Math.abs(width);
        height = Math.abs(height);
        var el = findDOMNode(this);
        var attrs = ['x','y','width','height'];
        var changed = attrs.some(function(attr){
            return props[attr] !== prevProps[attr];
        });
        if(animation&&changed) {
            $(el).stopTransition().transition({x,y,width,height},400,'easeout');        
        } else {
            $(el).stopTransition().attr({x,y,width,height});        
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({update:true})
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