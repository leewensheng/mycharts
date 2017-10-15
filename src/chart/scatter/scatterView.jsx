import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Text from '../../elements/text'
import ScatterPoint from './scatterPoint'
export default class Scatter extends Component {
    constructor(props){
        super(props);
        this.onGridChange = this.onGridChange.bind(this);
        this.toggleToolTip = this.toggleToolTip.bind(this);
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
        var {grid,hasInited,points} = state;
        var {seriesColor,visible,seriesIndex} = seriesModel;
        var {animation,symbol,size,style,borderRadius,borderColor,borderWidth,borderType} = seriesOpt;
        return (
            <g className="vcharts-series vcharts-bar-series">
                <g className="vcharts-series-points">
                    {
                        points.map(function(point,index){
                          var {plotX,plotY,size,x,y,color} = point;
                          return <ScatterPoint 
                                    animation={points.length>400?false:animation}
                                    key={index}
                                    index={index}
                          			cx={plotX} 
                          			cy={plotY} 
                          			size={visible?size:0} 
                          			fill={color}
                          			stroke={borderColor} 
                          			strokeWidth={borderWidth}
                                    style={style}
                                    toggleToolTip={that.toggleToolTip}
                          		/>
                        })
                    }
                </g>
            </g>
        );
    }
    toggleToolTip(dataIndex,isShow,mouseEvent){
        var {props,state} = this;
        var {seriesModel} = props;
        var data = seriesModel.getData();
        var point = state.points[dataIndex];
        var {plotX,plotY} = point;
        props.chartEmitter.emit('toggleToolTip',{
            show:isShow,
            point:data[dataIndex],
            plotX:plotX,
            plotY:plotY,
            event:mouseEvent
        });
    }
    onGridChange(grid){
        var {props,state} = this;
        if(grid.seriesIndex == this.props.seriesIndex) {
            var points = props.seriesModel.getScatterPoints(grid);
            this.setState({grid,points,hasInited:true});
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