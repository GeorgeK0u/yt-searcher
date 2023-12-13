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
function displayVideo(videoWrapper) {
    const videoDisplayWrapper = document.createElement('div');
    videoDisplayWrapper.id = 'video-display-wrapper';
    // title 
    const videoTitle = videoWrapper.querySelector('.video-title').textContent;
    const videoDisplayTitleEl = document.createElement('div');
    videoDisplayTitleEl.id = 'video-display-title';
    videoDisplayTitleEl.textContent = videoTitle;
    // thumbnail
    const videoThumbnailSrc = videoWrapper.querySelector('.video-thumbnail').src;
    const videoThumbnailEl = document.createElement('img');
    videoThumbnailEl.id = 'video-display-thumbnail';
    videoThumbnailEl.src = videoThumbnailSrc;
    // TODO
    // channel
    videoDisplayWrapper.appendChild(videoDisplayTitleEl);
    videoDisplayWrapper.appendChild(videoThumbnailEl);
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
            const apiKey = 'AIzaSyDrn07slgPiKCk-HzkTQWTH4yl2PEOs51w';
            const resp = yield fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${query}&type=${searchType}&key=${apiKey}`);
            const jsonResp = yield resp.json();
            console.log('Updating search results');
            console.log(jsonResp);
            // Show search results
            const searchResults = jsonResp.items;
            for (let i = 0; i < searchResults.length; i++) {
                const videoData = searchResults[i].snippet;
                const videoWrapper = document.createElement('div');
                videoWrapper.className = 'video-wrapper';
                const videoTitle = document.createElement('div');
                videoTitle.className = 'video-title';
                videoTitle.textContent = decodeEscaped(videoData.title);
                const videoThumbnail = document.createElement('img');
                videoThumbnail.className = 'video-thumbnail';
                videoThumbnail.src = videoData.thumbnails.high.url;
                videoWrapper.appendChild(videoTitle);
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
    if (elClickedClass.includes('video-display') || elClickedId.includes('video-display')) {
        return;
    }
    removeVideoDisplay();
    if (elClickedClass.includes('video')) {
        const videoWrapper = (elClickedClass.includes('wrapper')) ? elClicked : elClicked.parentElement;
        displayVideo(videoWrapper);
    }
};
