import $ from 'jquery'
import {Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
cad.defineShape("pie_connect_line",function(options){
    var {cx,cy,midAngle,radius,x,y,length2,textAlign} = options;
    var path = new cad.Path();
    if(textAlign === "right") {
        length2 *= -1;
    }
    console.log(textAlign)
    path.M(cx,cy).angleMoveTo(midAngle,radius).LineTo(x - length2,y).LineTo(x,y);
    return path;
})
class  ConnectLine extends Component{
    getDefaultProps(){
        return {
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
    }
    getInitialState(){
        var {cx,cy,radius,midAngle,x,y} = this.props;
        return {cx,cy,radius,midAngle,x,y};
    }
    render(){
        var {cx,cy,radius,midAngle,x,y,lineStyle,length2,textAlign} = this.props;
        var vpath = new VNode("path");
        var path = cad.getShapePath("pie_connect_line",{cx,cy,midAngle,radius,x,y,length2,textAlign});
        vpath.attr("d",path.toString())
             .attr("stroke",lineStyle.color)
             .attr("stroke-width",lineStyle.width)
             .attr("stroke-dasharray",lineStyle.dash);
        return vpath;
    }
}
module.exports = ConnectLine;