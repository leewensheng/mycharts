import $ from 'jquery'
import {Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import Axis from './axis'
class  Grid extends Component {
    getDefaultProps(){
        return {
            option:{
                    show:false,
                    left:'auto',
                    top:60,
                    right:'10%',
                    bottom:60,
                    width:'auto',
                    height:'auto',
                    background:'transparent'
                    labelWidth:null,
            },
            width:null,//图表宽度
            height:null,//图表高度
            xAxis:[],
            yAxis:[]
        }
    }
    render(){
        var gridLayer = new VNode('g',{className:'vcharts-grid'});
        var props = this.props;
        var {width,height,option,xAxis,yAxis} = props;
        var gridLeft,gridTop,gridWidth,gridHeight;
        gridLeft = option.left;
        gridTop = option.top;
        gridWidth = option.width || (width - gridLeft*2);
        gridHeight = option.height || (height - gridTop*2);
        var paper = new cad.Paper();
        paper.switchLayer(gridLayer);
        //网格背景
        paper.rect(gridLeft,gridTop,gridWidth,gridHeight).attr('fill',option.background);
        for(var i = 0; i < xAxis.length;i++) {
            paper.append(Axis,{
                gridTop:gridTop,
                gridLeft:gridLeft,
                gridWidth:gridWidth,
                gridHeight:gridHeight,
                axis:xAxis[i]
            });
        }
        for(var i = 0; i < yAxis.length;i++) {
            paper.append(Axis,{
                gridTop:gridTop,
                gridLeft:gridLeft,
                gridWidth:gridWidth,
                gridHeight:gridHeight,
                axis:xAxis[i]
            });
        }
        //clip rect
        return gridLayer;
    }
    componentDidMount(){

    }
}
