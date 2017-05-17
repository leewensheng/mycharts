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
            option:{
                gridIndex:0,//所属网格区域
                position:'',//上下左右，多轴时有用
                type:'',//category value time
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
            max:null,
            labelWidth:null
        }
    }
    render(){

    }
    animate(){

    }
}
module.exports = Axis;