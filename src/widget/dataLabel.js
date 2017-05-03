import {Component,VNode,findDOMNode} from 'preact'
import $ from 'jquery'
//todo 多行支持tspan
class  DataLabel extends Component{
    getDefaultProps(){
        return {
            x:0,
            y:0,
            text:'',
            style:{
                color:"#333",
                fontSize:13,
                fontFamily:"Microsoft Yahei",
                fontWeight:"normal",
                textAlign:"center",
                textBaseLine:"bottom",
                display:""
            }
        }
    }
    getInitialState(){
        return {
            x:this.props.x,
            y:this.props.y
        }
    }
    render(){
        var {text,style} = this.props;
        style.fontSize = style.fontSize||13;
        var {color,fontSize,fontFamily,fontWeight,textAlign,textBaseLine} = style;
        var {x,y} = this.state;
        var label = new VNode("text");
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
        label.attr("x",x)
             .attr("y",y)
             .text(text)
             .attr("fill",color)
             .attr("text-anchor",anchor[textAlign])
             .attr("dy",dy)
             .css("font-family",fontFamily)
             .attr("font-size",fontSize)  
             .css("font-weight",fontWeight)
             .css("pointer-events","none");
        ;
        return label; 
    }
    animate(){
        var {x,y} = this.props;
        var {oldX,oldY} = this.state;
        var el = findDOMNode(this);
        $(el).transition({x:x,y:y},400,'easeout');
    }
    componentWillReceiveProps(){
        this.setState({update:true})
    }
    componentWillUpdate(){
        $(findDOMNode(this)).stopTransition(true);
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
module.exports = DataLabel;