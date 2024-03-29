var s1 = new Symbol("lion",0,[4,10,40,100]); //[0,10,20,100]
var s2 = new Symbol("ecorat",1,[10,50,200,2000]);//[2,100,500,1500]
var s3 = new Symbol("cactus",2,[5,10,20,100]); //[0,5,20,100]
var s4 = new Symbol("mushroom",3,[2,10,20,100]);//[0,5,20,100]
var s5 = new Symbol("zebra",4,[5,10,50,1000]); //changed but I can't remember the orig
var s6 = new Symbol("tree",5,[0,5,20,100]);//[0,5,20,100]
var s7 = new Symbol("dog1",6,[5,10,50,200]);//[0,15,50,100]
var s8 = new Symbol("club",7,[0,0,0,0]); //you have not dealt with sequenes that start with wild properly
var s9 = new Symbol("dog2",8,[5,10,100,500]);//[0,20,100,500]
var s10 = new Symbol("apple",9,[2,5,10,100]); //scatter [0,2,10,50]

iconSize = 60;
wheelSet = [[s1, s4, s6, s1, s2, s3, s4, s6, s3, s1, s5, s6, s4, s3, s1, s6, s4, s9, s3, s7, s4, s3, s6, s1, s4, s7, s3, s4, s1, s3, s7, s4, s6, s1, s3, s4, s7, s6, s4, s3, s7, s1, s6, s3, s7, s1, s6, s3, s1, s7, s6, s3, s1, s4, s6, s3, s1, s10, s6, s3, s1, s10, s6, s3, s1, s10, s3, s6, s10, s6, s4, s7, s3, s8, s7, s3], [s2, s1, s7, s8, s1, s7, s2, s1, s4, s1, s7, s4, s8, s7, s4, s2, s1, s4, s7, s4, s2, s1, s4, s7, s10, s1, s7, s1, s4, s2, s9, s7, s1, s4, s10, s1, s4, s7, s1, s2, s7, s9, s1, s2, s1, s7, s4, s1, s2, s9, s7, s4, s3, s5, s1, s7, s1, s4, s5, s4, s1, s6, s1, s5, s4, s1, s6, s5, s1], [s3, s5, s6, s1, s5, s6, s7, s8, s6, s7, s5, s7, s3, s10, s9, s6, s5, s6, s7, s5, s1, s10, s3, s5, s6, s10, s3, s5, s7, s4, s5, s9, s4, s5, s6, s9, s5, s3, s6, s5, s9, s3, s5, s6, s3, s5, s9, s3, s2, s6, s9, s2, s9, s3, s6, s8, s3, s6, s2, s9, s5, s6, s2, s9, s1], [s1, s2, s6, s9, s1, s2, s6, s9, s1, s2, s6, s9, s10, s9, s1, s2, s1, s6, s1, s2, s3, s9, s1, s2, s3, s9, s1, s2, s6, s3, s4, s2, s9, s6, s7, s4, s8, s7, s4, s5, s4, s6, s5, s3, s6, s5, s9, s4, s5, s3, s4, s5, s3, s7, s4, s5, s3, s7, s4, s5, s3, s7, s7, s6], [s4, s2, s7, s1, s3, s4, s2, s7, s3, s1, s4, s5, s3, s1, s9, s7, s4, s5, s6, s1, s7, s4, s5, s3, s6, s7, s4, s5, s3, s9, s6, s7, s4, s5, s7, s9, s6, s4, s5, s3, s6, s7, s3, s6, s5, s9, s3, s9, s1, s6, s5, s9, s6, s3, s9, s1, s5, s3, s6, s1, s9, s10]];
//only row position needs to be specfied since the column always increments by 1
lines = [[1,1,1,1,1],[0,0,0,0,0],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2],[1,0,1,0,1],[1,2,1,2,1],[2,0,2,0,2],[0,2,0,2,0]];
//holds the values currently displayed
images = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]];
      
Array.prototype.max = function() {
    return Math.max.apply(null, this);
};
Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

//-------------THE FUNCTIONS USED TO GENERATE THE SIMULATION PAGE -------------------------------

