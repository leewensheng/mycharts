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
        var points = [];
        var {xAxis,yAxis,reversed} = this;
        var data,x,y,isInside;
        var xmin = xAxis.min,
            xmax = xAxis.max,
            ymin = yAxis.min,
            ymax = yAxis.max;
        for(let i = 0; i < seriesData.length;i++ ) {
            data = seriesData[i];
            x = data.x;
            y = data.y;
            if(typeof x === 'number') {
                if(reversed) {
                    if(x < ymin || x > ymax) {
                        continue;
                    } 
                } else {
                    if(x < xmin || x > xmax) {
                        continue;
                    }
                }
            }
            if(typeof y === 'number') {
                if(reversed) {
                    if(y < xmin || y > xmax) {
                        continue;
                    } 
                } else {
                    if(y < ymin || y > ymax) {
                        continue;
                    }
                }
            }
            points.push(this.getPointByData(data,i));
        }
        return points;
    }
}