import Cord from '../cord/cord.js'
export default class Polar extends Cord {
    cx = null;
    cy = null;
    startAngle = null;
    endAngle = null;
    cord = 'polar';
    constructor(seiresIndex,xAxis,yAxis,reversed,includeSeries){
        super(seiresIndex,xAxis,yAxis,reversed,includeSeries);
    }
    setPolarPosition(cx,cy,startAngle,endAngle) {
        this.cx = cx;
        this.cy = cy;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }
}