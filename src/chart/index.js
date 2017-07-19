import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import namespace from 'cad/namespace'
import charts from './charts'
import Vcomponents from '../components/index'
import $ from 'jquery'
import EventEmitter  from 'events'
import Tooltip from '../components/tooltip/index'
class Core extends Component {
    constructor(props){
        super(props);
        this.chartEmitter = new EventEmitter();
        this.state = {
            props:props
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
            var chartDependencies = Chart.dependencies||{};
            for(var key in chartDependencies) {
                dependencies[key] = false;
            }
        });
        return dependencies;
    }
    render(){
        var state = this.state;
        var props = this.state.props;
        var {width,height,option} = props;
        var {chart,colors,series} = option;
        var {updateType} = this.state;
        var dependencies = this.getDependcies(props);
        var components = [];
        var chartEmitter = this.chartEmitter;
        for(var dependence in dependencies) {
            components.push(dependence);
        };
        return (
            <div className='vcharts-container' style={{fontSize:0,width:width,height:height,overflow:'visible',position:'relative'}}>
                <Tooltip key={'tooltip'} chartEmitter={chartEmitter} chartWidth={width} chartHeight={height} chartOption={option} updateType={updateType}/>
                <svg width={width} height={height} xmlns={namespace.svg} xmlnsXlink={namespace.xlink} >
                    <defs></defs>
                    <rect className="vcharts-background" x="0" y="0" width="100%" height="100%" fill={chart.background}/>
                    {
                        components.map(function(name){
                            var Vcomponent = Vcomponents[name];
                            if(!Vcomponent) {
                                return;
                            }
                            return (
                                <Vcomponent key={name} chartEmitter={chartEmitter} chartWidth={width} chartHeight={height} chartOption={option} updateType={updateType}/>
                            )
                        })
                    }
                    {
                         series.map(function(chartOption,index){
                            var type = chartOption.type;
                            if(!type) {return;}
                            var Chart = charts[type];
                            if(!Chart) {return;}
                            var defaultOption = Chart.defaultOption;
                            chartOption = $.extend(true,{},defaultOption,option.plotOptions.series,option.plotOptions[type],chartOption);
                           return (
                            <Chart
                                key={type+index}
                                option={option} 
                                width={width}
                                height={height}
                                series={chartOption}
                                seriesIndex={index}
                                updateType={updateType}
                                chartEmitter={chartEmitter}
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
        $(el).find('svg').addSVGNamespace();
    }
    componentWillUnmount(){
        this.props.chart.vchart = null;
        this.props.chart = null;
    }
    setOption(nextProps){
        this.setState({
            props:nextProps,
            updateType:'newProps'
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setOption(nextProps);
    }
}
Core.defaultProps = {
    width:600,
    height:400,
    option:null       
}
module.exports = Core;