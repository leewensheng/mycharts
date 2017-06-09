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
        if(min === max) {
            return [max];
        }
        function isGood(a,b){
            a = parseFloat(a);
            b = parseFloat(b);
            if(a%b===0) {
                return true;
            } 
            var c = parseFloat(a/b) - a/b;
            if(Math.abs(c) < 1e-8) {
                return true;
            }
        }
        var oldAbsMax = Math.max(Math.abs(min),Math.abs(max));
        var oldAbsMin = Math.min(Math.abs(min),Math.abs(max));
        var absMin = oldAbsMin;
        var absMax = oldAbsMax;
        var gap = Math.abs(max- min);
        var k = 0;
        var grow;
        var isOk = false;
        var maxFlag,minFlag;
        var isSame = false;
        if(Math.abs(max) >= Math.abs(min)) {
            maxFlag = max>0?1:-1;
            minFlag = min>0?1:-1;
            isSame = true;
        } else {
            maxFlag = min>0?1:-1;
            minFlag = max>0?1:-1;
        }
        var realMax,realMin,interval;
        var data = [];
        var interval,tick ,realSplitNumber = splitNumber;
        var grow = gap/(splitNumber);
        if(max === min) {
            return [max];
        }
        var minTick = gap/(splitNumber);

        var k  = parseInt(Math.log10(minTick));
        var basic = Math.pow(10,k-1)*2.5;
        var scale = Math.ceil(minTick/basic);
        if(scale%2!=0) {
            scale += 1;
        }
        if(scale>4) {
            scale = Math.round(scale/4)*4;
        }
        
        tick = scale*basic;
        var count = 0;
        absMax = Math.floor(absMax/tick)*tick;
        while(!isOk) {
            count++;
            if(count>10) {
                console.log('over time')
                break;
            }
            absMax += grow;
            var maxRate = Math.ceil(absMax / tick);
            absMax = maxRate*tick;
            realMax = maxFlag * absMax;
            realMin = minFlag * absMin;
            interval = Math.abs(realMax - realMin)/(splitNumber-1); 
            interval = Math.floor(interval/tick)*tick;
            if(interval === 0) {
                interval = tick;
            }
            if(!isGood(absMax,interval)) {
                continue;
            }
            var gap = absMax - oldAbsMax;
            if(gap/interval < 0.3) {
                continue;
            }
            realSplitNumber = splitNumber;
            absMin = Math.abs(absMax - (realSplitNumber-1)*interval);
            if(isGood(absMin,interval)) {
                realMin = absMin*minFlag;
                if(interval*(realSplitNumber-1) >= Math.abs(realMax - realMin)) {
                    if(isSame) {
                        if(realMin < min) {
                            isOk = true;
                        }
                    } else {
                        if(realMin > max)  {
                            isOk = true;
                        }
                    }
                }
            }
            if(!isOk){
                for(var i = 1; i < 5; i++) {
                    realSplitNumber = splitNumber+i;
                    absMin = Math.abs(absMax - (realSplitNumber-1)*interval);
                    if(isGood(absMin,interval)) {
                        realMin = absMin*minFlag;
                        if(isGood(interval*(realSplitNumber-1) , Math.abs(realMax - realMin))) {
                            if(isSame) {
                                if(realMin < min) {
                                    isOk = true;
                                }
                            } else {
                                if(realMin > max)  {
                                    isOk = true;
                                }
                            }
                            if(isOk) {
                                break;
                            }
                        }
                    } 
                }
                if(!isOk) {
                    for(var i = 1; i < 5; i++) {
                        realSplitNumber = splitNumber - i;
                        absMin = Math.abs(absMax - (realSplitNumber-1)*interval);
                        if(isGood(absMin,interval)) {
                            realMin = absMin*minFlag;
                            if(isGood(interval*(realSplitNumber-1) , Math.abs(realMax - realMin))&&realSplitNumber>2) {
                                if(isSame) {
                                    if(realMin < min) {
                                        isOk = true;
                                    }
                                } else {
                                    if(realMin > max)  {
                                        isOk = true;
                                    }
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
    }
}