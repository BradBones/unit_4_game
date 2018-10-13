// This event tells the browser to hold off running this script until the page has loaded.
$(document).ready(() => {

  // Array to hold the user feedback messages that guide the player through the game.
  var messages = [
    "WE ARE UNDER ATTACK - CHOOSE A SHIP ...", // Message 0
    "SELECT A TARGET FROM THE REMAINING SHIPS ...", // Message 1
    "TARGET IS DOWN, ENGAGE ANOTHER ...", // Message 2
    "THE FORCE IS WITH YOU ... CLICK TO PLAY AGAIN ...", // Message 3
    "EJECT ... EJECT ... CLICK TO PLAY AGAIN" // Message 4
  ];

  // Useful variables.
	var game = true;
	var selectedShip = [];
	var attacker;
	var defender;
	var player1Ship;
	var defenderSprite;
  var wins = 0;

  // Display a message that promps the player to choose a ship.
	$("#info").html("<div class='typewriter'>" + messages[0] + "</div>");

  // MAIN SETUP - The player clicks on a starship sprit and the game runs.
	$(".sprite").on("click", function(event) {
    if(attacker === undefined) {
      player1Ship = $(this);
      var player1 = event.target.id;
      selectedShip.push(player1);
      getPlayer(player1, "attacker");
      $("#fighters").append(player1Ship);
      $("#party").append($("#selectShip"));
      $("#info").html("<div class='typewriter'>" + messages[1] + "</div>");
      console.log("attacker is " + attacker.name);
    } else if(attacker != undefined && defender === undefined) {
      var player1 = event.target.id;
      defenderSprite = $(this);
      if (selectedShip.indexOf(player1) === -1) {
        selectedShip.push(player1);
        getPlayer(player1, "defender");
        $("#fighters").append(defenderSprite);
        console.log("defender is " + defender.name);
      }
    }
  });

  // Listener for the attack button that appears after ship selection.
  $("body").on("click", "#attackButton", () => {
    if(game) {
  		 combat();
    }
  });

  // Tests to see if a full game cycle has run and if so, allows the player to click in the feild to start a new game.
  $("#info").on("click", function() {
  	if(!game) {
  		window.location.reload();
  	}
  });

  // Assigns power levels to the selected player sprite in both attack and defence situations, allowing us to balance the game's dificulty level.
	function getPlayer(name, player) {
		if(player === "attacker") {
			switch (name) {
        case "rebelFighter":
          attacker = new Character("rebel Fighter", 700, 100, 0);
          break;
        case "rebelBomber":
          attacker = new Character("rebel Bomber", 1200, 100, 0);
          break;
        case "imperialBomber":
          attacker = new Character("imperial Bomber", 1000, 100, 0);
          break;
        case "imperialFighter":
          attacker = new Character("imperial Fighter", 600, 200, 0);
          break;
      }
    } else if(player === "defender") {
      	switch (name) {
        case "rebelFighter":
          defender = new Character("rebel Fighter", 800, 0, 50);
          break;
        case "rebelBomber":
          defender = new Character("rebel Bomber", 1000, 0, 100);
          break;
        case "imperialBomber":
          defender = new Character("imperial Bomber", 1200, 0, 100);
          break;
        case "imperialFighter":
          defender = new Character("imperial Fighter", 600, 0, 50);
          break;
      }
      // If wins is less than 3, the game is still in progress and the information area "Board" should display the current game stats.
      if (wins < 3) {
        updateBoard();
      }
		}
	}

  // Updates the game stats in realtime to the user feedback feild "Board" while the game is running.
	function updateBoard() {
		$("#info").html("");
    $("#info").append("PLAYER - " + attacker.health + "  |  " + defender.health + " - " + defender.name.toUpperCase());
    $("#info").append("<div id='attackButton'>! FIRE !</div>");
  }
  
  // The combat mechanics - Testing conditions to detirmine the outcome of each match and game.
	function combat() {
    if (attacker.health > 0 && defender.health > 0) {
      attacker.health = attacker.health - defender.counterAttack;
      defender.health = defender.health - attacker.attack;
      attacker.attack += 100;
      updateBoard();
      if (attacker.health <= 0) {
        // lose condition
        game = false;
        $("#info").html("<div class='typewriter'>" + messages[4] + "</div>");
      } else if (defender.health <= 0 && attacker.health > 0) {
        if (wins < 3) {
        	wins++;
          $("#info").html("<div class='typewriter'>" + messages[2] + "</div>");
          defenderSprite.remove();
          defender = undefined;
        }
        if(wins === 3) {
          // win condition
          game = false;
          $("#info").html("<div class='typewriter'>" + messages[3] + "</div>");
        }
      }
    }
  }

  // Takes the data from the getPlayer function and stores each peice in a variable?
	function Character(name, health, attack, counterAttack) {
		this.name = name; 
    this.health = health;
      console.log(health);
		this.attack = attack;
    this.counterAttack = counterAttack;
      console.log(counterAttack);
	}

});