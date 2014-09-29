



$(window).ready(function(){
	
	var movedBallSrc;
	var lineLength = 5;
	var ballInLineIndex;
	
	function createRandomBalls(){
		var images = ["blue.jpg", "green.jpg", "red.jpg", "sea.jpg", "violet.jpg", "yellow.jpg"];
		var createdBallsNum = 5;
		
		var cellsNum = $("img").length;
		var ballsNum = images.length - 1;
		
		for (var i1=0; i1<createdBallsNum; i1++){
		
			var emptyCellsIndexes = new Array();
			
			for (var i=0; i<$("img").length; i++){
				if ($("img:eq("+i+")").attr("src") == undefined){
					emptyCellsIndexes.push(i);
				}
			}		
			
			var randomCellNum = Math.floor(Math.random() * (emptyCellsIndexes.length));
			var randomBallNum = Math.floor(Math.random() * (ballsNum + 1));

			$("img:eq("+emptyCellsIndexes[randomCellNum]+")").attr("src", "images/"+images[randomBallNum]);

			if (emptyCellsIndexes.length == 1){
				alert("Игра окончена. Вы проиграли.");
			}
			delete emptyCellsIndexes;
		}
	}

	function moveBall(event){

		var grey 	= "1px solid rgb(128, 128, 128)";
		var red 	= "1px solid rgb(255, 0, 0)";
		
		if ($(event.target).attr("src") != undefined){		// клик по шару
		
			var i = $(event.target).index();
			
			if ($(event.target).css("border") == grey){ 
				$("img").css("border","1px solid grey");
				$(event.target).css("border","1px solid red");
				movedBallSrc = $(event.target).attr("src");
			} 
			else 
			if ($(event.target).css("border") == red){
				$(event.target).css("border","1px solid grey");			
			}
			
		} else {											// клик по пустому месту
			$("img").each(function(index) {
				if ($(this).css("border") == red){

					$(event.target).attr("src", $(this).attr("src"));
					$(this).removeAttr("src");
					$(this).css("border", grey);
					createRandomBalls();
					return;
				}
			});
			
			if (deleteIfLine(event, "horizontal")){
				
				return;
			}
			else
			if (deleteIfLine(event, "vertical")){
				return;
			}
			else
			if (deleteIfLine(event, "diagonalUp")){
				return;
			}
			else
			if (deleteIfLine(event, "diagonalDown")){
				return;
			}
		}
	}
	
	
	function deleteIfLine(event, lineType){
		var shift;

		switch (lineType) {
			case "horizontal": 
				shift = 1;
				break;
			case "vertical": 
				shift = 10;
				break;
			case "diagonalUp": 
				shift = 9;
				break;
			case "diagonalDown":
				shift = 11;
				break;		
			default:
				;
		}
		
		
		ballInLineIndex = $(event.target).index("img");
		var movedBall = $("img:eq("+ballInLineIndex+")").attr("src");
		var ballBefore = $("img:eq("+(ballInLineIndex-shift)+")").attr("src");
		var ballAfter = $("img:eq("+(ballInLineIndex+shift)+")").attr("src");
		// ищем начало линии
		if (   ( (movedBall == ballBefore) && (ballBefore != undefined) ) || ( (movedBall == ballAfter) && (ballAfter != undefined) )   ){
			
			while ($("img:eq("+ballInLineIndex+")").attr("src") == 
				   $("img:eq("+(ballInLineIndex-shift)+")").attr("src")){
					
					ballInLineIndex-=shift;
			}
		} else {
			return 0;
		}		
		// пришли к началу линии
		
		
		
		// есть 5 одинаковых шариков?
		var lineBeginsIndex = ballInLineIndex;
		
		for (ballInLineIndex; ballInLineIndex < lineBeginsIndex + shift*(lineLength-1); ballInLineIndex+=shift){	
			if ($("img:eq(" + ballInLineIndex + ")").attr("src") != 
		        $("img:eq(" + (ballInLineIndex + shift) + ")").attr("src")){
				return 0;
			}
		}
		
		
		// удаляем линию
		for (ballInLineIndex; ballInLineIndex>lineBeginsIndex-lineLength; ballInLineIndex-=shift){
			
			$("img:eq(" + ballInLineIndex + ")").removeAttr("src");
		}
		
		return 1;
	}
	
	createRandomBalls();

	$("img").click(function(event) {
		moveBall(event);
	});
	
	
});