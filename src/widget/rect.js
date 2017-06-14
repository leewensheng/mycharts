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
        return <rect {...this.props} x={x} y={y} width={Math.abs(width)} height={Math.abs(height)} />
    }
    animate(nextProps){
        var {x,y,width,height} = nextProps;
        width = Math.abs(width);
        height = Math.abs(height);
        var el = findDOMNode(this);
        $(el).stopTransition().transition({
            x:x,
            y:y,
            width:width,
            height:height
        },400,'easeout');
    }
    componentWillReceiveProps(nextProps){
        this.animate(nextProps);
    }
    shouldComponentUpdate(nextProps,nextState){
        return false;
    }
}
Rect.defaultProps =
 {
    x:0,
    y:0,
    width:0,
    height:0,
    style:{
     
    }
}
module.exports = Rect;