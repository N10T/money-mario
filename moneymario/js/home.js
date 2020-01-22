var explainPage;
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
(function start() {
  let score = 0;
  const coins = document.querySelectorAll(".coin");
  const title = document.getElementById("title");

  title.onmouseover = function() {
    if (homeMusic.played) {
      homeMusic.play();
      homeMusic.loop = true;
    }
    homeMusic.volume = 0.5;
  };

  coins.forEach(
    e =>
      (e.onclick = function(e) {
        if (homeMusic.played) {
          homeMusic.play();
          homeMusic.loop = true;
        }

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
            body.innerHTML = explainPage;
            refreshPage2();
          }
        }
      })
  );
})();

function refreshPage2() {
  const peopleCard = document.querySelectorAll("#container2 .people");
  const container = document.getElementById("container2");
  peopleCard.forEach(a => (a.onclick = cardCliked));
  function cardCliked() {
    //play sound
  }

  const moveTheBar = function(e) {
    let position = 0;
    var x = e.clientX;
    position = x - window.innerWidth / 2;
    if (position > 330) position = 330;
    if (position < -330) position = -330;
    container.style.transform = `translate(${position}px)`;
  };
  peopleCard.forEach(e => (e.onmousemove = moveTheBar));

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
}
