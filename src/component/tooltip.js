module.exports = Tooltip;
function Tooltip() {
    this.chart = chart;
    this.series = [];
    this.points = [];
}
function getContent() {
    var points = this.points;
}
Tooltip.prototype = {
    getDefaultOption(){
        return {
            className:"mycharts-tooltip",
            background:"rbba(50,50,50,0.7)",
            borderColor:"#333",
            borderWidth:0,
            padding:"5px",
            hideDelay:100,
            style:{
                color:"#fff",
                cursor:"default",
                fontSize:"12px",
                fontFamily:"sans-serif",
                fontWeight:"normal",
                pointerEvents:"none",
                whiteSpace:"nowrap",
            }
        }
    },
    init(){
        var container = this.chart.container;
        var wrap = document.createElement("div");
        wrap.className = "mycharts-tooltip";
        wrap.style.display = "none";
        wrap.style.position = "absolute";
        wrap.style.background = "rgba(0,0,0,0.3)";
        wrap.style.borderRadius = "5px";
        wrap.style.padding = "12px";
        this.tooltipContainer =wrap;
        container.find(".mychart-container").append(wrap);
    },
    show(chart){
        //chart为一个图表实例
        var html = getContent.call(chart);
        this.tooltipContainer.innerHTML = html;
    },
    hide(){

    },
    update(){

    }
}