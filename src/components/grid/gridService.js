import cad from 'cad'
module.exports = {
    getValueRange(series){
        var mins = [],maxs = [];
        series.map(function(val){
            mins.push(cad.min(val.data));
            maxs.push(cad.max(val.data));

        });
        return {
            min:cad.min(mins),
            max:cad.max(maxs)
        }
    },
    getSplitArray:function(min,max,splitNumber) {
        var absMax = Math.max(Math.abs(min),Math.abs(max));
        var absMin = Math.min(Math.abs(min),Math.abs(max));
        var k = -1;
        var grow;
        var isOk = false;
        var minFlag = min>0?1:-1;
        var maxFlag = max>0?1:-1;
        var realMax,realMin,interval;
        var data = [];
        var interval,tick ,realSplitNumber = splitNumber;
        if(max === min) {
            return [max];
        }
        if(absMax >= 1) {
            while(Math.pow(10,k+1) <= absMax) {
                k++;
            }
            if(k==0) {
                grow = 0.1;
                if(absMax>3) {
                    tick = 1;
                } else {
                    tick = 0.5;
                }
            } else {
                grow = Math.pow(10,k-1)/2;
                tick = grow*5;
            }
            var num = 0;
            var count = 0;
            while(!isOk) {
                count++;
                if(count>1000) {
                    break;
                }
                absMax += grow;
                var maxRate = Math.ceil(absMax / grow);
                absMax = maxRate*grow;
                var minRate = Math.floor(absMin / grow);
                if(minRate!=0) {
                    minRate--;
                }
                absMin = minRate*grow;
                realMax = maxFlag*absMax;
                realMin = minFlag*absMin; 
                interval = (realMax - realMin)/(splitNumber - 1); 
                var maxGap = absMax - Math.abs(max);
                var minGap = 0.2;
                if(absMax%tick == 0 && absMin%tick==0 && (absMin==0 ? true:(absMin<Math.abs(min)))) {
                    if(maxGap/tick>minGap && interval % tick === 0 && absMax%interval=== 0&&absMin%interval===0) {
                        realSplitNumber = splitNumber;
                        isOk = true;         
                    } else {
                        for(var i = 1; i < 3; i++) {
                             realSplitNumber = splitNumber+i;
                             interval = (realMax - realMin) /(realSplitNumber - 1);
                            if(maxGap/tick>minGap && interval  % tick === 0 && absMax%interval=== 0&&absMin%interval===0) {
                                isOk = true;
                                break;
                            } 
                        }
                        if(!isOk) {
                            for(var i = 1; i < 3; i++) {
                                realSplitNumber = splitNumber - i;
                                interval = (realMax - realMin) /(realSplitNumber - 1);
                                if(maxGap/tick>minGap && realSplitNumber > 2 && interval % tick === 0 &&absMax%interval=== 0&&absMin%interval===0) {
                                    isOk = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            for(var i = 0; i < realSplitNumber;i++) {
                data.push(realMin +interval*i);
            }
            return data;
        } else if(absMax < 1 && absMax > 0) {
            while(Math.pow(10,-1*(k+1)) > absMax) {
                k++;
            }
        } else {
            return [0];
        }
         return [1,2,3,4];

    }
}