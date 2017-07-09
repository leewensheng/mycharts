import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'

class  Circle extends Component{
    constructor(props){
        super(props);
        var {cx,cy,r} = props;
        this.state = {cx,cy,r}
    }
    render(){
        var {state,props} = this;
        var {cx,cy,r} = state;
        var {style} = props;
        return <circle {...props} cx={cx} cy={cy} r={r} />
    }
    animate(prevProps){
        var {state,props} = this;
        var el = findDOMNode(this);
        var {animation,cx,cy,r} = props;
        var attrs = ['cx','cy','r'];
        var changed = attrs.some(function(attr){
            return props[attr]!==prevProps[attr];
        });
        if(animation&&changed) {
            $(el).stopTransition().transition({
                cx:cx,
                cy:cy,
                r:r
            },400,'easeOut');
        } else {
            $(el).stopTransition().attr({cx,cy,r});
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
        var {cx,cy,r} = props;
        var update = false;
        this.animate(prevProps);
        this.setState({cx,cy,r,update})
    }
}
Circle.defaultProps = {
    cx:0,
    cy:0,
    r:0,
    animation:true
}
module.exports = Circle;