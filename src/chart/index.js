import {Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import Pie from './pie/pie.js'
import Axis from '../component/axis.js'
import $ from 'jquery'
class Core extends Component {
    getInitialState(){
        return this.props;
    }
    getDefaultProps(){
        return  {
            width:600,
            height:400,
            option: {
                chart:{
                    background:"transparent"
                },
                colors:[
                    "#c23531",
                    "#2f4554",
                    "#61a0a8",
                    "#d48265",
                    "#91c7ae",
                    "#749f83",
                    "#ca8622",
                    "#bda29a",
                    "#6e7074",
                    "#546570",
                    "#c4ccd3"
                ],
                series:[]
            }        
        }
    }
    render(){
        //return ''
        var {width,height,option} = this.state;
        var {chart,colors,series} = option;
        var wrap = new VNode("div",{className:"vcharts-container"});
        //todo 修复连续css
        wrap.attr("style","width:0;position:relative;overflow:visible");
        var paper = new cad.Paper();
        paper.switchLayer(wrap);
        var svg = paper.append("svg",{width,height});
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
        paper.destroy();
        return wrap;
    }
    updateHeight(){
        var el = findDOMNode(this);
        var height = this.props.height;
        $(el).css("height",height);
        $(el).addSVGNamespace();
    }
    componentDidMount(){
        this.props.chart.vchart = this;
        var el = findDOMNode(this);
        $(el).find("svg").addSVGNamespace();
    }
    componentWillUnmount(){
        this.props.chart.vchart = null;
        this.props.chart = null;
    }
    componentDidUpdate(){
        this.updateHeight();
        this.props.vchart = this;
    }
}
module.exports = Core;