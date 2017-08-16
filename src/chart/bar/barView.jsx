import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Paper from 'cad/paper/index'
import Text from '../../elements/text'
import BarIcon from './icon';
class Linechart extends Component {
    constructor(props){
        super(props);
        this.onLegendChange = this.onLegendChange.bind(this);
        this.onGridChange = this.onGridChange.bind(this);
        this.onLegendHover = this.onLegendHover.bind(this);
        props.chartEmitter.on('grid',this.onGridChange);
        props.chartEmitter.on('legendVisibleToggle',this.onLegendChange);
        props.chartEmitter.on('legend.hoverChange',this.onLegendHover);
        this.state = {
            hasInited:false,
            isGridReady:false,
            visible:props.seriesModel.visible
        };
    }
    render(){
        var that = this;
        var {props,state} = this;
        var {width,height,seriesModel} = props;
        var seriesOpt = seriesModel.getOption();
        var {color,lineWidth,linecap,lineDash,data,xAxis,yAxis,dataLabels,marker} = seriesOpt;
        var {isGridReady,grid,legend,hasInited,visible} = this.state;
        if(!isGridReady) {
            return <g></g>;
        }
    }
    onLegendChange(msg){
        if(msg.seriesIndex == this.props.seriesIndex) {
            this.setState({visible:msg.visible});
        }
    }
    onGridChange(grid){
        if(grid.seriesIndex == this.props.seriesIndex) {
            this.setState({grid,isGridReady:true,hasInited:true});
            this.forceUpdate();
        }
    }
    onLegendHover(msg){
        var {index,eventType} = msg;
        if(index === this.props.seriesIndex) {
            if(eventType === 'mouseover') {
            } else {
            }
        }
    }
    animate(){
    }
    componentDidMount(){
    }
    componentWillReceiveProps(nextProps){
        this.setState({isGridReady:false});
    }
    shouldComponentUpdate(nextProps,nextState){
        return nextState.isGridReady?true:false;
    }
    componentDidUpdate(prevProps,prevState){
        var {props,state} = this;
        if(state.hasInited != prevState.hasInited) {
            this.animate();
        }
    }
    componentWillUnmount(){
        var {props,state} = this;
        props.chartEmitter.off('legendVisibleToggle',this.onLegendChange);
        props.chartEmitter.off('grid',this.onGridChange);
    }
}
Linechart.dependencies = {
    grid:{
        startOnTick:true,
        stackAble:true
    },
    legend:{
        icon:BarIcon
    }
};
module.exports = Linechart;