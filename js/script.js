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
		};

		//Setup Stats
		self.X = 0;
		self.O = 0;
		self.Tie = 0;

		self.handleClick = function(e) {
			var character = self._getChar();
			var $target = $(e.target),
				data = $target.data(),
				x = data.x,
				y = data.y,
				point = self.board[y][x];

			if(point == "") {
				//clicked td is empty, go ahead and assign it a character.
				self.board[y][x] = character;
				$target.text(character).addClass(character);
			}
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
			var character = self._getChar();

			alert(character + " wins!");
			self[character]++
			self.reset();
		};

		self.handleTie = function() {
			alert("no one wins :(");
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
			self.board = [
				["", "" ,"" ],
				["" ,"" ,"" ],
				["" ,"" ,"" ]
			];
			self.updateStats();
			self._buildBoard();
		};

		self.updateStats = function(){
			$(".x-count").text(self.X);
			$(".o-count").text(self.O);
			$(".tie-count").text(self.Tie);
		};

	    self.init = function() {
	    	self.reset();
	    };
	    
	    self.init();

		return self;
	}

	window.Game = new Game();

})();


$(document).ready(function() {
	$("#board").on("click","td",Game.handleClick)
});