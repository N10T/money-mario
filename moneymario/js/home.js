var explainPage;
var modeSelected = "";
const musicbox = document.getElementById("musicbox");
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

axios
  .get("./views/explain.html")
  .then(response => {
    explainPage = response.data;
    // Here we can do something with the response object
  })
  .catch(err => {
    // Here we catch the error and display it
  });
const body = document.getElementById("all");
const homeMusic = new Audio("./sounds/music-Title.mp3");
function start() {
  let score = 0;
  const coins = document.querySelectorAll(".coin");
  const title = document.getElementById("title");

  // title.onmouseover = function() {
  //   if (homeMusic.paused) {
  //     homeMusic.play();
  //     homeMusic.loop = true;
  //   }
  //   homeMusic.volume = 0.5;
  // };

  coins.forEach(
    e =>
      (e.onclick = function(e) {
        // if (homeMusic.played) {
        //   homeMusic.play();
        //   homeMusic.loop = true;
        // }

        score += 1;
        const coinSound = new Audio(
          "https://freesound.org/data/previews/341/341695_5858296-lq.mp3"
        );
        const hereWeGoURL = new Audio(
          "http://www.mariomayhem.com/downloads/sounds/mario_64_sound_effects/mario-herewego.WAV"
        );
        coinSound.volume = 0.6;
        coinSound.play();
        e.target.classList.remove("coin");
        console.log(score);
        if (score === 5) {
          hereWeGoURL.play();
          // page out with sound
          title.parentElement.classList.add("scale-out");
          setTimeout(gonextpage, 500);
          function gonextpage() {
            body.innerHTML = explainPage.substring(
              explainPage.search("<section")
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
  const tube = document.getElementById("tube");
  const body = document.getElementById("all");
  const level = document.querySelectorAll("#container3 .level");
  const gameCSS = "../css/game.css";
  var gameHTML = "";
  var homeHTML = "";

  axios
    .get("./index.html")
    .then(response => {
      homeHTML = response.data;
    })
    .catch(err => {
      console.log("index.html is not find");
    });

  axios
    .get("./views/game.html")
    .then(response => {
      gameHTML = response.data;
    })
    .catch(err => {
      console.log("game.html is not find");
    });

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

  tube.onclick = function() {
    body.querySelectorAll("*").forEach(a => a.classList.add("scale-out"));
    new Audio("./sounds/pipe.wav").play();

    setTimeout(function() {
      body.innerHTML = homeHTML;
      start();
      // body = document.getElementById("all")
      body.querySelectorAll("*").forEach(a => a.classList.remove("scale-out"));
    }, 500);
  };

  function playTheGame(e) {
    modeSelected = e.target.parentElement.id.match(/hard|normal|easy/gi) ? e.target.parentElement.id : e.target.id ;
    console.log(modeSelected);
    console.dir(e.target.parentElement.id);

    body.innerHTML = gameHTML;
    game();
    document.querySelector("link").href = gameCSS;
  }

  level.forEach(a => (a.onmouseenter = selectLevel));
  level.forEach(a => (a.onclick = playTheGame));
  peopleCard.forEach(e => (e.onmousemove = moveTheBar));
}

function game() {
  //----------------------------------------------------------------------------------------------------------------
  var player = {
    score: 0,
    touchedBy: [],
    coinAt: [],
    canPlayCasino: score > 9 ? true : false
  };

  var mode = {
    hard: {
      speed: 0.5,
      life: 10,
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
      bpm: -20,
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
      console.log(this.name, " make you lose ", this.power);
      if (!+lifeDOM.textContent) {
        setTimeout(() => {
          alert("You lose");
        }, 500); 
        clearInterval(bombWalk);
        clearInterval(beeFly);
        clearInterval(cloudRain);
      }
    };
    gain = () => (score.textContent += this.power);

    move(p) {
      acurateSound();

      if (!p) {
        p = this.dom.classList.value.includes("start") ? "right" : "left";
      }
      if (this.name === "Bee") {
        this.speed =
          mode[modeSelected].speed * this.speed +
          +score.textContent * Math.random();
        if (this.y > 100) upNdown = -1;
        if (this.y < -100) upNdown = +1;
        this.y += upNdown * this.speed;
      }
      if (this.name === "Bob-ombs") {
        // this.speed =  this.speed ;
      }
      if (p.includes("left")) {
        this.x -= this.speed;
        this.dom.style.transform = `translate(${this.x}px,${this.y}px)`;
        if (this.x < -window.innerWidth) this.x = this.dom.clientWidth + 20;
      }
      if (p.includes("right")) {
        this.x += this.speed;
        this.dom.style.transform = `translate(${this.x}px,${this.y}px) rotateY(180deg)`;
        if (this.x > window.innerWidth) this.x = -this.dom.clientWidth;
      }
    }
  }
  const acurateSound = () => {
    mode[modeSelected].soundtrack.playbackRate = 1 + 0.005 * score.textContent;
    bpm.innerText =
      Math.floor(mode[modeSelected].soundtrack.playbackRate * 90 + mode[modeSelected].bpm) + " BPM";
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
  const bizz = "../sounds/bee_bump.wav";
  // const marioSoundtrack = new Audio(
  //   "http://23.237.126.42/ost/super-mario-bros.-3/rifwvpjl/01%20-%20Grass%20Land.mp3"
  // );
  // Initialisation -----------------------------------------------------------------------------
  var life = mode[modeSelected].life;
  const lifeDOM = document.querySelector("#life p");
  lifeDOM.textContent = life;
  let upNdown = 1;
  const bomb = new People("Bob-ombs", 20, document.querySelector(".bomb"));
  const bees = document.querySelectorAll(".bee");
  const bee1 = new People("Bee", 5, bees[0]);
  const bee2 = new People("Bee", 5, bees[1]);
  const cloud = new People("cloud", 10, document.querySelector(".cloud"));
  const toad = document.getElementById("toad");
  const musicBox = document.querySelector(".music");
  const bpm = document.getElementById("bpm");
  const koopaDOM = document.querySelector(".walking-koopa")
  var coins;
  var score = document.querySelector("#score");

  const doItWalk = setInterval(bombWalk, 70);
  const doItFly = setInterval(beeFly, 70);
  const makeItRain = setInterval(cloudRain, 70);
  bomb.dom.addEventListener("mouseover", mouseOverBomb);
  bees.forEach(bee => bee.addEventListener("mouseover", mouseOverBee));
  cloud.dom.addEventListener("mouseover", cloud.attack);
  function mouseOverBee(e) {
    bee1.attack();
    // let holdSpeed = bee1.speed
    //   bee1.speed = 0
    //   console.log('stop bee',bee1.speed);
    //   setTimeout(() => {

    //     bee1.speed = holdSpeed
    //   }, 3000);
    e.target.removeEventListener("mouseover", mouseOverBee);
    setTimeout(() => {
      e.target.addEventListener("mouseover", mouseOverBee);
    }, 2000);
  }

  repeatFunction(createACoin, 5);

  musicBox.onclick = () => {
    new Audio("../sounds/pause.wav").play();
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
    console.log("clicked");
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
    bomb.attack();
    bomb.dom.classList.remove("bomb");
    bomb.dom.classList.add("bomb-explose");
    bomb.dom.removeEventListener("mouseover", mouseOverBomb);
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

// function createAkoopa(){
//   const endGrille = [...document.querySelectorAll(".end.grille")].filter(a=> !a.className.match(/bee|bomb|flying-koopa/));
//   let n = Math.floor(Math.random() * (endGrille.length-1))
//   endGrille[n].classList.add('flying-koopa');
// }

const koopa = new People("Red Koopa")











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

start();
