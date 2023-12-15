var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// header
// left side
let searchInput, searchBtn;
// right side
let quotasCostInfoLabel, quotasAmtEl;
// options
let resultsPerPageDropdown, searchTypeDropdown, channelInput, clearChannelBtn;
// results
let resultsWrapper;
let loadMoreResultsBtn;
// bigger display
let biggerDisplayWrapper, biggerDisplayTitle, biggerDisplayFrame, biggerDisplayChannelBtn, biggerDisplayDescription, biggerDisplayDescriptionReadMoreBtn;
// help vars 
let searchQuery;
let quotasAmt;
let resultsPerPage, searchType, channelId;
let apiKey;
let jsonResp;
let nextPageToken;
let lastVisitDateKey;
let quotasAmtKey;
// constants
const QUOTAS_REFILL_AMT = 10000, QUOTAS_PER_CALL_AMT = 100, QUOTAS_PER_VID_DESC_AMT = 1;
(function init() {
    // header
    // left side
    searchInput = document.querySelector('#search-input');
    searchBtn = document.querySelector('#search-btn');
    // right side
    quotasCostInfoLabel = document.querySelector('#quotas-cost-info-label');
    quotasCostInfoLabel.title = `Search / Go to Channel: -${QUOTAS_PER_CALL_AMT} Quotas\nLoad more: -${QUOTAS_PER_CALL_AMT} Quotas\nVideo description: -${QUOTAS_PER_VID_DESC_AMT} Quotas`;
    quotasAmtEl = document.querySelector('#quotas-amount');
    // options
    resultsPerPageDropdown = document.querySelector('#results-per-page-dropdown');
    searchTypeDropdown = document.querySelector('#search-type-dropdown');
    channelInput = document.querySelector('#channel-input');
    channelId = '';
    clearChannelBtn = document.querySelector('#clear-channel-btn');
    clearChannelBtn.onclick = () => {
        if (channelInput.value == '') {
            return;
        }
        channelInput.value = '';
        channelId = '';
        clearResults();
        clearChannelBtn.style.display = 'none';
    };
    clearChannelBtn.style.display = 'none';
    // results
    resultsWrapper = document.querySelector('#results-wrapper');
    loadMoreResultsBtn = document.querySelector('#load-more-results-btn');
    loadMoreResultsBtn.style.display = 'none';
    loadMoreResultsBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
        // update next page token
        nextPageToken = jsonResp.nextPageToken;
        showResults();
    });
    // bigger display	
    biggerDisplayWrapper = document.querySelector('#bigger-display-wrapper');
    biggerDisplayWrapper.style.display = 'none';
    biggerDisplayTitle = document.querySelector('#bigger-display-title');
    biggerDisplayChannelBtn = document.querySelector('#bigger-display-channel-btn');
    biggerDisplayDescription = document.querySelector('#bigger-display-description');
    biggerDisplayDescriptionReadMoreBtn = document.querySelector('#bigger-display-description-read-more-btn');
    // help vars
    apiKey = 'AIzaSyDrn07slgPiKCk-HzkTQWTH4yl2PEOs51w';
    // backup key
    // apiKey = 'AIzaSyCHhXjOCJqs2FX58P_qhO9XGBZcWBMvMlk';
    resultsPerPage = parseInt(resultsPerPageDropdown.value);
    searchType = searchTypeDropdown.value;
    // get/update quotas
    const todayDate = new Date().getDate().toString();
    lastVisitDateKey = 'lastVisitDate';
    quotasAmtKey = 'quotasAmt';
    let lastVisitDate = localStorage.getItem(lastVisitDateKey);
    // reset
    if (!lastVisitDate || lastVisitDate != todayDate) {
        localStorage.setItem(lastVisitDateKey, todayDate);
        lastVisitDate = todayDate;
        localStorage.setItem(quotasAmtKey, QUOTAS_REFILL_AMT.toString());
    }
    quotasAmt = parseInt(localStorage.getItem(quotasAmtKey));
    quotasAmtEl.textContent = quotasAmt.toString();
})();
function showResults() {
    return __awaiter(this, void 0, void 0, function* () {
        if (quotasAmt < QUOTAS_PER_CALL_AMT) {
            alert('Not enough quotas available. Come back tomorrow');
            return;
        }
        try {
            const resp = yield fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${resultsPerPage}&pageToken=${nextPageToken}&q=${searchQuery}&type=${searchType}&channelId=${channelId}&key=${apiKey}`);
            jsonResp = yield resp.json();
            // results
            const searchResults = jsonResp.items;
            for (let i = 0; i < searchResults.length; i++) {
                const result = searchResults[i];
                const resultData = result.snippet;
                // wrapper
                const resultWrapper = document.createElement('div');
                resultWrapper.className = 'result-wrapper';
                // title
                const resultTitle = document.createElement('div');
                resultTitle.className = 'result-title';
                resultTitle.textContent = decodeEscaped(resultData.title);
                // channel
                const resultChannelName = document.createElement('div');
                resultChannelName.className = 'result-channel-name';
                resultChannelName.textContent = resultData.channelTitle;
                // thumbnail
                const resultThumbnail = document.createElement('img');
                resultThumbnail.className = 'result-thumbnail';
                resultThumbnail.src = resultData.thumbnails.high.url;
                // metadata
                resultWrapper.setAttribute('metadata', JSON.stringify({
                    kind: result.id.kind,
                    channelId: resultData.channelId,
                    videoId: (result.id.hasOwnProperty('videoId')) ? result.id.videoId : '',
                    title: resultTitle.textContent,
                    channelName: resultChannelName.textContent,
                    thumbnailSrc: resultThumbnail.src,
                    shortDescription: resultData.description
                }));
                // render
                resultWrapper.appendChild(resultTitle);
                resultWrapper.appendChild(resultChannelName);
                resultWrapper.appendChild(resultThumbnail);
                resultsWrapper.appendChild(resultWrapper);
            }
            // update load more btn visibility
            if (jsonResp.hasOwnProperty('nextPageToken')) {
                if (loadMoreResultsBtn.style.display == 'none') {
                    loadMoreResultsBtn.style.display = 'inline-block';
                }
            }
            else {
                if (loadMoreResultsBtn.style.display != 'none') {
                    loadMoreResultsBtn.style.display = 'none';
                }
            }
            // update quotas
            quotasAmt -= QUOTAS_PER_CALL_AMT;
            quotasAmtEl.textContent = quotasAmt.toString();
            localStorage.setItem(quotasAmtKey, quotasAmt.toString());
        }
        catch (err) {
            console.log('Exception occured: ', err);
        }
    });
}
function clearResults() {
    // clear results
    for (let i = resultsWrapper.childElementCount - 1; i >= 0; i--) {
        resultsWrapper.children[i].remove();
    }
    // hide load more btn
    if (loadMoreResultsBtn.style.display != 'none') {
        loadMoreResultsBtn.style.display = 'none';
    }
    // reset next page token
    nextPageToken = '';
}
searchBtn.onclick = (e) => __awaiter(this, void 0, void 0, function* () {
    // prevent form redirect
    e.preventDefault();
    // update search query
    searchQuery = searchInput.value;
    if (searchQuery == '' && channelId == '') {
        return;
    }
    clearResults();
    showResults();
});
// change results per page amount
resultsPerPageDropdown.onchange = () => {
    resultsPerPage = parseInt(resultsPerPageDropdown.value);
};
// change search type
searchTypeDropdown.onchange = () => {
    searchType = searchTypeDropdown.value;
};
document.body.onclick = (e) => {
    const elClicked = e.target;
    const elClickedClass = elClicked.className;
    const elClickedId = elClicked.id;
    // prevent the display from being removed
    if (elClickedClass.includes('bigger-display') || elClickedId.includes('bigger-display')) {
        return;
    }
    hideBiggerDisplay();
    if (elClickedClass.includes('result')) {
        const resultWrapper = (elClickedClass.includes('wrapper')) ? elClicked : elClicked.parentElement;
        window.scrollTo({ top: 0, left: 0 });
        showBiggerDisplay(resultWrapper);
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
function showBiggerDisplay(resultWrapper) {
    // result metadata
    const resultMetadata = JSON.parse(resultWrapper.getAttribute('metadata'));
    const kind = resultMetadata.kind;
    // title 
    biggerDisplayTitle.textContent = resultMetadata.title;
    // frame
    switch (kind) {
        case 'youtube#video':
            const videoId = resultMetadata.videoId;
            biggerDisplayFrame = document.createElement('iframe');
            biggerDisplayFrame.src = `https://www.youtube.com/embed/${videoId}`;
            biggerDisplayFrame.allowFullscreen = true;
            // fetch full description
            if (quotasAmt < QUOTAS_PER_VID_DESC_AMT) {
                alert('Not enough quotas available. Come back tomorrow');
                break;
            }
            let fullDescription;
            fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`)
                .then((data) => data.json()
                .then((json) => __awaiter(this, void 0, void 0, function* () {
                fullDescription = json.items[0].snippet.description;
                // update quotas
                quotasAmt -= QUOTAS_PER_VID_DESC_AMT;
                quotasAmtEl.textContent = quotasAmt.toString();
                localStorage.setItem(quotasAmtKey, quotasAmt.toString());
                // no description
                if (fullDescription == '') {
                    biggerDisplayDescription.textContent = 'No description';
                    return;
                }
                // Replace search result description version with video description version
                const shortDescValues = getShortDescVersion(fullDescription);
                const shortDescVersion = shortDescValues[0];
                biggerDisplayDescription.textContent = shortDescVersion;
                const hasMore = shortDescValues[1];
                if (hasMore) {
                    biggerDisplayDescriptionReadMoreBtn.onclick = () => {
                        biggerDisplayDescription.textContent = fullDescription;
                        biggerDisplayDescriptionReadMoreBtn.style.display = 'none';
                    };
                    biggerDisplayDescriptionReadMoreBtn.style.display = 'inline-block';
                }
            })))
                .catch((e) => { console.log('Exception occured: ', e); });
            break;
        case 'youtube#playlist':
        case 'youtube#channel':
            biggerDisplayFrame = document.createElement('img');
            biggerDisplayFrame.src = resultMetadata.thumbnailSrc;
            break;
    }
    biggerDisplayFrame.id = 'bigger-display-frame';
    biggerDisplayWrapper.insertBefore(biggerDisplayFrame, biggerDisplayChannelBtn);
    // channel
    biggerDisplayChannelBtn.onclick = () => {
        // clear search query
        searchInput.value = '';
        // update channel
        channelInput.value = resultMetadata.channelName;
        channelId = resultMetadata.channelId;
        clearChannelBtn.style.display = 'inline-block';
        // trigger search
        searchBtn.click();
    };
    biggerDisplayChannelBtn.textContent = resultMetadata.channelName;
    // description
    if (kind == 'youtube#video') {
        if (quotasAmt >= QUOTAS_PER_VID_DESC_AMT) {
            biggerDisplayDescription.textContent = 'Loading...';
        }
        else {
            biggerDisplayDescription.textContent = 'Failed to fetch video description';
        }
    }
    else {
        biggerDisplayDescription.textContent = resultMetadata.shortDescription;
    }
    biggerDisplayWrapper.style.display = 'flex';
}
function hideBiggerDisplay() {
    // remove frame
    if (biggerDisplayFrame) {
        biggerDisplayFrame.remove();
    }
    // hide read more
    if (biggerDisplayDescriptionReadMoreBtn.style.display != 'none') {
        biggerDisplayDescriptionReadMoreBtn.style.display = 'none';
    }
    // hide wrapper
    if (biggerDisplayWrapper.style.display != 'none') {
        biggerDisplayWrapper.style.display = 'none';
    }
}
