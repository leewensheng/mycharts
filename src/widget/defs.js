import {Component,VNode,findDOMNode} from 'preact'
import $ from 'jquery'
import cad from 'cad'

class  Defs extends Component {
    render(){
        return this.props.children;
    }
    componentDidMount(){
        var el = findDOMNode(this);
        var svg = $(el).closest("svg");
        var paper = new cad.Paper(svg.get(0));
        var name = this.props.name;
        if(typeof name === 'string') {
            paper.importDefs(name,this.props);
        } else if(typeof name === 'function') {
            name.call(paper);
        }
        paper.destroy();
    }
    componentWillUnmount(){

    }
}
