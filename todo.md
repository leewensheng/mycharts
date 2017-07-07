#to do list 
饼图支持图例开关
getShapePath应该提供原始path接口
optionsManager 统一管理配置defaultOption,theme,数据分发
svg outerHTML
通过在配置层引入defs如渐变，填充等，提供高级支持
line,path底层统一，饼图重构
tooltip  统一point结构
组件默认值统一混合，zindex,useHTML
所有select状态和points分离
line配置扁平化,不放到style里
legend hover状态
bug 饼图选中配合\

图例开关，选中状态有问题
bug  坐标轴Y轴数目应当取最大并保持一致;
bug 饼图key统一用x
axis支持特殊场景  无series,单一值 
1.坐标轴不限定type，可以同时是categories,value
splitArea,hoverStyle
2.统一text ,line 配置 ，并尽量扁平化
3.symbol支持，自定义symbol
4,formatter，内置一些filter,formatter支持jsx组件
6.tooltip
8.stack

animation配置化


problem:
1.坐标轴不不应该强制对齐规则，除非对方没有规定对齐方式

chart规划
折线图，条形图，散点图
polar
仪表盘
环图
map
treepmap
股票

组件规划
tooltip
legend
datazoom


visualmap
