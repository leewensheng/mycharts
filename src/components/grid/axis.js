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
            indexInGrid:null,
            option:null
        }         
    }
    getInitialState(){
        return this.getRenderData(this.props);
    }
    getRenderData(props){
        var {top,left,right,bottom,width,height,axis,option} = props;
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
        var splits = data.map(function(val,index){
            return start + (end - start)*index/(data.length - 1);
        });
        return {
            start:start,
            end:end,
            other:other,
            splits:splits,
            data:data
        }
    }
    render(){
        var props = this.props;
        var {top,left,right,bottom,width,height,axis,min,max,option} = props;
        var {opposite,type,min,max,dataRange,minRange,splitNumber,inverse,title,axisLine,axisLabel,axisTick} = option;
        var state = this.state;
        var {start,end,other,splits,data} = state;
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
        var labelFlag = 1;
        if(axisLabel.inside) {
            labelFlag*= -1;
        }
        if(opposite) {
            labelFlag*= -1;
        }
        var labels = splits.map(function(val,index){
            var x,y,text;
            text = data[index];
            if(axis === 'x') {
                y = other + axisLabel.margin*labelFlag;
                x = val;
            } else {
                x = other - axisLabel.margin*labelFlag;
                y  = val;
            }
            return {x,y,text};
        });
        var tickFlag = 1;
        if(axisTick.inside) {
            tickFlag*= -1;
        }
        if(opposite) {
            tickFlag*= -1;
        }
        var ticks = splits.map(function(val,index){
            var x1,y1,x2,y2;
            if(axis === 'x') {
                x1  = x2 = val;
                y1 = other;
                y2 = other + axisTick.length*tickFlag;
            } else {
                y1 = y2 = val;
                x1 = other;
                x2 = other - axisTick.length*tickFlag;
            }
            return {x1,y1,x2,y2};
        })
        var className = 'vcharts-grid-axis';
        if(axis === 'x') {
            axisLabel.style.textBaseLine = labelFlag==1 ? 'top':'bottom';
            axisLabel.style.textAlign ='center';
            className += ' xAxis';
        } else {
            className += ' yAxis';
            axisLabel.style.textAlign = labelFlag==1 ?'right':'left';
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
                <g className="vcharts-axis-labels">
                {
                    labels.map(function(label){
                        return <DataLabel animation={true} x={label.x} y={label.y} text={label.text} style={axisLabel.style}/>
                    })
                }
                </g>
                <g className="vcharts-axis-tick">
                    {
                        ticks.map(function(tick,index){
                            var {x1,y1,x2,y2} = tick;
                           return <Line   
                                    x1={x1} 
                                    y1={y1} 
                                    x2={x2} 
                                    y2={y2} 
                                    style={axisTick.lineStyle} />
                        })
                    }
                </g>
            </g>
        )
    }
    componentWillReceiveProps(nextProps){
        var nextState = this.getRenderData(nextProps);
        this.setState(nextState);
    }
    sendAxisData(){
        var {props,state} = this;
        var {setAxisData,axis,indexInGrid} = props;
        var {index,axisLabel} = props.option
        var labelSize;
        var el = findDOMNode(this);
        if(axisLabel.inside||!axisLabel.show) {
            labelSize = 0;
        } else {
            var labelSize = 0;
            $(el).find('.vcharts-axis-labels text').each(function(index,label){
                var size = label.getComputedTextLength();
                labelSize = Math.max(labelSize,size);
            })
        }
        var {data} = state;
        setAxisData(axis,indexInGrid,{
            data:data,
            index:index,
            maxLabelSize:labelSize
        })
    }
    componentDidMount(){
        this.sendAxisData();
    }
    componentDidUpdate(){
        this.sendAxisData();
    }
}
module.exports = Axis;