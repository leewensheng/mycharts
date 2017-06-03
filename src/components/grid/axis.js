import $ from 'jquery'
import preact,{Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import DataLabel from '../../widget/dataLabel'
import Line from '../../widget/line'
const defaultOption = {
    gridIndex:0,//所属网格区域
    position:'',//上下左右，多轴时有用
    type:'',//category value time
    min:null,
    max:null,//对于分类轴来说仍然是有意义的
    minRange:null,
    splitNumber:5,//分割段数
    data:[],//分类轴用到
    inverse:false,//数值反转
    title:{
        show:true,
        align:"start",//start middle end
        margin:0,
        rotation:0,
        style:{
            color:"#666"
        },
        text:"",
    },
    axisLine:{
        show:true,
        lineStyle:{
            color:"#333",
            width:1,
            type:"solid"
        }
    },
    axisTick:{
        show:true,
        interval:"auto",
        inside:false,
        length:5,
        lineStyle:{
            color:"",
            width:1,
            type:"solid",
        }
    },
    axisLabel:{
        show:true,
        interval:'auto',
        inside:false,
        rotate:0,
        margin:8,
        textWidth:null,//强制宽度
        formatter:null,
        style:{
            color:'',
            fontSize:12,
            textAlign:"center",
            textBaseLine:"bottom"
        }
    }
}
class  Axis extends Component {
    getDefaultProps(){
        return {
            top:null,
            left:null,
            right:null,
            bottom:null,
            width:null,
            height:null,
            axis:'x',
            min:null,
            max:null,
            option:null
        }         
    }
    getRenderData(props){
        var {top,left,right,bottom,width,height,axis,min,max,option} = props;
        option = $.extend(true,{},defaultOption,option);
        var {position,type,min,max,minRange,splitNumber,data,inverse,title,axisLabel,axisTick} = option;
        var line = {};
        var labels = [];
        var ticks = [];
        var title = {};
        var splitLine = [];
        var base;
        if(axis === 'x') {
            line.x1 = left;
            line.x2 = right;
            if(position === 'top') {
                base = top;
            } else {
               base = bottom;
            }
            line.y1 = line.y2 = base;
            if(type === 'category') {
                data.map(function(text,index){
                    var x = left + index*width/(data.length-1);
                    var y = base + axisLabel.margin;
                    labels.push({
                        x:x,
                        y:y,
                        text:text,
                        style:{
                            color:'#333',
                            textAlign:'center',
                            textBaseLine:'top',
                            fontSize:13
                        }
                    });
                })
            }
        } else {
            line.y1 =bottom;
            line.y2 = top;
            if(position === 'right') {
                line.x1 = line.x2 = right;
            } else {
                line.x1 = line.x2 = left;
            }
            if(type === 'value') {
            }
        }
        return {
            line:line,
            labels:labels,
            ticks:ticks,
            title:title
        }
    }
    render(){
        var data = this.getRenderData(this.props);
        var {line,labels,ticks} = data;
        return (
            <g className="vcharts-grid-axis">
                <Line className="vcharts-axis-line" x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} style={line.style} />
                <g class="vcharts-axis-labels">
                {
                    labels.map(function(label){
                        return <DataLabel x={label.x} y={label.y} text={label.text} style={label.style}/>
                    })
                }
                </g>
            </g>
        )
    }
}
module.exports = Axis;