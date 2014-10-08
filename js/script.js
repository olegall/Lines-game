



$(window).ready(function(){
	

	
	
	
	function promptBall(position){
		this.position = position;
	}	
	
	function ball(){

	}
	
	
	
	
	
	
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
		balls[i1].__proto__ = promptBalls[i1];
		balls[i1].src = "images/"+images[randomPromptBallNum];	
	}

	
	
	Field.prototype.moveBall = function(){
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