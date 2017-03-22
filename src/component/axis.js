import $ from 'jquery'
import {Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import DataLabel from '../../widget/dataLabel'
class  Axis extends Component {
    getDefaultProps(){
        return {
            width:width,//图表宽度
            height:height,//图表高度
            grid:null,
            isXAxis:true,
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
                    formatter:null,
                    style:{
                        color:''
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
        //需要根据网格来计算出坐标轴的边界
        left = top =0 ;
        right = width;
        bottom = height;
        var axisGroup = new VNode("g");
        var paper = new cad.paper();
        paper.switchLayer(axisGroup);
        var axisLabel = option.axisLabel;
        if(axisLabel.show) {
            var labelGroup = paper.g();
            var categories = option.categories;
            categories.map(function(label,index){
                //计算文本位置，和网格宽高有关
                var x,y,text,rotation;
                if(isXAxis) {
                    x = left + index*20;
                    y = 0;
                } else {
                    x = 0;
                    y =  bottom + index*20;
                }
                paper.switchLayer(labelGroup);
                paper.append(DataLabel,{
                    x:x,
                    y:y
                })
            })
        }
    }
    animate(){

    }
}