

$( function() {
    // Initialize date-pickers
    $( "#startDate" ).datepicker({dateFormat: "mm/dd/yy"});
    $( "#endDate" ).datepicker({dateFormat: "mm/dd/yy"});
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
    LIVESTREAM.playing = false;
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

// Charts **********************
//need for Google Charts 
google.charts.load('current', { packages: ['corechart', 'line'] });
google.charts.load('current', {packages: ['corechart', 'bar']});

function run(){
    // Data from ne-iso
    console.log(getDataFromRange());
    // Data from MIT's usage
    console.log(getUsageFromRange());
    updateBidPrice();
    updateBidAmount();
    google.charts.setOnLoadCallback(drawISONEPRices); 
    google.charts.setOnLoadCallback(drawProfitability);
}

// Function to get data within time range
function getDataFromRange(startDate, endDate){
    // Set default values
    startDate   = startDate || $('#startDate').val();
    endDate     = endDate || $('#endDate').val();
    // Filter data
    return ENERGYDAT.filter(o => o.date >= startDate && o.date <= endDate);
}

// Function to get data within time range
function getUsageFromRange(startDate, endDate){
    // Set default values
    startDate   = startDate || $('#startDate').val();
    endDate     = endDate || $('#endDate').val();
    // Filter data
    return MITDATA.filter(o => o.date >= startDate && o.date <= endDate);
}
//console.log(ENERGYDAT[0]);
function drawISONEPRices() {
    console.log('dafljfdlgdf'); 
    var intermediate = getDataFromRange();
    var PriceBidGraphableArray = []; 
    intermediate.forEach(function(element){
        PriceBidGraphableArray.push([element[1], element[6], BidPrice]); 
    });

    PriceBidGraphableArray.unshift(['Time', 'DAM LMP', "Bid Price"]);
    var gdata = google.visualization.arrayToDataTable(PriceBidGraphableArray);
    var options = {
        title: 'ISO-NE Price versus Bid Price',
        vAxis: { title: 'LMP ($/MWh)' },
        hAxis: { title: 'Time (Month/Day/Year/Hour)' },
        seriesType: 'line',
        series: { 1: { type: 'line' } }
    }
    var chart = new google.visualization.ComboChart(document.getElementById('drawISONEPRicesChart_Div'));
    chart.draw(gdata, options);
}

// function drawProfitability(){
//     var intermediateISO = getDataFromRange();
//     var intermediateMITUse = getUsageFromRange(); 
//     var data = new google.visualization.arrayToDataTable([
//         ['Day','Profitability'],
//         //the results [time, profitability] , each row indivudalt
//     ]); 
//     var options = {
//         title: 'Motivation Level Throughout the Day',
//         hAxis: {
//           title: 'Time of Day',
//           format: 'h:mm a',
//                 },
//         vAxis: {
//             title: '',
//         }
//     }
//     var chart = new google.visualization.ColumnChart(document.getElementById('drawProfitability-Div'));
//     chart.draw(data, options);
// }

    //for graph 3, citation https://canvasjs.com/jquery-charts/resizable-chart/
