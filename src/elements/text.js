import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'

class  Text extends Component{
    constructor(props){
        super(props);
        var {x,y} = props;
        this.state = {x,y}
    }
    render(){
        var {state,props} = this;
        var {x,y} = state;
        var {style} = props;
        style = $.extend({fontSize:12,textAlign:'left',textBaseLine:'bottom'},style);
        var {fontSize,color,textAlign,textBaseLine} = style;
        var anchor = {
            left:'start',
            right:'end',
            center:'middle',
        };
        var dy = 0;
        if(textBaseLine === 'middle') {
            dy = fontSize/3;
        } else if(textBaseLine === "top") {
            dy = fontSize;
        }
        return <text {...props} style={style} x={x} y={y} fill={color} textAnchor={anchor[textAlign]} dy={dy}>{this.props.children}</text>
    }
    animate(prevProps){
        var {state,props} = this;
        var el = findDOMNode(this);
        var {animation,x,y} = props;
        if(animation&&prevProps.animation) {
            $(el).stopTransition().transition({
                x:x,
                y:y,
            },400,'easeout');
        } else {
            $(el).attr('x',x).attr('y',y);
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({update:true})
    }
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.update === false) {
            return false;
        }
        return nextState.update?true:false;
    }
    componentDidUpdate(prevProps){
        var {props} = this;
        var {x,y} = props;
        var update = false;
        this.animate(prevProps);
        this.setState({x,y,update})
    }
}
Text.defaultProps = {
    animation:true,
    x:0,
    y:0,
    style:{
        fontSize:12,
        color:"#333"
    }
}
module.exports = Text;