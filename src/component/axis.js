import $ from 'jquery'
import {Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import DataLabel from '../widget/dataLabel'
class  Axis extends Component {
    getDefaultProps(){
        return {
            width:null,//图表宽度
            height:null,//图表高度
            isXAxis:true,
            grid:null,//网格
            option:{
                gridIndex:0,//所属网格区域
                position:'',//上下左右，多轴时有用
                type:'',//category
                min:null,
                max:null,//对于分类轴来说仍然是有意义的
                splitNumber:5,//分割段数
                categories:null,//分类轴用到
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
            max:null
        }
    }
    render(){
        var {width,height,isXAxis,grid,option} = this.props;
        var left,top,right,bottom;
        var type = option.type;
        //需要根据网格来计算出坐标轴的边界
        left = top = 40 ;//应该先绘制Y轴，确定文本宽度
        right = width;
        bottom = height - 10;
        if(!type) {
            if(isXAxis) {
                type = 'category';
            } else {
                type = 'value';
            }
        };
        var axisGroup = new VNode("g",{className:"vcharts-axis"});
        var paper = new cad.Paper();
        var {axisLine,axisLabel,axisTick,categories} = option;
        paper.switchLayer(axisGroup);
        if(axisLine.show) {
            var lineBottom = bottom;
            if(axisLabel.show) {
                lineBottom -= axisLabel.style.fontSize;
                lineBottom -= axisLabel.margin;
            }
            paper.line(0,lineBottom,width,lineBottom)
                 .attr("stroke","#fff"||axisLine.lineStyle.color)
                 .attr("stroke-width",axisLine.lineStyle.width)
        }
        var axisLabel = option.axisLabel;
        if(axisLabel.show) {
            var labelGroup = paper.g({className:"axis-label"});
            var categories = option.categories || ['test','test','test'];
            categories.map(function(label,index){
                //计算文本位置，和网格宽高有关
                var x,y,text,rotation;
                var splitNumber = categories.length;
                if(isXAxis) {
                    x = left + index/(splitNumber-1)*width;
                    y = bottom;
                } else {
                    x = 0;
                    y =  bottom - index*20;
                }
                text = 'label' + index;
                paper.switchLayer(labelGroup);
                paper.append(DataLabel,{
                    x:x,
                    y:y,
                    text:text,
                    style:axisLabel.style
                });
            })
        }
        return axisGroup;
    }
    animate(){

    }
}
module.exports = Axis;