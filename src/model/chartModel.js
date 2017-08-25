import $ from 'jquery'
import seriesModels from '../chart/models'
import componentModels from '../components/models'
export default class ChartModel {
	constructor(width,height,option){
        this.constructor.chartId++;
        this.chartId = this.constructor.chartId;
		this.init(width,height,option);
	}
    static chartId = 0;
    defaultOption = {
        chart:{
            background:'transparent',
            animation:true
        },
        colors:[
            "#c23531",
            "#2f4554",
            "#61a0a8",
            "#d48265",
            "#91c7ae",
            "#749f83",
            "#ca8622",
            "#bda29a",
            "#6e7074",
            "#546570",
            "#c4ccd3"
        ],
        plotOptions:{
            series:{
                name:'',
                animation:true,
                stack:null,
                visible:true,
                showInLegend:true
            }
        },
        series:[]
    };
	init(width,height,option){
        this.width = width;
        this.height = height;
        this.originalOption = option;
        this.option = option;
        this.series = [];// series models;
        this.components = []; //components models;
        this.gradients = [];

        this.mergetDefaultOption();
        this.initSeriesModels();
        this.initComponentsModels();
        this.initGradients();
	}
    //支持背景图
    initGradients(){
        var that = this;
        var option = this.getOption();
        var {colors} = option;
        colors = colors.map(function(color){
            return that.addGradientColor(color);
        })
        option.colors = colors;
        this.eachSeries(function(seriesModel){
           var seriesColor = that.addGradientColor(seriesModel.seriesColor);
            var seriesOpt = seriesModel.getOption();
            seriesOpt.seriesColor = seriesColor;
            seriesModel.seriesColor = seriesColor;
            if(seriesOpt.color) {
                seriesOpt.color = that.addGradientColor(seriesOpt.color);
            }
            seriesModel.mapData(function(point){
                if(point.color) {
                    point.color = that.addGradientColor(point.color);
                }
            })
        })
    }
    addGradientColor(color){
        var {gradients,chartId} = this;
        if(typeof color !== 'object') {
            return color;
        }
        var index = gradients.indexOf(color);
        if( index === -1) {
            gradients.push(color);
            index = gradients.length - 1;
            this.gradients = gradients;
            return 'url(#' + this.getGradientId(index) + ')';
        } else {
            return 'url(#' + this.getGradientId(index) + ')';
        }
    }
    update(width,height,nextOption,notMerge){
        var {prevOption} = this;
        if(!notMerge) {
            nextOption = $.extend(true,{},prevOption,nextOption);
        } 
        this.init.call(this,width,height,nextOption);
    }
    getGradientId(index){
        var chartId = this.chartId;
        return chartId + '-gradient-' + index;
    }
    mergetDefaultOption(){
        var that = this;
        var {option,defaultOption} = this;
        option = $.extend(true,{},defaultOption,option);
        var {plotOptions,series,colors} = option;
        var components = {};
        series = series.map(function(seriesOpt,seriesIndex){
            seriesOpt.seriesIndex = seriesIndex;
            seriesOpt.seriesColor = seriesOpt.color || colors[seriesIndex % colors.length];
            seriesOpt.seriesName = seriesOpt.name || ('series' + seriesIndex);
            var {type} = seriesOpt;
            return $.extend(true,{animation:option.chart.animation},plotOptions.series,plotOptions[type],seriesOpt);
        })
        option.series = series;
        this.option = option;
    }
	getOption(){
        return this.option;
	}
    initSeriesModels() {
        var that = this;
        var option = this.getOption();
        var {series} = option;
        var models = series.map(function(seriesOpt,seriesIndex){
            var {type} = seriesOpt;
            var Model = seriesModels[type];
            var seriesModel =  new Model(that,seriesOpt);
            series[seriesIndex] = seriesModel.getOption();
            return seriesModel;
        })
        this.series = models;
    }
    initComponentsModels(){
        var components = [];
        this.eachSeries(function(seriesModel){
            var dependencies = seriesModel.dependencies;
            dependencies.map(function(type){
                if(components.indexOf(type)=== -1) {
                    components.push(type);
                }
            })
        });
        var that = this;
        var models = [];
        for(var i = 0; i < components.length;i++) {
            var type = components[i];
            var Model = componentModels[type];
            if(Model) {
                var component = new Model(that);
                var {dependencies} = component;
                dependencies.map(function(type){
                    if(components.indexOf(type) === -1) {
                        components.push(type);
                    }
                })
                models.push(component);
            } 
        }
        this.components = models;
    }
    getWidth(){
        return this.width;
    }
    getHeight(){
        return this.height;
    }

    getColorByIndex(index){
        var option = this.getOption();
        var {colors} = option;
        return colors[index % colors.length];
    }
    getSeriesByIndex(index){
        var ret = null;
        this.mapSeries(function(seriesModel){
            if(seriesModel.seriesIndex === index) {
                ret = seriesModel
            }
        })
        return ret;
    }
    getComponent(type) {
        var component = null;
        this.components.map(function(model){
            if(model && model.type === type) {
                component = model;
            }
        })
        return component;
    }
	eachSeries(callback) {
        var {series} = this;
        series.map(function(seriesModel){
            callback.call(null,seriesModel);
        });
	}
    mapSeries(callback) {
        var {series} = this;
        return series.map(callback);
    }
    eachSeriesByDependency(name,callback){
        var {series} = this;
        series.map(function(seriesModel){
            if(seriesModel.dependencies.indexOf(name)!==-1) {
                callback.call(null,seriesModel);
            }
        });
    }
    eachSeriesByType(type,callback) {
        var {series} = this;
        series.map(function(seriesModel){
            if(seriesModel.type === type) {
                callback.call(null,seriesModel);
            }
        });
    }
    getVisibleSeriesIndex(){
        
    }
}
