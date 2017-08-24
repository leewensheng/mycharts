import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Paper from 'cad/paper/index'
import Text from '../../elements/text'
import Polyline from '../../elements/polyline'
import Circle from '../../elements/circle'
export default class Linechart extends Component {
    constructor(props){
        super(props);
        this.onGridChange = this.onGridChange.bind(this);
        props.chartEmitter.on('grid',this.onGridChange);
        this.state = {
            hasInited:false,
            points:[]
        };
    }
    render(){
        var that = this;
        var {props,state} = this;
        var {width,height,seriesModel} = props;
        var seriesOpt = seriesModel.getOption();
        var {color,lineWidth,linecap,lineDash,data,xAxis,yAxis,dataLabels,marker} = seriesOpt;
        var {points,grid,hasInited} = this.state;
        var {seriesColor,visible} = seriesModel;
        var polylinePoints = points.map(function(point){
            var x = point.plotX;
            var y = point.plotY;
            return {x,y};
        })
        return (
            <g className="vcharts-series vcharts-line-series" style={{display:visible?'':'none'}}>
                <Polyline className="vcharts-series-polyline" points={polylinePoints}  stroke={color||seriesColor} fill='none' strokeLinecap={linecap} strokeDasharray={lineDash=='solid'?'':'5,5'} strokeWidth={lineWidth}/>
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
                                        onMouseOver={that.animateSymbol}
                                        onMouseOut={that.animateSymbol} />
                        })
                    }
                </g>
            </g>
        );
    }
    animateSymbol(e){
        var r = 4;
        if(e.type === 'mouseover') {
            r = 6;
        }
        $(e.target).stopTransition().transition({r:r},400,'elasticOut');
    }
    onGridChange(grid){
        var that = this;
        var {props,state} = this;
        if(grid.seriesIndex == this.props.seriesIndex) {
            var points = props.seriesModel.getLinePoints(grid);
            this.setState({grid,points,hasInited:true});
            this.forceUpdate();
        }
    }
    animate(){
        var {props,state} = this;
        var {option} = props;
        var {grid} = state;
        var {top,left,width,height} = grid;
        var el = findDOMNode(this);
        var {seriesIndex} = props;
        var svg = $(el).closest("svg").get(0);
        var paper = new Paper(svg);
        var clip = paper.clipPath(function(){
            paper.rect(left,top,0,height);
        });
        clip.attr("id","line-clip"+seriesIndex);
        $(el).attr("clip-path","url(#line-clip"+ seriesIndex +")");
        var rect = clip.find("rect");
        $(el).find('.series-line-labels').hide();
        rect.transition({width:width},600,'linear',function(){
            clip.remove();
            $(el).removeAttr('clip-path');
            $(el).find('.series-line-labels').show();
        });
        paper.destroy();
    }
    componentDidMount(){
    }
    shouldComponentUpdate(nextProps,nextState){
        if(!nextProps.seriesModel.visible) {
            return true;
        }
        return false;
    }
    componentDidUpdate(prevProps,prevState){
        var {props,state} = this;
        if(state.hasInited != prevState.hasInited) {
            this.animate();
        }
    }
    componentWillUnmount(){
        var {props,state} = this;
        props.chartEmitter.off('grid',this.onGridChange);
    }
}