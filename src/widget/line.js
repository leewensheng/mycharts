import preact,{Component,VNode,findDOMNode} from 'preact'
import $ from 'jquery'
//todo 多行支持tspan
class  Line extends Component{
    getDefaultProps(){
        return {
            x1:0,
            y1:0,
            x2:0,
            y2:0,
            style:{
                color:'#333',
                width:1,
                type:'solid'
            }
        }
    }
    getInitialState(){
        var {x1,y1,x2,y2} = this.props;
        return {x1,y1,x2,y2};
    }
    render(){
        var style = this.props.style||{color:"#333",width:1,type:'solid'};
        var className = this.props.className;
        var {x1,y1,x2,y2} = this.state;
        return <line className={className} x1={x1} y1={y1} x2={x2} y2={y2} stroke={style.color} stroke-width={style.width} /> 
    }
    animate(nextProps){
        var el = findDOMNode(this);
        var style = nextProps.style ||{};
        $(el).attr('stroke',style.color).attr('stroke-width',style.width);
        $(el).stopTransition(true).transition({
            x1:nextProps.x1,
            y1:nextProps.y1,
            x2:nextProps.x2,
            y2:nextProps.y2
        },400,'easeout');
    }
    componentWillReceiveProps(nextProps){
        this.animate(nextProps);
    }
    shouldComponentUpdate(nextProps,nextState){
        return false;
    }
}
module.exports = Line;