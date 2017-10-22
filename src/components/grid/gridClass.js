import Cord from '../cord/cord.js'
export default class Grid extends Cord {
    top = null;
    left = null;
    right = null;
    bottom = null;
    width = null;
    height = null;
    cord = 'grid';
    constructor(seiresIndex,xAxis,yAxis,reversed,includeSeries){
        super(seiresIndex,xAxis,yAxis,reversed,includeSeries);
    }
    setGridRect(top,left,right,bottom) {
        this.top = top;
        this.left = left;
        this.right = right;
        this.bottom = bottom;
        this.width = Math.abs(right - left);
        this.height = Math.abs(bottom - top);
    }
}