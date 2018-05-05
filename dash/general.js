var CURRENTTIME = '2018-05-01 07:20';

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(doTick());

MITDATA.sort(function (a, b) {
    return a.date - b.date || a.time - b.time;
});

$( function() {
    LIVESTREAM.watch.forEach((value)=>{
        $('#watchList').append(`<a href="#" onclick="removeWatch(${value})" id="watch_${value}" class="list-group-item">$${value}</a>`);
    });
    if(LIVESTREAM.playing){
        $('#playbtn').html(`<i class="fas fa-pause"></i>`);
    }
} );

// Map data to object array
    var ENERGYDAT = ALLDATA.map(t=>{
        var v = {
            date: t[1],
            hourEnding: t[2],
            locationID: t[3],
            locationName: t[4],
            locationType: t[5],
            marginalPrice: t[6],
            energyComponent: t[7],
            congestionComponent: t[8],
            marginalLossComponent: t[9]
        };
        return v;
    });

// LIVESTREAM object ***********************************
    // Default as playing
    LIVESTREAM.playing = true;
    // LIVESTREAM object properties
    LIVESTREAM.t = CURRENTTIME;
    LIVESTREAM.viewPeriod = 2;
    $("#currentTime").html(LIVESTREAM.t);
    LIVESTREAM.mPerTick = 60;
    LIVESTREAM.priceNow = 999;
    LIVESTREAM.watch = [20,25,30];
    LIVESTREAM.toggleOn = function(){
        if(this.playing){
            console.log('Stop');
            $('#playbtn').html(`<i class="fas fa-play"></i>`);
        }else{
            console.log('Start');
            $('#playbtn').html(`<i class="fas fa-pause"></i>`);
        }
        this.playing = !this.playing;
    };

// TICK FUNCTION *****************************************
    function doTick(){
        if(LIVESTREAM.playing){
            addTime();
            doDraw();
            LIVESTREAM.watch.forEach((value)=>{
                if(LIVESTREAM.priceNow > value){
                    $(`#watch_${value}`).addClass('list-group-item-success');
                }else{
                    $(`#watch_${value}`).removeClass('list-group-item-success');
                }
            });
        }
        setTimeout(function(){
            doTick();
        }, 1000);
    }

    function doDraw(){
        // let startDate = moment(LIVESTREAM.t).subtract(LIVESTREAM.viewPeriod, 'days').subtract(2, 'years').format('MM/DD') + '/2016';
        // let endDate = moment(LIVESTREAM.t).format('MM/DD') + '/2016';
        let startT = moment(LIVESTREAM.t).subtract(LIVESTREAM.viewPeriod, 'days').subtract(2, 'years');
        let endT = moment(LIVESTREAM.t).subtract(2, 'years');
        let mit = getUsageFromRange(startT, endT);
        let neiso = getDataFromRange(startT, endT);
        LIVESTREAM.priceNow = parseFloat(neiso[neiso.length-1].marginalPrice);
        //LIVESTREAM.playing = false;
        drawChart(mit, neiso);
        $("#currentTime").html(LIVESTREAM.t);
    }

    function addTime(){
        LIVESTREAM.t = moment(LIVESTREAM.t).add(LIVESTREAM.mPerTick, 'minutes').format('YYYY-MM-DD HH:mm');
        $("#currentTime").html(LIVESTREAM.t);
    }

    function addWatch(){
        let f = LIVESTREAM.watch.filter(o => parseFloat(o) === parseFloat($('#BidPrice').val()));
        if(f.length===0){
            LIVESTREAM.watch.push(parseFloat($('#BidPrice').val()));
        }
        $('#watchList').html('');
        LIVESTREAM.watch.forEach((value)=>{
            $('#watchList').append(`<a href="#" onclick="removeWatch(${value})" id="watch_${value}" class="list-group-item">$${value}</a>`);
        });
    }

    function removeWatch(v){
        LIVESTREAM.watch = LIVESTREAM.watch.filter(o => o !== v);
        if(LIVESTREAM.watch.length === 0){return $('#watchList').html(`<a href="#" class="list-group-item">None Listed</a>`);}
        $('#watchList').html('');
        LIVESTREAM.watch.forEach((value)=>{
            $('#watchList').append(`<a href="#" onclick="removeWatch(${value})" id="watch_${value}" class="list-group-item">$${value}</a>`);
        });
    }
