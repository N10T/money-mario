var explainHTML, gameHTML, homeHTML, scoreHTML, coins, coin, bpm;
var modeSelected = "";
const homeMusic = new Audio("./sounds/music-Title.mp3");
let score = 0;
const coinSound = new Audio(
  "https://freesound.org/data/previews/341/341695_5858296-lq.mp3"
);
var player = {
  coin: 0,
  score: 0,
  touchedBy: [],
  coinAt: [],
  maxBPM: 0
};

var ennemi = [
  "walking-bomb",
  "flying-koopa",
  "flying-bee",
  "flying-bee",
  "cloud"
];

axios
  .get("./index.html")
  .then(response => {
    homeHTML = response.data;
  })
  .catch(err => {
    console.log("index.html is not find");
  });

axios
  .get("./views/explain.html")
  .then(response => {
    explainHTML = response.data;
    // Here we can do something with the response object
  })
  .catch(err => {
    // Here we catch the error and display it
  });

axios
  .get("./views/game.html")
  .then(response => {
    gameHTML = response.data;
  })
  .catch(err => {
    console.log("game.html is not find");
  });

axios
  .get("./views/score.html")
  .then(response => {
    scoreHTML = response.data;
  })
  .catch(err => {
    console.log("score.html is not find");
  });

function start() {
  console.log("Start !");
  const musicbox = document.getElementById("musicbox");
  const body = document.getElementById("all");
  const coins = document.querySelectorAll(".coin");
  const title = document.getElementById("title");
  const popup = document.getElementById("popup");
  title.onmouseover = function() {
    if (homeMusic.paused) {
      homeMusic.play();
      homeMusic.loop = true;
    }
    homeMusic.volume = 0.5;
  };
  musicbox.onclick = () => {
    if (homeMusic.paused) {
      homeMusic.play();
      musicbox.classList.add("musicplay");
      musicbox.classList.remove("musicpause");
    } else {
      homeMusic.pause();
      musicbox.classList.remove("musicplay");
      musicbox.classList.add("musicpause");
    }
    homeMusic.loop = true;
  };

  coins.forEach(
    e =>
      (e.onclick = function firstCoins(e) {
        if (homeMusic.played) {
          homeMusic.play();
          homeMusic.loop = true;
        }

        score += 1;

        const hereWeGoURL = new Audio(
          "http://www.mariomayhem.com/downloads/sounds/mario_64_sound_effects/mario-herewego.WAV"
        );
        coinSound.volume = 0.6;
        coinSound.play();
        e.target.classList.remove("coin");
        
        if (score === 5) {
          hereWeGoURL.play();
          // page out with sound
          title.parentElement.classList.add("scale-out");
          setTimeout(gonextpage, 500);
          function gonextpage() {
            body.innerHTML = explainHTML.substring(
              explainHTML.search("<body") - 4,
              explainHTML.search("</body") + 7
            );
            refreshPage2();
          }
        }
      })
  );
}

function refreshPage2() {
  //--------------------------------------------------------------------------------------------------------------------
  const peopleCard = document.querySelectorAll("#container2 .people");
  const container = document.getElementById("container2");
  // const tube = document.getElementById("tube");
  const body = document.querySelector("body");
  var all = document.getElementById("all");
  const level = document.querySelectorAll("#container3 .level");
  const gameCSS = "./css/game.css";

  const moveTheBar = function(e) {
    let position = 0;
    var x = e.clientX;
    position = x - window.innerWidth / 2;
    if (!(e.clientX % 100))
      new Audio("./sounds/swipe_page_fireball.wav").play();
    if (position > 330) position = 330;
    if (position < -330) position = -330;
    container.style.transform = `translate(${position}px)`;
  };

  function selectLevel() {
    new Audio("./sounds/select_level_kick.wav").play();
  }

  // tube.onclick = function() {
  //   all.querySelectorAll("*").forEach(a => a.classList.add("scale-out"));
  //   new Audio("./sounds/pipe.wav").play();

  //   setTimeout(function() {
  //     all.innerHTML = homeHTML;
  //     start();
  //     all = document.getElementById("all");
  //     all.querySelectorAll("*").forEach(a => a.classList.remove("scale-out"));
  //   }, 500);
  // };

  function playTheGame(e) {
    modeSelected = e.target.parentElement.id.match(/hard|normal|easy/gi)
      ? e.target.parentElement.id
      : e.target.id;
    console.log(modeSelected);
    console.dir(e.target.parentElement.id);

    body.innerHTML = gameHTML.substring(
      gameHTML.search("<body") - 4,
      gameHTML.search("</body") + 7
    );
    game();
    document.querySelector("link").href = gameCSS;
  }

  level.forEach(a => (a.onmouseenter = selectLevel));
  level.forEach(a => (a.onclick = playTheGame));
  peopleCard.forEach(e => (e.onmousemove = moveTheBar));
}

