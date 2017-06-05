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
            data = gridService.getSplitArray(min||dataRange.min,max||dataRange.max,splitNumber);
        }
        var line = {};
        var labels = [];
        var ticks = [];
        var title = {};
        var splitLine = [];
        var base;
        if(axis === 'x') {
            line.x1 = left;
            line.x2 = right;
            if(opposite) {
                base = top;
            } else {
               base = bottom;
            }
            line.y1 = line.y2 = base;
            if(type === 'category') {
                data.map(function(text,index){
                    var x = left + index*width/(data.length-1);
                    var y = base + axisLabel.margin;
                    labels.push({
                        x:x,
                        y:y,
                        text:text,
                        style:{
                            color:'#333',
                            textAlign:'center',
                            textBaseLine:'top',
                            fontSize:13
                        }
                    });
                })
            }
        } else {
            line.y1 =bottom;
            line.y2 = top;
            if(opposite) {
                line.x1 = line.x2 = right;
            } else {
                line.x1 = line.x2 = left;
            }
            if(type === 'value') {
            }
        }
        return {
            line:line,
            labels:labels,
            ticks:ticks,
            title:title
        }
    }
    render(){
        var data = this.getRenderData(this.props);
        var {line,labels,ticks} = data;
        return (
            <g className="vcharts-grid-axis">
                <Line className="vcharts-axis-line" x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} style={line.style} />
                <g class="vcharts-axis-labels">
                {
                    labels.map(function(label){
                        return <DataLabel x={label.x} y={label.y} text={label.text} style={label.style}/>
                    })
                }
                </g>
            </g>
        )
    }
}
module.exports = Axis;