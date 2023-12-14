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
let quotasCostInfoLabel;
let quotasAmtEl;
let resultsPerPageDropdown;
let searchTypeDropdown;
let contentItemsWrapper;
let apiKey;
let searchQuery;
let resultsPerPage, searchType;
let jsonResp;
let nextPageToken;
let lastVisitDateKey;
let quotasAmtKey;
let quotasAmt;
const QUOTAS_REFILL_AMT = 10000, QUOTAS_PER_CALL_AMT = 100, QUOTAS_PER_VID_DESC_AMT = 1;
(function init() {
    searchInput = document.querySelector('#search-input');
    searchBtn = document.querySelector('#search-btn');
    quotasCostInfoLabel = document.querySelector('#quotas-cost-info-label');
    quotasCostInfoLabel.title = `Search: -${QUOTAS_PER_CALL_AMT} Quotas\nLoad more: -${QUOTAS_PER_CALL_AMT} Quotas\nVideo description: -${QUOTAS_PER_VID_DESC_AMT} Quotas`;
    quotasAmtEl = document.querySelector('#quotas-amount');
    resultsPerPageDropdown = document.querySelector('#results-per-page-dropdown');
    searchTypeDropdown = document.querySelector('#search-type-dropdown');
    contentItemsWrapper = document.querySelector('#content-items-wrapper');
    apiKey = 'AIzaSyDrn07slgPiKCk-HzkTQWTH4yl2PEOs51w';
    // Backup key
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
            const resp = yield fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${resultsPerPage}&pageToken=${nextPageToken}&q=${searchQuery}&type=${searchType}&key=${apiKey}`);
            jsonResp = yield resp.json();
            console.log(jsonResp.items);
            const searchResults = jsonResp.items;
            for (let i = 0; i < searchResults.length; i++) {
                const contentItem = searchResults[i];
                const contentItemData = contentItem.snippet;
                const contentItemWrapper = document.createElement('div');
                contentItemWrapper.className = 'content-item-wrapper';
                // title
                const contentItemTitle = document.createElement('div');
                contentItemTitle.className = 'content-item-title';
                contentItemTitle.textContent = decodeEscaped(contentItemData.title);
                // channel
                const contentItemChannelName = document.createElement('div');
                contentItemChannelName.className = 'content-item-channel-name';
                contentItemChannelName.textContent = contentItemData.channelTitle;
                // thumbnail
                const contentThumbnail = document.createElement('img');
                contentThumbnail.className = 'content-item-thumbnail';
                contentThumbnail.src = contentItemData.thumbnails.high.url;
                // metadata
                contentItemWrapper.setAttribute('metadata', JSON.stringify({
                    kind: contentItem.id.kind,
                    videoId: (contentItem.id.hasOwnProperty('videoId')) ? contentItem.id.videoId : '',
                    title: contentItemTitle.textContent,
                    channelName: contentItemChannelName.textContent,
                    thumbnailSrc: contentThumbnail.src,
                    shortDescription: contentItemData.description
                }));
                // render
                contentItemWrapper.appendChild(contentItemTitle);
                contentItemWrapper.appendChild(contentItemChannelName);
                contentItemWrapper.appendChild(contentThumbnail);
                contentItemsWrapper.appendChild(contentItemWrapper);
            }
            let loadMoreWrapper = document.querySelector('#load-more-wrapper');
            if (jsonResp.hasOwnProperty('nextPageToken')) {
                if (!loadMoreWrapper) {
                    loadMoreWrapper = document.createElement('div');
                    loadMoreWrapper.id = 'load-more-wrapper';
                    const loadMoreBtn = document.createElement('button');
                    loadMoreBtn.id = 'load-next-page-results-btn';
                    loadMoreBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                        // update next page token
                        nextPageToken = jsonResp.nextPageToken;
                        showResults();
                        return;
                    });
                    loadMoreBtn.textContent = 'Load more';
                    loadMoreWrapper.appendChild(loadMoreBtn);
                    document.body.appendChild(loadMoreWrapper);
                }
            }
            else {
                if (loadMoreWrapper) {
                    loadMoreWrapper.remove();
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
searchBtn.onclick = (e) => __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    searchQuery = searchInput.value;
    if (searchQuery == '') {
        return;
    }
    // clear results
    for (let i = contentItemsWrapper.childElementCount - 1; i >= 0; i--) {
        contentItemsWrapper.children[i].remove();
    }
    // remove load more btn
    const loadMoreWrapper = document.querySelector('#load-more-wrapper');
    if (loadMoreWrapper) {
        loadMoreWrapper.remove();
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
    if (elClickedClass.includes('bigger-display') || elClickedId.includes('bigger-display')) {
        return;
    }
    removeBiggerDisplay();
    if (elClickedClass.includes('content-item')) {
        const contentItemWrapper = (elClickedClass.includes('wrapper')) ? elClicked : elClicked.parentElement;
        window.scrollTo({ top: 0, left: 0 });
        createBiggerDisplay(contentItemWrapper);
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
function createBiggerDisplay(contentItemWrapper) {
    // get search result content item metadata
    const contentItemSearchResultMetadata = JSON.parse(contentItemWrapper.getAttribute('metadata'));
    const kind = contentItemSearchResultMetadata.kind;
    // bigger display wrapper
    const biggerDisplayWrapper = document.createElement('div');
    biggerDisplayWrapper.id = 'bigger-display-wrapper';
    // title 
    const biggerDisplayTitleEl = document.createElement('div');
    biggerDisplayTitleEl.id = 'bigger-display-title';
    biggerDisplayTitleEl.textContent = contentItemSearchResultMetadata.title;
    // frame
    let biggerDisplayFrame;
    let biggerDisplayDescriptionWrapper;
    switch (kind) {
        case 'youtube#video':
            const videoId = contentItemSearchResultMetadata.videoId;
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
                    const descReadMoreBtn = document.createElement('button');
                    descReadMoreBtn.id = 'bigger-display-desc-read-more-btn';
                    descReadMoreBtn.textContent = 'Read more';
                    descReadMoreBtn.onclick = () => {
                        biggerDisplayDescription.textContent = fullDescription;
                        descReadMoreBtn.remove();
                    };
                    biggerDisplayDescriptionWrapper.appendChild(descReadMoreBtn);
                }
            })))
                .catch((e) => { console.log('Exception occured: ', e); });
            break;
        case 'youtube#playlist':
        case 'youtube#channel':
            biggerDisplayFrame = document.createElement('img');
            biggerDisplayFrame.src = contentItemSearchResultMetadata.thumbnailSrc;
            break;
    }
    biggerDisplayFrame.id = 'bigger-display-frame';
    // channel
    const biggerDisplayChannelNameEl = document.createElement('div');
    biggerDisplayChannelNameEl.id = 'bigger-display-channel-name';
    biggerDisplayChannelNameEl.textContent = contentItemSearchResultMetadata.channelName;
    // description
    biggerDisplayDescriptionWrapper = document.createElement('div');
    biggerDisplayDescriptionWrapper.id = 'bigger-display-description-wrapper';
    const biggerDisplayDescriptionLabel = document.createElement('label');
    biggerDisplayDescriptionLabel.id = 'bigger-display-description-label';
    biggerDisplayDescriptionLabel.textContent = 'Description';
    biggerDisplayDescriptionWrapper.appendChild(biggerDisplayDescriptionLabel);
    const biggerDisplayDescription = document.createElement('div');
    biggerDisplayDescription.id = 'bigger-display-description';
    if (kind == 'youtube#video') {
        if (quotasAmt >= QUOTAS_PER_VID_DESC_AMT) {
            biggerDisplayDescription.textContent = 'Loading...';
        }
        else {
            biggerDisplayDescription.textContent = 'Failed to fetch video description';
        }
    }
    else {
        biggerDisplayDescription.textContent = contentItemSearchResultMetadata.shortDescription;
    }
    biggerDisplayDescriptionWrapper.appendChild(biggerDisplayDescription);
    // render
    biggerDisplayWrapper.appendChild(biggerDisplayTitleEl);
    biggerDisplayWrapper.appendChild(biggerDisplayFrame);
    biggerDisplayWrapper.appendChild(biggerDisplayChannelNameEl);
    biggerDisplayWrapper.appendChild(biggerDisplayDescriptionWrapper);
    document.body.appendChild(biggerDisplayWrapper);
}
function removeBiggerDisplay() {
    const biggerDisplay = document.querySelector('#bigger-display-wrapper');
    if (biggerDisplay) {
        biggerDisplay.remove();
    }
}
