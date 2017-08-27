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
        var {animation,color,lineWidth,linecap,lineDash,data,xAxis,yAxis,dataLabels,marker} = seriesOpt;
        var {points,grid,hasInited} = this.state;
        var {seriesColor,visible} = seriesModel;
        var polylinePoints = points.map(function(point){
            var x = point.plotX;
            var y = point.plotY;
            return {x,y};
        })
        var clipId = seriesId + 'clippath';
        return (
            <g className="vcharts-series vcharts-line-series" clipPath={'url(#' + clipId + ')'} style={{display:visible?'':'none'}}>
                {
                hasInited<2
                &&
                <ClipPath id={clipId}>
                    <Rect animation={animation} x={0} y={0} width={hasInited?width:0} height={height} />
                </ClipPath>
                }
                <Polyline ref="polyline" className="vcharts-series-polyline" points={polylinePoints}  stroke={color||seriesColor} fill='none' strokeLinecap={linecap} strokeDasharray={lineDash=='solid'?'':'5,5'} strokeWidth={lineWidth}/>
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
    onGridChange(grid){
        var that = this;
        var {props,state} = this;
        var {hasInited} = state;
        if(grid.seriesIndex == this.props.seriesIndex) {
            hasInited++;
            var points = props.seriesModel.getLinePoints(grid);
            this.setState({grid,points,hasInited:hasInited});
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