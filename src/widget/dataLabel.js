import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import $ from 'jquery'
//todo 多行支持tspan
var defaultStyle = {
    color:"#333",
    fontSize:13,
    fontFamily:"Microsoft Yahei",
    fontWeight:"normal",
    textAlign:"center",
    textBaseLine:"bottom",
}
class  DataLabel extends Component{
    constructor(props){
        super(props);
        var {x,y} = props;
        this.state = {x,y}
    }
    render(){
        var {text,style} = this.props;
        style = $.extend({},defaultStyle,style);
        var {color,fontSize,fontFamily,fontWeight,textAlign,textBaseLine} = style;
        var {x,y} = this.state;
        var anchor = {
            left:'start',
            right:'end',
            center:'middle',
        };
        var dy = 0;
        if(textBaseLine === 'middle') {
            dy = fontSize/2;
        } else if(textBaseLine === "top") {
            dy = fontSize;
        }
        return (
            <text x={x}
                  y={y}
                  fill={color}
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  fontFamily={fontFamily}
                  textAnchor={anchor[textAlign]}
                  dy={dy}
                  pointerEvents='none'
                  stroke="none">{text.toString()}</text>
        )
    }
    animate(){
        var {x,y,animation} = this.props;
        var {oldX,oldY} = this.state;
        var el = findDOMNode(this);
        if(!animation) {
            $(el).attr('x',x).attr('y',y);
            return;
        }
        $(el).stopTransition(true).transition({x:x,y:y},400,'easeout');
    }
    componentWillReceiveProps(){
        this.setState({update:true})
    }
    shouldComponentUpdate(nextProps,nextState){
        return nextState.update?true:false;
    }
    componentDidUpdate(){
        var {x,y} = this.props;
        this.setState({update:false,x:x,y:y});
        this.animate();
    }
}
DataLabel.defaultProps = {
    animation:true,
    x:0,
    y:0,
    text:'',
    style:null
}
module.exports = DataLabel;