function game() {
  //----------------------------------------------------------------------------------------------------------------
  var x, y;
  let body = document.querySelector("body");

  var mode = {
    hard: {
      speed: 0.5,
      life: 30,
      coin: 5,
      soundtrack: new Audio("./sounds/hard-soundtrack.mp3"),
      bpm: +10
    },
    normal: {
      speed: 0.4,
      life: 30,
      coin: 5,
      soundtrack: new Audio("./sounds/normal-soundtrack.mp3"),
      bpm: 0
    },
    easy: {
      speed: 0.3,
      life: 50,
      coin: 10,
      soundtrack: new Audio("./sounds/easy-soundtrack.mp3"),
      bpm: -20
    }
  };

  class People {
    constructor(name, power, dom) {
      this.name = name;
      this.power = power;
      this.dom = dom;
      this.x = 0;
      this.y = 0;
      this.soundURL = "";
      this.speed = this.name === "Bob-ombs" ? 5 : 10;
      this.image = "";
    }

    attack = () => {
      this.power >= 10 ? playSound(ouch) : playSound(bizz);
      life -= this.power;
      life <= this.power
        ? (lifeDOM.textContent = "00")
        : (lifeDOM.textContent = twoDigits(life));
      player.touchedBy.push(this.name);
      if (+bpm.textContent.substring(0, bpm.textContent - 4) > player.maxBPM) {
        player.maxBPM = +bpm.textContent.substring(0, bpm.textContent - 4);
      }
      if (!+lifeDOM.textContent) {
        setTimeout(() => {
          new Audio(".././sounds/gameover.wav").play();
          alert("You lose");

          mode[modeSelected].soundtrack.pause();
          player.coin = +score.textContent;
          player.maxBPM = bpm.textContent;
          body.innerHTML = scoreHTML.substring(
            scoreHTML.search("<body") - 4,
            scoreHTML.search("</body") + 7
          );
          document.querySelector("link").href = "./css/score.css";
          scorePage();
        }, 200);
        document.getElementsByClassName('grille').forEach(a=>classList.remove("coin"))
        clearInterval(doItWalk);
        clearInterval(doItFly);
        clearInterval(makeItRain);
        clearInterval(doKoopaFly);
      } else {
        popup.innerText = this.name + " takes you " + this.power + " HP";
        setTimeout(() => {
          popup.innerText = "";
        }, 4000);
      }
    };
    gain = () => (score.textContent += this.power);

    move(p) {
      acurateSound();

      if (!p) {
        p = this.dom.classList.value.includes("start") ? "right" : "left";
      }
      if (this.name === "Cloudy"){
        this.speed = this.speed+0.01*mode[modeSelected].speed*+score.textContent
      }
      if (this.name === "Koopa") {
        this.speed =
          mode[modeSelected].speed * this.speed +
          +score.textContent * Math.random();
        this.x -= this.speed;
        if (this.x < -80) this.x = window.innerWidth;
        if (this.speed > 15) {
          koopa.dom.classList.remove("walking-koopa");
          koopa.dom.classList.add("flying-koopa");
          if (this.x < -window.innerWidth) this.x = this.dom.clientWidth + 20;
          followCursor()[1] > window.innerHeight / 2
            ? (this.y += 100 / followCursor()[1])
            : (this.y -= 100 / followCursor()[1]);
          this.y < -530 ? (this.y = 0) : this.y > 0 ? (this.y = -531) : "";
        }
        this.dom.style.transform = `translate(${this.x}px,${this.y}px)`;
      }

      if (this.name === "O'Bee One" || this.name === "2'Bee Free") {
        this.speed =
          mode[modeSelected].speed * this.speed +
          +score.textContent * Math.random();
        if (this.y > 100) upNdown = -1;
        if (this.y < -100) upNdown = +1;
        this.y += upNdown * this.speed;
      }
      if (p.includes("left") && this.name !== "Koopa") {
        this.x -= this.speed;
        this.dom.style.transform = `translate(${this.x}px,${this.y}px)`;
        if (this.x < -window.innerWidth) this.x = this.dom.clientWidth + 20;
      }
      if (p.includes("right") && this.name !== "Koopa") {
        this.x += this.speed;
        this.dom.style.transform = `translate(${this.x}px,${this.y}px) rotateY(180deg)`;
        if (this.x > window.innerWidth) this.x = -this.dom.clientWidth;
      }
    }
  }
  const acurateSound = () => {
    mode[modeSelected].soundtrack.playbackRate = 1 + 0.005 * score.textContent;
    bpm.innerText =
      Math.floor(
        mode[modeSelected].soundtrack.playbackRate * 90 + mode[modeSelected].bpm
      ) + " BPM";
  };

  // Audio -------------------------------------------------------------------------------------------
  homeMusic.pause();
  mode[modeSelected].soundtrack.play();
  mode[modeSelected].soundtrack.loop = true;
  const woo =
    "http://www.mariomayhem.com/downloads/sounds/mario_64_sound_effects/mario-woo.WAV";
  const woohoo =
    "http://www.mariomayhem.com/downloads/sounds/mario_64_sound_effects/mario-woohoo.WAV";
  const hereWeGo =
    "http://www.mariomayhem.com/downloads/sounds/mario_64_sound_effects/mario-herewego.WAV";
  const coin = "https://freesound.org/data/previews/341/341695_5858296-lq.mp3";
  const boom =
    "http://www.mariomayhem.com/downloads/sounds/mario_64_sound_effects/cannon-fire.WAV";
  const ouch =
    "http://www.mariomayhem.com/downloads/sounds/mario_64_sound_effects/mario-lowonhealth.WAV";
  const bizz = "./sounds/bee_bump.wav";
  // const marioSoundtrack = new Audio(
  //   "http://23.237.126.42/ost/super-mario-bros.-3/rifwvpjl/01%20-%20Grass%20Land.mp3"
  // );
  // Initialisation -----------------------------------------------------------------------------
  const pauseBtn = document.getElementById("howto");
  var life = mode[modeSelected].life;
  const lifeDOM = document.querySelector("#life p");
  lifeDOM.textContent = life;
  let upNdown = 1;
  const bomb = new People("Bob-ombs", 10, document.querySelector(".bomb"));
  const bees = document.querySelectorAll(".bee");
  const bee1 = new People("O'Bee One", 5, bees[0]);
  const bee2 = new People("2'Bee Free", 5, bees[1]);
  const cloud = new People("Cloudy", 7, document.querySelector(".cloud"));
  const musicBox = document.querySelector(".music");
  const bpm = document.getElementById("bpm");
  const koopaDOM = document.querySelector(".walking-koopa");

  var score = document.querySelector("#score");
  const doItWalk = setInterval(bombWalk, 70);
  const doItFly = setInterval(beeFly, 70);
  const makeItRain = setInterval(cloudRain, 70);
  const doKoopaFly = setInterval(koopaWalk, 50);
  document.getElementById("all").addEventListener("mousemove", followCursor);
  function followCursor(e) {
    let position = 0;
    x = e ? e.clientX : x;
    y = e ? e.clientY : y;
    return [x, y];
  }
  function pauseTheGame() {
    new Audio("./sounds/pause.wav").play();
    mode[modeSelected].soundtrack.pause();
    setTimeout(function() {
      alert("pause");
      new Audio("./sounds/pause.wav").play();
      mode[modeSelected].soundtrack.play();
    }, 50);
  }
  pauseBtn.onclick = pauseTheGame;

  bomb.dom.addEventListener("mouseover", mouseOverBomb);
  bees.forEach(bee => bee.addEventListener("mouseover", mouseOverBee));
  cloud.dom.addEventListener("mouseover", mouseOverCloud);

  function mouseOverCloud(e) {
    cloud.attack();
    e.target.removeEventListener("mouseover", mouseOverCloud);
    setTimeout(() => {
      e.target.addEventListener("mouseover", mouseOverCloud);
    }, 2000);
  }

  function mouseOverBee(e) {
    bee1.attack();
    e.target.removeEventListener("mouseover", mouseOverBee);
    setTimeout(() => {
      e.target.addEventListener("mouseover", mouseOverBee);
    }, 2000);
  }

  repeatFunction(createACoin, 5);

  musicBox.onclick = () => {
    new Audio("./sounds/pause.wav").play();
    mode[modeSelected].soundtrack.paused
      ? mode[modeSelected].soundtrack.play()
      : mode[modeSelected].soundtrack.pause();
    mode[modeSelected].soundtrack.loop = true;
  };

  function cloudRain() {
    cloud.y = 0;
    cloud.move("goright");
  }

  function beeFly() {
    bee1.move();
    bee2.move();
  }

  function koopaWalk() {
    koopa.move();
  }

  function bombExplosion() {
    bomb.dom.classList.remove("bomb-explose");
    clearInterval(doItWalk);
    coins.forEach(a => a.classList.remove("coin")); // remove all coins
    repeatFunction(createACoin, coins.length); // create all new coins
    playSound(boom);
  }

  function bombWalk() {
    bomb.move("goleft");
  }

  function coinClicked(e) {
    playSound("https://freesound.org/data/previews/341/341695_5858296-lq.mp3");
    e.target.classList.remove("coin");
    e.target.removeEventListener("click", coinClicked);
    score.textContent = twoDigits(+score.textContent + 1);
    console.log("+1");
    if (!(+score.textContent % 50))
      playSound(
        "http://www.mariomayhem.com/downloads/sounds/mario_64_sound_effects/mario-herewego.WAV"
      );
    else if (!(+score.textContent % 10))
      playSound(
        "http://www.mariomayhem.com/downloads/sounds/mario_64_sound_effects/mario-woohoo.WAV"
      );
    createACoin();
    refresh(coins);
  }

  function mouseOverBomb() {
    bomb.dom.removeEventListener("mouseover", mouseOverBomb);
    bomb.attack();
    bomb.dom.classList.remove("bomb");
    bomb.dom.classList.add("bomb-explose");
    setTimeout(bombExplosion, 500);
    playSound(
      "http://www.mariomayhem.com/downloads/sounds/mario_64_sound_effects/mario-woo.WAV"
    );
  }

  const twoDigits = n => (("" + n).length === 1 ? "0" + n : n);

  const playSound = url => new Audio(url).play();

  function createACoin() {
    const grille = document.getElementsByClassName("grille");
    let n = Math.floor(
      1 + Math.random() * document.getElementById("grid").childElementCount
    );
    [...grille[n].classList].length !== 1
      ? createACoin()
      : grille[n].classList.toggle("coin");
    refresh(coins);
  }

  const koopa = new People("Koopa", 7, koopaDOM);

  koopa.dom.addEventListener("mouseover", mouseOverKoopa);

  function mouseOverKoopa() {
    koopa.attack();
    e.target.removeEventListener("mouseover", mouseOverKoopa);
    setTimeout(() => {
      e.target.addEventListener("mouseover", mouseOverKoopa);
    }, 2000);
  }

  function refresh(dom) {
    if (dom === coins) {
      coins = document.querySelectorAll(".coin:not(p)");
      coins.forEach(a => a.addEventListener("click", coinClicked));
      coins.forEach(a => a.addEventListener("touchstart", coinClicked));
    }
  }

  function repeatFunction(f, times) {
    [...Array(times)].forEach(a => f());
  }
}

