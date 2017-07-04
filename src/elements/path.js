import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'
import Path from 'cad/path'
import {interpolatePath} from 'cad/interpolate'

class  PathShape extends Component{
    constructor(props){
        super(props);
        var {path} = props;
        this.state = {path};
    }
    render(){
        var {state,props} = this;
        var {path} = state;
        return <path {...props}  d={path.toString()} />
    }
    animate(){
        var {state,props} = this;
        var el = findDOMNode(this);
        var {animation,path} = props;
        var oldPath = $(el).attr('d');
        oldPath = new Path(oldPath);
        var ease = interpolatePath(oldPath,path);
        $(el).stopTransition().transition({
            from:0,
            to:1,
            during:400,
            ease:'easeOut',
            onUpdate(k){
                var d = ease(k);
                $(el).attr('d');
            }
        });
    }
    componentWillReceiveProps(nextProps){
        this.setState({update:true})
    }
    shouldComponentUpdate(nextProps,nextState){
        return nextState.update?true:false;
    }
    componentDidUpdate(){
        var {props} = this;
        var {path} = props;
        var update = false;
        this.animate();
        this.setState({path,update})
    }
}
PathShape.defaultProps = {
    animation:true,
    path:null
}
module.exports = PathShape;