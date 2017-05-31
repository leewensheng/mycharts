import $ from 'jquery'
import preact,{Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import Grid from './grid'

var defaultOption = {
    grid:{
        left:30,
        top:30,
        width:100,
        height:100,
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
            grids = [{grid:grid,xAxis:[],yAxis:[]}];
        } else {
            grids = grid.map(function(val){
                return {
                    grid:val,
                    xAxis:[],
                    yAxis:[]
                }
            })
        };
        if(!xAxis.length) {
            xAxis = [xAxis]
        } 
        xAxis.map(function(val){
            var gridIndex = val.gridIndex;
            grids[gridIndex].xAxis.push(val);
        })
        if(!yAxis.length) {
            yAxis = [yAxis];
        }
        yAxis.map(function(val){
            var gridIndex = val.gridIndex;
            grids[gridIndex].yAxis.push(val);
        });
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
        var {chartWidth,chartHeight,chartOption} = props;
        var {grids} = this.state;
        return (
        	<g className='vcharts-grids'>
	        {
	        	grids.map(function(grid){
	        	var {top,left,right,bottom,xAxis,yAxis,background} = grid;
		        return <Grid 
		        			background={background}
		        			top={top}
		        			left={left}
		        			right={right}
		        			bottom={bottom}
		        			xAxis={xAxis}
		        			yAxis={yAxis}/>
	        	})
	        }
        	</g>);
    }
    updateLabelSize(){
        var el = findDOMNode(this);
        var labelWidth =0,labelHeight = 0;
        $(el).find('.vcharts-grid-axis .axis-label text').each(function(){
            var width = this.getComputedTextLength();
            labelWidth = Math.max(labelWidth,width);
        });
        this.setState({
            labelWidth:labelWidth,
            updateType:'adjust'
        })
    }
    componentDidMount(){
        this.updateLabelSize();
    }
    componentWillReceiveProps(){
        this.setState({
            updateType:'newprops'
        })
    }
}
module.exports = Grids;