function scorePage() {
  function calculWorstEnnemi(arr) {
    let name = ["Bob-ombs", "Koopa", "O'Bee One", "2'Bee Free", "Cloudy"];
    let nameRpt = [
      arr.filter(a => a === "Bob-ombs").length,
      arr.filter(a => a === "Koopa").length,
      arr.filter(a => a === "O'Bee One").length,
      arr.filter(a => a === "2'Bee Free").length,
      arr.filter(a => a === "Cloudy").length
    ];
    return [
      nameRpt
        .map((a, i, arr) => (a === Math.max(...arr) ? name[i] : ""))
        .filter(a => a !== "")[0],
      ennemi[
        nameRpt
          .map((a, i, arr) => (a === Math.max(...arr) ? i : ""))
          .filter(a => a !== "")[0]
      ],
      Math.max(...nameRpt)
    ];
  }

  document
    .querySelector("#worst-ennemi div")
    .classList.add(calculWorstEnnemi(player.touchedBy)[1]);
  document.querySelector("#worst-ennemi p").textContent = `"I kicked your ass ${
    calculWorstEnnemi(player.touchedBy)[2]
  } time${calculWorstEnnemi(player.touchedBy)[2] > 1 ? "s" : ""} tho"`;
  const worstEnnemi = calculWorstEnnemi(player.touchedBy)[0];
  let coinsDOM = document.getElementById("coins");
  let bpmDOM = document.getElementById("bpm");
  let totalDOM = document.getElementById("total-score");
  const worstEnnemiDOM = document.querySelector("#worst-ennemi>h2");
  let bpm = +player.maxBPM.substring(0, 3);
  let increasePointsExecuted = false;
  let i = 0;
  let j = 0;
  let k = 0;
  let total = +player.coin + bpm;
  const soundEnd = new Audio(".././sounds/fin-score.wav");
  const pointCount = setInterval(increasePoints, 25);

  worstEnnemiDOM.textContent = worstEnnemi;

  function increasePoints() {
    i < player.coin ? i++ : i;
    j < bpm ? j++ : j;
    coinsDOM.textContent = i;
    bpmDOM.textContent = j;
    if (i === player.coin && j === bpm) {
      setTimeout(increaseTotal, 500);
      if (!increasePointsExecuted) {
        new Audio(
          "http://www.mariomayhem.com/downloads/sounds/mario_64_sound_effects/mario-woohoo.WAV"
        ).play();
      }
      increasePointsExecuted = true;
    }
  }
  function restartHandler(){
    soundEnd.pause()
    player.touchedBy = []
      document.querySelector('body').innerHTML = explainHTML.substring(
        explainHTML.search("<body")-4,explainHTML.search("</body")+7)
      refreshPage2();
      homeMusic.play()
      document.querySelector('link').href = "./css/home-style.css"
  }
  document.getElementById('restart').onclick = restartHandler
  function increaseTotal() {
    k < total ? k++ : k;
    totalDOM.textContent = k;
    if (!(k % 5))
      new Audio(
        "https://freesound.org/data/previews/341/341695_5858296-lq.mp3"
      ).play();
    if (k === total) {
      clearInterval(pointCount);
      setTimeout(function() {
        soundEnd.play();
         }, 500);
    }
  }
}

start();
