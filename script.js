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
// filters
let searchTypeDropdown, vidDurationDropdownWrapper, vidDurationDropdown, vidQualityDropdownWrapper, vidQualityDropdown, vidReleaseTimeDropdownWrapper, vidReleaseTimeDropdown, channelVideoCountOrderByOption, resultsDatetimeFromRangeDropdown, resultsDatetimeFromRangeCustomInput, resultsDatetimeToRangeDropdown, resultsDatetimeToRangeCustomInput, resultsLangDropdown, safeSearchDropdown;
// options
let resultsPerCallDropdown, resultsOrderByDropdown;
// results
let resultsWrapper;
let loadMoreResultsBtn;
// big display
let bigDisplayWrapper, bigDisplayTitle, bigDisplayFrame, bigDisplayChannelBtn, bigDisplayDesc, bigDisplayDescReadMoreBtn;
// help vars 
let searchQuery, channelId, quotasAmt;
let resultsPerCall, searchType, vidDuration, vidQuality, vidReleaseTime, resultsOrderBy, resultsDatetimeFromRangeOption, resultsDatetimeToRangeOption, resultsLang, safeSearch;
let jsonResp, nextPageToken;
// constants
// main api key 'AIzaSyDrn07slgPiKCk-HzkTQWTH4yl2PEOs51w'
// backup api key 'AIzaSyCHhXjOCJqs2FX58P_qhO9XGBZcWBMvMlk';
const API_KEY = 'AIzaSyDrn07slgPiKCk-HzkTQWTH4yl2PEOs51w', TODAY_DATE_STR = new Date().getDate().toString(), LAST_VISIT_DATE_KEY = 'lastVisitDate', QUOTAS_AMT_KEY = 'quotasAmt', QUOTAS_REFILL_AMT = 10000, QUOTAS_PER_CALL_AMT = 100, QUOTAS_PER_VID_DESC_AMT = 1, INLINE_STR = 'inline', BLOCK_STR = 'block', INLINE_BLOCK_STR = 'inline-block', FLEX_STR = 'flex', NONE_STR = 'none', MAX_SHORT_DESC_CHARS = 450, RESULT_KIND = { video: 'youtube#video', playlist: 'youtube#playlist', channel: 'youtube#channel' }, VIDEO_STR = 'video', CHANNEL_STR = 'channel';
(function init() {
    // header
    // left side
    searchInput = document.querySelector('#search-input');
    searchBtn = document.querySelector('#search-btn');
    searchBtn.onclick = (e) => {
        // prevent form redirect
        e.preventDefault();
        // prevent holding enter down
        searchBtn.blur();
        // update search query
        searchQuery = searchInput.value;
        const clearPrevious = true;
        showResults(clearPrevious);
    };
    channelInput = document.querySelector('#channel-input');
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
    // filters
    searchTypeDropdown = document.querySelector('#search-type-dropdown');
    vidDurationDropdownWrapper = document.querySelector('#video-duration-dropdown-wrapper');
    hideEl(vidDurationDropdownWrapper);
    vidDurationDropdown = document.querySelector('#video-duration-dropdown');
    vidQualityDropdownWrapper = document.querySelector('#video-quality-dropdown-wrapper');
    hideEl(vidQualityDropdownWrapper);
    vidQualityDropdown = document.querySelector('#video-quality-dropdown');
    vidReleaseTimeDropdownWrapper = document.querySelector('#video-release-time-dropdown-wrapper');
    hideEl(vidReleaseTimeDropdownWrapper);
    vidReleaseTimeDropdown = document.querySelector('#video-release-time-dropdown');
    channelVideoCountOrderByOption = document.querySelector('#channel-video-count-order-by-option');
    hideEl(channelVideoCountOrderByOption);
    resultsDatetimeFromRangeDropdown = document.querySelector('#results-datetime-from-range-dropdown');
    resultsDatetimeFromRangeCustomInput = document.querySelector('#results-datetime-from-range-custom-input');
    hideEl(resultsDatetimeFromRangeCustomInput);
    resultsDatetimeToRangeDropdown = document.querySelector('#results-datetime-to-range-dropdown');
    resultsDatetimeToRangeCustomInput = document.querySelector('#results-datetime-to-range-custom-input');
    hideEl(resultsDatetimeToRangeCustomInput);
    resultsLangDropdown = document.querySelector('#results-lang-dropdown');
    safeSearchDropdown = document.querySelector('#safe-search-dropdown');
    // options
    resultsPerCallDropdown = document.querySelector('#results-per-call-dropdown');
    resultsOrderByDropdown = document.querySelector('#results-order-by-dropdown');
    // results
    resultsWrapper = document.querySelector('#results-wrapper');
    loadMoreResultsBtn = document.querySelector('#load-more-results-btn');
    hideEl(loadMoreResultsBtn);
    loadMoreResultsBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
        // update next page token
        nextPageToken = jsonResp.nextPageToken;
        showResults();
    });
    // big display	
    bigDisplayWrapper = document.querySelector('#big-display-wrapper');
    hideEl(bigDisplayWrapper);
    bigDisplayTitle = document.querySelector('#big-display-title');
    bigDisplayChannelBtn = document.querySelector('#big-display-channel-btn');
    bigDisplayDesc = document.querySelector('#big-display-desc');
    bigDisplayDescReadMoreBtn = document.querySelector('#big-display-desc-read-more-btn');
    // help vars
    // update dropdown values
    const dropdowns = Array.from(document.querySelectorAll('select'));
    for (const dropdown of dropdowns) {
        updateDropdownValue(dropdown);
        dropdown.onchange = () => {
            updateDropdownValue(dropdown);
        };
    }
    nextPageToken = '';
    channelId = '';
    // get/update quotas
    let lastVisitDateStr = localStorage.getItem(LAST_VISIT_DATE_KEY);
    // reset
    if (!lastVisitDateStr || lastVisitDateStr != TODAY_DATE_STR) {
        lastVisitDateStr = TODAY_DATE_STR;
        localStorage.setItem(LAST_VISIT_DATE_KEY, TODAY_DATE_STR);
        localStorage.setItem(QUOTAS_AMT_KEY, QUOTAS_REFILL_AMT.toString());
    }
    quotasAmt = parseInt(localStorage.getItem(QUOTAS_AMT_KEY));
    const updateStoredQuotas = false;
    updateQuotas(updateStoredQuotas);
    // handle big display show/hide
    document.body.onclick = (e) => {
        const elClicked = e.target;
        const elClickedClass = elClicked.className;
        const elClickedId = elClicked.id;
        // prevent the display from being removed
        if (elClickedClass.includes('big-display') || elClickedId.includes('big-display')) {
            return;
        }
        hideBigDisplay();
        if (elClickedClass.includes('result')) {
            // scroll to top
            window.scrollTo({ top: 0, left: 0 });
            // show result on big display
            const resultWrapper = (elClickedClass.includes('wrapper')) ? elClicked : elClicked.parentElement;
            showBigDisplay(resultWrapper);
        }
    };
})();
function showResults(clear = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (quotasAmt < QUOTAS_PER_CALL_AMT) {
            alert('Not enough quotas available. Come back tomorrow');
            return;
        }
        try {
            // results type
            const searchTypePart = (searchType != '') ? `&type=${searchType}` : '';
            // video specific filters
            const vidDurationPart = (searchType == VIDEO_STR && vidDuration != '') ? `&videoDuration=${vidDuration}` : '';
            const vidQualityPart = (searchType == VIDEO_STR && vidQuality != '') ? `&videoDefinition=${vidQuality}` : '';
            const vidEventTypePart = (searchType == VIDEO_STR && vidReleaseTime != '') ? `&eventType=${vidReleaseTime}` : '';
            // datetime range
            const datetimeRangeValues = getDatetimeRange();
            const datetimeFromRange = datetimeRangeValues[0];
            const publishedAfterPart = (datetimeFromRange != '') ? `&publishedAfter=${datetimeFromRange}` : '';
            const datetimeToRange = datetimeRangeValues[1];
            const publishedBeforePart = (datetimeToRange != '') ? `&publishedBefore=${datetimeToRange}` : '';
            // channel id
            const channelIdPart = (channelId != '') ? `&channelId=${channelId}` : '';
            // results language
            const resultsLangPart = (resultsLang != '') ? `&relevanceLanguage=${resultsLang}` : '';
            const resp = yield fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${resultsPerCall}&pageToken=${nextPageToken}&q=${searchQuery}${searchTypePart}${vidDurationPart}${vidQualityPart}${vidEventTypePart}&order=${resultsOrderBy}${publishedAfterPart}${publishedBeforePart}${channelIdPart}${resultsLangPart}&safeSearch=${safeSearch}&key=${API_KEY}`);
            jsonResp = yield resp.json();
            // results
            // User has used their quotas outside this app as well
            if (!jsonResp.hasOwnProperty('items')) {
                alert('Not enough quotas available. Come back tomorrow');
                console.log('User has used their quotas outside this app as well');
                return;
            }
            // update quotas
            quotasAmt -= QUOTAS_PER_CALL_AMT;
            updateQuotas();
            // clear previous results
            if (clear) {
                clearResults();
            }
            const searchResults = jsonResp.items;
            // no results
            if (searchResults.length == 0) {
                alert('No results found');
                return;
            }
            // show/append results
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
                // hide when no more results available
                hideEl(loadMoreResultsBtn);
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
function showBigDisplay(resultWrapper) {
    // result metadata
    const resultMetadata = JSON.parse(resultWrapper.getAttribute('metadata'));
    const kind = resultMetadata.kind;
    // title 
    bigDisplayTitle.textContent = resultMetadata.title;
    // frame
    switch (kind) {
        case RESULT_KIND.video:
            const videoId = resultMetadata.videoId;
            bigDisplayFrame = document.createElement('iframe');
            bigDisplayFrame.src = `https://www.youtube.com/embed/${videoId}`;
            bigDisplayFrame.allowFullscreen = true;
            // fetch full desc
            if (quotasAmt < QUOTAS_PER_VID_DESC_AMT) {
                break;
            }
            let fullDesc;
            fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`)
                .then((data) => data.json()
                .then((json) => {
                fullDesc = json.items[0].snippet.description;
                // update quotas
                quotasAmt -= QUOTAS_PER_VID_DESC_AMT;
                updateQuotas();
                // no desc
                if (fullDesc == '') {
                    bigDisplayDesc.textContent = 'No description';
                    return;
                }
                // Replace search result desc version with video desc version
                const shortDescValues = getShortDescVersion(fullDesc);
                const shortDescVersion = shortDescValues[0];
                bigDisplayDesc.textContent = shortDescVersion;
                const hasMore = shortDescValues[1];
                if (hasMore) {
                    bigDisplayDescReadMoreBtn.onclick = () => {
                        bigDisplayDesc.textContent = fullDesc;
                        hideEl(bigDisplayDescReadMoreBtn);
                    };
                    setElDisplay(bigDisplayDescReadMoreBtn, INLINE_BLOCK_STR);
                }
            }))
                .catch((e) => { console.log('Exception occured: ', e); });
            break;
        case RESULT_KIND.playlist:
        case RESULT_KIND.channel:
            bigDisplayFrame = document.createElement('img');
            bigDisplayFrame.src = resultMetadata.thumbnailSrc;
            break;
    }
    bigDisplayFrame.id = 'big-display-frame';
    bigDisplayWrapper.insertBefore(bigDisplayFrame, bigDisplayChannelBtn);
    // channel
    bigDisplayChannelBtn.onclick = () => {
        // clear search query
        searchInput.value = '';
        // update channel
        channelInput.value = resultMetadata.channelName;
        channelId = resultMetadata.channelId;
        setElDisplay(clearChannelBtn, INLINE_BLOCK_STR);
        // trigger search
        searchBtn.click();
    };
    bigDisplayChannelBtn.textContent = resultMetadata.channelName;
    // desc
    if (kind == RESULT_KIND.video && quotasAmt >= QUOTAS_PER_VID_DESC_AMT) {
        bigDisplayDesc.textContent = 'Loading...';
    }
    else {
        bigDisplayDesc.textContent = resultMetadata.shortDesc;
    }
    setElDisplay(bigDisplayWrapper, FLEX_STR);
}
function hideBigDisplay() {
    // remove frame
    if (bigDisplayFrame) {
        bigDisplayFrame.remove();
    }
    hideEl(bigDisplayDescReadMoreBtn);
    hideEl(bigDisplayWrapper);
}
// help functions
function getElDisplay(el) {
    return el.style.display;
}
function setElDisplay(el, display) {
    if (getElDisplay(el) == display) {
        return;
    }
    el.style.display = display;
}
function hideEl(el) {
    setElDisplay(el, NONE_STR);
}
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
function updateDropdownValue(dropdown) {
    if (dropdown.id == searchTypeDropdown.id) {
        searchType = dropdown.value;
        setElDisplay(vidDurationDropdownWrapper, (searchType == VIDEO_STR) ? BLOCK_STR : NONE_STR);
        setElDisplay(vidQualityDropdownWrapper, (searchType == VIDEO_STR) ? BLOCK_STR : NONE_STR);
        setElDisplay(vidReleaseTimeDropdownWrapper, (searchType == VIDEO_STR) ? BLOCK_STR : NONE_STR);
        setElDisplay(channelVideoCountOrderByOption, (searchType == CHANNEL_STR) ? INLINE_STR : NONE_STR);
    }
    else if (dropdown.id == vidDurationDropdown.id) {
        vidDuration = dropdown.value;
    }
    else if (dropdown.id == vidQualityDropdown.id) {
        vidQuality = dropdown.value;
    }
    else if (dropdown.id == vidReleaseTimeDropdown.id) {
        vidReleaseTime = dropdown.value;
    }
    else if (dropdown.id == resultsDatetimeFromRangeDropdown.id) {
        resultsDatetimeFromRangeOption = dropdown.value;
    }
    else if (dropdown.id == resultsDatetimeToRangeDropdown.id) {
        resultsDatetimeToRangeOption = dropdown.value;
    }
    else if (dropdown.id == resultsLangDropdown.id) {
        resultsLang = dropdown.value;
    }
    else if (dropdown.id == safeSearchDropdown.id) {
        safeSearch = dropdown.value;
    }
    else if (dropdown.id == resultsPerCallDropdown.id) {
        resultsPerCall = parseInt(dropdown.value);
    }
    else if (dropdown.id == resultsOrderByDropdown.id) {
        resultsOrderBy = dropdown.value;
    }
}
function updateQuotas(updateStoredValue = true) {
    const quotasAmtStr = quotasAmt.toString();
    quotasAmtEl.textContent = quotasAmtStr;
    if (updateStoredValue) {
        localStorage.setItem(QUOTAS_AMT_KEY, quotasAmtStr);
    }
}
