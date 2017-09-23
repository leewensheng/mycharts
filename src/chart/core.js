import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import namespace from 'cad/namespace'
import charts from './charts'
import Vcomponents from '../components/index'
import $ from 'jquery'
import EventEmitter  from 'events'
import Tooltip from '../components/tooltip/index'
import ChartModel from '../model/chartModel'
import Gradient from '../elements/gradient'
import Paper from 'cad/paper/index'

export default class Core extends Component {
    constructor(props){
        super(props);
        var chartEmitter = new EventEmitter();
        var {width,height,option} = props;
        var chartModel = new ChartModel(width,height,option);
        this.onLegendVisibleToggle = this.onLegendVisibleToggle.bind(this);
        this.refresh = this.refresh.bind(this);
        this.chartEmitter = chartEmitter;
        this.state = {chartModel};
        this.initEvents();
    }
    static defaultProps = {
        width:600,
        height:400,
        option:null       
    };

    render(){
        var state = this.state;
        var {chartModel} = state;
        var width = chartModel.getWidth();
        var height = chartModel.getHeight();
        var chartEmitter = this.chartEmitter;
        var option = chartModel.getOption();
        var {gradients} = chartModel;
        return (
            <div className='vcharts-container' style={{fontSize:0,width:"100%",height:height,overflow:'hidden',position:'relative'}}>
                <Tooltip key={'tooltip'} chartEmitter={chartEmitter} chartModel={chartModel}/>
                <svg width={width} height={height} xmlns={namespace.svg} xmlnsXlink={namespace.xlink} style={{userSelect:'none',fontSize:12,fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif'}}>
                    <desc>created by liws</desc>
                    <defs>
                        {
                            gradients.map(function(gradient,index){
                                return <Gradient key={'gradient'+index} id={chartModel.getGradientId(index)} {...gradient} />
                            })
                        }
                    </defs>
                    <rect className="vcharts-background" x="0" y="0" width="100%" height="100%" fill={option.chart.background}/>
                    {
                        chartModel.components.map(function(componentModel){
                            var name = componentModel.type;
                            var Vcomponent = Vcomponents[name];
                            if(!Vcomponent) {
                                return;
                            }
                            return (
                                <Vcomponent
                                     key={name} 
                                     chartEmitter={chartEmitter} 
                                     chartModel = {chartModel}
                                     componentModel={componentModel}
                                />
                            )
                        })
                    }
                    {
                         chartModel.mapSeries(function(seriesModel){
                            var seriesIndex = seriesModel.seriesIndex;
                            var type = seriesModel.type;
                            if(!type) {return;}
                            var Chart = charts[type];
                            if(!Chart) {return;}
                           return (
                            <Chart
                                key={type+seriesIndex}
                                option={option} 
                                width={width}
                                height={height}
                                seriesIndex={seriesIndex}
                                chartEmitter={chartEmitter}
                                chartModel={chartModel}
                                seriesModel={seriesModel}
                            />
                            )
                        })
                    }
                </svg>
            </div>
        )
    }
    componentDidMount(){
        this.props.chart.vchart = this;
        var el = findDOMNode(this);
        var $svg = $(el).find('svg');
        $svg.addSVGNamespace();
        var paper = new Paper($svg[0]);
        paper.importDefs('shadow',{
            blur:2,
            offsetX:0,
            offsetY:0
        });
    }
    componentWillUnmount(){
        this.props.chart.vchart = null;
        this.props.chart = null;
    }
    setOption(nextProps){
        var {width,height,option} = nextProps;
        var {chartModel} = this.state;
        chartModel.update(width,height,option);
        this.setState({chartModel});
    }
    onLegendVisibleToggle(msg){
        var {chartModel} = this.state;
        var {seriesIndex,dataIndex} = msg;
       var seriesModel = chartModel.getSeriesByIndex(seriesIndex);
       if(!seriesModel.multipleLegend) {
            seriesModel.visible = !(seriesModel.visible)
       } else {
            var data = seriesModel.getOption().data[dataIndex];
            data.visible = !data.visible;
       }
       this.setState({chartModel});
    }
    componentWillReceiveProps(nextProps) {
        this.setOption(nextProps);
    }
    componentWillUnmount(){
        this.chartEmitter.removeAllListeners();
    }
    initEvents() {
        this.chartEmitter.on('legendVisibileToggle',this.onLegendVisibleToggle);
        this.chartEmitter.on('refresh',this.refresh);
    }
    refresh(){
        this.setState({});
    }
    resize(width,height){
        var {chartModel} = this.state;
        chartModel.width =  width;
        chartModel.height = height;
        this.setState({chartModel});
    }
}
