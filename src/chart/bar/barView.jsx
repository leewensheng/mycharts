import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Text from '../../elements/text'
import Rect from '../../elements/rect'
import ClipPath from '../../elements/clippath'

import colorHelper from 'cad/color/index'

export default class Bar extends Component {
    constructor(props){
        super(props);
        this.onGridChange = this.onGridChange.bind(this);
        this.toggleToolTip = this.toggleToolTip.bind(this);
        props.chartEmitter.on('grid',this.onGridChange);
        this.state = {
            grid:null,
            hasInited:false,
            bars:[]
        };
    }
    render(){
        var that = this;
        var {props,state} = this;
        var {width,height,seriesModel} = props;
        var seriesOpt = seriesModel.getOption();
        var {grid,hasInited,bars} = state;
        var {seriesColor,visible,seriesIndex,seriesId} = seriesModel;
        var toggleToolTip = this.toggleToolTip;
        var {animation,style,borderRadius,borderColor,borderWidth} = seriesOpt;
        return (
            <g  className="vcharts-series vcharts-bar-series">
                <g className="vcharts-series-points">
                {
                    bars.map(function(bar,index){
                        var {
                            x,
                            y,
                            color,
                            plotX,
                            plotY,
                            plotStart,
                            plotEnd,
                            barWidth,
                            align,
                            startFromAxis,
                            isAdd
                        } = bar;
                        var r =  seriesModel.getPercentMayBeValue(borderRadius,barWidth);
                        var attrs = {
                            className:"vcharts-series-point",
                            rx:r,
                            ry:r,
                            fill:color,
                            stroke:borderColor,
                            strokeWidth:borderWidth,
                            style
                        }
                        return (
                        <BarItem 
                            key={x}
                            index={index}
                            isAdd={isAdd}
                            visible={visible}
                            label={y}
                            animation={animation}
                            plotStart={plotStart}
                            plotEnd={plotEnd}
                            barWidth={barWidth}
                            startFromAxis={startFromAxis}
                            align={align}
                            toggleToolTip={toggleToolTip}
                            attrs={attrs}
                        />
                        )
                    })
                }
                </g>
            </g>
        );
    }
    onGridChange(grid){
        var {props,state} = this;
        if(grid.seriesIndex == this.props.seriesIndex) {
            var bars = props.seriesModel.getBars(grid);
            if(state.hasInited) {
                bars = bars.map(function(bar,index){
                    if(!state.bars[index]) {
                        bar.isAdd = true;
                    }
                    return bar;
                })
            }
            this.setState({grid,bars,hasInited:true});
            this.forceUpdate();
        }
    }
    toggleToolTip(index,isShow,event){
        var {props,state} = this;
        var point = props.seriesModel.getData()[index];
        var bar = this.state.bars[index];
        var {plotX,plotY} = bar;
        var {props,state} = this;
        props.chartEmitter.emit('toggleToolTip',{
            show:isShow,
            point:point,
            plotX:plotX,
            plotY:plotY,
            event:event
        });
    }
    shouldComponentUpdate(nextProps,nextState){
        if(!nextProps.seriesModel.visible) {
            return true;
        }
        return false;
    }
    componentWillUnmount(){
        var {props,state} = this;
        props.chartEmitter.off('grid',this.onGridChange);
    }
}
class BarItem extends Component {
    constructor(props) {
        super(props);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.state = {
            renderCount:0
        };
    }
    render(){
        var {props,state} = this;
        var {animated,updateType} = state;
        var {animation,isAdd,visible,label,plotStart,plotEnd,startFromAxis,align,barWidth,attrs} = props;
        if(animation && !animated) {
            plotEnd = plotStart;
        }
        if(updateType === 'newProps' || isAdd) {
            animation = true;
        }
        var x,y,width,height;
        if(align === 'vertical') {
            x = Math.min(plotStart.x - barWidth/2,plotStart.x + barWidth/2);
            y = Math.min(plotStart.y,plotEnd.y);
            width = barWidth;
            height = Math.abs(plotStart.y - plotEnd.y);
        } else {
            x = Math.min(plotStart.x,plotEnd.x);
            y = Math.min(plotStart.y - barWidth/2,plotEnd.y + barWidth/2);
            width = Math.abs(plotStart.x - plotEnd.x);
            height = barWidth;
        }
        if(!visible) {
            if(align === 'vertical') {
                width = 0;
            } else {
                height = 0;
            }
        }
        return (
        <g>
            <Rect   
                {...attrs}
                animation={animation}
                x={x}
                y={y}
                width={width}
                height={height}
                onMouseOver={this.handleMouseOver} 
                onMouseMove={this.handleMouseMove} 
                onMouseOut={this.handleMouseOut} 
            />
            <Text  
                animation={animation}
                x={plotEnd.x} 
                y={plotEnd.y} 
                style={{color:"#fff",textAlign:'center',textBaseLine:'middle',display:visible?'':'none'}}>
                {label}
            </Text>
        </g>
        )

    }
    handleMouseOver(event){
        var {props,state} = this;
        var fillColor = this.props.attrs.fill;
        var hoverColor = colorHelper.brighten(fillColor,0.2);
        var el = findDOMNode(this);
        $(el).find('rect').attr('fill',hoverColor);
        props.toggleToolTip(props.index,true,event);
    }
    handleMouseMove(event){
        var {props,state} = this;
        props.toggleToolTip(props.index,true,event);
    }
    handleMouseOut(){
        var {props,state} = this;
        var fillColor = props.attrs.fill;
        var el = findDOMNode(this);
        $(el).find('rect').attr('fill',fillColor);
        props.toggleToolTip(props.index,false,event);
    }
    componentDidMount(){
        this.setState({animated:true});
    }
    componentWillReceiveProps(){
        this.setState({updateType:'newProps'});
    }
}