import Cord from '../cord/cord.js'
export default class Grid extends Cord {
    top = null;
    left = null;
    right = null;
    bottom = null;
    width = null;
    height = null;
    constructor(xAxis,yAxis,reversed,includeSeries){
        super(xAxis,yAxis,reversed,includeSeries);
    }
    setGridRect(top,left,right,bottom) {
        this.top = top;
        this.left = left;
        this.right = right;
        this.bottom = bottom;
    }
}