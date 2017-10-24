export default class Cord {
    xAxis = null;
    yAxis = null;
    reversed = null;
    cordType = null;
    includeSeries = [];
    constructor(seriesIndex,xAxis,yAxis,reversed,includeSeries){
        this.seriesIndex = seriesIndex;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.reversed = reversed;
        this.includeSeries = includeSeries;
    }
    getOption(){
        return this._option;
    }
    getPointByData(data){
        var {x,y} = data;
        var {reversed,xAxis,yAxis} = this;
        var inCord = true,
            xmin = xAxis.min,
            xmax = xAxis.max,
            ymin = yAxis.min,
            ymax = yAxis.max;
        if(typeof x === 'number') {
            if(reversed) {
                if(x < ymin || x > ymax) {
                    inCord = false;
                } 
            } else {
                if(x < xmin || x > xmax) {
                    inCord = false;
                }
            }
        }
        if(typeof y === 'number') {
            if(reversed) {
                if(y < xmin || y > xmax) {
                    inCord = false;
                } 
            } else {
                if(y < ymin || y > ymax) {
                    inCord = false;
                }
            }
        }
        var plotX,plotY;
        plotX = reversed ? xAxis.getPositionByValue(y) : xAxis.getPositionByValue(x);
        plotY = reversed ? yAxis.getPositionByValue(x) : yAxis.getPositionByValue(y);
        return {plotX,plotY,x,y,inCord};
    }
    getDataByPoint(data){
        var {x,y} = data;
        return {
            x:reversed ? yAxis.getValueByPosition(x) : xAxis.getValueByPosition(x),
            y:reversed ? xAxis.getValueByPosition(y) : yAxis.getValueByPosition(y)
        }
    }
    getPointsByData(seriesData){
        var that = this;
        return seriesData.map(function(data){
            return that.getPointByData(data);
        })
    }
}