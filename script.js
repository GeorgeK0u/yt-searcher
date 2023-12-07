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
            const apiKey = 'AIzaSyDrn07slgPiKCk-HzkTQWTH4yl2PEOs51w';
            const resp = yield fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${query}&key=${apiKey}`);
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
                videoTitle.textContent = videoData.title;
                const videoThumbnail = document.createElement('img');
                videoThumbnail.className = 'video-thumbnail';
                videoThumbnail.src = videoData.thumbnails.default.url;
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
