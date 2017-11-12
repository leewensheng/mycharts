import $ from 'jquery'
import React,{Component} from 'react'
import BarItem from './barItem'
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
        var {animation,style,borderRadius,borderColor,borderWidth,dataLabels} = seriesOpt;
        var clipId = seriesId + 'clippath';
        var clipPath='url(#' + clipId + ')';
        return (
            <g clipPath={clipPath} className="vcharts-series vcharts-bar-series">
                {
                    grid&&
                    <clipPath id={clipId}>
                    <rect x={grid.left} y={grid.top} width={grid.right - grid.left} height={grid.bottom-grid.top} />
                    </clipPath>
                }
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
                            barLength,
                            reversed,
                            startFromAxis,
                            isAdd,
                            inCord
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
                            valueAxis={grid.reversed?grid.xAxis:grid.yAxis}
                            index={index}
                            isAdd={isAdd}
                            visible={visible}
                            inCord={inCord}
                            label={y}
                            dataLabels={dataLabels}
                            animation={animation}
                            plotStart={plotStart}
                            plotEnd={plotEnd}
                            barWidth={barWidth}
                            startFromAxis={startFromAxis}
                            reversed={reversed}
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