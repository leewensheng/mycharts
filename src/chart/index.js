import {Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import Pie from './pie/pie'
import $ from 'jquery'
import Grids from '../components/grid/index'
class Core extends Component {
    getDefaultProps(){
        return  {
            width:600,
            height:400,
            option:null       
        }
    }
    getInitialState(){
        return {
            dependencies:{}
        }
    }
    render(){
        //return ''
        var {width,height,option} = this.props;
        var {chart,colors,series} = option;
        var onDependceReady = this.onDependceReady.bind(this);
        var paper = new cad.Paper();
        var svg = new VNode("svg",{width,height})
                    .attr("xmlns",cad.namespace.svg)
                    .attr("xmlns:xlink",cad.namespace.xlink)
        paper.switchLayer(svg);
        //defs层
        paper.append("defs");
        //设置background
        paper.rect(0,0,"100%","100%").attr("fill",chart.background);
        //所有的图表g
        var group = paper.g({className:'vcharts-series'});
        var dependencies = {};
        series.map(function(chartOption,index){
            var chartDependencies = Pie.dependencies||[];
            for(var i = 0; i < chartDependencies.length;i++) {
                dependencies[chartDependencies[i]] = true;
            }
            return;
            paper.switchLayer(group);
            var type = chartOption.type;
            chartOption.index = index;
            var defaultOption = Pie.defaultOption;
            chartOption = $.extend(true,{},defaultOption,chartOption);
            paper.append(Pie,{option :option , width:width,height:height,series : chartOption,serieIndex:index});
        });
        for(var dependence in dependencies) {
            paper.append(Grids,{
                chartOption:option,
                chartWidth:width,
                chartHeight:height,
                onDependceReady:onDependceReady
            });
        };
        return svg;
    }
    onDependceReady(serieIndex,data){
        console.log(data)
        var dependencies = this.state.dependencies;
        dependencies[serieIndex] = data;
        this.setState({dependencies:dependencies});
    }
    componentDidMount(){
        this.props.chart.vchart = this;
        delete this.props.chart;
        var el = findDOMNode(this);
        $(el).find("svg").addSVGNamespace();
    }
    componentWillUnmount(){
        this.props.chart.vchart = null;
        this.props.chart = null;
    }
}
module.exports = Core;