import $ from 'jquery'
import preact,{Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import gridService from './gridService'
import DataLabel from '../../widget/dataLabel'
import Line from '../../widget/line'
class  Axis extends Component {
    getDefaultProps(){
        return {
            top:null,
            left:null,
            right:null,
            bottom:null,
            width:null,
            height:null,
            axis:'x',
            min:null,
            max:null,
            option:null
        }         
    }
    getRenderData(props){
        var {top,left,right,bottom,width,height,axis,min,max,option} = props;
        var {opposite,type,min,max,dataRange,minRange,splitNumber,data,inverse,title,axisLabel,axisTick} = option;
        var start,end,other;
        if(axis === 'x') {
            start = left;
            end = right;
            other = opposite?top:bottom;
        } else if(axis === 'y') {
            start = bottom;
            end = top;
            other = opposite?right:left;
        }
        if(type === 'value') {
            data = gridService.getSplitArray(min,max,dataRange,splitNumber);
        }
        var ticks = data.map(function(val,index){
            return start + (end - start)*index/(data.length - 1);
        });
        return {
            start:start,
            end:end,
            other:other,
            ticks:ticks
        }
    }
    render(){
        var props = this.props;
        var {top,left,right,bottom,width,height,axis,min,max,option} = props;
        var {data,inverse,title,axisLine,axisLabel,axisTick} = option;
        var renderData = this.getRenderData(props);
        var {start,end,other,ticks} = renderData;
        var x1,y1,x2,y2;
        if(axis === 'x') {
            y1 = y2 = other;
            x1 = start;
            x2 = end;
        } else {
            x1 = x2 = other;
            y1 = start;
            y2 = end;
        };
        var labels = ticks.map(function(val,index){
            var x,y,text;
            text = data[index]||val;
            if(axis === 'x') {
                y = other + axisLabel.margin;
                x = ticks[index];
            } else {
                x = other - axisLabel.margin;
                y  = ticks[index];
            }
            return {x,y,text};
        })
        var className = 'vcharts-grid-axis';
        if(axis === 'x') {
            axisLabel.style.textBaseLine = 'top';
            axisLabel.style.textAlign ='center';
            className += ' xAxis';
        } else {
            className += ' yAxis';
            axisLabel.style.textAlign = 'right';
            axisLabel.style.textBaseLine = 'middle';
        }

        return (
            <g className={className}>
                <Line   className="vcharts-axis-line" 
                        x1={x1} 
                        y1={y1} 
                        x2={x2} 
                        y2={y2} 
                        style={axisLine.lineStyle} />
                <g class="vcharts-axis-labels">
                {
                    labels.map(function(label){
                        return <DataLabel animation={true} x={label.x} y={label.y} text={label.text} style={axisLabel.style}/>
                    })
                }
                </g>
            </g>
        )
    }
}
module.exports = Axis;