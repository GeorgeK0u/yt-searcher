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
let biggerDisplayWrapper, biggerDisplayTitle, biggerDisplayFrame, biggerDisplayChannelBtn, biggerDisplayDesc, biggerDisplayDescReadMoreBtn;
// help vars 
let searchQuery, quotasAmt;
let resultsPerPage, searchType, channelId;
let jsonResp, nextPageToken;
// constants
const API_KEY = 'AIzaSyDrn07slgPiKCk-HzkTQWTH4yl2PEOs51w', TODAY_DATE_STR = new Date().getDate().toString(), LAST_VISIT_DATE_KEY = 'lastVisitDate', QUOTAS_AMT_KEY = 'quotasAmt', QUOTAS_REFILL_AMT = 10000, QUOTAS_PER_CALL_AMT = 100, QUOTAS_PER_VID_DESC_AMT = 1, INLINE_BLOCK_STR = 'inline-block', FLEX_STR = 'flex', NONE_STR = 'none', MAX_SHORT_DESC_CHARS = 450, RESULT_KIND = { video: 'youtube#video', playlist: 'youtube#playlist', channel: 'youtube#channel' };
// backup api key
// apiKey = 'AIzaSyCHhXjOCJqs2FX58P_qhO9XGBZcWBMvMlk';
(function init() {
    // header
    // left side
    searchInput = document.querySelector('#search-input');
    searchBtn = document.querySelector('#search-btn');
    // right side
    quotasCostInfoLabel = document.querySelector('#quotas-cost-info-label');
    const quotasStr = 'Quotas';
    quotasCostInfoLabel.title = `Search / Go to Channel: -${QUOTAS_PER_CALL_AMT} ${quotasStr}\nLoad more: -${QUOTAS_PER_CALL_AMT} ${quotasStr}\nVideo description: -${QUOTAS_PER_VID_DESC_AMT} ${quotasStr}`;
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
        hideEl(clearChannelBtn);
    };
    hideEl(clearChannelBtn);
    // results
    resultsWrapper = document.querySelector('#results-wrapper');
    loadMoreResultsBtn = document.querySelector('#load-more-results-btn');
    hideEl(loadMoreResultsBtn);
    loadMoreResultsBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
        // update next page token
        nextPageToken = jsonResp.nextPageToken;
        showResults();
    });
    // bigger display	
    biggerDisplayWrapper = document.querySelector('#bigger-display-wrapper');
    hideEl(biggerDisplayWrapper);
    biggerDisplayTitle = document.querySelector('#bigger-display-title');
    biggerDisplayChannelBtn = document.querySelector('#bigger-display-channel-btn');
    biggerDisplayDesc = document.querySelector('#bigger-display-desc');
    biggerDisplayDescReadMoreBtn = document.querySelector('#bigger-display-desc-read-more-btn');
    // help vars
    resultsPerPage = parseInt(resultsPerPageDropdown.value);
    searchType = searchTypeDropdown.value;
    // get/update quotas
    let lastVisitDateStr = localStorage.getItem(LAST_VISIT_DATE_KEY);
    // reset
    if (!lastVisitDateStr || lastVisitDateStr != TODAY_DATE_STR) {
        lastVisitDateStr = TODAY_DATE_STR;
        localStorage.setItem(LAST_VISIT_DATE_KEY, TODAY_DATE_STR);
        localStorage.setItem(QUOTAS_AMT_KEY, QUOTAS_REFILL_AMT.toString());
    }
    quotasAmt = parseInt(localStorage.getItem(QUOTAS_AMT_KEY));
    quotasAmtEl.textContent = quotasAmt.toString();
})();
function showResults() {
    return __awaiter(this, void 0, void 0, function* () {
        if (quotasAmt < QUOTAS_PER_CALL_AMT) {
            alert('Not enough quotas available. Come back tomorrow');
            return;
        }
        try {
            const resp = yield fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${resultsPerPage}&pageToken=${nextPageToken}&q=${searchQuery}&type=${searchType}&channelId=${channelId}&key=${API_KEY}`);
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
                resultWrapper.appendChild(resultTitle);
                // channel
                const resultChannelName = document.createElement('div');
                resultChannelName.className = 'result-channel-name';
                resultChannelName.textContent = resultData.channelTitle;
                resultWrapper.appendChild(resultChannelName);
                // thumbnail
                const resultThumbnail = document.createElement('img');
                resultThumbnail.className = 'result-thumbnail';
                resultThumbnail.src = resultData.thumbnails.high.url;
                resultWrapper.appendChild(resultThumbnail);
                // render
                resultsWrapper.appendChild(resultWrapper);
                // metadata
                resultWrapper.setAttribute('metadata', JSON.stringify({
                    kind: result.id.kind,
                    channelId: resultData.channelId,
                    videoId: (result.id.hasOwnProperty('videoId')) ? result.id.videoId : '',
                    title: resultTitle.textContent,
                    channelName: resultChannelName.textContent,
                    thumbnailSrc: resultThumbnail.src,
                    shortDesc: resultData.description
                }));
            }
            // update load more btn visibility
            if (jsonResp.hasOwnProperty('nextPageToken')) {
                if (getElDisplay(loadMoreResultsBtn) == NONE_STR) {
                    setElDisplay(loadMoreResultsBtn, INLINE_BLOCK_STR);
                }
            }
            else {
                hideEl(loadMoreResultsBtn);
            }
            // update quotas
            quotasAmt -= QUOTAS_PER_CALL_AMT;
            quotasAmtEl.textContent = quotasAmt.toString();
            localStorage.setItem(QUOTAS_AMT_KEY, quotasAmt.toString());
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
    hideEl(loadMoreResultsBtn);
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
        case RESULT_KIND.video:
            const videoId = resultMetadata.videoId;
            biggerDisplayFrame = document.createElement('iframe');
            biggerDisplayFrame.src = `https://www.youtube.com/embed/${videoId}`;
            biggerDisplayFrame.allowFullscreen = true;
            // fetch full desc
            if (quotasAmt < QUOTAS_PER_VID_DESC_AMT) {
                alert('Not enough quotas available. Come back tomorrow');
                break;
            }
            let fullDesc;
            fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`)
                .then((data) => data.json()
                .then((json) => __awaiter(this, void 0, void 0, function* () {
                fullDesc = json.items[0].snippet.description;
                // update quotas
                quotasAmt -= QUOTAS_PER_VID_DESC_AMT;
                quotasAmtEl.textContent = quotasAmt.toString();
                localStorage.setItem(QUOTAS_AMT_KEY, quotasAmt.toString());
                // no desc
                if (fullDesc == '') {
                    biggerDisplayDesc.textContent = 'No description';
                    return;
                }
                // Replace search result desc version with video desc version
                const shortDescValues = getShortDescVersion(fullDesc);
                const shortDescVersion = shortDescValues[0];
                biggerDisplayDesc.textContent = shortDescVersion;
                const hasMore = shortDescValues[1];
                if (hasMore) {
                    biggerDisplayDescReadMoreBtn.onclick = () => {
                        biggerDisplayDesc.textContent = fullDesc;
                        hideEl(biggerDisplayDescReadMoreBtn);
                    };
                    setElDisplay(biggerDisplayDescReadMoreBtn, INLINE_BLOCK_STR);
                }
            })))
                .catch((e) => { console.log('Exception occured: ', e); });
            break;
        case RESULT_KIND.playlist:
        case RESULT_KIND.channel:
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
        setElDisplay(clearChannelBtn, INLINE_BLOCK_STR);
        // trigger search
        searchBtn.click();
    };
    biggerDisplayChannelBtn.textContent = resultMetadata.channelName;
    // desc
    if (kind == RESULT_KIND.video) {
        if (quotasAmt >= QUOTAS_PER_VID_DESC_AMT) {
            biggerDisplayDesc.textContent = 'Loading...';
        }
        else {
            biggerDisplayDesc.textContent = 'Failed to fetch video desc';
        }
    }
    else {
        biggerDisplayDesc.textContent = resultMetadata.shortDesc;
    }
    setElDisplay(biggerDisplayWrapper, FLEX_STR);
}
function hideBiggerDisplay() {
    // remove frame
    if (biggerDisplayFrame) {
        biggerDisplayFrame.remove();
    }
    hideEl(biggerDisplayDescReadMoreBtn);
    hideEl(biggerDisplayWrapper);
}
function hideEl(el) {
    if (getElDisplay(el) != NONE_STR) {
        setElDisplay(el, NONE_STR);
    }
}
function getElDisplay(el) {
    return el.style.display;
}
function setElDisplay(el, display) {
    el.style.display = display;
}
