import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Paper from 'cad/paper/index'
import Text from '../../elements/text'
import Polyline from '../../elements/polyline'
import Circle from '../../elements/circle'
import ClipPath from '../../elements/clippath'
import Rect from '../../elements/rect'
export default class Linechart extends Component {
    constructor(props){
        super(props);
        this.onGridChange = this.onGridChange.bind(this);
        props.chartEmitter.on('grid',this.onGridChange);
        this.state = {
            hasInited:0,
            points:[]
        };
    }
    render(){
        var that = this;
        var {props,state} = this;
        var {width,height,seriesModel} = props;
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
            <g clipPath={clipPath} className="vcharts-series vcharts-line-series" style={{display:visible?'':'none'}}>
                {
                animation
                &&
                <ClipPath id={clipId}>
                    <Rect  ref="clip" animation={hasInited<2 && animation} x={hasInited?grid.left:0} y={hasInited?grid.top:0} width={hasInited?grid.width:width} height={hasInited?grid.height:height} />
                </ClipPath>
                }
                <Polyline  ref="polyline" className="vcharts-series-polyline" points={polylinePoints}  stroke={color||seriesColor} fill='none'  strokeDasharray={lineDash=='solid'?'':'5,5'} strokeWidth={lineWidth}/>
                <Polyline  ref="fillArea" className="vcharts-series-fillarea" points={fillAreaPoints}  stroke='none' fill={seriesColor} fillOpacity="0.3"/>
                <g className="series-line-labels">
                    {
                        dataLabels.enabled
                        &&
                        points.map(function(point,index){
                            var {x,y,plotX,plotY,polyline,color} = point;
                            return <Text  
                                    key={index}
                                    x={plotX} 
                                    y={plotY - 10}
                                    fill={color} 
                                    style={dataLabels.style} 
                                    >{y}</Text>
                        })
                    }
                </g>
                <g className="series-symbols">
                    {
                        marker.enabled
                        &&
                        points.map(function(point,index){
                            var {x,y,plotX,plotY,polyline,color} = point;
                            return <Circle  
                                        key={index}
                                        cx={plotX} 
                                        cy={plotY} 
                                        r={4} 
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
    animate(grid){
        var animation = this.props.seriesModel.getOption().animation;
        if(!animation) {
            return
        }
        var clip = this.refs.clip;
        var rect = findDOMNode(clip);
        var {left,top,width,height} = grid;
        var ease = 'easeOut',during = 1000;
        if(typeof animation === 'object') {
            ease = animation.ease || ease;
            during = animation.during || during;
        }
        $(rect)
        .attr('x',left)
        .attr('y',top)
        .attr('width',0)
        .attr('height',height)
        .transition({
            width:width
        },during,ease);
    }
    onGridChange(grid){
        var that = this;
        var {props,state} = this;
        var {hasInited} = state;
        if(grid.seriesIndex == this.props.seriesIndex) {
            var points = props.seriesModel.getLinePoints(grid);
            if(!hasInited) {
                this.animate(grid);
            }
            this.setState({grid,points,hasInited:++hasInited});
            this.forceUpdate();
            
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