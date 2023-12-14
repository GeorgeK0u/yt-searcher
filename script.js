var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let searchInput;
let searchBtn;
let resultsPerPageDropdown;
let searchTypeDropdown;
let videosWrapper;
let apiKey;
let searchQuery;
let resultsPerPage, searchType;
let jsonResp;
let nextPageToken;
(function init() {
    searchInput = document.querySelector('#search-input');
    searchBtn = document.querySelector('#search-btn');
    resultsPerPageDropdown = document.querySelector('#results-per-page-dropdown');
    searchTypeDropdown = document.querySelector('#search-type-dropdown');
    videosWrapper = document.querySelector('#videos-wrapper');
    apiKey = 'AIzaSyDrn07slgPiKCk-HzkTQWTH4yl2PEOs51w';
    // Backup key
    // apiKey = 'AIzaSyCHhXjOCJqs2FX58P_qhO9XGBZcWBMvMlk';
    resultsPerPage = parseInt(resultsPerPageDropdown.value);
    searchType = searchTypeDropdown.value;
})();
function showResults() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${resultsPerPage}&pageToken=${nextPageToken}&q=${searchQuery}&type=${searchType}&key=${apiKey}`);
            jsonResp = yield resp.json();
            const searchResults = jsonResp.items;
            for (let i = 0; i < searchResults.length; i++) {
                const videoItem = searchResults[i];
                const videoData = videoItem.snippet;
                const videoWrapper = document.createElement('div');
                videoWrapper.className = 'video-wrapper';
                // title
                const videoTitle = document.createElement('div');
                videoTitle.className = 'video-title';
                videoTitle.textContent = decodeEscaped(videoData.title);
                // channel
                const videoChannelName = document.createElement('div');
                videoChannelName.className = 'video-channel-name';
                videoChannelName.textContent = videoData.channelTitle;
                // thumbnail
                const videoThumbnail = document.createElement('img');
                videoThumbnail.className = 'video-thumbnail';
                videoThumbnail.src = videoData.thumbnails.high.url;
                // metadata
                videoWrapper.setAttribute('metadata', JSON.stringify({
                    videoId: videoItem.id.videoId,
                    title: videoTitle.textContent,
                    channelName: videoChannelName.textContent,
                    thumbnailSrc: videoThumbnail.src
                }));
                // render
                videoWrapper.appendChild(videoTitle);
                videoWrapper.appendChild(videoChannelName);
                videoWrapper.appendChild(videoThumbnail);
                videosWrapper.appendChild(videoWrapper);
            }
            let loadMoreBtn = document.querySelector('#load-next-page-results-btn');
            if (jsonResp.hasOwnProperty('nextPageToken')) {
                if (!loadMoreBtn) {
                    loadMoreBtn = document.createElement('button');
                    loadMoreBtn.id = 'load-next-page-results-btn';
                    loadMoreBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                        // update next page token
                        nextPageToken = jsonResp.nextPageToken;
                        showResults();
                        return;
                    });
                    loadMoreBtn.textContent = 'Load more';
                    document.body.appendChild(loadMoreBtn);
                }
            }
            else {
                if (loadMoreBtn) {
                    loadMoreBtn.remove();
                }
            }
        }
        catch (err) {
            console.log('Exception occured: ', err);
        }
    });
}
searchBtn.onclick = (e) => __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    searchQuery = searchInput.value;
    if (searchQuery == '') {
        return;
    }
    // clear results
    for (let i = videosWrapper.childElementCount - 1; i >= 0; i--) {
        videosWrapper.children[i].remove();
    }
    // remove load more btn
    const loadMoreBtn = document.querySelector('#load-next-page-results-btn');
    if (loadMoreBtn) {
        loadMoreBtn.remove();
    }
    // reset next page token
    nextPageToken = '';
    showResults();
});
resultsPerPageDropdown.onchange = () => {
    resultsPerPage = parseInt(resultsPerPageDropdown.value);
};
searchTypeDropdown.onchange = () => {
    searchType = searchTypeDropdown.value;
};
document.body.onclick = (e) => {
    const elClicked = e.target;
    const elClickedClass = elClicked.className;
    const elClickedId = elClicked.id;
    // prevent the display from being removed
    if (elClickedClass.includes('video-display') || elClickedId.includes('video-display')) {
        return;
    }
    removeVideoDisplay();
    if (elClickedClass.includes('video')) {
        const videoWrapper = (elClickedClass.includes('wrapper')) ? elClicked : elClicked.parentElement;
        window.scrollTo({ top: 0, left: 0 });
        displayVideo(videoWrapper);
    }
};
function decodeEscaped(text) {
    try {
        const parser = new DOMParser().parseFromString(text, 'text/html');
        const decodedText = parser.documentElement.textContent;
        return decodedText;
    }
    catch (err) {
        console.log('Failed to decode html-escaped title');
        return text;
    }
}
function getShortDescVersion(fullDesc) {
    const MAX_SHORT_DESC_CHARS = 450;
    const hasMore = fullDesc.length > MAX_SHORT_DESC_CHARS;
    if (hasMore) {
        const shortDescVersion = fullDesc.substring(0, MAX_SHORT_DESC_CHARS) + '...';
        return [shortDescVersion, hasMore];
    }
    return [fullDesc, hasMore];
}
function displayVideo(videoWrapper) {
    // get search result video metadata
    const videoSearchResultMetadata = JSON.parse(videoWrapper.getAttribute('metadata'));
    const videoId = videoSearchResultMetadata.videoId;
    // video display wrapper
    const videoDisplayWrapper = document.createElement('div');
    videoDisplayWrapper.id = 'video-display-wrapper';
    // title 
    const videoDisplayTitleEl = document.createElement('div');
    videoDisplayTitleEl.id = 'video-display-title';
    videoDisplayTitleEl.textContent = videoSearchResultMetadata.title;
    // video
    const videoFrame = document.createElement('iframe');
    videoFrame.id = 'video-display-frame';
    videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
    videoFrame.allowFullscreen = true;
    // channel
    const videoChannelNameEl = document.createElement('div');
    videoChannelNameEl.id = 'video-display-channel-name';
    videoChannelNameEl.textContent = videoSearchResultMetadata.channelName;
    // description
    const videoDescriptionWrapper = document.createElement('div');
    videoDescriptionWrapper.id = 'video-display-description-wrapper';
    const videoDescription = document.createElement('div');
    videoDescription.id = 'video-display-description';
    videoDescription.textContent = 'Loading...';
    videoDescriptionWrapper.appendChild(videoDescription);
    // fetch full description
    let fullDescription;
    fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`)
        .then((data) => data.json()
        .then((json) => __awaiter(this, void 0, void 0, function* () {
        fullDescription = json.items[0].snippet.description;
        if (fullDescription == '') {
            videoDescription.textContent = 'No description';
            return;
        }
        // Replace search result description version with video description version
        const shortDescValues = getShortDescVersion(fullDescription);
        const shortDescVersion = shortDescValues[0];
        videoDescription.textContent = shortDescVersion;
        const hasMore = shortDescValues[1];
        if (hasMore) {
            const descReadMoreBtn = document.createElement('button');
            descReadMoreBtn.id = 'video-display-desc-read-more-btn';
            descReadMoreBtn.textContent = 'Read more';
            descReadMoreBtn.onclick = () => {
                videoDescription.textContent = fullDescription;
                descReadMoreBtn.remove();
            };
            videoDescriptionWrapper.appendChild(descReadMoreBtn);
        }
    })))
        .catch((e) => { console.log('Exception occured: ', e); });
    // render
    videoDisplayWrapper.appendChild(videoDisplayTitleEl);
    videoDisplayWrapper.appendChild(videoFrame);
    videoDisplayWrapper.appendChild(videoChannelNameEl);
    videoDisplayWrapper.appendChild(videoDescriptionWrapper);
    document.body.appendChild(videoDisplayWrapper);
}
function removeVideoDisplay() {
    const videoDisplay = document.querySelector('#video-display-wrapper');
    if (videoDisplay) {
        videoDisplay.remove();
    }
}