// Charts **********************
//need for Google Charts 


function run(){
    // Data from ne-iso
    //console.log(getDataFromRange());
    // Data from MIT's usage
    //console.log(getUsageFromRange());
    updateBidPrice();
    updateBidAmount();
}

// Function to get data within time range
function getDataFromRange(startT, endT){
    // Filter data
    //return ENERGYDAT.filter(o => o.date >= startDate && o.date <= endDate);
    let data = ENERGYDAT.filter(o => dateToMoment(o.date, o.hourEnding, 'energydat').isBetween(startT, endT));
    data.sort(function(a, b){
        var adt = dateToMoment(a.date, a.hourEnding, 'energydat');
        var bdt = dateToMoment(b.date, b.hourEnding, 'energydat');
        if (adt.isBefore(bdt)) {return -1;}else{return 1;}
    });
    return data;
}

// Function to get data within time range
function getUsageFromRange(startT, endT){
    // Filter data
    let data = MITDATA.filter(o => dateToMoment(o.date, o.time).isBetween(startT, endT));
    data.sort(function(a, b){
        var adt = dateToMoment(a.date, a.time);
        var bdt = dateToMoment(b.date, b.time);
        if (adt.isBefore(bdt)) {return -1;}else{return 1;}
    });
    return data;
    //console.log(startT, endT);
}
function dateToMoment(d, t, dtype){
    if(dtype==='energydat'){
        return moment(d + ' ' + t, "MM/DD/YYYY HH");
    }
    return moment(d + ' ' + t, "MM-DD-YYYY HH:mm");
}

var usageChart = null;
function drawChart(mit, isone){

        var data = new google.visualization.DataTable();
        data.addColumn('datetime', 'Time');
        data.addColumn('number', 'Usage');
        data.addColumn('number', 'Price');
        LIVESTREAM.watch.forEach((w, i)=>{
            data.addColumn('number', 'Watch ' + (i + 1));
        });
    // MIT USAGE
        let dat = [];
        mit.forEach((line)=>{
            let yr = line.date.substring(6,11);
            let mo = parseInt(line.date.substring(0,2));
            let day = parseInt(line.date.substring(3,5));
            let hr = parseInt(line.time.substring(0,2));
            let min = parseInt(line.time.substring(3,5));
            let thisrow = [new Date(yr, mo-1, day, hr, min, 0, 0),line['usage']/1000,null];
            LIVESTREAM.watch.forEach((w, i)=>{
                thisrow.push(w);
            });
            dat.push(thisrow);
        });
        data.addRows(dat);
    // ISO PRICE
        var dataISO = new google.visualization.DataTable();
        dat = [];
        isone.forEach((line)=>{
            let yr = line.date.substring(6,11);
            let mo = parseInt(line.date.substring(0,2));
            let day = parseInt(line.date.substring(3,5));
            let hr = parseInt(line.hourEnding);
            let min = 0;
            let thisrow = [new Date(yr, mo-1, day, hr, min, 0, 0),null,parseFloat(line.marginalPrice)];
            LIVESTREAM.watch.forEach((w, i)=>{
                thisrow.push(null);
            });
            dat.push(thisrow);
        });
        data.addRows(dat);

    var options = {
        height: 550,
        series: {
            0: {targetAxisIndex: 0},
            1: {targetAxisIndex: 1}
        },
        vAxes: {
            // Adds titles to each axis.
            0: {title: 'Usage [MW]'},
            1: {title: 'Price [$ / MWh]'}
        },
        'chartArea': {'width': '80%', 'height': '80%'},
        curveType: 'function',
        legend: { position: 'bottom' }
    };
    LIVESTREAM.watch.forEach((w, i)=>{
        options.series[2+i] = {targetAxisIndex: 1};
    });

    if(usageChart===null){usageChart = new google.visualization.LineChart(document.getElementById('chart_div'))};

    usageChart.draw(data, options);
}