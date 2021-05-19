/* 👇 Start writing your p5.js code here */

//de slang ben ik met mijn hoofd erop en ik word steeds langer hoe meer proteine shakes ik drink.

var s; //snake
var scl = 30; //scale
var food; //eten
var currentscore = 0; //begin score = 0, want je begint zonder score
var score = document.getElementById("currentscore"); //pakt html element met id currentscore
var gameoverscreen = document.querySelector(".gameover"); //pakt de class gameover
var bgColor; //maakt de variable bgColor aan zonder waarde, zodat hier later een kleur in opgeslagen kan worden


//functie speelbord creeërt
function setup() {
  createCanvas(1240, 760);
  s = new Snake();
  frameRate(10);
  pickLocation();
  backgroundColor();
}


//Functie om random background color te generereren. 3 x random variable tussen 0 en 256 ( rgb waardes ), dit wordt dan aan elkaar gestringed en in var bgColor opgeslagen. (bijvoorbeeld:  rgb(0, 144,23) )
function backgroundColor() {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  bgColor = "rgb(" + r + "," + g + "," + b + ")";
}



// functie geschreven die een locatie pakt in de grid. 
function pickLocation() {
  var cols = floor(width / scl);
  var rows = floor(height / scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);
}


// background (bgColor) geeft de random achtergrondkleur weer die er in is opgeslagen.
function draw() {
  background(bgColor);

  s.death();
  s.update();
  s.show();

  if (s.eat(food)) {
    pickLocation();
  }

  var cols = floor(width / scl);
  var rows = floor(height / scl);

// https://www.w3schools.com/tags/canvas_drawimage.asp
//De drawImage() methode tekent een afbeelding, canvas of video op het canvas. Deze methode kan ook delen van een afbeelding tekenen en/ of de afbeeldingsgrootte vergroten/verkleinen.
  var canvas = document.getElementById('defaultCanvas0');
  var ctx = canvas.getContext('2d');


  //image() maakt een nieuw HTMLImageElement (vergelijkbaar met document.createElement('img')) 
  // src specificeerd de url van een externe script file (in dit geval de url van de food img)
  var foodimg = new Image();
  foodimg.src = ("img/food.svg");
  // de image die ik heb gebruikt voor de food-icon: https://www.flaticon.com/free-icon/bottle_1676523?term=shake&related_id=1676523

  //fill de food blokjes met een transparante bg color (4e getal in de color code hieronder is de transparantie)
  fill(0, 255, 0, 0);

  ctx.drawImage(foodimg, food.x, food.y, scl, scl);
  rect(food.x, food.y, scl, scl);
}

//function dat een soort global event is, wordt keyPressed genoemd.

function keyPressed() {
  if (keyCode === UP_ARROW) {
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    s.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    s.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    s.dir(-1, 0);
  }
}

// Met deze functie kon ik d.m.v op mijn rechter muisknop klikken de slang groter maken. Om te controleren of de slang dood gaat als hij tegen zichzelf aankomt.
// function mousePressed() {
//s.total++;
//}

// Een constructor function. Hierin geef je een object een x en y waarde. Daarnaast wil je dat de slang begint met bewegen. Dit doe je door de functie slang een xspeed en yspeed waarde te geven, als je de xspeed de waarde 1 geeft begint de slang van links -> rechts te bewegen. En als je de yspeed de waarde 1 geeft gaat de slang van boven -> beneden bewegen. Al deze waardes zorgen ervoor dat de slang door het canvas heen bewegen.
function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 1;
  this.tail = [];

  this.dir = function (x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  this.eat = function (pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
      // de afstand tussen de slang en de milkshake
    if (d < 1) {
      this.total++;
      Scorebord(); //elke keer als de slang er een tail bij krijgt (en de score omhoog zou moeten gaan) wordt de functie om het scorebord up te daten aangeroepen.
      return true;
    } else {
      return false;
    }
  }
  //op minuut 23:20 video: https://www.youtube.com/watch?v=AaGK-fj-BAM&ab_channel=TheCodingTrain
  // new function -> "if whatever is in the new spot is connected with any of these and we need to make sure we do this before we shift anything in because we dont want its current spot to have actually shifted into the array".
  this.death = function () {
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      // de afstand tussen de x-location en de nieuwe plek van de nieuwste onderdeel van de slang.
      if (d < 1) {
        console.log('starting over');
        this.total = 0; // het is 0, vanwege zijn current location.
        this.tail = []; // een array
        gameover(); //trigger de gameover functie
      }
    }
  }

  // Alle oude onderdelen van de slang worden meegenomen nadat de slang iets heeft gegeten, waardoor het nieuwe onderdeel van de slang aan het einde van de array wordt neergezet. Hij wordt dus steeds langer, hoe meer hij eet.
  this.update = function () {
    if (this.total === this.tail.length) {
      for (var i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.total - 1] = createVector(this.x, this.y);
    // An array that always shifts everything back and the new spot goes in the end.
    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;

    // Dit is een constrain. Die zorgt ervoor dat de slang binnen de canvas blijft en er niet doorheen kan gaan. 
    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - scl);
  }

  this.show = function () {
    var canvas = document.getElementById('defaultCanvas0');
    var ctx = canvas.getContext('2d');

    var snakeHeadimg = new Image();
    snakeHeadimg.src = ("img/Snake.png");
    var snakeimg = new Image();
    snakeimg.src = ("img/Slange_deel.png");

    //JavaScript syntax: 	context.drawImage(img,xy,,width,height);
    ctx.drawImage(snakeHeadimg, this.x, this.y, scl, scl);

      
    // Een Array die de current location van de slang in de laatste plek neerzet. 
    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
      ctx.drawImage(snakeimg, this.tail[i].x, this.tail[i].y, scl, scl);
    }
    rect(this.x, this.y, scl, scl);
  }
}


//Scorebord
function Scorebord() {
  currentscore = currentscore + 1; //currentscore had in het begin een waarde van 0 gekregen, nu elke keer dat deze functie getriggered wordt, update de score met  + 1
  score.innerHTML = currentscore; //verander de html zodat de score ook zichtbaar is op het scorebord
}

//Gameover functie, laat het gameover functie scherm zien, update de score
//window.keyPressed = function(){}; zorgt ervoor dat de functie "keypressed" leeg komt te staan, en dit zorgt ervoor dat je de slang niet meer kan bewegen (op het moment dat je gameover bent).
function gameover() {
  gameoverscreen.classList.add("gamerestart");
  window.keyPressed = function () {};
}


//pak het html element met id restart button, luister ernaar tot er op geklikt wordt, als dit gebeurt voer een fuctie uit die de URL reload.
document.getElementById("restartbtn").addEventListener("click", function () {
  location.reload();
});

// De basis van het spel heb ik gevonden door het kanaal van The Coding Train. Hierop legt een programmerder precies uit hoe je de basis krijgt van een snake spelletje: https://www.youtube.com/watch?v=AaGK-fj-BAM&ab_channel=TheCodingTrain

//https://stackoverflow.com/questions/49240718/how-to-create-a-restart-button-for-a-game-in-java-script
//https://www.w3resource.com/javascript-exercises/javascript-math-exercise-40.php
//https://stackoverflow.com/questions/39876582/disabling-a-function-with-another-function-vanilla-js/39876689