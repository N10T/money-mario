(function start() {
  let score = 0;
  const coins = document.querySelectorAll(".coin");
  const title = document.getElementById("title");
  const homeMusic = document.getElementById("home-music");
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

        if (score === 5) hereWeGoURL.play();
      })
  );
})();
