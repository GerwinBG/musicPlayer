const songProgress = document.querySelector("#song-progress")
const currentSong = document.querySelector("#current-song")
const playButton = document.querySelector("#play-button")
const currentTimeElement = document.querySelector(".current-time");
const songLengthElement = document.querySelector(".song-length");

//set current song >>>>>>>>>>>>>>>>

const songTitle = "All Too Well (Taylor's Version)";
const songArtist = "Taylor Swift";

const currentSongTitle = document.querySelector(".current-song-title")
const currentSongArtist = document.querySelector(".current-song-artist")
currentSongTitle.innerHTML = songTitle;
currentSongArtist.innerHTML = songArtist;

// fetch lyrics

const lyricWrapper = document.querySelector(".lyric-wrapper")

async function fetchData() {
    const options = {
      method: 'GET',
      url: 'https://genius-song-lyrics1.p.rapidapi.com/search/',
      params: {
        q: `${songTitle} ${songArtist}`,
        per_page: '1',
        page: '1',
      },
      headers: {
        'X-RapidAPI-Key': '2ddcb98af1msh1dc56611e800571p13a725jsnd0e7641f1b03',
        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com',
      },
    };
    
    const optionsForSpotify = {
        method: 'GET',
        url: 'https://spotify23.p.rapidapi.com/search/',
        params: {
            q: songArtist,
            type: 'artists',
            limit: '1',
            numberOfTopResults: '1'
        },
        headers: {
            'X-RapidAPI-Key': 'bb774aa129msh980e113d1d2e298p12deb0jsnace4c008ff68',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };
  
    try {

        const res = await axios(options);
        const songLyricId = res.data.hits[0].result.id;

        fetchLyric(songLyricId);
        
        const resSpotify = await axios(optionsForSpotify);
        const spotifyArtistID = resSpotify.data.artists.items[0].data.uri;
        const splitArtistId =  spotifyArtistID.split(":");
        const splittedArtistId = splitArtistId[2];

        fetchOtherAlbum(splittedArtistId);
        fetchRelatedArtists(splittedArtistId);




    } catch (error) {
      console.error(error);
    }
}

async function fetchLyric(songLyricId) {

    const options = {
        method: 'GET',
        url: 'https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/',
        params: {id: songLyricId},
        headers: {
        'X-RapidAPI-Key': '2ddcb98af1msh1dc56611e800571p13a725jsnd0e7641f1b03',
        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
    };
  
    try {
        const res = await axios.request(options);
        const lyricsObj = res.data.lyrics.lyrics.body.html;
        lyricWrapper.innerHTML = lyricsObj;


    } catch (error) {
        console.error(error);
    }
}

async function fetchOtherAlbum (splittedArtistId) {

    const optionsFetchAlbum = {
        method: 'GET',
        url: 'https://spotify23.p.rapidapi.com/artist_albums/',
        params: {
          id: splittedArtistId,
          offset: '0'
        },
        headers: {
          'X-RapidAPI-Key': 'bb774aa129msh980e113d1d2e298p12deb0jsnace4c008ff68',
          'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };
      
    try {
        const res = await axios(optionsFetchAlbum);
        const albumsArr = res.data.data.artist.discography.albums.items

        const albumContainer = document.querySelector(".other-albums");
        console.log(albumsArr[0])

        //create divs and mapping >>>>>>

        albumsArr.forEach(album => {

            const item = album.releases.items[0];

            const albumDiv = document.createElement("div");
            albumDiv.classList.add("other-album-container");
      
            const albumImage = document.createElement("img");
            albumImage.src = item.coverArt.sources[0].url;
            albumImage.alt = item.name;

            const link = document.createElement("a");
            link.href = item.sharingInfo.shareUrl;
            link.target = "blank";
      
            const albumDetails = document.createElement("div");
            albumDetails.classList.add("album-details");

            const albumTitle = document.createElement("h4");
            albumTitle.textContent = item.name;
            
            const albumYear = document.createElement("p");
            albumYear.textContent = item.date.year;
            
            link.appendChild(albumImage)
            albumDetails.appendChild(albumTitle);
            albumDetails.appendChild(albumYear);
            albumDiv.appendChild(link);
            albumDiv.appendChild(albumDetails);
      
            albumContainer.appendChild(albumDiv);
          });

    } catch (error) {
        console.error(error);
    }
}

async function fetchRelatedArtists(splittedArtistId) {
    
    const optionsRelatedArtist = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/artist_related/',
    params: {
      id: splittedArtistId,
    },
    headers: {
      'X-RapidAPI-Key': 'bb774aa129msh980e113d1d2e298p12deb0jsnace4c008ff68',
      'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
  };
  
  try {
    const res = await axios.request(optionsRelatedArtist);
    const relatedArtistArr = res.data.artists;
    
    const relatedArticle = document.querySelector(".related-articles");

    relatedArtistArr.forEach((artist) => {
        const articleContainer = document.createElement("div");
        articleContainer.classList.add("article-container");

        const link = document.createElement("a");
        link.href = artist.external_urls.spotify;
        link.target = "blank";

        const image = document.createElement("img");
        image.src = artist.images[1].url;
        image.alt = artist.name;

        link.appendChild(image);

        const photoContainer = document.createElement("div");
        photoContainer.classList.add("photo-container");

        photoContainer.appendChild(link);

        const articleDetails = document.createElement("div");
        articleDetails.classList.add("article-details");

        const artistName = document.createElement("h4");
        artistName.textContent = artist.name;
        

        articleDetails.appendChild(artistName);

        articleContainer.appendChild(photoContainer);
        articleContainer.appendChild(articleDetails);

        relatedArticle.appendChild(articleContainer);
    });

  } catch (error) {
    console.error(error);
  }

}

fetchData();


// playbutton function >>>>>>>>>>>>>>>>>>>>>>

playButton.addEventListener("click", function() {
    if (currentSong.paused || currentSong.ended) {
      currentSong.play();
      playButton.classList.remove("fa-circle-play");
      playButton.classList.add("fa-circle-pause");
    } else {
      currentSong.pause();
      playButton.classList.remove("fa-circle-pause");
      playButton.classList.add("fa-circle-play");
    }
});

currentSong.onloadedmetadata = function(){
    songProgress.max = currentSong.duration;
    songProgress.value = currentSong.currentTime;

    songLengthElement.textContent = formatTime(currentSong.duration);
}

setInterval(function() {
    songProgress.value = currentSong.currentTime;

    currentTimeElement.textContent = formatTime(currentSong.currentTime);
}, 100);

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${displayTime(minutes)}:${displayTime(remainingSeconds)}`;
}

function displayTime(number) {
    return number.toString().padStart(2, "0");
}

songProgress.addEventListener("input", function() {
    currentSong.currentTime = songProgress.value;
});

songProgress.addEventListener("change", function() {
    if (!currentSong.paused) {
        currentSong.play();
    }
});

// explore container >>>>>>>>>>>>>>>

function toggleContent(contentType) {
    const contentDiv = document.querySelector(`.${contentType}`);
  
    if (contentDiv) {
      const contentDivs = document.querySelectorAll('.content-wrapper > div');
      contentDivs.forEach((div) => {
        if (div !== contentDiv) {
          div.classList.add('hidden');
          div.classList.remove('active');
        }
      });
  
      contentDiv.classList.remove('hidden');
      contentDiv.classList.add('active');
    }
  }