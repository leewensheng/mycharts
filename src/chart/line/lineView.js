import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Text from '../../elements/text'
import Polyline from '../../elements/polyline'
import Circle from '../../elements/circle'
import ClipPath from '../../elements/clippath'
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
        var {animation,color,lineWidth,lineDash,data,xAxis,yAxis,dataLabels,marker} = seriesOpt;
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
        })
        var fillAreaPoints = polylinePoints.concat(stackOnPoints.reverse());
        var clipId = seriesId + 'clippath';
        var clipPath='url(#' + clipId + ')';
        return (
            <g  clipPath={clipPath} className="vcharts-series vcharts-line-series" >
                {
                animation
                &&
                <ClipPath id={clipId}>
                    <rect  ref="clip" animation={hasInited<2 && animation} x={hasInited?grid.left:0} y={hasInited?grid.top:0} width={hasInited?grid.width:width} height={hasInited?grid.height:height} />
                </ClipPath>
                }
                <Polyline style={{display:visible?'':'none'}} clipPath={clipPath}  ref="polyline" className="vcharts-series-polyline" points={polylinePoints}  stroke={color||seriesColor} fill='none'  strokeDasharray={lineDash=='solid'?'':'5,5'} strokeWidth={lineWidth}/>
                <Polyline style={{display:visible?'':'none'}} clipPath={clipPath}  ref="fillArea" className="vcharts-series-fillarea" points={fillAreaPoints}  stroke='none' fill={seriesColor} fillOpacity="0.3"/>
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
                <g className="series-symbols">
                    {
                        marker.enabled
                        &&
                        points.map(function(point,index){
                            var {x,y,plotX,plotY,polyline,color,inCord} = point;
                            return <Circle  
                                        key={x}
                                        cx={plotX} 
                                        cy={plotY} 
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
        if(isStop) {
            $(rect).stopTransition().attr({x,y,width,height});
            return;
        }
        $(rect).stopTransition().attr({
            x,y,width:reversed?width:0,height:reversed?0:height
        }).transition({
            x,y,width,height
        },during,ease,function(){
           el.removeAttr('clip-path');
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