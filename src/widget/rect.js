import preact,{Component,VNode,findDOMNode} from 'preact'
import $ from 'jquery'
//todo 多行支持tspan
class  Rect extends Component{
    getDefaultProps(){
        return {
            x:0,
            y:0,
            width:0,
            height:0,
            style:{
             
            }
        }
    }
    getInitialState(){
        var {x,y,width,height} = this.props;
        return {x,y,width,height}
    }
    render(){
        var {x,y,width,height} = this.state;
        return <rect {...this.props} x={x} y={y} width={width} height={height} />
    }
    animate(nextProps){
        var el = findDOMNode(this);
        $(el).stopTransition(true).transition({
            x:nextProps.x,
            y:nextProps.y,
            width:nextProps.width,
            height:nextProps.height
        },400,'easeout');
    }
    componentWillReceiveProps(nextProps){
        this.animate(nextProps);
    }
    shouldComponentUpdate(nextProps,nextState){
        return false;
    }
}
module.exports = Rect;