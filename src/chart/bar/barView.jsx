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
        var {style,borderRadius,borderColor,borderWidth} = seriesOpt;
        var clipId = seriesId + 'clippath';
        var clipPath='url(#' + clipId + ')';
        return (
            <g clipPath={clipPath}  className="vcharts-series vcharts-bar-series">
                {
                hasInited 
                && 
                <ClipPath id={clipId}>
                    <Rect  x={grid.left} y={grid.top} width={grid.width} height={grid.height} />
                </ClipPath>
                }
                
                <g className="vcharts-series-points">
                    {
                        bars.map(function(bar,index){
                            var  {color,barWidth,barLength,plotX,plotY,x,y,rectX,rectY,rectWidth,rectHeight} = bar;
                            var r =  seriesModel.getPercentMayBeValue(borderRadius,Math.min(barLength,barWidth));
                            if(!visible) {
                                grid.reversed ? rectHeight = 0 : rectWidth = 0;
                            }
                            return (
                            <g key={'group'+index}>
                            <BarItem 
                                key={'bar'+index}
                                className="vcharts-series-point" 
                                index={index}
                                x={rectX} 
                                y={rectY} 
                                rx={r}
                                ry={r}
                                width={rectWidth} 
                                height={rectHeight} 
                                fill={color} 
                                stroke={borderColor} 
                                strokeWidth={borderWidth}
                                style={style}
                                toggleToolTip={toggleToolTip}
                             />
                             <Text  key={'label'+index} 
                                    x={rectX + rectWidth/2} 
                                    y={rectY  - 5} 
                                    style={{textAlign:'center',textBaseLine:'bottom',display:visible?'':'none'}}>{y}</Text>
                             </g>
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
            hasInited:false
        };
    }
    render(){
        var {props,state} = this;
        var {hasInited} = state;
        return <Rect    {...props} 
                        onMouseOver={this.handleMouseOver} 
                        onMouseMove={this.handleMouseMove} 
                        onMouseOut={this.handleMouseOut} />

    }
    handleMouseOver(event){
        var {props,state} = this;
        var fillColor = this.props.fill;
        var hoverColor = colorHelper.brighten(fillColor,0.2);
        var el = findDOMNode(this);
        $(el).attr('fill',hoverColor);
        props.toggleToolTip(props.index,true,event);
    }
    handleMouseMove(event){
        var {props,state} = this;
        props.toggleToolTip(props.index,true,event);
    }
    handleMouseOut(){
        var {props,state} = this;
        var fillColor = props.fill;
        var el = findDOMNode(this);
        $(el).attr('fill',fillColor);
        props.toggleToolTip(props.index,false,event);
    }
    componentDidMount(){
        this.setState({hasInited:true});
    }
}