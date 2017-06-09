import $ from 'jquery'
import preact,{Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import DataLabel from '../../widget/dataLabel'
import defaultOption from './option'
class Linechart extends Component {
    getDefaultProps(){

    }
    getInitialState(){

    }
    render(){
        var props = this.props;
        var state = this.state;
        var {width,height,series,option,dependciesData} = this.props;
        var {data,xAxisIndex,yAxisIndex,dataLabels} = series;
        var {left,top,right,bottom,width,height,width,xAxis,yAxis} = dependciesData;
        var points = [];
        var yAxisData,xAxisData;
        yAxis.map(function(axis){
            if(axis.index === yAxisIndex) {
                yAxisData = axis;
            }
        });
        xAxis.map(function(axis){
            if(axis.index === xAxisIndex) {
                xAxisData = axis;
            }
        })
        var min = yAxisData.data[0],max = yAxisData.data[yAxisData.data.length-1];
        var scale = (max - min)/height;
        var len = xAxisData.data.length;
        data.map(function(val,index){
            var x = left + index*width/(len-1);
            var y = bottom  - (val-min)/scale;
            points.push({x,y});
        });
        var polyline = points.map(function(p){
            return p.x+','+ p.y;
        }).join(' ');
        return (
            <g className="vcharts-series line">
                <polyline points={polyline}  stroke="red" stroke-width="2" fill="none"/>
                <g className="series-labels">
                    {
                        data.map(function(value,index){
                            var x = points[index].x;
                            var y = points[index].y;
                            return <DataLabel  
                                    x={x} 
                                    y={y - 5} 
                                    text={value} 
                                    style={dataLabels.style}/>
                        })
                    }
                </g>
                <g className="series-symbols">

                </g>
            </g>
        );
    }
    animate(){

    }
}
Linechart.defaultOption = defaultOption;
Linechart.dependencies = ['grid'];
module.exports = Linechart;