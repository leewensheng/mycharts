import $ from 'jquery'
import React,{Component} from 'react'
import Path from 'cad/path'
import shape from 'cad/shape'
import PathElement from '../../elements/path'
shape.defineShape("pie_connect_line",function(options){
    var {cx,cy,midAngle,radius,x,y,leadLength,textAlign} = options;
    var path = new Path();
    if(textAlign === "right") {
        leadLength *= -1;
    }
    path.M(cx,cy).angleMoveTo(midAngle,radius).LineTo(x - leadLength,y).LineTo(x,y);
    return path;
})
class  ConnectLine extends Component{
    render(){
        var {cx,cy,radius,midAngle,x,y,leadLength,lineStyle,textAlign} = this.props;
        var d = shape.getShapePath("pie_connect_line",{cx,cy,midAngle,radius,x,y,leadLength,textAlign},true);
        return <PathElement d={d} fill="none" pathShape={{name:'pie_connect_line',config:{cx,cy,midAngle,radius,x,y,leadLength,textAlign}}} stroke={lineStyle.color} strokeWidth={lineStyle.width} />
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
    leadLength:20,
    textAlign:null,
    lineStyle:{
        color:null,
        width:null,
        dash:0
    }
}
module.exports = ConnectLine;