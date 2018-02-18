$(window).ready(function(){
	function promptBall(position){
		this.position = position;
	}	
	promptBall.prototype.src = "";
	
	function ball(){
	}
	
	ball.prototype = Object.create(promptBall.prototype);
	
	function Field() {
	}
	
	var movedBallSrc;
	var lineLength = 5;
	var ballInLineIndex;
	
	var createdBallsNum = 5;
	var balls = new Array(createdBallsNum);
	var promptBalls = new Array(createdBallsNum);	
	
	var i1;
	var emptyCellsIndexes;
	var randomPromptCellNum;
	var randomPromptBallNum;
	var images = ["blue.jpg", "green.jpg", "red.jpg", "sea.jpg", "violet.jpg", "yellow.jpg"];
	var promptImages = ["prompt_blue.jpg", "prompt_green.jpg", "prompt_red.jpg", "prompt_sea.jpg", "prompt_violet.jpg", "prompt_yellow.jpg"];	
	
	Field.prototype.createRandomBalls = function(){
		var cellsNum = $("img").length;
		var ballsNum = images.length - 1;
		var srcs = new Array($("img").length);		
		var sign;
		for (var i=0; i<$("img").length; i++){
			if ($("img:eq("+i+")").attr("src") == undefined){
				sign = "fieldIsEmpty";
			} else {
				sign = "";
				break;
			}
		}
		
		for (i1=0; i1<createdBallsNum; i1++){
			emptyCellsIndexes = new Array();
			for (var i=0; i<$("img").length; i++){
				if ($("img:eq("+i+")").attr("src") == undefined){
					emptyCellsIndexes.push(i);
					
				}
			}		
			var randomCellNum = Math.floor(Math.random() * (emptyCellsIndexes.length));
			var randomBallNum = Math.floor(Math.random() * (ballsNum + 1));
			for (var i=0; i<$("img").length; i++){
				if ($("img:eq("+i+")").attr("src") == undefined){
					emptyCellsIndexes.push(i);
				}
			}
			randomPromptCellNum = Math.floor(Math.random() * (emptyCellsIndexes.length));
			randomPromptBallNum = Math.floor(Math.random() * (ballsNum + 1));
			delete emptyCellsIndexes;
			
			if (sign == "fieldIsEmpty"){
				$("img:eq("+emptyCellsIndexes[randomCellNum]+")").attr("src", "images/"+images[randomBallNum]);				
				$("img:eq("+emptyCellsIndexes[randomPromptCellNum]+")").attr("src", "images/"+promptImages[randomPromptBallNum]);
				createBallInstance();
			} else {
				$("img:eq("+balls[i1].position+")").attr("src", balls[i1].src);
				createBallInstance();				
				$("img:eq("+promptBalls[i1].position+")").attr("src", promptBalls[i1].src);
			}
		}
		field.checkIfLose();
	}

	Field.prototype.checkIfLose = function(){
		var checkSign = null;
		for (var i=0; i<$("img").length; i++){
			if ($("img:eq("+i+")").attr("src") == undefined){
				checkSign = "freeCellsExist";
				break;
			}
		}
		if(checkSign != "freeCellsExist"){
			$("h1").text("Вы проиграли. Обновите страницу");
		}	
	}
	
	function createBallInstance(){
		promptBalls[i1] = new promptBall(emptyCellsIndexes[randomPromptCellNum]);
		promptBalls[i1].src = "images/"+promptImages[randomPromptBallNum];
		balls[i1] = new ball();
		balls[i1].src = "images/"+images[randomPromptBallNum];	
		balls[i1].position = promptBalls[i1].position;
	}

	Field.prototype.moveBall = function(event){
		var grey 	= "1px solid rgb(128, 128, 128)";
		var red 	= "1px solid rgb(255, 0, 0)";

		if ($(event.target).attr("src") != "images/"+promptImages[0] && 
		    $(event.target).attr("src") != "images/"+promptImages[1] && 
		    $(event.target).attr("src") != "images/"+promptImages[2] && 
		    $(event.target).attr("src") != "images/"+promptImages[3] && 
		    $(event.target).attr("src") != "images/"+promptImages[4] && 
		    $(event.target).attr("src") != "images/"+promptImages[5] && 
		    $(event.target).attr("src") != undefined)
		{																	// клик по шару

			// блок формирования пути
			$("img").attr("class", "undefined");	// перед выбором шара очищаем поле от классов
			for (var i=0; i<$("img").length; i++){
				if ($("img").eq(i).attr("src") == "images/"+images[0] ||
					$("img").eq(i).attr("src") == "images/"+images[1] ||
					$("img").eq(i).attr("src") == "images/"+images[2] || 
					$("img").eq(i).attr("src") == "images/"+images[3] || 
					$("img").eq(i).attr("src") == "images/"+images[4] || 
					$("img").eq(i).attr("src") == "images/"+images[5]){

					$("img").eq(i).attr("class","ball");
				}
			}
			
			$(event.target).attr("class","ball");
			var undefinedBefore = $(".undefined").length;
			field.circleCell($(event.target),$(event.target).index("img"));
			
			for (;;)
			{
				for (var i = $(event.target).index("img"); i>=0; i--){
					if ($("img").eq(i).attr("class") != "undefined" && 
						$("img").eq(i).attr("class") != "ball"){
						field.circleCell($(event.target), i);
					}
				}
				for (var i = $(event.target).index("img"); i<$("img").length; i++){
					
					if ($("img").eq(i).attr("class") != "undefined" &&
						$("img").eq(i).attr("class") != "ball"
					){
						field.circleCell($(event.target), i);
					}
				}
				if ($(".undefined").length == undefinedBefore){
					break;
				}
				undefinedBefore = $(".undefined").length;
			}
			// конец блока формирования пути
			
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
		} 
		else 
		if ($(event.target).attr("src") != "images/"+promptImages[0] && 
		    $(event.target).attr("src") != "images/"+promptImages[1] && 
		    $(event.target).attr("src") != "images/"+promptImages[2] && 
		    $(event.target).attr("src") != "images/"+promptImages[3] && 
		    $(event.target).attr("src") != "images/"+promptImages[4] && 
		    $(event.target).attr("src") != "images/"+promptImages[5]) 
		{																	// клик по пустому месту и не по шару-превью
			if ($(event.target).attr("class") == "undefined"){
				return;
			}
			$("img").each(function(index) {
				if ($(this).css("border") == red){

					$(event.target).attr("src", $(this).attr("src"));
					$(this).removeAttr("src");
					$(this).css("border", grey);
					field.createRandomBalls();
					return;
				}
			});
			if (field.deleteIfLine(event, "horizontal")){
				return;
			}
			else
			if (field.deleteIfLine(event, "vertical")){
				return;
			}
			else
			if (field.deleteIfLine(event, "diagonalUp")){
				return;
			}
			else
			if (field.deleteIfLine(event, "diagonalDown")){
				return;
			}
		}
	}

	Field.prototype.circleCell = function (cellInside, cellInsideIndex){
		// ячейка на границе сверху
		if (cellInsideIndex == 1 || cellInsideIndex == 2 ||	cellInsideIndex == 3 ||					
			cellInsideIndex == 4 || cellInsideIndex == 5 ||	cellInsideIndex == 6 ||					
			cellInsideIndex == 7 || cellInsideIndex == 8)
		{		
			field.putPathStep(cellInside, cellInsideIndex, "east");		
			field.putPathStep(cellInside, cellInsideIndex, "south");		
			field.putPathStep(cellInside, cellInsideIndex, "west");				
		}
		else
		// ячейка на границе справа
		if (cellInsideIndex == 19 || cellInsideIndex == 29 || cellInsideIndex == 39 ||					
			cellInsideIndex == 49 || cellInsideIndex == 59 || cellInsideIndex == 69 ||					
			cellInsideIndex == 79 || cellInsideIndex == 89)
		{
			field.putPathStep(cellInside, cellInsideIndex, "south");		
			field.putPathStep(cellInside, cellInsideIndex, "west");				
			field.putPathStep(cellInside, cellInsideIndex, "north");					
		}
		else
		// ячейка на границе снизу
		if (cellInsideIndex == 91 || cellInsideIndex == 92 || cellInsideIndex == 93 ||					
			cellInsideIndex == 94 || cellInsideIndex == 95 || cellInsideIndex == 96 ||					
			cellInsideIndex == 97 || cellInsideIndex == 98)
		{
			field.putPathStep(cellInside, cellInsideIndex, "west");				
			field.putPathStep(cellInside, cellInsideIndex, "north");		
			field.putPathStep(cellInside, cellInsideIndex, "east");		
		}		
		else
		// ячейка на границе слева
		if (cellInsideIndex == 10 || cellInsideIndex == 20 || cellInsideIndex == 30	||				
			cellInsideIndex == 40 || cellInsideIndex == 50 || cellInsideIndex == 60 || 
			cellInsideIndex == 70 || cellInsideIndex == 80) 		
		{
			field.putPathStep(cellInside, cellInsideIndex, "north");		
			field.putPathStep(cellInside, cellInsideIndex, "east");		
			field.putPathStep(cellInside, cellInsideIndex, "south");		
		}		
		else 
		// ячейка в углу слева сверху
		if (cellInsideIndex == 0)
		{
			field.putPathStep(cellInside, cellInsideIndex, "east");		
			field.putPathStep(cellInside, cellInsideIndex, "south");		
		}		
		else 
		// ячейка в углу справа сверху
		if (cellInsideIndex == 9)
		{
			field.putPathStep(cellInside, cellInsideIndex, "west");		
			field.putPathStep(cellInside, cellInsideIndex, "south");		
		}
		else 
		// ячейка в углу справа снизу
		if (cellInsideIndex == 99)
		{
			field.putPathStep(cellInside, cellInsideIndex, "west");		
			field.putPathStep(cellInside, cellInsideIndex, "north");		
		}
		else 
		// ячейка в углу слева снизу
		if (cellInsideIndex == 90)
		{
			field.putPathStep(cellInside, cellInsideIndex, "north");		
			field.putPathStep(cellInside, cellInsideIndex, "east");		
		} else {
			field.putPathStep(cellInside, cellInsideIndex, "north");
			field.putPathStep(cellInside, cellInsideIndex, "east");		
			field.putPathStep(cellInside, cellInsideIndex, "south");		
			field.putPathStep(cellInside, cellInsideIndex, "west");				
		}
	}
	
	Field.prototype.putPathStep = function(cellInside, cellInsideIndex, direction){
		var shift;
		switch (direction) {
			case "north":
				shift = -10;
			break;
			case "east":
				shift = 1;
			break;
			case "south":
				shift = 10;
			break;		
			case "west":
				shift = -1;
			break;	
		}
		
		if ($("img").eq(cellInsideIndex+shift).attr("src") != "images/"+images[0] &&
			$("img").eq(cellInsideIndex+shift).attr("src") != "images/"+images[1] &&
			$("img").eq(cellInsideIndex+shift).attr("src") != "images/"+images[2] &&
			$("img").eq(cellInsideIndex+shift).attr("src") != "images/"+images[3] &&
			$("img").eq(cellInsideIndex+shift).attr("src") != "images/"+images[4] &&
			$("img").eq(cellInsideIndex+shift).attr("src") != "images/"+images[5]){
			$("img").eq(cellInsideIndex+shift).attr("class", "step");
		}
	}
	
	Field.prototype.deleteIfLine = function(event, lineType){
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
		if (   ( (movedBall == ballBefore) && (ballBefore != undefined) ) || 
		       ( (movedBall == ballAfter) && (ballAfter != undefined) )   ){

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
	
	var field = new Field();
	field.createRandomBalls();
	
	$("img").click(function(event) {
		field.moveBall(event);
	});
});
