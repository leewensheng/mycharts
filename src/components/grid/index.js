import $ from 'jquery'
import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import Grid from './grid'
export default class  Grids extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        var props = this.props;
        var {chartModel,chartEmitter} = props;
        var component = chartModel.getComponent('grid');
        var grids = component.getGridsData();
        return (
        	<g className='vcharts-grids'>
	        {
	        	grids.map(function(grid,index){
                var  {
                    background,top,left,right,bottom,width,height,
                    containLabel,xAxis,yAxis,includeSeries} = grid;
		        return <Grid 
                            key={index}
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
}
