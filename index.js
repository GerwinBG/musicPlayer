let currentMusic = 0;

const music = document.querySelector('#audio');
const image = document.querySelector('#trackImg');
const seekBar = document.querySelector('.seekBar');
const songName = document.querySelector('.songName');
const artistName = document.querySelector('.artistName');
const currentTime = document.querySelector('.currentTime');
const songDuration = document.querySelector('.songDuration');
const playButton = document.querySelector('#playButton');
const nextBtn = document.querySelector('.nextBtn');
const prevBtn = document.querySelector('.prevBtn');
const lyrics = document.querySelector('.lyricsContainer');
const albumWrapper = document.querySelector('.albumsWrapper')
const artistWrapper = document.querySelector('.relatedArtistsWrapper')


const songArtist = "Taylor Swift";
const songTitle = "All Too Well (Taylor\'s Version)";

const fetchMusic = async () => {
  // fetch artist details, id and song id 
  const options = {
    method: 'GET',
    url: 'https://genius-song-lyrics1.p.rapidapi.com/search/',
    params: {
      q: songTitle,
      per_page: '1',
      page: '1'
    },
    headers: {
      'X-RapidAPI-Key': '4d7cdb182bmshc331df311cdfe01p19aa36jsn966353d89d93',
      'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
    }
  }

  const spotifyOptions = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/search/',
    params: {
      q: songArtist,
      type: 'artists',
      limit: '1',
      numberOfTopResults: '1'
    },
    headers: {
      'X-RapidAPI-Key': '4d7cdb182bmshc331df311cdfe01p19aa36jsn966353d89d93',
      'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    const songs = response.data.hits[0].result;
    image.src = songs.header_image_thumbnail_url;
    songName.innerHTML = songs.title;
    artistName.innerHTML = songs.artist_names;
    const songId = response.data.hits[0].result.id;
    fetchLyric(songId)


  // fetch artist album id but it's on string separated with ":"
    const resSpotify = await axios.request(spotifyOptions);
    const spotifyArtistID = resSpotify.data.artists.items[0].data.uri;
    const splitId =  spotifyArtistID.split(":");
    const artistId = splitId[2];


    fetchArtistAlbum(artistId);
    fetchRelatedArtists(artistId);

  } catch (error) {
    console.error(error);
    alert("Something went wrong!");
  }
  
}


// fetch lyrics from genius-song-lyrics
const fetchLyric = async (songId) => {
  const options = {
    method: 'GET',
    url: 'https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/',
    params: {id: songId},
    headers: {
      'X-RapidAPI-Key': '4d7cdb182bmshc331df311cdfe01p19aa36jsn966353d89d93',
      'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    const showLyrics = response.data.lyrics.lyrics.body.html;
    lyrics.innerHTML = showLyrics;
  } catch (error) {
    console.error(error);
    alert("Something went wrong")
  }
}


// fetch albums from Spotify
const fetchArtistAlbum = async (artistId) => {

  const optionsForAlbums = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/artist_albums/',
    params: {
      id: artistId,
      offset: '0',
    },
    headers: {
      'X-RapidAPI-Key': '4d7cdb182bmshc331df311cdfe01p19aa36jsn966353d89d93',
      'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(optionsForAlbums);
    const albumsArr = response.data.data.artist.discography.albums.items;
    albumsArr.forEach(album => {
      const item = album.releases.items[0];
        const albums = document.createElement("div");
        albums.classList.add("albumContainer");
        albums.innerHTML = `
            <a href="${item.sharingInfo.shareUrl}"><img src="${item.coverArt.sources[2].url}" class="songCover" /></a>
            <p class="title">${item.name}</p>
            <p class="releaseDate">${item.date.year}</p>
          </div>
        `;
        albumWrapper.appendChild(albums);
    });
  } catch (error) {
    console.error(error);
    alert("Something went wrong")
  }
}

// fetch related artist
const fetchRelatedArtists = async(artistId) => {
  const options = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/artist_related/',
    params: {
      id: artistId
    },
    headers: {
      'X-RapidAPI-Key': '4d7cdb182bmshc331df311cdfe01p19aa36jsn966353d89d93',
      'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    const artistArr = response.data.artists;
    artistArr.forEach(artist => {
      const item = artist;
      const relArtist = document.createElement("div");
      relArtist.classList.add("relatedArtistsContainer");
      relArtist.innerHTML = `
            <a href="${item.external_urls.spotify}"><img src="${item.images[0].url}" class="artistImg" /></a>
            <p class="nameOfArtist">${item.name}</p>
          </div>
      `;
      artistWrapper.appendChild(relArtist);
    });
  } catch (error) {
    console.error(error);
    alert("Something went wrong")
  }

}


fetchMusic();

const setMusic = (i) => {
  seekBar.value = 0;
  let song = "https://hosseinghanbari.ir/other/music-player/autumn.mp3";
  currentMusic = i;
  music.src = song;
  currentTime.innerHTML = '00:00';
  setTimeout(() => {
    seekBar.max = music.duration;
    songDuration.innerHTML = formatTime(music.duration);
   
  }, 300)
}

setMusic(0);


// play button 
document.getElementById('playButton').addEventListener('click', function() {
  let icon = this.querySelector('.fa-solid');
  if(icon.classList.contains('fa-circle-pause')){
    music.play();
  } else {
    music.pause();
  }
  if (icon.classList.contains('fa-circle-play')) {
    icon.classList.remove('fa-circle-play');
    icon.classList.add('fa-circle-pause');
  } else {
    icon.classList.remove('fa-circle-pause');
    icon.classList.add('fa-circle-play');
  }
});



// formatting time to min and seconds format
const formatTime = (time) => {
  let min = Math.floor(time / 60);
  if(min < 10) {
    min = `0${min}`;
  }
  let sec = Math.floor(time % 60);
  if(sec < 10) {
    sec = `0${sec}`;
  }
  return `${min}:${sec}`;
}

function togglePlayButtonIcon() {
  let icon = playButton.querySelector('.fa-solid');
  if (icon.classList.contains('fa-circle-pause')) {
    icon.classList.remove('fa-circle-pause');
    icon.classList.add('fa-circle-play');
  }
}


//seekBar
setInterval(() => {
  seekBar.value = music.currentTime;
  currentTime.innerHTML =formatTime(music.currentTime);
  if(Math.floor(music.currentTime) == Math.floor(seekBar.max)){
    nextBtn.click();
  } 
},500)
seekBar.addEventListener('change', () => {
  music.currentTime = seekBar.value;
})




//prevBtn and nextBtn

nextBtn.addEventListener('click', () => {
  if(currentMusic >= songs.length - 1){
    currentMusic = 0;
  } else {
    currentMusic++;
  }
  setMusic(currentMusic);
  togglePlayButtonIcon();
  music.play();
})

prevBtn.addEventListener('click', () => {
  if(currentMusic <= 0){
    currentMusic = songs.length - 1;
  } else {
    currentMusic--;
  }
  setMusic(currentMusic);
  togglePlayButtonIcon();
  music.play();
});

// Exporer Section
document.getElementById("defaultOpen").click();
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";  
}
