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
        };
    },
    getSplitArray:function(min,max,dataRange,splitNumber) {
        return [1,2,3,4];
    }
}