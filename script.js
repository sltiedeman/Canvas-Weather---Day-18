setTimeout(function(){
	var windowHeight = window.innerHeight;
	var contentHeight = $('#intro-page').height();
	console.log(contentHeight);
	var paddingAdjust = parseInt((windowHeight - contentHeight)/2)
	$('#intro-page').css('padding-top', paddingAdjust + 'px');
},10);


function viewProject(){
	document.getElementById("intro-page-wrapper").style.display="none";
}



$(document).ready(function($){

	
	//get the api key for the weather site and other urls to enable us to get the weather data
	var apiKey = 'eac2948bfca65b78a8c5564ecf91d00e';
	var baseUrl = "http://api.openweathermap.org/data/2.5/weather?q=";
	var endUrl = ',us&units=imperial&APPID='+apiKey;

	//the submit function for when a user makes a search
	$('#weather-submit').submit(function(event){
		event.preventDefault(event);
		var zipCode = $('#input-text').val();
		$('#input-text').val("");	
		var weatherUrl = baseUrl + zipCode + endUrl;

		//get the weather object
		$.getJSON(weatherUrl, function(weatherData){
			console.log(weatherData);
			var currLocation = weatherData.name;
			if(currLocation == null){
				$('#weather-location').html("Invalid Location");
			}else{
				$('#weather-location').html(currLocation);
				//getting all the necessary pieces of data we want from the weather object
				var currTemp = weatherData.main.temp;
				var weatherIcon = weatherData.weather[0].icon;
				var cityid = weatherData.id;
				var iconHtml= '<img src="http://openweathermap.org/img/w/' + weatherIcon + '.png">';
				$('#weather-info').html(iconHtml);
				$('#degree-symbol').html('<img src="degree.png">');
				var canvas = $('#weather-canvas');
				var context = canvas[0].getContext('2d');
				// context.beginPath();
				// context.moveTo(0, 0);
				// context.lineTo(200, 200);
				// context.moveTo(0, 200);
				// context.lineTo(0, 50);
				// context.lineWidth = 10;
				// context.stroke();

				//setting the paramaeters for the circle weather interface
				var lineWidth = 5;
				var outterRadius = 70;
				var innerRadius = outterRadius - lineWidth;
				var currPerc = 0;
				var counterClockwise = false;
				var circ = Math.PI * 2;
				var quart = Math.PI / 2;
				var shadeColor;
				var displayDegree = Math.floor(currTemp);

				//set colors for circle according to temperature
				if(currTemp < 32){
					shadeColor = '#D4F0FF';
				}else if((currTemp >= 32)&&(currTemp<59)){
					shadeColor = '#129793';
				}else if((currTemp >= 59)&&(currTemp<75)){
					shadeColor = '#7cfc00';
				}else if((currTemp >= 75)&&(currTemp<90)){
					shadeColor = '#FF6600';
				}else{
					shadeColor = '#e3170d';
				}


				function animate(current){
					context.clearRect(0,0,250,500);
					context.fillStyle = "#c3c3c3";
					context.beginPath();
					context.arc(155,75,innerRadius,0,2*Math.PI,true);
					context.closePath();
					context.fill();

					context.lineWidth = 10;
					context.strokeStyle = shadeColor;
					context.beginPath();
					context.arc(155,75, outterRadius, -(quart), ((circ) * current) - quart, false);
					context.stroke();
					context.font = "48px Myriad Pro";
					context.fillStyle = "Black";
					context.textBaseline = "top";
					context.fillText(displayDegree, 194-outterRadius, 75-outterRadius/2);
					currPerc++;
					if(currPerc < currTemp){
						requestAnimationFrame(function(){ 
							animate(currPerc / 100);
						});
					}

				}	
				animate();
				context.closePath();
			}

			//need a different url to get the object for a weather forecast
			var forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?id=' + cityid + '&cnt=5&units=imperial&APPID=' + apiKey;
			var forecastHtml;
			var dayHtml;
			$.getJSON(forecastUrl, function(forecastData){
			
				//get the current date and subtract 1.  we'll add back a number during the loop
				var date = (new Date().getDay()) - 1;
				var dayToDisplay;
				for(i=0; i<forecastData.list.length; i++){
					date++;
					if(date>6){
						date=0;
					}
					forecastHtml = "";
					var lowTemp = Math.floor(forecastData.list[i].temp.min);
					var highTemp = Math.floor(forecastData.list[i].temp.max);

					switch (date){
						case 0:
					        dayToDisplay = "Sunday";
					        break;
					    case 1:
					        dayToDisplay  = "Monday";
					        break;
					    case 2:
					        dayToDisplay  = "Tuesday";
					        break;
					    case 3:
					        dayToDisplay  = "Wednesday";
					        break;
					    case 4:
					        dayToDisplay = "Thursday";
					        break;
					    case 5:
					        dayToDisplay  = "Friday";
					        break;
					    case 6:
					        dayToDisplay  = "Saturday";
					        break;
					}

					dayHtml = '<h2>' + dayToDisplay + '</h2>';
					var dayId = '#daynum' + i;
					$(dayId).html(dayHtml);
					forecastHtml += '<p>Low: ' + lowTemp + '</p>';
					forecastHtml += '<p>Max: ' + highTemp +'</p>';
					var temp = '#temp' + i;
					$(temp).html(forecastHtml);
					var weatherIcon = forecastData.list[i].weather[0].icon;
					var weatherIconHtml= '<img src="http://openweathermap.org/img/w/' + weatherIcon + '.png">';
					var icon = '#icon' + i;
					$(icon).html(weatherIconHtml);
					var tempDivHeight = $(temp).height();
					$(icon).css("height", tempDivHeight + 'px');
					if(i%2==0){
						$('#day' + i).css("border", "2px solid gray");
					}else{
						$('#day' + i).css("border-top", "2px solid gray");
						$('#day' + i).css("border-bottom", "2px solid gray");
					}
					var d = new Date();
					d = d.toString();
					var dateArray = [];
					for(x=0; x<3;x++){
						dateArray.push(d[x]);
					}
					d = dateArray[0] + dateArray[1] + dateArray[2];

				}

			});
		})

	})

});