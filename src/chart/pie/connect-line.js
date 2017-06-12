import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Path from 'cad/path'
import shape from 'cad/shape'
import {interpolate} from 'cad/interpolate'
shape.defineShape("pie_connect_line",function(options){
    var {cx,cy,midAngle,radius,x,y,length2,textAlign} = options;
    var path = new Path();
    if(textAlign === "right") {
        length2 *= -1;
    }
    path.M(cx,cy).angleMoveTo(midAngle,radius).LineTo(x - length2,y).LineTo(x,y);
    return path;
})
class  ConnectLine extends Component{
    render(){
        var {cx,cy,radius,midAngle,x,y,length2,lineStyle,textAlign} = this.props;
        var d = shape.getShapePath("pie_connect_line",{cx,cy,midAngle,radius,x,y,length2,textAlign}).toString();
        return <path d={d} 
                    stroke={lineStyle.color} 
                    strokeWidth={lineStyle.width} 
                    strokeDasharray={lineStyle.dash} />
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.updateType === "select") {
            return;
        }
        var {lineStyle,textAlign} = nextProps;
        var interpolateFunc = interpolate(this.props,nextProps);
        var el = findDOMNode(this);
        var that = this;
        $(el).attr("stroke",lineStyle.color)
             .attr("stroke-width",lineStyle.width)
             .attr("stroke-dasharray",lineStyle.dash);
        if(!nextProps.animation) {
            onUpdate.call(el,1);
            return;
        }
        $(el).stopTransition();
        $(el).transition({
            from:0,
            to:1,
            ease:"easeout",
            during:400,
            onUpdate:onUpdate
        });
        function onUpdate(k){
            var val = interpolateFunc(k);
            var {cx,cy,radius,midAngle,x,y,length2} = val;
            var path = shape.getShapePath("pie_connect_line",{cx,cy,radius,midAngle,x,y,length2,textAlign});
            $(el).attr("d",path);
        }
    }
    shouldComponentUpdate(){
        return false;
    }
}
ConnectLine.defaultProps =  {
    animation:false,
    cx:null,
    cy:null,
    radius:null,
    midAngle:null,
    x:null,
    y:null,
    length2:20,
    textAlign:null,
    lineStyle:{
        color:null,
        width:null,
        dash:0
    }
}
module.exports = ConnectLine;