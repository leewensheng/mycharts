import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'
import Path from 'cad/path'
import {interpolatePath,interpolateObject,interpolateTransform} from 'cad/interpolate'
import shape from 'cad/shape'
export default class  PathElement extends Component{
    constructor(props){
        super(props);
        var {d,transform} = props;
        this.state = {d,transform};
    }
    static defaultProps = {
        animation:true,
        d:''
    };
    render(){
        var {state,props} = this;
        var {d,transform} = state;
        return <path {...props}  d={d.toString()} transform={transform}/>
    }
    animate(prevProps){
        var {state,props} = this;
        var el = findDOMNode(this);
        var {animation,d,transform,pathShape,onAnimationChange} = props;

        if(!(prevProps.animation&&animation)){
            $(el).attr('d',d.toString());
            $(el).attr('transform',transform);
            return;
        }
        var during = 400,ease = 'easeOut',delay = 0;
        if(typeof animation === 'object') {
            during = animation.during || during;
            ease = animation.ease || ease;
        }
        onAnimationChange&&onAnimationChange(true);
        if(d.toString()=== prevProps.d.toString()&&transform === prevProps.transform) {
            return;
        }
        var currentTransform = $(el).attr('transform');
        var currentD = $(el).attr('d');
        var transformEase = interpolateTransform(currentTransform,transform);
        var pathInterpolate;
        if(!pathShape) {
            pathInterpolate = interpolatePath(currentD,d);
        } else {
            pathInterpolate = interpolateObject(prevProps.pathShape.config,pathShape.config);
        }
        $(el).stopTransition().transition({
            from:0,
            to:1,
            ease:ease,
            during:during,
            onUpdate(k) {
                var easeD;
                $(el).attr('transform',transformEase(k));
                if(!pathShape) {
                    easeD = pathInterpolate(k);
                } else {
                    easeD = shape.getShapePath(pathShape.name,pathInterpolate(k));
                }
                $(el).attr('d',easeD);
            }
        });
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            update:nextProps.update!==false
        })
    }
    shouldComponentUpdate(nextProps,nextState){
        return nextState.update?true:false;
    }
    componentDidUpdate(prevProps){
        var {props} = this;
        var {d,transform} = props;
        var update = false;
        this.animate(prevProps);
        this.setState({d,transform,update})
    }
    componentWillUnmount(){
        $(findDOMNode(this)).stopTransition();
    }
}
