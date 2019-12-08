/* global d3, crossfilter, timeSeriesChart, barChart */

var dateFmt = d3.timeParse("%d/%m/%Y %H:%M");

// d3.csv("data/humbolt_data.csv")
  
//     .then(data => {console.log("data", data);
//     // var dateFmt = d3.timeParse("%b %Y");

//     data.forEach(function(d) {
//         // console.log(d.Timestamp);
//         // console.log(dateFmt(d.Timestamp));
//         d.Timestamp = dateFmt(d.Timestamp);
//         // d.value = +d.value;
//     });

//     const cs = crossfilter(data);
//     // const Timestamp = dateFmt(d.Timestamp);
//     const dimTime = cs.dimension(d => d.Timestamp);
//     const groupTime = dimTime.group(d3.timeHour);
//     console.log(groupTime.all());

//     const chartTimeline= timeSeriesChart()
//         .x(d => d.key)
//         .y(d => d.value);

//     d3.select("#timeline2")
//         .data([groupTime.all()])
//         .call(chartTimeline);
    
// });

d3.csv("data/humbolt_data_bk.csv")
  
    .then(data => {console.log("data", data.length);

    // var dateFmt = d3.timeParse("%Y-%m-%d %H:%M:%S");
    // var dateFmt = d3.timeParse("%b %Y");

    const cs = crossfilter(data);

    data.forEach(function(d) {
        // console.log(d.Timestamp);
        // console.log(Date(d.Timestamp));
        d.Timestamp = dateFmt(d.Timestamp);
    });
    // const Timest = dateFmt(d => d.Timest);
    const dimTime = cs.dimension(d => d.Timestamp);
    const groupTime = dimTime.group(d3.timeHour);
    // console.log(groupTime.all());
    const dimMes = cs.dimension(d => d["mes"]);
    const groupMes = dimMes.group();

    const dimKingdom = cs.dimension(d => d["kingdom"]);
    const groupKingdom = dimKingdom.group();

    // const dimTime = cs.dimension(d => d.TimeStamp);
    // const groupTime = dimTime.group();

    //console.log(groupTime.all());
    console.log(groupKingdom.all());

    const lineTime= timeSeriesChart()
        .x(d => d.key)
        .y(d => d.value)
        .onBrushed(selected => {
            // console.log(selected);
            dimTime.filter(selected);
            update();
        });

    const barMes= barChart()
        .x(d => d.key)
        .y(d => d.value)
        .onMouseEnter( d=> {
             dimMes.filter(d.key);
             update();
        })
        .onMouseOut( d=> {
            dimMes.filterAll();
            update();
        });

    const barKingdom= barChart()
        .x(d => d.key)
        .y(d => d.value)
        .onMouseEnter( d=> {
            dimKingdom.filter(d.key);
            update();
        })
        .onMouseOut( d=> {
            dimKingdom.filterAll();
            update();
        });

    function update() {
    
    d3.select("#timeline")
        .data([groupTime.all()])
        .call(lineTime)
        .selectAll(".tick text")
        .attr("transform", "translate(-8,-1) rotate(-45)");

    d3.select("#mes")
        .data([groupMes.all()])
        .call(barMes)
        .selectAll(".tick text")
        .attr("transform", "translate(-8,-1) rotate(-45)");

    d3.select("#kingdom")
        .data([groupKingdom.all()])
        .call(barKingdom)
        .selectAll(".tick text")
        .attr("transform", "translate(-8,-1) rotate(-45)");
    }
    update();
    
});

// d3.csv("Lekagul_slice.csv",
// function (err, data) {
//     if (err) throw err;
//     var csData = crossfilter(data);

//     // We create dimensions for each attribute we want to filter by
//     csData.dimCarType = csData.dimension(function (d) { return d["car-type"]; });
//     csData.dimGateName = csData.dimension(function (d) { return d["gate-name"]; });

// });

