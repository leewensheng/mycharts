import $ from 'jquery'
import seriesModels from '../chart/models'
export default class ChartModel {
	constructor(width,height,option){
        this.width = width;
        this.height = height;
		this.option = option;
		this.init();
	}
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
                visible:true
            }
        },
        series:[]
    };
	init(){
        this.mergetDefaultOption();
        this.initSeriesModels();
	}
    mergetDefaultOption(){
        var that = this;
        var {option,defaultOption} = this;
        option = $.extend(true,{},defaultOption,option);
        this.option = option;
        var {plotOptions,series,colors} = option;
        var components = {};
        series = series.map(function(seriesOpt,seriesIndex){
            seriesOpt.seriesIndex = seriesIndex;
            seriesOpt.seriesColor = colors[seriesIndex % colors.length];
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
    getColorByIndex(index){
        var option = this.getOption();
        var {colors} = option;
        return colors[index % colors.length];
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
            if(seriesModel.dependencies[name]) {
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