function initializeSimulationPage(){
	$('#sim_numberoflines').spinner({ min: 1, max: 9 });
	$('#sim_creditsperline').spinner({ min: 1, max: 10 });
}

function runSimulation(){
	disableButtons();
	setTimeout(simulate,0);
}

function simulate(){
	var gamespersession = $('#sim_sessionlength').val();
	var sessions = $('#sim_playfrequency').val();
	var lines = $("#sim_numberoflines").val();
	var credits = $('#sim_creditsperline').val();
	var dollarspercredit = 0.1;
	var expectedCretitsLost = gamespersession*sessions*lines*credits*0.15;
	var startdollaramount = expectedCretitsLost*dollarspercredit*1.5; //start with 1.5 times the expected loss
	var dollaramount = startdollaramount;
	var totals = [startdollaramount];
	var profits = [];
	var total = 0;
	var win = 0;
	var maxwin = 0;
	for (var run = 0; run < sessions; run ++){
		profits[run] = 0;		
		for (var count = 0; count < gamespersession; count++){
			win = play(credits,lines)[0];
			if (win > maxwin){maxwin = win;}
			profits[run] += (win - credits*lines)*dollarspercredit;			
			total += win;
		}
		totals[run+1] = dollaramount + profits[run];
		dollaramount = totals[run+1];
	}
	var rtnRate = Math.round(total*100/(gamespersession*sessions*credits*lines))/100;
	var word = "lost";
	
	if ((dollaramount-startdollaramount) > 0) {word = "won";}
	$("#sim_result_text").text(
	"I simulated playing "+sessions+" sessions of "+gamespersession+" games each."+
	" The maximum win was $"+maxwin+
	" but overall I "+word+" $"+(Math.abs(startdollaramount-dollaramount)).toFixed(0)+"."+
	//" The total amount of money put through the machine was "+(lines*credits*sessions*gamespersession)+
	" The return rate over the year was "+rtnRate);
	
	drawlineplot(totals,1.1*startdollaramount,sessions);
	//drawHistogram(data);
	enableButtons();
}

function drawlineplot(moneyOverTime,expectedMax,sessions){
	var max = moneyOverTime.max();
	var min = moneyOverTime.min();
	var top = Math.max(max,expectedMax);
	var bottom = Math.min(min,0);
	var gap = max - min;
	var increment = 1000;	
	if (gap > 10000 && gap < 50000) {
		increment = 5000;
	} else if (gap > 50000 && gap < 100000) {
		increment = 10000;
	} else if (gap > 100000 && gap < 500000){
		increment = 50000;
	} else if (gap > 500000){
		increment = 100000;
	}

	$('#sim_chart_lossovertime').empty();
	yticks =  [bottom];
	for (i = 0; i < max; i += increment){
		yticks.push(i);
	}
	yticks.push(top);
	
	plot2 = $.jqplot('sim_chart_lossovertime', [moneyOverTime], { 
	    title:'Losses over one year', 
	    series:[
	        {
	            showMarker:false, 
	            lineWidth:4, 
	            shadowAngle:0, 
	            shadowOffset:1.5, 
	            shadowAlpha:.08, 
	            shadowDepth:6,
	            neighborThreshold: -1
	        }
	    ],
	    
	    axes:{
			yaxis:{
				min: bottom, 
				max: top,
				//ticks:yticks//,
				tickOptions:{formatString:'$%d'}
				},
			xaxis: {
		    	min:1,
		    	max: sessions,
		    	showTicks:false
		    }
	    },
	    cursor: {
			zoom:true, 
			//clickReset:true,
			style:'crosshair'
		}
	    
	}); 
}

//----------------Functions used by the poker machine page ----------------------

function redirectToSimulationPage(){
	document.location = "file:///home/finn/workspace/testjs/simulation.html";
	
}
 
 
function setUpForBrowser(){
	if (navigator.userAgent.indexOf("Chrome") >= 0){return;} //if its chrome we are good
	var firefox = navigator.userAgent.search("Firefox/[0-9.]{0,15}$");
	if (firefox > -1){
		var version = parseInt(navigator.userAgent.substring(firefox+8),10);
		if (version >= 3){return;}	
	}
	var warning = $("warning");
	warning.innerHTML = "This application has only been tested for Chrome or Firefox 3.0 and later. If you experience problems please try one of these browsers"; 	
}

