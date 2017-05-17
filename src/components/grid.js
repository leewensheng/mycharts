import $ from 'jquery'
import {Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import Axis from './axis'
var defaultOption = {
    grid:{
        left:10,
        top:10,
        width:100,
        height:100,
        background:'pink'
    },
    xAxis:{
        gridIndex:0,
        type:'category'
    },
    yAxis:{
        gridIndex:0,
        type:'value'
    }
}
class  Grid extends Component {
    getDefaultProps(){
        return {
            chartOption:null,
            chartWidth:null,//图表宽度
            chartHeight:null,//图表高度
        }
    }
    render(){
        var gridLayer = new VNode('g',{className:'vcharts-grid'});
        var props = this.props;
        var {chartWidth,chartHeight,chartOption} = props;
        chartOption = $.extend({},defaultOption,chartOption);
        var {grid,xAxis,yAxis,series} = chartOption;
        var grids = [];
        if(!grid.length) {
            grids = [{grid:grid,xAxis:[],yAxis:[]}];
        } else {
            grids = grid.map(function(val){
                return {
                    grid:val,
                    xAxis:[],
                    yAxis:[]
                }
            })
        };
        if(!xAxis.length) {
            xAxis = [xAxis]
        } 
        xAxis.map(function(val){
            var gridIndex = val.gridIndex;
            grids[gridIndex].xAxis.push(val);
        })
        if(!yAxis.length) {
            yAxis = [yAxis];
        }
        yAxis.map(function(val){
            var gridIndex = val.gridIndex;
            grids[gridIndex].yAxis.push(val);
        });

        series.map(function(val){
            var type = val.type;
            var dependencies = [];
            if(dependencies.indexOf('grid')) {
                var data = val.data;
            };
        })
        var paper = new cad.Paper();
        paper.switchLayer(gridLayer);
        grids.map(function(val){
            var {grid,xAxis,yAxis} = val;
            var {top,left,width,height,background} = grid;
            width = chartWidth- 20;
            height = chartHeight  - 20;
            paper.switchLayer(gridLayer);
            paper.rect(top,left,width,height).attr('fill',background);
            xAxis.map(function(axis){
                paper.append(Axis,{
                    top:top,
                    left:left,
                    width:width,
                    height:height,
                    axis:'x'
                })
            });
            yAxis.map(function(axis){
                paper.append(Axis,{
                    top:top,
                    left:left,
                    width:width,
                    height:height,
                    axis:'y'
                })
            });
        });
        return gridLayer;
    }
    componentDidMount(){

    }
}
module.exports = Grid;