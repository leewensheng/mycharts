import $ from 'jquery'
import preact,{Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import Axis from './axis'
import seriesService from '../service/seriesService'

var defaultOption = {
    grid:{
        left:30,
        top:30,
        width:100,
        height:100,
        background:'transparent'
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
    getRenderData(props){

    }
    getInitialState(){
        var props = this.props;
        return this.getRenderData(props);
    }
    render(){
        var gridLayer = new VNode('g',{className:'vcharts-grid'});
        var props = this.props;
        var {chartWidth,chartHeight,chartOption} = props;
        chartOption = $.extend({},defaultOption,chartOption);
        var {grid,xAxis,yAxis,series} = chartOption;
        var {labelWidth,labelHeight,updateType}  = this.state;
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
            width = chartWidth- 50;
            height = chartHeight  - 50;
            paper.switchLayer(gridLayer);
            paper.rect(top,left,width,height).attr('fill',background).attr('className','vcharts-grid-background');
            xAxis.map(function(axis,index){
                var range = {};
                if(axis.type === 'value') {
                    var axisSeries = series.filter(function(val){
                        var axisIndex = val.xAxisIndex||0;
                        return index == xAxisIndex;
                    });
                    range = seriesService.getValueRange(axisSeries);
                }
                paper.append(Axis,{
                    top:top,
                    left:left,
                    width:width,
                    height:height,
                    labelWidth:labelWidth,
                    labelHeight:labelHeight,
                    min:range.min,
                    max:range.max,
                    axis:'x',
                    updateType:updateType
                })
            });
            yAxis.map(function(axis,index){
                var range = {};
                if(axis.type === 'value') {
                    var axisSeries = series.filter(function(val){
                        var axisIndex = val.yAxisIndex||0;
                        return index == axisIndex;
                    });
                    range = seriesService.getValueRange(axisSeries);
                }
                paper.append(Axis,{
                    top:top,
                    left:left,
                    width:width,
                    height:height,
                    labelWidth:labelWidth,
                    labelHeight:labelHeight,
                    min:range.min,
                    max:range.max,
                    axis:'y',
                    updateType:updateType
                })
            });
        });
        return gridLayer;
    }
    updateLabelSize(){
        var el = findDOMNode(this);
        var labelWidth =0,labelHeight = 0;
        $(el).find('.vcharts-grid-axis .axis-label text').each(function(){
            var width = this.getComputedTextLength();
            labelWidth = Math.max(labelWidth,width);
        });
        this.setState({
            labelWidth:labelWidth,
            updateType:'adjust'
        })
    }
    componentDidMount(){
        this.updateLabelSize();
    }
    componentWillReceiveProps(){
        this.setState({
            updateType:'newprops'
        })
    }
}
module.exports = Grid;