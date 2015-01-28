(function(model) {
	
	model.Game = function() {
		var self = this;

		self._getChar = function() {
			return self.playCount % 2 ? "X" : "O";
		};
		
		self.X = 0;
		self.O = 0;
		self.Tie = 0;

		self.HandleClick = function(e) {
			var character = self._getChar();
			var $target = $(e.target),
				data = $target.data(),
				x = data.x,
				y = data.y,
				point = self.board[y][x];

			if(!point) {
				self.board[y][x] = character;
				$target.text(character).addClass(character);
			}

			if(self.playCount >= 4) {
				self.CheckForWinner();
			} else {
				self.NextPlay();
			}
		};

		self.BuildBoard = function() {
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

		self.NextPlay = function() {
			self.playCount++;
		};

		self.CheckForWinner = function() {
			var player = self._getChar();
			// rows
			var win = false;
			self.board.forEach(function(row) {
				if(row.every(function(cell) {
					return cell == player
				})) {
					//left-to-right win!
					win = true;
				};
			})

			//columns
			for(var i = 0;i<3; i++) {
				if(self.board[0][i] == player &&
					self.board[1][i] == player &&
					self.board[2][i] == player) {

					//top to bottom win!
					win = true;
				}
			}

			//diagonal
			var center = self.board[1][1];
			if(center == player) {
				if(self.board[0][0] == player && self.board[2][2] == player) {
					//top-left to bottom-right win!
					win = true;
				}
				if(self.board[0][2] == player && self.board[2][0] == player) {
					//top-right to bottom-left win!
					win = true;
				}
			}

			if(win) {
				alert(player + " wins!");
				self[player]++
				self.Reset();
			} else if(self.playCount == 8) {
				alert("no one wins :(");
				self.Tie++;
				self.Reset();
			} else {
				self.NextPlay();
			}
		};

		self.Reset = function() {
			self.playCount = 0;
			self.board = [
				["", "" ,"" ],
				["" ,"" ,"" ],
				["" ,"" ,"" ]
			];
			self.BuildBoard();
			self.UpdateStats();
		};

		self.UpdateStats = function(){
			$(".x-count").text(self.X);
			$(".o-count").text(self.O);
			$(".tie-count").text(self.Tie);
		};

	    self.init = function() {
	    	self.Reset();
	    };
	    
	    self.init();

		return self;
	}

	$(document).ready(function() {
		window.Game = new model.Game();
		$("#board").on("click","td",Game.HandleClick)
	});
})({});