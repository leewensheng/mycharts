import {Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import Pie from './pie/pie.js'
import $ from 'jquery'
class Core extends Component {
    getDefaultProps(){
        return  {
            width:600,
            height:400,
            option:null       
        }
    }
    render(){
        //return ''
        var {width,height,option} = this.props;
        var {chart,colors,series} = option;
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
        var group = paper.g();


        series.map(function(chartOption,index){
            paper.switchLayer(group);
            var type = chartOption.type;
            chartOption.index = index;
            var defaultOption = Pie.defaultOption;
            chartOption = $.extend(true,{},defaultOption,chartOption);
            paper.append(Pie,{option :option , width:width,height:height,series : chartOption });
        })
        return svg;
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