import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Text from '../../elements/text'
import Circle from '../../elements/circle'
export default class Scatter extends Component {
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
        var {grid,hasInited,points} = state;
        var {seriesColor,visible,seriesIndex} = seriesModel;

        var {style,borderRadius,borderColor,borderWidth} = seriesOpt;
        return (
            <g className="vcharts-series vcharts-bar-series">
                <g className="vcharts-series-points">
                    {
                        points.map(function(point,index){
                          var {plotX,plotY,size,x,y} = point;
                          return <Circle 
                                    key={index}
                          			cx={plotX} 
                          			cy={plotY} 
                          			r={size} 
                          			fill={seriesColor}
                          			stroke={borderColor} 
                          			strokeWidth={borderWidth}
                          		/>
                        })
                    }
                </g>
            </g>
        );
    }
    onGridChange(grid){
        var {props,state} = this;
        if(grid.seriesIndex == this.props.seriesIndex) {
            var points = props.seriesModel.getScatterPoints(grid);
            this.setState({grid,points,hasInited:true});
            this.forceUpdate();
        }
    }
    animate(){
   
    }
    componentDidMount(){
    }
    componentWillReceiveProps(nextProps){
        var points = this.state.points;
        var grid = this.state.grid;
        if(!nextProps.seriesModel.visible && grid) {
            points.map(function(point){
               point.size = 0;
            })
            this.setState({points});
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