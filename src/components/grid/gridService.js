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
        var interval = (max - min)/(splitNumber-1);
        var scale = Math.abs(min/max);
        var rmin,rmax;
        interval = Math.ceil(interval);
        rmax = min  +  interval*splitNumber;
        rmin = 0;
        var arr = [];
        for(var i = 0; i < splitNumber;i++) {
            arr.push(rmin + i*interval);
        }
        return arr;
    }
}