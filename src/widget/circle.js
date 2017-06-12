import preact,{Component,VNode,findDOMNode} from 'preact'
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
    animate(){
        var {state,props} = this;
        var el = findDOMNode(this);
        var {animation,cx,cy,r} = props;
        if(animation) {
            $(el).stopTransition(true).transition({
                cx:cx,
                cy:cy,
                r:r
            },400,'easeout');
        } else {
            $(el).attr({cx,cy,r});
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
        var {cx,cy,r} = props;
        var update = false;
        this.animate();
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