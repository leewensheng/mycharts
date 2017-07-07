import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'
import Path from 'cad/path'
import {interpolatePath,interpolateObject} from 'cad/interpolate'
import shape from 'cad/shape'
class  PathElement extends Component{
    constructor(props){
        super(props);
        var {d} = props;
        this.state = {d};
    }
    render(){
        var {state,props} = this;
        var {d} = state;
        return <path {...props}  d={d.toString()} />
    }
    animate(prevProps){
        var {state,props} = this;
        var el = findDOMNode(this);
        var {animation,d,pathShape,onAnimationEnd} = props;
        if(pathShape) {
            var prevConfig = prevProps.pathShape.config;
            var configInterpolate = interpolateObject(prevConfig,pathShape.config);
            $(el).stopTransition().transition({
                from:0,
                to:1,
                during:400,
                ease:'easeOut',
                onUpdate(k){
                    var d = shape.getShapePath(pathShape.name,configInterpolate(k));
                    $(el).attr('d',d);
                },
                callback(){
                    onAnimationEnd&&onAnimationEnd();
                }
            })
        } else {
            var oldPath = $(el).attr('d');
            oldPath = new Path(oldPath);
            var ease = interpolatePath(oldPath,d);
            $(el).stopTransition().transition({
                from:0,
                to:1,
                during:400,
                ease:'easeOut',
                onUpdate(k){
                    var d = ease(k);
                    $(el).attr('d',d);
                },
                callback(){
                    onAnimationEnd&&onAnimationEnd();
                }
            });
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
        var {d} = props;
        var update = false;
        this.animate(prevProps);
        this.setState({d,update})
    }
}
PathElement.defaultProps = {
    animation:true,
    d:''
}
module.exports = PathElement;