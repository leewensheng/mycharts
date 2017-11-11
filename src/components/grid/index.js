import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Grid from './grid'
export default class  Grids extends Component {
    constructor(props) {
        super(props);
        var {chartModel,chartEmitter} = props;
        var component = chartModel.getComponent('grid');
        var grids = component.getGridsData();
        this.onAxisZoom = this.onAxisZoom.bind(this);
        chartEmitter.on('axisZoom',this.onAxisZoom);
        this.state = {grids};
    }
    render(){
        var {props,state} = this;
        var {chartModel,chartEmitter} = props;
        var {grids} = state;
        return (
        	<g className='vcharts-grids'>
	        {
	        	grids.map(function(grid,index){
                var  {
                    background,top,left,right,bottom,width,height,
                    containLabel,xAxis,yAxis,includeSeries} = grid;
		        return <Grid 
                            key={index}
                            index={index}
		        			background={background}
		        			top={top}
		        			left={left}
                            right={left + width}
                            bottom={top + height}
		        			width={width}
		        			height={height}
                            containLabel={containLabel}
		        			xAxis={xAxis}
		        			yAxis={yAxis}
                            chartEmitter={chartEmitter}
                            includeSeries={includeSeries}
                            />
	        	})
	        }
        	</g>);
    }
    onAxisZoom(zoomAxis){
        var {props,state} = this; 
        var {grids} = state;
        var {chartModel} = props;
        var component = chartModel.getComponent('grid');
        var chartOpt = chartModel.getOption();
        zoomAxis.map(function(axisData){
            var {index,axis,min,max} = axisData;
            var axisOpt = chartOpt[axis][index];
            axisOpt.min = min;
            axisOpt.max = max;
        });
        var grids = chartModel.getComponent('grid').getGridsData();
        this.setState({grids});
    }
    componentWillReceiveProps(nextProps){
        var grids = nextProps.chartModel.getComponent('grid').getGridsData();
        this.setState({grids});
    }
    componentWillUnmount(){
        this.chartEmitter.off('axisZoom',this.onAxisZoom);
    }
}
