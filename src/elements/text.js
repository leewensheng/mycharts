import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'
export default class  Text extends Component{
    constructor(props){
        super(props);
        var {x,y} = props;
        this.state = {x,y}
    }
    static defaultProps = {
        animation:true,
        x:0,
        y:0,
        style:{
            fontSize:12
        }
    };
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
        if(x === prevProps.x && y === prevProps.y) {
            return;
        }
        var during = 400,ease = 'easeOut',delay = 0;
        if(typeof animation === 'object') {
            during = animation.during || during;
            ease = animation.ease || ease;
        }
        if(animation) {
            $(el).stopTransition().transition({x,y },during,ease);
        } else {
            $(el).stopTransition().attr('x',x).attr('y',y);
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({update:nextProps.update!==false})
    }
    shouldComponentUpdate(nextProps,nextState){
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