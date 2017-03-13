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
        var {x,y} = this.state;
        var label = new VNode("text");
        var anchor = {
            left:'start',
            right:'end',
            center:'middle',
        };
        var dy = 0;
        if(style.textBaseLine === 'middle') {
            dy = style.fontSize/2;
        } else if(style.textBaseLine === "top") {
            dy = style.fontSize;
        }
        label.attr("x",x)
             .attr("y",y)
             .text(text)
             .attr("fill",style.color)
             .attr("text-anchor",anchor[style.textAlign])
             .attr("dy",dy)
             .css("font-family",style.fontFamily)
             .attr("font-size",style.fontSize)  
             .css("font-weight",style.fontWeight)
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
        //$(findDOMNode(this)).stopTransition(true);
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