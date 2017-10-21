export default class Cord {
    xAxis = null;
    yAxis = null;
    reversed = null;
    cordType = null;
    includeSeries = [];
    constructor(xAxis,yAxis,reversed,includeSeries){
        this.xAxis = [];
        this.yAxis = [];
        this.reversed = reversed;
        this.includeSeries = includeSeries;
    }
    getOption(){
        return this._option;
    }
    getPointByData(data){
        var {x,y} = data;
        var {reversed,xAxis,yAxis} = this;
        var plotX,plotY;
        plotX = reversed ? yAxis.getPositionByValue(x):  xAxis.getPositionByValue(x);
        plotY = reversed ? xAxis.getPositionByValue(y) : yAxis.getPositionByValue(y);
        return {plotX,plotY};
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