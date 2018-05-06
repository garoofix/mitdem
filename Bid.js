var BidPrice = 20; //PriceNG*NGPlantRate;units in dollars
var BidMW = 1.0; //units in MW, participation requres at least 0.1 MW

function updateBid(){
        BidMW = Number(document.getElementById('BidAmount').value); 
        BidPrice= Number(document.getElementById('BidPrice').value);
        drawISONEPRices();
        drawProfit(); 
        drawPriceUse();  
        totalProfit();      
}


