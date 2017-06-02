import $ from 'jquery'
import preact,{Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'

class Linechart extends Component {
    getDefaultProps(){

    }
    getInitialState(){

    }
    render(){
        var props = this.props;
        var state = this.state;
        var {width,height,series,option,dependciesData} = this.props;
        var {data} = series;
        var {left,top,right,bottom,width,height,width} = dependciesData;
        var points = [];
        var len = data.length;
        data.map(function(val,index){
            var x = left + index*width/(len-1);
            var y = bottom  - val*3;
            points.push(x + ',' + y);
        });
        return (
            <g className="vcharts-series line">
                <polyline points={points.join(' ')}  stroke="red" stroke-width="2" fill="none"/>
            </g>
        );
    }
    animate(){

    }
}
Linechart.dependencies = ['grid'];
module.exports = Linechart;