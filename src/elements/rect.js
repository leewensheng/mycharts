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
    animate(){
        var {state,props} = this;
        var {animation,x,y,width,height} = props;
        width = Math.abs(width);
        height = Math.abs(height);
        var el = findDOMNode(this);
        if(animation) {
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
    componentDidUpdate(){
        var {props} = this;
        var {x,y,width,height} = props;
        var update = false;
        this.animate();
        this.setState({x,y,width,height,update});
    }
}
Rect.defaultProps =
 {
    animatin:true,
    x:0,
    y:0,
    width:0,
    height:0,
    style:{
     
    }
}
module.exports = Rect;