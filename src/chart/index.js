import {Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import charts from './charts'
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
        var state = this.state;
        var props = this.props;
        var {width,height,option} = props;
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
        var dependencies = {};
        series.map(function(chartOption,index){
            var type = chartOption.type;
            var Chart = charts[type];
            if(!Chart) {return;}
            var chartDependencies = Chart.dependencies||[];
            for(var i = 0; i < chartDependencies.length;i++) {
                dependencies[chartDependencies[i]] = true;
            }
        });
        for(var dependence in dependencies) {
            paper.append(Grids,{
                chartOption:option,
                chartWidth:width,
                chartHeight:height,
                onDependceReady:onDependceReady
            });
        };
        var group = paper.g({className:'vcharts-series'});
        series.map(function(chartOption,index){
            var type = chartOption.type;
            if(!type) {return;}
            var Chart = charts[type];
            var chartDependencies = Chart.dependencies||[];
            var dependciesData = state.dependencies[index]
            if(chartDependencies.length&&!dependciesData) return;
            paper.switchLayer(group);
            var defaultOption = Chart.defaultOption;
            chartOption = $.extend(true,{},defaultOption,chartOption);
            paper.append(Chart,{
                option :option , 
                width:width,
                height:height,
                series : chartOption,
                serieIndex:index,
                dependciesData:dependciesData
            });
        });
        return svg;
    }
    onDependceReady(serieIndex,data){
        var dependencies = this.state.dependencies;
        if(Array.isArray(serieIndex)) {
            serieIndex.map(function(index){
                dependencies[index] = data
            });
        } else {
            dependencies[serieIndex] = data;       
        }
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
    componentWillReceiveProps(){
        console.log('33')
    }
}
module.exports = Core;