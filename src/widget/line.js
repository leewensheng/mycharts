import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'
import browser from 'cad/browser'
//todo 多行支持tspan
class  Line extends Component{
    constructor(props) {
        super(props);
        var {x1,y1,x2,y2} = props;
        this.state =  {x1,y1,x2,y2};
    }
    render(){
        var style = this.props.style||{color:"#333",width:1,type:'solid'};
        var className = this.props.className;
        var {x1,y1,x2,y2} = this.state;
        var transform = "";
        if(browser.msie) {
            transform = 'translate(0.5,0.5)';
        }
        return <line  transform={transform} style={{shapeRendering:"optimizeSpeed"}} x1={x1} y1={y1} x2={x2} y2={y2} stroke={style.color} fill="none" strokeWidth={style.width}/> 
    }
    animate(nextProps){
        var el = findDOMNode(this);
        var style = nextProps.style ||{};
        $(el).attr('stroke',style.color).attr('stroke-width',style.width);
        $(el).stopTransition().transition({
            x1:nextProps.x1,
            y1:nextProps.y1,
            x2:nextProps.x2,
            y2:nextProps.y2
        },400,'easeout');
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.update === false) {
            return false;
        }
        this.animate(nextProps);
    }
    shouldComponentUpdate(nextProps,nextState){
        return false;
    }
}
Line.defaultProps = 
{
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
module.exports = Line;