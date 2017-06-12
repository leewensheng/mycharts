import $ from 'jquery'
import preact,{Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import Grid from './grid'
import defaultOption  from './option'
import charts from '../../chart/charts'
import gridService from './gridService'
class  Grids extends Component {
    getDefaultProps(){
        return {
            chartOption:null,
            chartWidth:null,//图表宽度
            chartHeight:null,//图表高度
            onDependceReady:null,
            isReady:false
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
            xAxis = defaultOption.axis;
        }
        if(!yAxis) {
            yAxis = defaultOption.axis;
        };
        if(!grid.length) {
            grids = [{option:grid,xAxis:[],yAxis:[]}];
        } else {
            grids = grid.map(function(val){
                return {
                    option:val,
                    xAxis:[],
                    yAxis:[],
                    includeSeries:[]
                }
            })
        };
        if(!xAxis.length) {
            xAxis = [xAxis]
        } 
        xAxis = xAxis.map(function(val,index){
            val = $.extend(true,{},defaultOption.axis,val);
            var gridIndex = val.gridIndex;
            val.index = index;
            grids[gridIndex].xAxis.push(val);
            return val;
        })
        if(!yAxis.length) {
            yAxis = [yAxis];
        }
        yAxis = yAxis.map(function(val,index){
            val = $.extend(true,{},defaultOption.axis,val);
            var gridIndex = val.gridIndex;
            val.index = index;
            grids[gridIndex].yAxis.push(val);
            return val;
        });
        grids.forEach(function(grid){
            var {xAxis,yAxis,option} = grid;
            grid.option = $.extend({},defaultOption.grid,option);
            if(xAxis.length >= 2) {
                xAxis[1].opposite  =  !xAxis[0].opposite;
            }
            if(yAxis.length >= 2) {
                yAxis[1].opposite = !xAxis[0].opposite;
            }
            var isValueType = grid.xAxis.some(function(axis){return axis.type === 'value'});
            grid.yAxis.forEach(function(axis){
                axis.type = isValueType ? 'category' :'value';
                if(yAxis.length>=2) {
                    axis.hasOpposite = true;
                }
            });
            grid.xAxis.forEach(function(axis){
                axis.type = isValueType ?'value':'category';
                if(xAxis.length>=2) {
                    axis.hasOpposite = true;
                }
            });
            grid.valueAxis = isValueType?'x':'y';
        });
        setAxisDataRange(xAxis,'xAxis');
        setAxisDataRange(yAxis,'yAxis');
        function setAxisDataRange(someAxis,key){
            someAxis.map(function(axis){
                var type = axis.type;
                var axisIndex = axis.index;
                var gridIndex = axis.gridIndex;
                var grid = grids[gridIndex];
                var arr = [];
                var includeSeries = series.filter(function(serie,index){
                    var type = serie.type;
                    var chart = charts[type];
                    if(!type||!chart) {
                        return;
                    }
                    var dependencies = chart.dependencies||[];
                    if(dependencies.indexOf('grid') === -1) {
                        return;
                    }
                    var isInclude = (serie[key]||0) === axisIndex;
                    if(isInclude) {
                        arr.push(index);
                        return isInclude;
                    }
                });
                if(type === 'value') {
                    var dataRange = gridService.getValueRange(includeSeries);
                    axis.dataRange = dataRange;
                }
                grid.includeSeries = arr;
            });
        }
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
	        	var {xAxis,yAxis,option,includeSeries} = grid;
                var {top,left,bottom,right,background} = option;
                var width = chartWidth - right - left;
                var height = chartHeight - bottom - top;
		        return <Grid 
		        			background={background}
		        			top={top}
		        			left={left}
                            right={left + width}
                            bottom={top + height}
		        			width={width}
		        			height={height}
		        			xAxis={xAxis}
		        			yAxis={yAxis}
                            onDependceReady={onDependceReady}
                            includeSeries={includeSeries}
                            />
	        	})
	        }
        	</g>);
    }
    shouldComponentUpdate(nextProps){
        return !nextProps.isReady;
    }
    componentWillReceiveProps(nextProps){
        this.setState(this.getRenderData(nextProps));
    }
}
module.exports = Grids;