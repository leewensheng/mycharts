import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Text from '../../elements/text'
import Polyline from '../../elements/polyline'
import Circle from '../../elements/circle'
import PathElement from '../../elements/path'

import Path from 'cad/path'

export default class Linechart extends Component {
    constructor(props){
        super(props);
        this.onGridChange = this.onGridChange.bind(this);
        props.chartEmitter.on('grid',this.onGridChange);
        this.state = {
            grid:null,
            hasInited:0,
            visible:props.seriesModel.visible,
            points:[]
        };
    }
    render(){
        var that = this;
        var {props,state} = this;
        var {width,height,seriesModel,chartModel} = props;
        var seriesOpt = seriesModel.getOption();
        var seriesId = seriesModel.seriesId;
        var {type,animation,color,smooth,lineWidth,lineDash,data,xAxis,yAxis,dataLabels,marker} = seriesOpt;
        var {points,grid,hasInited} = this.state;
        var {seriesColor,visible} = seriesModel;
        var polylinePoints = points.map(function(point){
            var x = point.plotX;
            var y = point.plotY;
            return {x,y};
        })
        var stackOnPoints = points.map(function(point){
            var x = point.stackX;
            var y = point.stackY;
            return {x,y};
        }).reverse();
        var linePath = new Path();
        var fillareaPath = new Path();
        if(smooth) {
            linePath.CurveToAll(polylinePoints);
            fillareaPath.CurveToAll(polylinePoints);
            stackOnPoints.length
            &&
            fillareaPath.L(stackOnPoints[0].x,stackOnPoints[0].y).CurveToAll(stackOnPoints)
        } else {
            linePath.LineToAll(polylinePoints);
            fillareaPath.LineToAll(polylinePoints);
            stackOnPoints.length
            &&
            fillareaPath.L(stackOnPoints[0].x,stackOnPoints[0].y).LineToAll(stackOnPoints)
        }
        var clipId = seriesId + 'clippath';
        var clipPath='url(#' + clipId + ')';
        var markerSize = 10;
        var group = null;
        var chartId = chartModel.chartId;
        if(grid) {
            group = chartId + 'xAxis' + grid.xAxis.option.index;
        }
        return (
            <g  clipPath={clipPath} className="vcharts-series vcharts-line-series" >
                {
                animation
                &&
                <clipPath id={clipId}>
                    <rect  ref="clip" animation={hasInited<2 && animation} x={hasInited?(grid.left - markerSize):0} y={hasInited?(grid.top-markerSize):0} width={hasInited?(grid.width+markerSize):width} height={hasInited?(grid.height+markerSize):height} />
                </clipPath>
                }
                <PathElement animation={{group:group}} style={{display:visible?'':'none'}} clipPath={clipPath}  ref="polyline" className="vcharts-series-polyline" d={linePath}  stroke={color||seriesColor} fill='none'  strokeDasharray={lineDash=='solid'?'':'5,5'} strokeWidth={lineWidth}/>
                {
                type === 'area'
                &&
                <PathElement animation={{group:group}} style={{display:visible?'':'none'}} clipPath={clipPath}  ref="fillArea" className="vcharts-series-fillarea" d={fillareaPath}  stroke='none' fill={seriesColor} fillOpacity="0.3"/>
                }
                <g className="series-line-labels">
                    {
                        dataLabels.enabled
                        &&
                        points.map(function(point,index){
                            var {x,y,plotX,plotY,polyline,color,inCord} = point;
                            var labelStyle = {display:inCord&&visible ? '' : 'none'};
                            $.extend(labelStyle,dataLabels.style);
                            return <Text  
                                    key={x}
                                    x={plotX} 
                                    y={plotY - 10}
                                    fill={color} 
                                    style={labelStyle} 
                                    >{y}</Text>
                        })
                    }
                </g>
                <g className="series-symbols" clipPath={clipPath}>
                    {
                        marker.enabled&&false
                        &&
                        points.map(function(point,index){
                            var {x,y,plotX,plotY,polyline,color,inCord} = point;
                            return <Circle  
                                        key={x}
                                        cx={plotX} 
                                        cy={plotY} 
                                        onMouseOver={that.toggleToolTip.bind(that,index,true)}
                                        onMouseOut={that.toggleToolTip.bind(that,index,false)}
                                        r={visible&&inCord?4:0} 
                                        fill="#fff" 
                                        stroke={color} 
                                        strokeWidth="1" 
                                        />
                        })
                    }
                </g>
            </g>
        );
    }
    animate(grid,isStop){
        var animation = this.props.seriesModel.getOption().animation;
        if(!animation) {
            return
        }
        var that = this;
        var el = $(findDOMNode(this));
        var refs = this.refs;
        var clip = refs.clip;
        var rect = findDOMNode(clip);
        var {top,left,right,bottom,reversed} = grid;
        var ease = 'easeOut',during = 1000;
        if(typeof animation === 'object') {
            ease = animation.ease || ease;
            during = animation.during || during;
        }
        var x = left,y = top;
        var width = right - left;
        var height = bottom - top;
        if(!isStop) {
            $(rect).stopTransition().attr({
                x,y,width:reversed?width:0,height:reversed?0:height
            });
        } else {
            $(rect).stopTransition();
            during = 200;
       }
       $(rect).transition({
            x,y,width,height
        },during,ease,function(){
           el.removeAttr('clip-path');
        });
    }
    toggleToolTip(index,isShow,event){
        var {props,state} = this;
        var point = props.seriesModel.getData()[index];
        var plot = this.state.points[index];
        var {plotX,plotY} = plot;
        props.chartEmitter.emit('toggleToolTip',{
            show:isShow,
            point:point,
            plotX:plotX,
            plotY:plotY,
            event:event
        });
    }
    onGridChange(grid){
        var that = this;
        var {props,state} = this;
        var {hasInited,visible} = state;
        if(grid.seriesIndex == this.props.seriesIndex) {
            var points = props.seriesModel.getLinePoints(grid);
            if(!hasInited || !visible) {
                this.animate(grid);
            } else {
                this.animate(grid,true)
            }
            this.setState({grid,points,hasInited:++hasInited,visible:true});
            this.forceUpdate();
            
        }
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.seriesModel.visible) {
            this.setState({visible:false});
        }
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