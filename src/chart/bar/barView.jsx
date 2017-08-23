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
            isGridReady:false
        };
    }
    render(){
        var that = this;
        var {props,state} = this;
        var {width,height,seriesModel} = props;
        var seriesOpt = seriesModel.getOption();
        var {isGridReady,grid,hasInited} = this.state;
        var {seriesColor,visible,seriesIndex} = seriesModel;
        if(!hasInited) {
            return <g></g>;
        }

        var bars = seriesModel.getBars(grid);
        return (
            <g className="vcharts-series vcharts-bar-series">
                <g>
                    {
                        bars.map(function(bar,index){
                            var  {color,plotX,plotY,x,y,rectX,rectY,rectWidth,rectHeight} = bar;
                            return (
                            <Rect key={seriesIndex+index} x={rectX} y={rectY} width={rectWidth} height={rectHeight} fill={color} stroke="#333" strokeWidth={1} />
                            )
                        })
                    }
                </g>
            </g>
        );
    }
    onGridChange(grid){
        if(grid.seriesIndex == this.props.seriesIndex) {
            this.setState({grid,isGridReady:true,hasInited:true});
            this.forceUpdate();
        }
    }
    animate(){
    }
    componentDidMount(){
    }
    componentWillReceiveProps(nextProps){
        this.setState({isGridReady:false});
    }
    shouldComponentUpdate(nextProps,nextState){
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