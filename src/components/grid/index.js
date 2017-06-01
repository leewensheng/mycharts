import $ from 'jquery'
import preact,{Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import Grid from './grid'

var defaultOption = {
    grid:{
        left:30,
        top:30,
        width:400,
        height:300,
        background:'transparent'
    },
    xAxis:{
        gridIndex:0,
        type:'category'
    },
    yAxis:{
        gridIndex:0,
        type:'value'
    }
}
class  Grids extends Component {
    getDefaultProps(){
        return {
            chartOption:null,
            chartWidth:null,//图表宽度
            chartHeight:null,//图表高度
            onDependceReady:null
        }
    }
    getRenderData(props){
    	//todo 计算出grid的大小，和各axis的值范围
        var {chartWidth,chartHeight,chartOption} = props;
        var {grid,xAxis,yAxis,series} = chartOption;
        var grids = [];
        if(!grid) {
            grid = defaultOption.grid;
        }
        if(!xAxis) {
            xAxis = defaultOption.xAxis;
        }
        if(!yAxis) {
            yAxis = defaultOption.yAxis;
        };
        if(!grid.length) {
            grids = [{option:grid,xAxis:[],yAxis:[]}];
        } else {
            grids = grid.map(function(val){
                return {
                    option:val,
                    xAxis:[],
                    yAxis:[]
                }
            })
        };
        if(!xAxis.length) {
            xAxis = [xAxis]
        } 
        xAxis.map(function(val){
            val = $.extend(true,{},defaultOption.xAxis,val);
            var gridIndex = val.gridIndex;
            grids[gridIndex].xAxis.push(val);
        })
        if(!yAxis.length) {
            yAxis = [yAxis];
        }
        yAxis.map(function(val){
            val = $.extend(true,{},defaultOption.yAxis,val);
            var gridIndex = val.gridIndex;
            grids[gridIndex].yAxis.push(val);
        });
        grids.map(function(grid){
            grid.option = $.extend({},defaultOption.grid,grid.option);
        })
        return {
            grids:grids
        }
    }
    getInitialState(){
        var props = this.props;
        return this.getRenderData(props);
    }
    render(){
        var props = this.props;
        var {chartWidth,chartHeight,chartOption,onDependceReady} = props;
        var {grids} = this.state;
        return (
        	<g className='vcharts-grids'>
	        {
	        	grids.map(function(grid){
	        	var {xAxis,yAxis,option} = grid;
                var {top,left,width,height,background} = option;
                var right = left +width;
                var bottom = top + height;
		        return <Grid 
		        			background={background}
		        			top={top}
		        			left={left}
                            right={right}
                            bottom={bottom}
		        			width={width}
		        			height={height}
		        			xAxis={xAxis}
		        			yAxis={yAxis}
                            onDependceReady={onDependceReady}
                            />
	        	})
	        }
        	</g>);
    }
}
module.exports = Grids;