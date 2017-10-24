
export default class Axis {
    index = null;
    type = null;
    axis = null;
    min = null;
    max = null;
    realMin = null;
    realMax = null;
    start = null;
    end = null;
    interval = null;
    tick = null;
    option = null;
    includeSeries = [];
    cord = null;
    unit = null;
    constructor(axis,min,max,option,includeSeries){
        var realMin = min;
        var realMax = max;
        var {type,categories} = option;
        var isforceMin = typeof option.min === 'number' && option.min !== realMin;
        var isforceMax = typeof option.max === 'number' && option.max !== realMax;
        if(option.forceExtreme) {
            isforceMin = true;
            isforceMax = true;
        }
        var splitData = [];
        var tick;
        min = isforceMin ? option.min : min;
		max = isforceMax ? option.max : max;
        if(type === 'value') {
            let splitInfo = this._getSplitInfo(min,max,option.splitNumber,isforceMin,isforceMax);
            splitData = splitInfo.data;
            tick = splitInfo.tick;
			min = splitData[0];
			max = splitData[splitData.length-1];
        } else if(type === 'category') {
            splitData = categories.map(function(val,index){
                return index;
            });
            if(min < 0 || typeof min !== 'number') {
                min = 0;
            }
            if(max > splitData.length - 1 || typeof max !== 'number') {
                max = splitData[splitData.length-1];
            }
            splitData = splitData.slice(Math.round(min),Math.round(min)+Math.round(max-min)+1);
            let categoryMin = splitData[0];
            let categoryMax = splitData[splitData.length-1];
            min = categoryMin;
            max = categoryMax;
            if(categoryMin !== categoryMax) {
                tick = (categoryMax - categoryMin) / (splitData.length - 1);
            }
        }
        this.option = option;
        this.index = option.index;
        this.type = option.type;
        this.axis = axis;
        this.min = min;
        this.max = max;
        this.realMin = realMin;
        this.realMax = realMax;
        this.splitData = splitData;
        this.tick = tick;
        this.includeSeries = includeSeries;
    }
    setAxisSide(start,end,other,startEdge,endEdge) {
        var that = this;
        var {min,max,splitData,tick} = this;
        this.start = start;
        this.end = end;
        this.other = other;
        this.startEdge = startEdge;
        this.endEdge = endEdge;
        if(min === max) {
            this.interval = (startEdge + endEdge)/2;
        } else {
            this.interval = tick / (max - min) * (end - start);
        }
        this.unit = end >= start ? 1:-1;
        this.ticksPosition = splitData.map(function(val){
            return that.getPositionByValue(val);
        })
    }
    getPositionByValue(val){
        var {min,max,start,end} = this;
        if(min === max) {
            return (start + end) / 2;
        }
        if(typeof val === 'number') {
            return start + (val - min) / (max - min) * (end - start);
        }
        return this.otherAxisPosition;
    }
    getPositionsByData(data){
        var that = this;
        return data.map(function(){
            return that.getPositionByValue(val);
        });
    }
    getValueByPosition(pos){
        var {min,max,start,end} = this;
        if(min === max) {
            return min;
        }
        return min + (pos - start) / (end - start) * (max - min);
    }
    getChangeByDistance(d) {
        var {min,max,start,end} = this;
        if(start === end) {
            return 0;
        }
        return (max - min)*d/(end - start);
    }
    _getSplitInfo(min,max,splitNumber,isforceMin,isforceMax) {
        if(min === max) {
        	if(min === null) {
            	return {data:[],tick:null};
        	} else {
            	return {data:[min],tick:null};
        	}
        }
        var gap =  max - min;
        var data = [];
        var realMax,realMin;
        var tick = gap /(splitNumber-1);
        var k = Math.ceil(Math.log(tick)/Math.log(10));
        var minTick = 0.25*Math.pow(10,k);
        var n   = Math.log(tick/minTick)/Math.log(2);
        n = Math.round(n);
        tick = Math.pow(2,n)*minTick;
        realMax = Math.round(max/tick)*tick;
        realMin = Math.round(min/tick)*tick;
        if(realMax < max) {
            realMax += tick;
        } 
        if(realMin > min) {
            realMin -= tick;
        }
        splitNumber = (realMax - realMin) / tick +1;
        for(var i = 0;i < splitNumber; i++){
            data.push(realMin + tick*i);
        }
        if(isforceMin) {
        	data[0] = min;
        }
        if(isforceMax) {
        	data[data.length - 1] = max;
        }
        return {data,tick};
    }
}