// script.js
const songs = [
  ['Playlist 1 of 3', 'BIRDS OF A FEATHER', 'Billie Ellish', '1.3M', '2M', 'ba.mp3',  'ba.jpg'],
  ['Playlist 2 of 3', 'Locked Away', 'R.City ft. Adam Levine', '943K', '1.2M', 'la.mp3',  'la.jpg'],
  ['Playlist 3 of 3', 'Kami Belum Tentu', '.Feast', '782K', '1M', 'kb.mp3',  'kb.jpg']
];

const musicContainer = document.getElementById('music-container');

songs.forEach((song, index) => {
  const [trackNum, title, artist, likes, views, audioSrc, imgSrc] = song;

  const player = document.createElement('div');
  player.classList.add('player');

  player.innerHTML = `
    <div class="track-header">${trackNum}</div>
    <div class="cover-wrapper">
      <div class="dj-beat-ring"></div>
      <img src="${imgSrc}" class="cover" alt="cover">
      <div class="pulse-effect"></div>
    </div>
    <div class="title">${title}</div>
    <div class="artist">${artist}</div>
    <div class="progress">
      <span class="current-time">0:00</span>
      <input type="range" value="0" class="progress-bar">
      <span class="duration">0:00</span>
    </div>
    <div class="controls large-controls">
      <i class="ph ph-skip-back-circle" data-index="${index}"></i>
      <i class="ph ph-play-circle toggle-play" data-index="${index}"></i>
      <i class="ph ph-skip-forward-circle" data-index="${index}"></i>
    </div>
    <div class="stats">
      <div class="likes"><i class="ph ph-heart"></i> ${likes}</div>
      <div class="views"><i class="ph ph-play"></i> ${views}</div>
    </div>
  `;

  musicContainer.appendChild(player);
});

const audio = new Audio();
let currentIndex = -1;
let interval = null;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function updateProgressUI(index) {
  const player = document.querySelectorAll(".player")[index];
  const progressBar = player.querySelector('input[type="range"]');
  const currentTimeElem = player.querySelector(".current-time");
  const durationElem = player.querySelector(".duration");

  progressBar.value = audio.currentTime;
  currentTimeElem.textContent = formatTime(audio.currentTime);
  durationElem.textContent = formatTime(audio.duration);
}

function playSong(index) {
  if (currentIndex !== index) {
    audio.src = songs[index][5];
    currentIndex = index;

    
    audio.addEventListener("loadedmetadata", () => {
      const player = document.querySelectorAll(".player")[index];
      const progressBar = player.querySelector('input[type="range"]');
      progressBar.max = audio.duration;
    }, { once: true });
  }

  audio.play();

  clearInterval(interval);
  interval = setInterval(() => updateProgressUI(index), 500);

  updateIcons(index, true);
  updateControlsState(index, true);
}


function pauseSong(index) {
  audio.pause();
  clearInterval(interval);
  updateIcons(index, false);
  updateControlsState(index, false);
}

function updateIcons(index, isPlaying) {
  document.querySelectorAll(".toggle-play").forEach((btn, i) => {
    btn.className = "ph toggle-play " + (i === index
      ? (isPlaying ? "ph-pause-circle" : "ph-play-circle")
      : "ph-play-circle");
  });
}

function updateControlsState(index, isActive) {
  document.querySelectorAll(".player").forEach((player, i) => {
    if (i === index && isActive) {
      player.classList.add("playing");
    } else {
      player.classList.remove("playing");
    }
  });
}

function skip(direction) {
  if (currentIndex === -1) return;
  let newIndex = currentIndex + direction;
  if (newIndex < 0) newIndex = songs.length - 1;
  if (newIndex >= songs.length) newIndex = 0;
  playSong(newIndex);
}

document.addEventListener("click", (e) => {
  const index = +e.target.dataset.index;

  if (e.target.matches(".toggle-play")) {
    if (audio.paused || currentIndex !== index) {
      playSong(index);
    } else {
      pauseSong(index);
    }
  } else if (e.target.matches(".ph-skip-forward-circle")) {
    if (e.target.dataset.index == currentIndex) skip(1);
  } else if (e.target.matches(".ph-skip-back-circle")) {
    if (e.target.dataset.index == currentIndex) skip(-1);
  }
});

document.addEventListener("input", (e) => {
  if (e.target.type === "range" && currentIndex >= 0) {
    audio.currentTime = e.target.value;
  }
});
