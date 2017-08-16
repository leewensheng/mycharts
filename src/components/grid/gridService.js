import mathUtils from 'cad/math'
module.exports = {
    getStackedExtreme(series,axis){
        //获取所有series的极值
        var mins = [],maxs = [];
        series.map((val,index)=>{
            var data = this.getStackedData(series,index,axis);
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
    getValues(series){
        var data = series.data;
        return data.map(function(point){
            if(typeof point === 'number') {
                return point;
            } else if(point instanceof Array) {
                return point[1]; 
            } if(typeof point === 'object') {
                return point.y || point.value;
            } else {
                return null;
            }
        })
    },
    getStackedData(series,index,axis){
        var currentSeries = series[index];
        var stack = currentSeries.stack;
        var currentData = this.getValues(currentSeries);
        if(!stack) {
            return currentData;
        }
        for(var i = 0; i < index ; i++) {
            let stackSeries = series[i];
            if(stackSeries.stack !== stack) {
                continue;
            }
            let stackData = this.getValues(stackSeries);
            stackData.map(function(num,index){
                var y = currentData[index]||0;
                y += num;
                currentData[index] = y;
            })
        }
        return currentData;
    },
    getStackedOnData(series,seriesIndex){
        var currentSeries = series[seriesIndex];
        var stack = currentSeries.stack;
        if(!stack) {
            return false;
        }
        var stackedOnData = [];
        for(var i = 0 ;i < seriesIndex;i++) {
            let stackSeries = series[i];
            if(stackSeries.stack === stack) {
                stackSeries.data.map(function(num,index){
                    var y = stackedOnData[index] || 0;
                    y += num;
                    stackedOnData[index] = y;
                })
            }
        }
        return stackedOnData;
    }
}