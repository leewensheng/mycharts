import $ from 'jquery'
import {Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import DataLabel from '../widget/dataLabel'
class  Axis extends Component {
    getDefaultProps(){
        return {
            top:null,
            left:null,
            width:null,
            height:null,
            axis:'x',
            min:null,
            max:null,
            labelWidth:0,
            labelHeight:0,
            option:{
                gridIndex:0,//所属网格区域
                position:'',//上下左右，多轴时有用
                type:'',//category value time
                min:null,
                max:null,//对于分类轴来说仍然是有意义的
                minRange:null,
                splitNumber:5,//分割段数
                data:null,//分类轴用到
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
        }         
    }
    getInitialState(){
        return {
            min:null,
            max:null,
            isReady:false
        }
    }
    render(){
        var props = this.props;
        var {top,left,width,height,labelWidth,labelHeight,min,max,axis,option} = props;
        var {min,max,position,data,splitNumber,title,axisLine,axisLabel,axisTick} = option||{};
        var paper = new cad.Paper();
        var bottom = top+height,right = left+width;
        var axisLeft = left+labelWidth;
        var axisLayer = new VNode('g',{className:'vcharts-grid-axis xaxis'});
        //先画轴线
        paper.switchLayer(axisLayer);

        var lineLayer = paper.g({className:'axis-line'});
        var labelLaler = paper.g({className:'axis-label'});
        var tickLayer = paper.g({className:'axis-tick'});
        if(axis === 'x') {
            paper.line(left,bottom,right,bottom).attr('stroke','red').attr('stroke-width',3).attr('stroke-dash','');
            data = [1,2,3,4,5];
            splitNumber = data.length-1;
            data.map(function(text,index){
                paper.switchLayer(labelLaler);
                paper.append(DataLabel,{
                    animation:true,
                    x:left+width/(splitNumber)*index,
                    y:bottom,
                    text:text,
                    style:{
                        color:'red',
                        textAlign:'center',
                        textBaseLine:'bottom'
                    }
                })
            })
        } else {
            paper.line(axisLeft,bottom,axisLeft,top).attr('stroke','red').attr('stroke-width',3).attr('stroke-dash','');
            var data = [1,2,3,4000000000,5];
            var splitNumber = data.length-1;
            data.map(function(text,index){
                paper.switchLayer(labelLaler);
                paper.append(DataLabel,{
                    animation:false,
                    x:axisLeft - 8,
                    y:bottom - height/splitNumber*index,
                    text:text,
                    style:{
                        color:'red',
                        textAlign:'right',
                        textBaseLine:'middle'
                    }
                })
            })
        }
        return axisLayer;
    }
}
module.exports = Axis;