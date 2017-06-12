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
    getDependcies(props){
        var {option} = props;
        var {series} = option;
        var dependencies = {};
        series.map(function(chartOption,index){
            var type = chartOption.type;
            var Chart = charts[type];
            if(!Chart) {
                return;
            }
            var chartDependencies = Chart.dependencies||[];
            for(var i = 0; i < chartDependencies.length;i++) {
                dependencies[chartDependencies[i]] = false;
            }
        });
        return dependencies;
    }
    getInitialState(){
        var props = this.props;
        return {
            dependencies:this.getDependcies(props),
            dependenceData:{

            }
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
        var {dependencies,dependenceData,updateType} = this.state;
        for(var dependence in dependencies) {
            paper.append(Grids,{
                chartOption:option,
                chartWidth:width,
                chartHeight:height,
                onDependceReady:onDependceReady,
                isReady:dependencies[dependence],
                updateType:updateType
            });
        };
        var group = paper.g({className:'vcharts-series'});
        series.map(function(chartOption,index){
            var type = chartOption.type;
            if(!type) {return;}
            var Chart = charts[type];
            if(!Chart) {return;}
            var chartDependencies = Chart.dependencies||[];
            var dependeData = dependenceData[index]
            if(chartDependencies.length&&!dependeData) return;
            var isDependReady = true;
            for(var i = 0; i < chartDependencies.length;i++) {
                if(!dependencies[chartDependencies[i]]) {
                    isDependReady = false;
                }
            };
            paper.switchLayer(group);
            var defaultOption = Chart.defaultOption;
            chartOption = $.extend(true,{},defaultOption,option.plotOptions.series,option.plotOptions[type],chartOption);
            paper.append(Chart,{
                option :option , 
                width:width,
                height:height,
                series : chartOption,
                serieIndex:index,
                dependciesData:dependeData,
                updateType:updateType,
                isDependReady:isDependReady
            });
        });
        return svg;
    }
    onDependceReady(name,serieIndex,data){
        var {dependencies,dependenceData} = this.state;
        dependencies[name]  = true;
        if(Array.isArray(serieIndex)) {
            serieIndex.map(function(index){
                dependenceData[index] = data;
            })
        } else {
            dependenceData[serieIndex] = data;
        }
        this.setState({
            dependencies,dependenceData,
            updateType:'dependceChange'
        });
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
    setOption(nextProps){
        var dependencies = this.getDependcies(nextProps);
        this.setState({
            dependencies:dependencies,
            updateType:'newProps'
        })
    }
}
module.exports = Core;