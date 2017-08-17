import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import namespace from 'cad/namespace'
import charts from './charts'
import Vcomponents from '../components/index'
import $ from 'jquery'
import EventEmitter  from 'events'
import Tooltip from '../components/tooltip/index'
import ChartModel from '../model/chartModel'
class Core extends Component {
    constructor(props){
        super(props);
        this.chartEmitter = new EventEmitter();
        var dependencies = this.getDependcies(props);
        this.state = {
            props:props,
            dependencies:dependencies
        };
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
        var chartModel = new ChartModel(width,height,option);
        var option = chartModel.getOption();
        var {chart,colors,series} = option;
        var {updateType,dependencies} = this.state;
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
                                <Vcomponent
                                     key={name} 
                                     chartEmitter={chartEmitter} 
                                     chartModel = {chartModel}
                                     chartWidth={width} 
                                     chartHeight={height} 
                                     chartOption={option} 
                                     updateType={updateType}/>
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
                                updateType={updateType}
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
        $(el).find('svg').addSVGNamespace();
    }
    componentWillUnmount(){
        this.props.chart.vchart = null;
        this.props.chart = null;
    }
    setOption(nextProps){
        var dependencies = this.getDependcies(nextProps);
        this.setState({
            props:nextProps,
            dependencies:dependencies,
            updateType:nextProps.updateType||'newProps'
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