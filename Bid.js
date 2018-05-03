/* 
var PriceNG=2.2; /*2.52 is price of natural gas (NG), $/million BTUs , Henry Hub 2016 average Price
https://www.eia.gov/dnav/ng/ng_pri_fut_s1_a.htm
note that 2015: $2.62/mmBTU; 2014: $4.37/mmBTU 

var NGPlantRate =7870/1000; /*ramp rate in mmBTU/MWh of MIT's NG plant
7870/1000 is 2016, natural gas average operating heat rate in BTU/kWh, converted 
https://www.eia.gov/electricity/annual/html/epa_08_01.html
2015:7878 ; 2014: 7907
*/  
var BidPrice = 20; //PriceNG*NGPlantRate;units in dollars
var BidMW = 1.0; //units in MW, participation requres at least 0.1 MW

function updateBidPrice(){
        BidPrice= Number(document.getElementById('BidPrice').value);
        drawISONEPRices(); 
        drawProfit(); 
}
function updateBidAmount(){
        BidMW = Number(document.getElementById('BidAmount').value);      
        drawProfit();  
}
/*
function updateNGPrice(){
        PriceNG = document.getElementById('NGPrice').value; 
}
function updateHeatRate(){
        NGPlantRate = document.getElementById('HeatRate').value; 
}
*/ 

