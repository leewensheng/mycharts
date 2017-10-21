import Axis from '../cord/axis'

export default class  GridAxis extends Axis {
    cord = 'grid';
    other = null;
    base = null;
    otherAxisPosition = null;
    grid = null;
    constructor(axis,min,max,option,includeSeries){
        super(axis,min,max,option,includeSeries);
    }
    computedAxisPosition(grid){
        var {top,left,right,bottom} = grid;
        var {type,axis,min,max,splitData,option,includeSeries} = this;
        var {opposite,categories,inverse,startOnTick}  = option;
        var start,end, other,base;
        var startEdge,endEdge;
        if(axis === 'xAxis') {
	        start = startEdge = left;
	        end = endEdge = right;
	        other = opposite ? top : bottom;
	    } else if(axis === 'yAxis') {
	        start = startEdge = bottom;
	        end = endEdge = top;
	        other = opposite?right:left;
	    }
	    base = other;
	    if(inverse) {
	        var tempVar =  start;
	        start  = startEdge = end;
	        end = endEdge = tempVar;
		}
        if(startOnTick && type === 'category') {
            if(categories.length > 1) {
                let gap =  (end - start)/(max - min+1)/2;
                start += gap;
                end -= gap;
            }
        }
        this.grid = grid;
        this.setAxisSide(start,end,other,startEdge,endEdge);
        this.base = base;
        return this;
    }
    getAxisLinePosition(){
        var {axis,startEdge,endEdge,other} = this;
        var x1,y1,x2,y2;
        if(axis === 'xAxis') {
            x1 = startEdge;
            x2 = endEdge;
            y1 = y2 = other;
        } else if(axis === 'yAxis') {
            y1 = startEdge;
            y2 = endEdge;
            x1 = x2 = other;
        }
        return {x1,y1,x2,y2};
    }
    getTicks(){
        var {axis,type,other,interval,ticksPosition,option,includeSeries} = this;
        var {opposite,axisTick,startOnTick} = option;
        var {inside,length} = axisTick;
        var tickFlag = 1;
        var tickOther;
        if(inside) {
            tickFlag *= -1;
        }
        if(opposite) {
            tickFlag *= -1;
        }
        if(axis === 'xAxis') {
            tickOther = other + tickFlag * length;
        } else if(axis === 'yAxis') {
            tickOther = other - tickFlag * length;
        }
        var ticks =  ticksPosition.map(function(position){
            if(type === 'category' && startOnTick) {
                position -= interval / 2;
            }
            var x1,y1,x2,y2;
            if(axis === 'xAxis') {
                x1 = x2 = position;
               y1 = other;
               y2 = tickOther;
            } else if(axis === 'yAxis') {
               y1 = y2 = position;
               x1 = other;
               x2 = tickOther;
            }
            return {x1,x2,y1,y2};
        });
        return ticks;
    }
    getGridLines(){
        var {axis,grid,ticksPosition,otherAxisPosition} = this;
        var lines = [];
        var {top,left,right,bottom} = grid;
         ticksPosition.map(function(position){
             var x1,y1,x2,y2;
            if(Math.abs(position - otherAxisPosition) > 1e-6) {
                if(axis === 'xAxis') {
                    x1 = x2 = position;
                    y1 = bottom;
                    y2 = top;
                } else {
                    y1 = y2=  position;
                    x1 = left;
                    x2 = right;
                }
                lines.push({x1,y1,x2,y2});
            }
        })
        return lines;
    }
    getLabels(){
        var {axis,type,option,other,splitData,base,ticksPosition} = this;
        var {categories,axisLabel,opposite} = option;
        var {inside,margin} = axisLabel;
        var labels = [];
        var labelFlag = 1;
        if(inside) {
            labelFlag *= -1;
        }
        if(opposite) {
            labelFlag *= -1;
        }
        return ticksPosition.map(function(position,index){
            var x,y,text;
            if(axis === 'xAxis') {
                x = position;
                y = base + labelFlag * margin;
            } else {
                y = position;
                x = base - labelFlag * margin;
            }
            if(type === 'category') {
                text  = categories[splitData[index]];
            } else {
                text = splitData[index];
            }
            return {x,y,text};
        })
    }
}