//icon should be the string icon name, and payoutArray an array [2inrow,3inrow,4inrow,5inrow]
function Symbol(sName,iconNum,payoutArray){
	this.sName = sName;
	this.iconNum = iconNum;
	this.payoutArray = payoutArray;
	this.payout = function(numInRow){
		if (numInRow > 1){
			return this.payoutArray[numInRow-2];
		} else {return 0;}
	};
	this.getIcon = function(){
		return $('<img src="icons/'+iconNum+'.png" />');
		//return new Element("img",{src:"icons/"+iconNum+".png"});
	};
	this.toString = function(){
		return this.sName;
	};		
}


function initializePokerMachine(){
	setUpForBrowser();
	initializeMachine();
}

function initializeMachine(){
	var machineSize = 640;
	var machinelrborder = 30;
	var machinetbborder = 10;
	var gap = 6;
	iconSize = (machineSize - 2*machinelrborder - 5*gap)/5 ;	
	loadWheels(wheelSet);
	scaleMachineToSize(machineSize,machinelrborder,gap, machinetbborder);
}

function scaleMachineToSize(sizeInPixels, machinelrborder, gap, machinetbborder){
	$("#machine").css('width',sizeInPixels);
	$("#banner").css('width',sizeInPixels -2*machinelrborder);
	$("#banner").css('padding-left',machinelrborder);
	$("#banner").css('padding-right',machinelrborder);
	$("#banner").css('padding-top',machinetbborder);
	
	$(".wheel img").css('height',iconSize);
	$(".wheel img").css('width',iconSize);
	$(".wheelDisplay").css("height", iconSize *3);
	$(".wheelDisplay").css("width", iconSize);
	$("#games").css("padding-left",machinelrborder);
	$("#games").css("padding-right", machinelrborder);
	$(".wheelsTable td").css("padding-left",gap/2+"px");
	$(".wheelsTable td").css("padding-right",gap/2);
	$('#spinner').spinner({ min: 1, max: 10 });
}

function payoff(stopPoints,credits,lines){
	var total = 0;
	
	var scatters = 0;
	for (var i = 0; i < 5; i++){
		for (var r = 0; r < 3; r++){
			var rowPos = (stopPoints[i]+r)%(wheelSet[i].length);
			image = wheelSet[i][rowPos];
			images[i][r] = image;
			if (image === s10){
				scatters+=1;
			}
		}
	}	
	for (var l = 0; l < lines;l++){
		total += payoffLine(l,images);
	}
	var scat = s10.payout(scatters)*lines; //scatters
	total += scat;
	total *= credits;

	return total;
}

function payoffLine(lineNo,images){
//needs to check for things in a row and then determine what type they are to get the payout.
	line = lines[lineNo];
	var first = images[0][line[0]];
	if (first === s10) {return 0;} //scatter
	var count = 1;
	for (var col = 1; col < line.length; col ++){
		var image = images[col][line[col]];
		if (image == first || image == s8){ //s8 is wild card
			count +=1;
		} else {
			break;
		}
	}
	return first.payout(count);		
}

function getNoOfCredits(){
	var credits = $("#spinner").val();
	return credits;
}


function getNoOfLines(){
	var lines = $("#linesForm input:checked").val();
	return lines;
}



function disableButtons(){
	var buttons = document.getElementsByTagName("button");
	for (var b = 0; b < buttons.length; b++){
		buttons[b].disabled = true;
	}
}
function enableButtons(){
	var buttons = document.getElementsByTagName("button");
	for (var b = 0; b < buttons.length; b++){
		buttons[b].disabled = false;
	}
}






function play(credits,lines){
	var stopPoints =  []
	for (var col = 0; col < wheelSet.length; col++){
		stopPoints[col] = Math.floor(Math.random()*(wheelSet[col].length));	
	}
	var payout = payoff(stopPoints,credits,lines);
	return [payout,stopPoints];
}

