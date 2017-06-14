import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import cad from 'cad'
import namespace from 'cad/namespace'
import charts from './charts'
import $ from 'jquery'
import Grids from '../components/grid/index'
class Core extends Component {
    constructor(props){
        super(props);
        this.state = {
            props:props,
            dependencies:this.getDependcies(props),
            dependenceData:{

            }
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
            var chartDependencies = Chart.dependencies||[];
            for(var i = 0; i < chartDependencies.length;i++) {
                dependencies[chartDependencies[i]] = false;
            }
        });
        return dependencies;
    }
    render(){
        var state = this.state;
        var props = this.state.props;
        var {width,height,option} = props;
        var {chart,colors,series} = option;
        var onDependceReady = this.onDependceReady.bind(this);
        var {dependencies,dependenceData,updateType} = this.state;
        var components = [];
        for(var dependence in dependencies) {
            components.push({
                name:dependence,
                chartOption:option,
                chartWidth:width,
                chartHeight:height,
                onDependceReady:onDependceReady,
                isReady:dependencies[dependence],
                updateType:updateType
            });
        };
        return (
            <svg width={width} height={height} xmlns={namespace.svg} xmlnsXlink={namespace.xlink} >
                <defs></defs>
                <rect x="0" y="0" width="100%" height="100%" fill={chart.background} className="vcharts-background"/>
                {
                    components.map(function(component){
                        var name = component.name;
                        return (
                            <Grids key={name} {...component}/>
                        )
                    })
                }
                {
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
                        var defaultOption = Chart.defaultOption;
                        chartOption = $.extend(true,{},defaultOption,option.plotOptions.series,option.plotOptions[type],chartOption);
                       
                       return (
                        <Chart
                            key={index}
                            option={option} 
                            width={width}
                            height={height}
                            series={chartOption}
                            serieIndex={index}
                            dependciesData={dependeData}
                            updateType={updateType}
                            isDependReady={isDependReady}
                        />
                        )
                    })
                }
            </svg>
        )
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
        //delete this.props.chart;
        var el = findDOMNode(this);
        $(el).addSVGNamespace();
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