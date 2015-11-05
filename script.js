$(document).ready(function($){


	var apiKey = 'eac2948bfca65b78a8c5564ecf91d00e';
	var baseUrl = "http://api.openweathermap.org/data/2.5/weather?zip=";
	var endUrl = ',us&units=imperial&APPID='+apiKey;
	// var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=Dallas,tx&units=imperial&APPID="+apiKey;
	$('#weather-submit').submit(function(){
		event.preventDefault();
		var zipCode = $('#input-text').val();
		$('#input-text').val("");
		var weatherUrl = baseUrl + zipCode + endUrl;
		$.getJSON(weatherUrl, function(weatherData){
			var currLocation = weatherData.name;
			if(currLocation == null){
				$('#weather-location').html("Invalid Location");
			}else{
				$('#weather-location').html(currLocation + ' Weather');
				var currTemp = weatherData.main.temp;
				var weatherIcon = weatherData.weather[0].icon;
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

				var lineWidth = 5;
				var outterRadius = 70;
				var innerRadius = outterRadius - lineWidth;
				var currPerc = 0;
				var counterClockwise = false;
				var circ = Math.PI * 2;
				var quart = Math.PI / 2;
				var shadeColor;
				var displayDegree = Math.floor(currTemp);


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
		})
	})

});