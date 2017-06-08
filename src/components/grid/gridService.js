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
        var oldAbsMax = Math.max(Math.abs(min),Math.abs(max));
        var oldAbsMin = Math.min(Math.abs(min),Math.abs(max));
        var absMin = oldAbsMin;
        var absMax = oldAbsMax;
        var k = -1;
        var grow;
        var isOk = false;
        var maxFlag,minFlag
        if(Math.abs(max) >= Math.abs(min)) {
            maxFlag = max>0?1:-1;
            minFlag = min>0?1:-1;
        } else {
            maxFlag = min>0?1:-1;
            minFlag = max>0?1:-1;
        }
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
                    grow = 0.1;
                    tick = 0.5;
                }
            } else {
                grow = Math.pow(10,k-1)/2;
                tick = grow*5;
            }
            //须根据实际情况求出最小刻度*
            var num = 0;
            var count = 0;
            while(!isOk) {
                count++;
                if(count>10) {
                    break;
                }
                absMax += grow;
                var maxRate = Math.ceil(absMax / tick);
                absMax = maxRate*tick;
                realMax = maxFlag * absMax;
                realMin = minFlag * absMin;
                interval = Math.abs(realMax - realMin)/(splitNumber - 1); 
                interval = Math.floor(interval/tick)*tick;
                if(absMax%interval!==0) {
                    continue;
                }
                var maxGap = absMax - Math.abs(max);
                var minGap = 0.2;
                if(maxGap/tick < minGap) {
                    continue;
                }
                realSplitNumber = splitNumber;
                absMin = Math.abs(absMax - (realSplitNumber-1)*interval);
                if(absMin%interval===0) {
                    if(minFlag == 1) {
                        if(absMin*minFlag<oldAbsMin*minFlag) {
                            isOk = true;
                        }
                    } else {
                        if(absMin*minFlag>oldAbsMin*minFlag) {
                            isOk = true;
                        }
                    }
                }
                if(!isOk){
                    for(var i = 1; i < 5; i++) {
                        realSplitNumber = splitNumber+i;
                        absMin = Math.abs(absMax - (realSplitNumber-1)*interval);
                        if(absMin%interval===0) {
                            if(minFlag == 1) {
                                if(absMin*minFlag < oldAbsMin*minFlag) {
                                    isOk = true;
                                    break;
                                }
                            } else {
                                if(absMin*minFlag>oldAbsMin*minFlag) {
                                    isOk = true;
                                    break;
                                }
                            }
                        } 
                    }
                    if(!isOk) {
                        for(var i = 1; i < 5; i++) {
                            realSplitNumber = splitNumber - i;
                            absMin = Math.abs(absMax - (realSplitNumber-1)*interval);
                            if(absMin%interval===0&&realSplitNumber>2) {
                                if(minFlag == 1) {
                                    if(absMin*minFlag>oldAbsMin*minFlag) {
                                        isOk = true;
                                        break;
                                    }
                                } else {
                                    if(absMin*minFlag < oldAbsMin*minFlag) {
                                        isOk = true;
                                        break;
                                    }
                                }
                            } 
                        }
                    }
                }
                realMin = absMin*minFlag;
            }
            min = Math.min(maxFlag*absMax,minFlag*absMin);
            max = Math.max(maxFlag*absMax,minFlag*absMin);
            for(var i = 0; i < realSplitNumber;i++) {
                data.push(min +interval*i);
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