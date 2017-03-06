import {Component,VNode,findDOMNode} from 'preact'

class Chart extends Component {
    getInitialState(){
        return this.props.options
    }
    getDefaultProps(){
        return {
            chart:{
                background:""
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
    render(){
        var {chart,options} = this.state.options;
        var series = options.series;
        var svg = new VNode("svg");
        var paper = new cad.Ppaer();
        paper.switchLayer(svg);
        //defs层
        paper.append("defs");
        //设置background
        paper.rect(0,0,"100%","100%").attr("fill",options.background);
        //所有的图表g
        var group = paper.g()//.addClass
        paper.switchLayer(group);
        series.map(function(chartOption,key){
            //是否该在此处切换图层？
            var type = chartOption.type;
            paper.append(Pie,{chart:chart,series:series})
        })
    }
}