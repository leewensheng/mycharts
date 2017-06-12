import $ from 'jquery'
import preact,{Component,VNode,findDOMNode} from 'preact'
import Paper from 'cad/paper'
import DataLabel from '../../widget/dataLabel'
import Polyline from './polyline'
import Circle from '../../widget/circle'
import defaultOption from './option'
class Linechart extends Component {
    render(){
        var that = this;
        var props = this.props;
        var state = this.state;
        var {width,height,series,option,dependciesData} = props;
        var {data,xAxisIndex,yAxisIndex,dataLabels} = series;
        var {left,top,right,bottom,width,height,width,xAxis,yAxis} = dependciesData;
        var points = [];
        var xyData = this.getDependenyData();
        var {xAxisData,yAxisData} = xyData;
        var min = yAxisData.data[0],max = yAxisData.data[yAxisData.data.length-1];
        var scale = (max - min)/height;
        var len = xAxisData.data.length;
        data.map(function(val,index){
            var x = left + index*width/(len-1);
            var y = bottom  - (val-min)/scale;
            points.push({x,y});
        });
        return (
            <g className="vcharts-series vcharts-line-series">
                <Polyline points={points}  stroke='red' fill='none' stroke-width='1'/>
                <g className="series-line-labels">
                    {
                        data.map(function(value,index){
                            var x = points[index].x;
                            var y = points[index].y;
                            return <DataLabel  
                                    animation={true}
                                    x={x} 
                                    y={y - 10} 
                                    text={value} 
                                    style={dataLabels.style}/>
                        })
                    }
                </g>
                <g className="series-symbols">
                    {
                        data.map(function(value,index){
                            var x = points[index].x;
                            var y = points[index].y;
                            return <Circle  cx={x} cy={y} r={4} fill="#fff" stroke="red" stroke-width="1" 
                                            onMouseOver={that.animateSymbol}
                                            onMouseOut={that.animateSymbol} />
                        })
                    }
                </g>
            </g>
        );
    }
    animateSymbol(e){
        var r = 4;
        if(e.type === 'mouseover') {
            r = 6;
        }
        $(e.target).stopTransition().transition({r:r},400,'elasticOut');
    }
    getDependenyData(){
        var props = this.props;
        var {dependciesData,series} = props;
        var {xAxisIndex,yAxisIndex,dataLabels} = series;
        var {xAxis,yAxis} = dependciesData;
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
        return {xAxisData,yAxisData};
    }
    componentDidMount(){
        this.animate();
    }
    shouldComponentUpdate(nextProps){
        if(!nextProps.isDependReady) {
            return false;
        } else {
            return true;
        }
    }
    animate(){
        var {state,props} = this;
        var {option,dependciesData} = props;
        var {top,left,width,height} = dependciesData;
        var el = findDOMNode(this);
        var {serieIndex} = props;
        var svg = $(el).closest("svg").get(0);
        var paper = new Paper(svg);
        var clip = paper.clipPath(function(){
            paper.rect(top,left,0,height);
        });
        clip.attr("id","line-clip"+serieIndex);
        $(el).attr("clip-path","url(#line-clip"+ serieIndex +")");
        var rect = clip.find("rect");
        $(el).find('.series-line-labels').hide();
        rect.transition({width:width},1000,'linear',function(){
            clip.remove();
            $(el).removeAttr('clip-path');
            $(el).find('.series-line-labels').show();
        });
        paper.destroy();
    }
}
Linechart.defaultOption = defaultOption;
Linechart.dependencies = ['grid'];
module.exports = Linechart;