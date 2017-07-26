import mathUtils from 'cad/math'
module.exports = {
    getValueRange(series){
        var mins = [],maxs = [];
        series.map((val,index)=>{
            var data = this.getStackedData(series,index)
            mins.push(mathUtils.min(data));
            maxs.push(mathUtils.max(data));
        });
        return {
            min:mathUtils.min(mins),
            max:mathUtils.max(maxs)
        }
    },
    getSplitArray:function(min,max,splitNumber,isForceMin,isForceMax) {
        if(min === max) {
            return [max];
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
        return data;
    },
    getCategories(series){
        var data = [];
        if(series.length > 0) {
            data = series[0].data.map(function(val,index){
                if(Array.isArray(val)) {
                    return val[0];
                } else {
                    return index;
                }
            })
        }
    },
    getSeriesDataLength(series){
        var len = 0;
        series.map(function(val){
            var data = val.data ||[];
            len = Math.max(len,data.length);
        });
        return len;
    },
    getStackedData(series,index) {
        var len = this.getSeriesDataLength(series);
        var stackedData = new Array(len);
        stackedData = stackedData.map(function(){
            return null;
        });
        if(index < 0) {
            return stackedData;
        }
        var stack = series[index].stack;
        for(var i = 0; i <= index; i++) {
            if(series[i].stack !== stack && i !== index) {
                continue;
            }
            let data = series[i].data ||[];
            data.map(function(val,index){
                var y = stackedData[index]||0;
                if(typeof val === 'number') {
                    y += val;
                }
                stackedData[index] = y;
            })
        }
        return stackedData;
    }
}