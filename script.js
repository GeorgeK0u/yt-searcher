var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const videosWrapper = document.querySelector('#videos-wrapper');
const apiKey = 'AIzaSyDrn07slgPiKCk-HzkTQWTH4yl2PEOs51w';
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
function removeVideoDisplay() {
    const videoDisplay = document.querySelector('#video-display-wrapper');
    if (videoDisplay) {
        videoDisplay.remove();
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
    // video display wrapper
    const videoDisplayWrapper = document.createElement('div');
    videoDisplayWrapper.id = 'video-display-wrapper';
    // title 
    const videoDisplayTitleEl = document.createElement('div');
    videoDisplayTitleEl.id = 'video-display-title';
    videoDisplayTitleEl.textContent = videoSearchResultMetadata.title;
    // thumbnail
    const videoThumbnailEl = document.createElement('img');
    videoThumbnailEl.id = 'video-display-thumbnail';
    videoThumbnailEl.src = videoSearchResultMetadata.thumbnailSrc;
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
    const videoId = videoSearchResultMetadata.videoId;
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
    videoDisplayWrapper.appendChild(videoThumbnailEl);
    videoDisplayWrapper.appendChild(videoChannelNameEl);
    videoDisplayWrapper.appendChild(videoDescriptionWrapper);
    document.body.appendChild(videoDisplayWrapper);
}
searchBtn.onclick = (e) => __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    const query = searchInput.value;
    if (query != '') {
        // remove previous search results
        for (let i = videosWrapper.childElementCount - 1; i >= 0; i--) {
            videosWrapper.children[i].remove();
        }
        // Update search results
        try {
            const maxResults = 10;
            const searchType = 'video';
            const resp = yield fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${query}&type=${searchType}&key=${apiKey}`);
            const jsonResp = yield resp.json();
            console.log('Updating search results');
            // Show search results
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
        }
        catch (err) {
            console.log('Exception occured: ', err);
        }
    }
    return;
});
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
        displayVideo(videoWrapper);
    }
};
