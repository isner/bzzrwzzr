'use strict';

var board = document.getElementById('board');
var teamPanel = document.getElementById('team-panel');

var len;

var config = {

  noDisplay: [8,9,10,11,14,15,16,17,20,21,22,23,26,27,28,29],

  categories: ['architecture', 'art-and-stage', 'business-world', 'communities', 'design', 'film', 'food-and-drink', 'geography', 'history', 'humans', 'language', 'literature', 'music', 'nature', 'politics', 'science', 'sports-and-games', 'technology', 'traditions-and-beliefs', 'tv-and-radio'],

  nums: ['one', 'two', 'three', 'four']

};

  // Add squares to the board
for (var i = 0; i < 36; i++) {

  var square = document.createElement('div');
  square.classList.add('square');

  if (i === 30) {
    square.id = 'start';
  }

  if (config.noDisplay.indexOf(i + 1) >= 0) {
    square.classList.add('hidden');
  } else {
    square.setAttribute('ondragover', 'allowDrop(event)');
    square.setAttribute('ondrop', 'dropPlayer(event)');
  }

  board.appendChild(square);

}

  // For each team
var teams = ['blue', 'red', 'green', 'yellow'];
len = teams.length;
for (var i = 0; i < len; i++) {

    // Make team panel
  var team = document.createElement('div');
  team.classList.add('team');
  team.classList.add('red-burst');
  team.classList.add(teams[i]);

    // Make question panel
  var questionPanel = document.createElement('div');
  questionPanel.classList.add('question-panel');
  team.appendChild(questionPanel);

    // Add question squares
  for (var ii = 0; ii < 4; ii++) {
    var square = document.createElement('div');
    square.classList.add('square');
    square.setAttribute('ondragover', 'allowDrop(event)');
    square.setAttribute('ondrop', 'dropQuestion(event)');

    var piece = document.createElement('div');
    piece.classList.add('piece');
    piece.setAttribute('draggable', true);
    piece.setAttribute('ondragstart', 'drag(event)');

    questionPanel.appendChild(square);
    square.appendChild(piece);
  }

    // Make point value indicators
  var pointWrap = document.createElement('div');
  pointWrap.className = 'point-values';
  for (var iv = 0; iv < 4; iv++) {
    var points = document.createElement('div');
    points.classList.add('points');
    points.classList.add(config.nums[iv]);
    for (var v = 0; v < iv + 1; v++) {
      var point = document.createElement('div');
      point.className = 'point';
      points.appendChild(point);
    }
    pointWrap.appendChild(points);
  }
  team.appendChild(pointWrap);

    // Make bonus panel
  var bonusPanel = document.createElement('div');
  bonusPanel.classList.add('bonus-panel');
  team.appendChild(bonusPanel);

    // Add bonus squares
  for (var iii = 0; iii < 3; iii++) {
    var square = document.createElement('div');
    square.classList.add('bonus');
    square.classList.add(teams[i]);
    bonusPanel.appendChild(square);
    square.innerHTML = iii < 2 ? 'b' : 'z';
  }

    // Make player/team name
  var teamname = document.createElement('div');
  teamname.classList.add('teamname');
  teamname.textContent = 'Team ' + (i + 1);
  team.appendChild(teamname);

  teamPanel.appendChild(team);

    // Make player/team avatar
  var avatar = document.createElement('div');
  avatar.classList.add('avatar');
  avatar.classList.add(teams[i]);
  avatar.setAttribute('draggable', true);
  avatar.setAttribute('ondragstart', 'drag(event)');
  document.getElementById('start').appendChild(avatar);
}

  // Add draw button
var drawButton = document.createElement('button');
drawButton.textContent = 'New Round';
drawButton.addEventListener('click', newRound);
teamPanel.appendChild(drawButton);

newRound();

  // Bind listener to toggle question borders
var questions = document.querySelectorAll('.question-panel .square');
len = questions.length;
for (var i = 0; i < len; i++) {
  questions[i].addEventListener('click', toggleBorder);
}

  // Bind listener to toggle bonus pieces
var bonuses = document.querySelectorAll('.bonus');
len = bonuses.length;
for (var i = 0; i < len; i++) {
  bonuses[i].addEventListener('click', toggleBonus);
}

  // Bind listener to edit teamnames
var teamnames = document.querySelectorAll('.teamname');
var teamLen = teamnames.length;
for (var i = 0; i < teamLen; i++) {
  teamnames[i].addEventListener('click', editTeamname);
}

function newRound() {
  var questions = document.querySelectorAll('.question-panel .piece');
  var categories = [].concat(config.categories);
  len = questions.length;
  for (var i = 0; i < len; i++) {
    questions[i].className = 'piece';
    var question = Math.floor(Math.random() * (categories.length - 1 + 1) + 1) - 1;
    questions[i].classList.add(categories[question]);
    categories.splice(question, 1);
    questions[i].parentNode.className = 'square';
  }
  var bonuses = document.querySelectorAll('.bonus');
  for (var i = 0; i < bonuses.length; i++) {
    bonuses[i].classList.remove('off');
  }
}

function toggleBorder(event) {
  var container = event.target.parentNode;
  var isGreen = container.classList.contains('border-green');
  var isRed = container.classList.contains('border-red');
  if (isGreen) {
    container.classList.remove('border-green');
    container.classList.add('border-red');
  } else if (isRed) {
    container.classList.remove('border-red');
  } else {
    container.classList.add('border-green');
  }
}

function toggleBonus(event) {
  event.target.classList.toggle('off');
}

function editTeamname(event) {
  var frame = event.target;
  var oldName = frame.textContent;
  frame.textContent = '';
  var input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.value = oldName;
  frame.appendChild(input);
  input.select();
  input.addEventListener('blur', submitName);
  input.addEventListener('keydown', inputKeyPressed);
}

function submitName(event) {
  var input = event.target;
  var frame = input.parentNode;
  frame.removeChild(input);
  frame.textContent = input.value;
}

function inputKeyPressed(event) {
  var which = event.which;
  if (which === 13) {
    event.target.removeEventListener('blur', submitName);
    submitName(event);
  }
}

function drag(event) {
  event.dataTransfer.setData('text', event.target.classList);
}

function allowDrop(event) {
  event.preventDefault();
}

function dropQuestion(event) {
  event.preventDefault();
  var draggedClass = event.dataTransfer.getData('text');
  var query = 'div.' + draggedClass.split(' ').join('.');

  var draggedPiece = document.querySelector(query);
  var source = draggedPiece.parentNode;
  var dropzone = event.target.parentNode;
  var swappedPiece = dropzone.childNodes[0];

  dropzone.appendChild(draggedPiece);
  source.appendChild(swappedPiece);
}

function dropPlayer(event) {
  event.preventDefault();
  var draggedClass = event.dataTransfer.getData('text');
  var query = 'div.' + draggedClass.split(' ').join('.');
  var draggedPlayer = document.querySelector(query);
  var dropzone = event.target;
  dropzone.appendChild(draggedPlayer);
}