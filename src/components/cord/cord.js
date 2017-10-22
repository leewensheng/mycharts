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
    getPointByData(data,dataIndex){
        var {x,y} = data;
        var {reversed,xAxis,yAxis} = this;
        var plotX,plotY;
        plotX = reversed ? xAxis.getPositionByValue(y) : xAxis.getPositionByValue(x);
        plotY = reversed ? yAxis.getPositionByValue(x) : yAxis.getPositionByValue(y);
        return {plotX,plotY,x,y,dataIndex};
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
        return seriesData.map(function(data,dataIndex){
            return that.getPointByData(data,dataIndex);
        })
    }
}