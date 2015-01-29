(function(model) {
	
	var Game = function() {
		var self = this;

		self._getChar = function() {
			return self.playCount % 2 ? "X" : "O";
		};
		
		self._buildBoard = function() {
			var $container = $("#board").empty();
			for(var y = 0; y < 3; y++) {
				var $row = $("<tr/>");
				for(var x = 0; x < 3; x++) {
					var $cell = $("<td/>").data({x:x,y:y});
					$row.append($cell);
				}
				$container.append($row);
			}
			$container.removeClass("resetting");
		};

		//Setup Stats
		self.X = 0;
		self.O = 0;
		self.Tie = 0;

		self.handleClick = function(e) {
			if(self.gameOver) {
				return;
			}
			var character = self._getChar();
			var $target = $(e.target),
				data = $target.data(),
				x = data.x,
				y = data.y,
				point = self.board[y][x];
			if(point != "") {
				return;
			}
			//clicked td is empty, go ahead and assign it a character.
			self.board[y][x] = character;
			$target.text(character).addClass(character);

			if(self.playCount < 4) {
				//Not possible to have a winner yet, keep playing!
				return self.nextPlay();
			}
			if(self.playCount >= 4) {
				if(self.isWinner()) {
					//Winner exists!
					self.handleWin();
				} else if(self.playCount == 8) {
					//Game Over!
					self.handleTie();
				} else {
					//Keep playing!
					self.nextPlay();
				}
			}
		};

		self.handleWin = function() {
			self.gameOver = true;
			var character = self._getChar();
			//alert(character + " wins!");
			$("." + character).addClass("wohoo");
			self[character]++
			//self.reset();
		};

		self.handleTie = function() {
			self.gameOver = true;
			//alert("no one wins :(");
			$(".tie").addClass("wohoo");
			self.Tie++;
			self.reset();
		};

		self.nextPlay = function() {
			self.playCount++;
		};

		self.isWinner = function() {
			var player = self._getChar(),
				i,
				center = self.board[1][1];

			// rows
			for(i = 0;i<3;i++) {
				var row = self.board[i];
				if(row.every(function(cell) {
					return cell == player
				})) {
					//left-to-right win!
					return true;
				};
			}

			//columns
			for(i = 0;i<3; i++) {
				if(self.board[0][i] == player &&
					self.board[1][i] == player &&
					self.board[2][i] == player) {

					//top to bottom win!
					return true;
				}
			}

			//diagonal
			if(center == player) {
				if(self.board[0][0] == player && self.board[2][2] == player) {
					//top-left to bottom-right win!
					return true;
				}
				if(self.board[0][2] == player && self.board[2][0] == player) {
					//top-right to bottom-left win!
					return true;
				}
			}
			
			return false;
		};

		self.reset = function() {
			self.playCount = 0;
			self.gameOver = false;
			self.board = [
				["", "" ,"" ],
				["" ,"" ,"" ],
				["" ,"" ,"" ]
			];

			self.updateStats();
		};

		self.updateStats = function(){
			$(".x-count").text(self.X);
			$(".o-count").text(self.O);
			$(".tie-count").text(self.Tie);
		};

	    self.init = function() {
	    	self.reset();
	    	self._buildBoard();
	    };
	    
	    self.init();

		return self;
	};

	window.TicTacToe = window.TicTacToe || {};

	TicTacToe.Game = new Game();

})();

$(document).ready(function() {
	$("#board")
		.on("click","td",TicTacToe.Game.handleClick)
		.on("webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd",function(e) {
			if($(e.target).is(".resetting")) {
				TicTacToe.Game._buildBoard();
			}
		});
	$(".stats li").on("webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd",function(e) {
		if(!$(e.target).is(".wohoo")) {
			$("#board").addClass("resetting");
			TicTacToe.Game.reset();
		}
		$(this).removeClass("wohoo");

	})
});