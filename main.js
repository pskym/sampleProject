/**
 * Created by pskym on 12/15/2014.
 */
/** A test JS file to practice random bits of code
 */
require([
    "dojox/charting/Chart",
    "dojox/charting/Chart2D",
    "dojox/charting/plot2d/Pie",
    "dojox/charting/action2d/Tooltip",
    "dojox/charting/action2d/MoveSlice",
    "dojox/charting/themes/Claro",
    "dojox/charting/plot2d/Columns",
    "dojox/charting/plot2d/Lines",
    "dojox/charting/widget/Legend",
    "dojo/_base/lang",
    "dojox/grid/DataGrid",
    "dojo/store/Memory",
    "dojo/data/ObjectStore",
    "dojo/request",
    "dojo/data/ItemFileWriteStore",
    "dojox/charting/StoreSeries",
    "dojo/store/Observable",
    "dojo/domReady!"
], function(Chart, Chart2D, Pie, Tooltip, MoveSlice, PlotKitGreen, Columns, Lines, Legend, lang, DataGrid, Memory, ObjectStore, request, ItemFileWriteStore, StoreSeries, Observable){

    campus = [
        { y: 1500, legend: "Lab Science", text: "$1500"},
        { y: 2500, legend: "Admin", text: "$2500"},
        { y: 3000, legend: "Welcome Center", text: "$3000"},
        { y: 4000, legend: "Health Science", text: "$4000"},
        { y: 5000, legend: "General Arts", text: "$5000"}
    ];
    var pieChart = new Chart("pieChartNode", {
        title: "Northwest Campus Capital Reserve Requirement",
        titlePos: "top",
        titleGap: 25,
        titleFont: "normal normal normal 15pt Arial",
        titleFontColor: "red"
    });
    pieChart.setTheme(PlotKitGreen);
    pieChart.addPlot("default", {
        type: "Pie",
        radius: 200,
        fontColor: "#ff0000",
        fontSize: 18,
        labelOffset: 60
    });
    pieChart.addSeries("example", campus);
    new MoveSlice(pieChart,"default");
    new Tooltip(pieChart, "default", {
        text: lang.hitch(this, function (o) {
            return this.campus[o.index].legend
        })
    });
    pieChart.render();
    var legend = dijit.byId("Legend");
    var Legend = new Legend({
        chart: pieChart,
        horizontal: false,
        domNode: Legend,
        theme: PlotKitGreen
    }, "Legend");


    reserves = [
        { value: 1, y: 7000, text: "Nov"},
        { value: 2, y: 0, text: "Dec"},
        { value: 3, y: 0, text: "Jan"},
        { value: 4, y: 8000, text: "Feb"},
        { value: 5, y: 5000, text: "Mar"},
        { value: 6, y: 0, text: "Apr"},
        { value: 7, y: 5000, text: "May"},
        { value: 8, y: 0, text: "Jun"},
        { value: 9, y: 0, text: "Jul"},
        { value: 10, y: 5000, text: "Aug"},
        { value: 11, y: 10000, text: "Sep"},
        { value: 12, y: 5000, text: "Oct"}
    ];
    var barStore;
    request.get("test.json",{
        handleAs: "json"
    }).then(function(data){
        barStore = new ObjectStore({ objectStore:new Memory({ data: data.reserves }) });

    });
    var barChart = new Chart2D("barChartNode", {
        title: "Capital Reserve Expenditures Prior 12 Months",
        titlePos: "top",
        titleGap: 25,
        titleFont: "normal normal normal 15pt Arial",
        titleFontColor: "red"
    });
    barChart.addPlot("default", {
        type: "Columns",
        tension: 3,
        gap: 2
    });
    barChart.setTheme(PlotKitGreen);
    barChart.addAxis("x", {
        labels: [
            { value: 0, text: ""},
            { value: 1, text: reserves[0].text + "-14" },
            { value: 2, text: reserves[1].text + "-14"},
            { value: 3, text: reserves[2].text + "-14"},
            { value: 4, text: reserves[3].text + "-14"},
            { value: 5, text: reserves[4].text + "-14"},
            { value: 6, text: reserves[5].text + "-14"},
            { value: 7, text: reserves[6].text + "-14"},
            { value: 8, text: reserves[7].text + "-14"},
            { value: 9, text: reserves[8].text + "-14"},
            { value: 10, text: reserves[9].text + "-14"},
            { value: 11, text: reserves[10].text + "-14"},
            { value: 12, text: reserves[11].text + "-14"},
            { value: 13, text: "" }
        ],
        fixLower: "major",
        fixUpper: "minor",
        rotation: 50
    });
    barChart.addAxis("y", {
        vertical: true,
        fixLower: "major",
        fixUpper: "major",
        min: 0,
        labelFunc: function(value) {
            return "$" + value;
        }
    });
    barChart.addSeries("sample", reserves);
    new Tooltip(barChart, "default", {
        text: lang.hitch(this, function (o) {
            return "$" + this.reserves[o.index].y
        })
    });
    barChart.render();


    expendituresT = Object();
    expendituresArray = [];
    requiredT = Object();
    requiredArray = [];
    var dataStore;
    request.get("test.json",{
        handleAs: "json"
    }).then(function(data){
        dataStore = new ObjectStore({ objectStore:new Memory({ data: data.attributes }) });
        var expendituresNum = Number(dataStore.objectStore.data[1].balance);
        var reserveRequired = 0;
        expendituresT = dataStore.objectStore.data[2];
        requiredT = dataStore.objectStore.data[0];
        for (i = 0; i < requiredT.Required.length; i++) {
            //console.log(requiredT.Required[i]);
            var reserveMaterials = Number(requiredT.Required[i].reserve_required_materials);
            var materialsInflation = Number(expendituresT.Projection[i].material_inflation);
            var reserveLabor = Number(requiredT.Required[i].reserve_required_labor);
            var laborInflation = Number(expendituresT.Projection[i].labor_inflation);
            var reserveRequiredIterator = reserveMaterials + reserveMaterials*materialsInflation + reserveLabor + reserveLabor*laborInflation;
            reserveRequired = reserveRequired + reserveRequiredIterator;
            var investmentYield = Number(expendituresT.Projection[i].investment_yield);
            if (i > 0) {
                expendituresNum = expendituresNum + expendituresNum*investmentYield;
            }
            var dataExpenditures = { id: i + 1, value: i + 1, y: expendituresNum, text: expendituresT.Projection[i].year.toString() };
            var dataRequired = { id: i + 1, value: i + 1, y: reserveRequired };
            expendituresArray.push(dataExpenditures);
            requiredArray.push(dataRequired);
        }
        this.lineChart(expendituresArray, requiredArray);
    });
    lineChart = function(array, arraySecond) {
        var lineChartT = new Chart2D("lineChartNodeJSON", {
            title: "Capital Reserve Projections",
            titlePos: "top",
            titleGap: 25,
            titleFont: "normal normal normal 15pt Arial",
            titleFontColor: "red"
        });
        lineChartT.addPlot("default", {
            type: "Lines",
            lines: true,
            markers: true
        });
        lineChartT.addAxis("x", {
            labels: array
        });
        lineChartT.addAxis("y", {
            labelFunc: function(value) {
                return "$" + value
            },
            vertical: true,
            fixFlower: "major",
            fixUpper: "major"
        });
        lineChartT.setTheme(PlotKitGreen);
        lineChartT.addSeries("x", array);
        lineChartT.addSeries("y", arraySecond);
        lineChartT.render();
    };


    /*var data = {
        identifier: "id",
        items: []
    };
    var data_list = [
        { campus: "Downriver", 2014: "", 2015: "", 2016: "", 2017: "", 2018: "", 2019: "", 2020: "", 2021: "", 2022: "" },
        { campus: "Downtown", 2014: "", 2015: "", 2016: "", 2017: "", 2018: "", 2019: "", 2020: "", 2021: "", 2022: "" },
        { campus: "Eastern", 2014: "", 2015: "", 2016: "", 2017: "", 2018: "", 2019: "", 2020: "", 2021: "", 2022: "" },
        { campus: "Northwest", 2014: "$3000", 2015: "$5000", 2016: "$10000", 2017: "-", 2018: "$15000", 2019: "$50000", 2020: "-", 2021: "$5000", 2022: "$10000" },
        { campus: "Western", 2014: "", 2015: "", 2016: "", 2017: "", 2018: "", 2019: "", 2020: "", 2021: "", 2022: "" },
        { campus: "University Center", 2014: "", 2015: "", 2016: "", 2017: "", 2018: "", 2019: "", 2020: "", 2021: "", 2022: "" }
    ];
    addData = [
        {campus: "Total", 2014: "-", 2015: "-", 2016: "-", 2017: "-", 2018: "-", 2019: "-", 2020: "-", 2021: "-", 2022: "-"}
    ];
    for(var i = 0, l = data_list.length; i <= data_list.length; i++){
        if (i == l) {
            data.items.push(lang.mixin({ id: i+1 }, addData[i%l]));
        }
        else {
            data.items.push(lang.mixin({ id: i+1 }, data_list[i]));
        }
    }
    var store = new ItemFileWriteStore({data: data});*/
    var layout = [
        {'name': 'Campus', 'field': 'campus', 'width': '60px'},
        {'name': '2014', 'field': '2014', 'width': '50px'},
        {'name': '2015', 'field': '2015', 'width': '50px'},
        {'name': '2016', 'field': '2016', 'width': '50px'},
        {'name': '2017', 'field': '2017', 'width': '50px'},
        {'name': '2018', 'field': '2018', 'width': '50px'},
        {'name': '2019', 'field': '2019', 'width': '50px'},
        {'name': '2020', 'field': '2020', 'width': '50px'},
        {'name': '2021', 'field': '2021', 'width': '50px'},
        {'name': '2022', 'field': '2022', 'width': '50px'}
    ];
    /*var grid = new DataGrid({
        id: 'grid',
        store: store,
        structure: layout,
        rowSelector: '20px'});
    grid.placeAt("gridDiv");
    grid.startup();*/


    var dataStore;
    request.get("test.json",{
        handleAs: "json"
    }).then(function(dataJSON){
        dataStore = new ObjectStore({ objectStore: new Memory({ data: dataJSON.items }) });
        //console.log(dataStore.objectStore.data[0]);
        this.newGrid(dataStore, layout);
    });
    newGrid = function(dataStore, layout) {
        var newGrid = new DataGrid({
            id: "newGrid",
            store: dataStore,
            query: { id: "*" },
            queryOptions: {},
            structure: layout
        }, "newGrid");
        newGrid.startup();
    };
});
