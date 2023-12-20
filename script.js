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
let searchInput, searchBtn, channelInput, clearChannelBtn;
// right side
let quotasCostInfoLabel, quotasAmtEl;
// options
let resultsPerPageDropdown, searchTypeDropdown, videoReleaseTimeDropdownWrapper, videoReleaseTimeDropdown, resultsOrderByDropdown, channelVideoCountOrderByOption, resultsDatetimeFromRangeDropdown, resultsDatetimeFromRangeCustomInput, resultsDatetimeToRangeDropdown, resultsDatetimeToRangeCustomInput;
// results
let resultsWrapper;
let loadMoreResultsBtn;
// bigger display
let biggerDisplayWrapper, biggerDisplayTitle, biggerDisplayFrame, biggerDisplayChannelBtn, biggerDisplayDesc, biggerDisplayDescReadMoreBtn;
// help vars 
let searchQuery, channelId, quotasAmt;
let resultsPerPage, searchType, videoReleaseTime, resultsOrderBy, resultsDatetimeFromRangeOption, resultsDatetimeToRangeOption;
let jsonResp, nextPageToken;
// constants
const API_KEY = 'AIzaSyCHhXjOCJqs2FX58P_qhO9XGBZcWBMvMlk', TODAY_DATE_STR = new Date().getDate().toString(), LAST_VISIT_DATE_KEY = 'lastVisitDate', QUOTAS_AMT_KEY = 'quotasAmt', QUOTAS_REFILL_AMT = 10000, QUOTAS_PER_CALL_AMT = 100, QUOTAS_PER_VID_DESC_AMT = 1, INLINE_STR = 'inline', BLOCK_STR = 'block', INLINE_BLOCK_STR = 'inline-block', FLEX_STR = 'flex', NONE_STR = 'none', MAX_SHORT_DESC_CHARS = 450, RESULT_KIND = { video: 'youtube#video', playlist: 'youtube#playlist', channel: 'youtube#channel' };
// backup api key
// apiKey = 'AIzaSyCHhXjOCJqs2FX58P_qhO9XGBZcWBMvMlk';
(function init() {
    // header
    // left side
    searchInput = document.querySelector('#search-input');
    searchBtn = document.querySelector('#search-btn');
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
    // right side
    quotasCostInfoLabel = document.querySelector('#quotas-cost-info-label');
    const quotasStr = 'Quotas';
    quotasCostInfoLabel.title = `Search / Go to Channel: -${QUOTAS_PER_CALL_AMT} ${quotasStr}\nLoad more: -${QUOTAS_PER_CALL_AMT} ${quotasStr}\nVideo description: -${QUOTAS_PER_VID_DESC_AMT} ${quotasStr}`;
    quotasAmtEl = document.querySelector('#quotas-amount');
    // options
    resultsPerPageDropdown = document.querySelector('#results-per-page-dropdown');
    searchTypeDropdown = document.querySelector('#search-type-dropdown');
    videoReleaseTimeDropdownWrapper = document.querySelector('#video-release-time-dropdown-wrapper');
    hideEl(videoReleaseTimeDropdownWrapper);
    videoReleaseTimeDropdown = document.querySelector('#video-release-time-dropdown');
    resultsOrderByDropdown = document.querySelector('#results-order-by-dropdown');
    channelVideoCountOrderByOption = document.querySelector('#channel-video-count-order-by-option');
    hideEl(channelVideoCountOrderByOption);
    resultsDatetimeFromRangeDropdown = document.querySelector('#results-datetime-from-range-dropdown');
    resultsDatetimeFromRangeCustomInput = document.querySelector('#results-datetime-from-range-custom-input');
    hideEl(resultsDatetimeFromRangeCustomInput);
    resultsDatetimeToRangeDropdown = document.querySelector('#results-datetime-to-range-dropdown');
    resultsDatetimeToRangeCustomInput = document.querySelector('#results-datetime-to-range-custom-input');
    hideEl(resultsDatetimeToRangeCustomInput);
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
    videoReleaseTime = videoReleaseTimeDropdown.value;
    resultsOrderBy = resultsOrderByDropdown.value;
    resultsDatetimeFromRangeOption = resultsDatetimeFromRangeDropdown.value;
    resultsDatetimeToRangeOption = resultsDatetimeToRangeDropdown.value;
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
            // video release time
            const eventTypePart = (getElDisplay(videoReleaseTimeDropdownWrapper) != NONE_STR && videoReleaseTime != '') ? `&eventType=${videoReleaseTime}` : '';
            // datetime range
            const datetimeRangeValues = getDatetimeRange();
            console.log(datetimeRangeValues);
            const datetimeFromRange = datetimeRangeValues[0];
            const publishedAfterPart = (datetimeFromRange != '') ? `&publishedAfter=${datetimeFromRange}` : '';
            const datetimeToRange = datetimeRangeValues[1];
            const publishedBeforePart = (datetimeToRange != '') ? `&publishedBefore=${datetimeToRange}` : '';
            //
            const resp = yield fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${resultsPerPage}&pageToken=${nextPageToken}&q=${searchQuery}&type=${searchType}${eventTypePart}&order=${resultsOrderBy}${publishedAfterPart}${publishedBeforePart}&channelId=${channelId}&key=${API_KEY}`);
            jsonResp = yield resp.json();
            console.log(jsonResp);
            // results
            if (!jsonResp.hasOwnProperty('items')) {
                alert('Not enough quotas available. Come back tomorrow');
                return;
            }
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
                setElDisplay(loadMoreResultsBtn, INLINE_BLOCK_STR);
            }
            else {
                hideEl(loadMoreResultsBtn);
            }
            // update quotas
            quotasAmt -= QUOTAS_PER_CALL_AMT;
            quotasAmtEl.textContent = quotasAmt.toString();
            localStorage.setItem(QUOTAS_AMT_KEY, quotasAmt.toString());
            if (searchResults.length == 0) {
                alert('No results found');
            }
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
    setElDisplay(videoReleaseTimeDropdownWrapper, (searchType == 'video') ? BLOCK_STR : NONE_STR);
    setElDisplay(channelVideoCountOrderByOption, (searchType == 'channel') ? INLINE_STR : NONE_STR);
};
// change video release time option
videoReleaseTimeDropdown.onchange = () => {
    videoReleaseTime = videoReleaseTimeDropdown.value;
};
// change results order by
resultsOrderByDropdown.onchange = () => {
    resultsOrderBy = resultsOrderByDropdown.value;
};
// change results datetime from range option
resultsDatetimeFromRangeDropdown.onchange = () => {
    resultsDatetimeFromRangeOption = resultsDatetimeFromRangeDropdown.value;
    setElDisplay(resultsDatetimeFromRangeCustomInput, (resultsDatetimeFromRangeOption == 'custom') ? INLINE_BLOCK_STR : NONE_STR);
};
// change results datetime to range option
resultsDatetimeToRangeDropdown.onchange = () => {
    resultsDatetimeToRangeOption = resultsDatetimeToRangeDropdown.value;
    setElDisplay(resultsDatetimeToRangeCustomInput, (resultsDatetimeToRangeOption == 'custom') ? INLINE_BLOCK_STR : NONE_STR);
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
    setElDisplay(el, NONE_STR);
}
function getElDisplay(el) {
    return el.style.display;
}
function setElDisplay(el, display) {
    if (getElDisplay(el) == display) {
        return;
    }
    el.style.display = display;
}
function getDatetimeBefore(datetime) {
    const year = datetime.getFullYear();
    const month = datetime.getMonth();
    const date = datetime.getDate();
    const hours = datetime.getHours();
    const mins = datetime.getMinutes();
    const secs = datetime.getSeconds();
    if (date == 1) {
        if (month == 0) {
            return new Date(year - 1, 12, 0, hours, mins, secs);
        }
        else {
            return new Date(year, month + 1, 0, hours, mins, secs);
        }
    }
    else {
        return new Date(year, month, date - 1, hours, mins, secs);
    }
}
function getDatetimeAfter(datetime) {
    const year = datetime.getFullYear();
    const month = datetime.getMonth();
    const date = datetime.getDate();
    const hours = datetime.getHours();
    const mins = datetime.getMinutes();
    const secs = datetime.getSeconds();
    const lastMonthDate = new Date(year, month + 1, 0).getDate();
    if (date == lastMonthDate) {
        if (month == 11) {
            return new Date(year + 1, 0, 1, hours, mins, secs);
        }
        else {
            return new Date(year, month + 1, 1, hours, mins, secs);
        }
    }
    else {
        return new Date(year, month, date + 1, hours, mins, secs);
    }
}
function isDatetimeFormatValid(text) {
    if (!text.includes('/')) {
        return false;
    }
    let pattern = '';
    for (let ch of text) {
        const chCode = ch.charCodeAt(0);
        if (chCode >= 48 && chCode <= 57) {
            pattern += '#';
        }
        else if (ch == '#') {
            pattern += '';
        }
        else {
            pattern += ch;
        }
    }
    const dateValues = ((pattern.includes(' ')) ? pattern.split(' ')[0] : pattern).split('/').join('');
    const maxDigits = 2 * 2 + 4;
    if (dateValues.length > maxDigits) {
        return false;
    }
    for (let ch of dateValues) {
        if (ch != '#') {
            return false;
        }
    }
    return true;
}
function getDatetimeRange() {
    let rangeArr = [];
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    const thisDate = today.getDate();
    const thisDay = today.getDay();
    // from range
    let fromRange = '';
    switch (resultsDatetimeFromRangeOption) {
        case 'today':
            fromRange = formatDatetime(new Date(thisYear, thisMonth, thisDate));
            break;
        case 'week':
            fromRange = formatDatetime(new Date(thisYear, thisMonth, thisDate - thisDay + 1));
            break;
        case 'month':
            fromRange = formatDatetime(new Date(thisYear, thisMonth, 1));
            break;
        case 'year':
            fromRange = formatDatetime(new Date(thisYear, 0, 1));
            break;
        case 'custom':
            try {
                const customDatetime = resultsDatetimeFromRangeCustomInput.value.trim();
                if (!isDatetimeFormatValid(customDatetime)) {
                    resultsDatetimeFromRangeCustomInput.value = '';
                    break;
                }
                const datetimeValues = customDatetime.includes(' ') ? customDatetime.split(' ') : [customDatetime];
                // custom date
                const customDateValues = datetimeValues[0].split('/');
                const customDate = customDateValues[0];
                const customMonth = (parseInt(customDateValues[1]) - 1).toString();
                const customYear = customDateValues[2];
                // custom time
                let customHours, customMins, customSecs;
                if (datetimeValues.length == 2) {
                    const customTimeValues = datetimeValues[1].split(':');
                    customHours = customTimeValues[0];
                    customMins = customTimeValues[1];
                    customSecs = customTimeValues[2];
                }
                else {
                    customHours = 0;
                    customMins = 0;
                    customSecs = 0;
                }
                fromRange = formatDatetime(new Date(customYear, customMonth, customDate, customHours, customMins, customSecs));
            }
            finally {
                break;
            }
    }
    rangeArr.push(convertDatetimeToRFC(fromRange));
    // to range
    let toRange = '';
    switch (resultsDatetimeToRangeOption) {
        case 'today':
            toRange = formatDatetime(new Date(thisYear, thisMonth, thisDate, 23, 59, 59));
            break;
        case 'week':
            toRange = formatDatetime(new Date(thisYear, thisMonth, thisDate - thisDay + 1, 23, 59, 59));
            break;
        case 'month':
            toRange = formatDatetime(new Date(thisYear, thisMonth, 1, 23, 59, 59));
            break;
        case 'year':
            toRange = formatDatetime(new Date(thisYear, 0, 1, 23, 59, 59));
            break;
        case 'custom':
            try {
                const customDatetime = resultsDatetimeToRangeCustomInput.value.trim();
                if (!isDatetimeFormatValid(customDatetime)) {
                    resultsDatetimeToRangeCustomInput.value = '';
                    break;
                }
                const datetimeValues = customDatetime.includes(' ') ? customDatetime.split(' ') : [customDatetime];
                // custom date
                const customDateValues = datetimeValues[0].split('/');
                const customDate = customDateValues[0];
                const customMonth = (parseInt(customDateValues[1]) - 1).toString();
                const customYear = customDateValues[2];
                // custom time
                let customHours, customMins, customSecs;
                if (datetimeValues.length == 2) {
                    const customTimeValues = datetimeValues[1].split(':');
                    customHours = customTimeValues[0];
                    customMins = customTimeValues[1];
                    customSecs = customTimeValues[2];
                }
                else {
                    customHours = 23;
                    customMins = 59;
                    customSecs = 59;
                }
                toRange = formatDatetime(new Date(customYear, customMonth, customDate, customHours, customMins, customSecs));
            }
            finally {
                break;
            }
    }
    rangeArr.push(convertDatetimeToRFC(toRange));
    return rangeArr;
}
function formatDatetime(datetime) {
    function formatDatetimeValue(datetimeValue) {
        return datetimeValue.toString().padStart(2, '0');
    }
    const year = datetime.getFullYear();
    const month = formatDatetimeValue(datetime.getMonth() + 1);
    const date = formatDatetimeValue(datetime.getDate());
    const hours = formatDatetimeValue(datetime.getHours());
    const mins = formatDatetimeValue(datetime.getMinutes());
    const secs = formatDatetimeValue(datetime.getSeconds());
    return `${year}/${month}/${date} ${hours}:${mins}:${secs}`;
}
function convertDatetimeToRFC(datetime) {
    if (datetime == '') {
        return datetime;
    }
    let rfcDatetime = datetime;
    rfcDatetime = rfcDatetime.replaceAll('/', '-');
    rfcDatetime = rfcDatetime.replace(' ', 'T');
    rfcDatetime += 'Z';
    return rfcDatetime;
}
