# Tic-Tac-Toe
A simple tic-tac-to, built with javascript. [Demo](http://nickvanmeter.com/projects/tic-tac-toe)!

+ Keeps track of the board state via a nested array (`self.board`) and uses that array to check for wins (left-to-right, top-to-bottom or diagonal) instead of parsing the DOM on each click.
+ Used `onTransitionEnd` to listen for when the transition of the table is complete to remove the `.resetting` class to show a new board.
