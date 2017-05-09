import $ from 'jquery'
import {Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
cad.defineShape("pie_connect_line",function(options){
    var {cx,cy,midAngle,radius,x,y,length2,textAlign} = options;
    var path = new cad.Path();
    if(textAlign === "right") {
        length2 *= -1;
    }
    path.M(cx,cy).angleMoveTo(midAngle,radius).LineTo(x - length2,y).LineTo(x,y);
    return path;
})
class  ConnectLine extends Component{
    getDefaultProps(){
        return {
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
    }
    render(){
        var {cx,cy,radius,midAngle,x,y,length2,lineStyle,textAlign} = this.props;
        var vpath = new VNode("path");
        var path = cad.getShapePath("pie_connect_line",{cx,cy,midAngle,radius,x,y,length2,textAlign});
        vpath.attr("d",path.toString())
             .attr("stroke",lineStyle.color)
             .attr("stroke-width",lineStyle.width)
             .attr("stroke-dasharray",lineStyle.dash);
        return vpath;
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.updateType === "select") {
            return;
        }
        var {lineStyle,textAlign} = nextProps;
        var interpolate = cad.interpolate(this.props,nextProps);
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
            var val = interpolate(k);
            var {cx,cy,radius,midAngle,x,y,length2} = val;
            var path = cad.getShapePath("pie_connect_line",{cx,cy,radius,midAngle,x,y,length2,textAlign});
            $(el).attr("d",path);
        }
    }
    shouldComponentUpdate(){
        return false;
    }
}
module.exports = ConnectLine;