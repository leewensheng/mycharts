import mathUtils from 'cad/math'
module.exports = {
    getValueRange(series){
        var mins = [],maxs = [];
        series.map(function(val){
            mins.push(mathUtils.min(val.data));
            maxs.push(mathUtils.max(val.data));

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
    }
}