function startLivePlay(){
	disableButtons();
	setTimeout("livePlay()",0);
}
function livePlay(){
	var lines = getNoOfLines();
	var credits = getNoOfCredits();
	var playrun = play(credits,lines);
	var count = 20;
	var wheels = $(".wheel");
	wheels.each(function(indx,w) {
		w.stopPoint = playrun[1][indx];
		w.spinsLeft = count;
		count += 4;
	});
	var interval = setInterval(function (){spin(wheels,interval)},5); //5
	var money = parseInt($("#moneyamount").text())+(playrun[0]-(credits*lines));
	$("#moneyamount").text(money);
	$("#winamount").text(playrun[0]);
	$("#betamount").text(credits*lines);
}

	
function spin(wheels,interval){
	
	var text = $("hiddentext");
	text.innerHTML = parseInt(text.innerHTML)+1;
	var activeWheels = 0;
	
	wheels.each(function(index,w) {
		var jw = $(w);
		if (w.spinsLeft >= 0){
			
			var top = parseInt(jw.css('top'));
			if (top >=0){
				top =-1*iconSize*jw.attr('wheelsize');
			}
			
			jw.css('top',top+45+"px");
			
			if (w.spinsLeft==0){
				jw.css('top',-1*w.stopPoint*iconSize+"px");
			}	
			
		}
		if (w.spinsLeft>-5){
			activeWheels +=1;
			w.spinsLeft -=1;
		}
	});
	

	if (activeWheels < 1){
		clearInterval(interval);
		enableButtons();		
	}
}

function loadWheels(wheelArray){
	var wheelsDiv = $('#wheels');
	wheelsDiv.empty();
	var table = $('<table />');
	table.appendTo(wheelsDiv);
	
	table.attr('class','wheelsTable');
	
	var tableRow = $('<tr />');
	tableRow.appendTo(table);

	for (var c=0; c< wheelArray.length; c++){
		var cell = $('<td />');
		cell.appendTo(tableRow);
		
		//create a new div to represent the fixed wheel display
		var div1 = $("<div />");
		div1.appendTo(cell);
		div1.attr('class','wheelDisplay');
		
		// create the div to hold the movable wheel
		var div = $("<div />");
		div.appendTo(div1);
		div.attr('class','wheel');
		div.attr('wheelsize',wheelArray[c].length);
		div.css('top',-iconSize*wheelArray[c].length+"px");
		
		for (var r = 0; r < wheelArray[c].length; r++){			
			// now here we need to set the image
			var symbol = wheelArray[c][r];
			symbol.getIcon().appendTo(div);
			//var icon_number = wheelArray[c][r];
			//getIconImage(icon_number).inject(div);
		}
		// add in the duplicate elements
		for (var dup = 0; dup < 3; dup++){
			symbol = wheelArray[c][dup];
			symbol.getIcon().appendTo(div);

			//icon_number = wheelArray[c][dup];
			//getIconImage(icon_number).inject(div);
		}

	}
				
}

// generates an array of random integers between 1 and the maxImageNumber
function generateRandomWheels(maxImageNumber,rows,columns){
	// create an empty array to hold the wheels (columns)
	var wheels = [];
	for (var c = 0; c<columns;c++){
		// for each wheel(column) create a new empty wheel		
		var wheel = [];
		// add the newly created wheel to the array of wheels
		wheels.push(wheel);
		for (var r = 0; r<rows; r++){
			var imageNum = Math.floor(Math.random()*maxImageNumber);
			// add the random number to the wheel 
			wheel.push(imageNum);
		}
		
	}
	return wheels;
}

function histogram(data,noOfBins){	
	bins = [];
	labels = [];
	var min;
	var max;
	for (var value in data){
		if (value > max){max = value;}
		if (value < min){min = value;}
	}
	

	
	var bw = (max-min)/noOfBins;
	for (var i = 0; i < noOfBins; i++){
		bins[i] = 0;
		labels[i] = Math.floor(min+(bw*i));
	}
	for (var i = 0; i < data.length; i++){
		var b = Math.floor((data[i]-min-0.1)/bw);
		bins[b] +=1;
	}

	return [bins,labels];
}






  


