import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Paper from 'cad/paper/index'
import Text from '../../elements/text'
import Rect from '../../elements/rect'
export default class Bar extends Component {
    constructor(props){
        super(props);
        this.onGridChange = this.onGridChange.bind(this);
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
        var {style} = seriesOpt;
        var {grid,hasInited,bars} = state;
        var {seriesColor,visible,seriesIndex} = seriesModel;
        return (
            <g className="vcharts-series vcharts-bar-series">
                <g className="vcharts-series-points">
                    {
                        bars.map(function(bar,index){
                            var  {color,plotX,plotY,x,y,rectX,rectY,rectWidth,rectHeight} = bar;
                            return (
                            <Rect 
                                className="vcharts-series-point" 
                                key={seriesIndex+index} 
                                x={rectX} 
                                y={rectY} 
                                width={rectWidth} 
                                height={rectHeight} 
                                fill={color} 
                                stroke="#333" 
                                strokeWidth={1}
                                style={style}
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
            this.setState({grid,bars,hasInited:true});
            this.forceUpdate();
        }
    }
    animate(){
        return;
        var el = findDOMNode(this);
        var $bars = $(el).find('.vcharts-series-point');
        $bars.each(function(){
            $(this).transition({
                from:0,
                to:1,
                ease:'easeOut',
                during:400,
                onUpdate(k){
                    var transform = 'scale(' + k + ','+ k+ ')';
                    $(this).attr('transform',transform);
                }
            })
        })
    }
    componentDidMount(){
    }
    componentWillReceiveProps(nextProps){
        var bars = this.state.bars;
        var grid = this.state.grid;
        if(!nextProps.seriesModel.visible && grid) {
            bars = bars.map(function(bar){
                if(!grid.reversed) {
                    bar.rectWidth = 0;
                } else {
                    bar.rectHeight = 0;
                }
                return bar;
            })
            this.setState({bars});
        }
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