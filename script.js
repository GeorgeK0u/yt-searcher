var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// header
// left side
var searchInput, searchBtn, channelInput, clearChannelBtn;
// right side
var quotasCostInfoLabel, quotasAmtEl;
// filters
var searchTypeDropdown, vidDurationDropdownWrapper, vidDurationDropdown, vidQualityDropdownWrapper, vidQualityDropdown, vidReleaseTimeDropdownWrapper, vidReleaseTimeDropdown, channelVideoCountOrderByOption, resultsDatetimeFromRangeDropdown, resultsDatetimeFromRangeCustomInput, resultsDatetimeToRangeDropdown, resultsDatetimeToRangeCustomInput, resultsLangDropdown, safeSearchDropdown;
// options
var resultsPerCallDropdown, resultsOrderByDropdown;
// results
var resultsWrapper;
var loadMoreResultsBtn;
// big display
var bigDisplayWrapper, bigDisplayTitle, bigDisplayFrame, bigDisplayChannelBtn, bigDisplayDesc, bigDisplayDescReadMoreBtn;
// help vars 
var searchQuery, channelId, quotasAmt;
var resultsPerCall, searchType, vidDuration, vidQuality, vidReleaseTime, resultsOrderBy, resultsDatetimeFromRangeOption, resultsDatetimeToRangeOption, resultsLang, safeSearch;
var jsonResp, nextPageToken;
// constants
// main api key 'AIzaSyDrn07slgPiKCk-HzkTQWTH4yl2PEOs51w'
// backup api key 'AIzaSyCHhXjOCJqs2FX58P_qhO9XGBZcWBMvMlk';
var API_KEY = 'AIzaSyDrn07slgPiKCk-HzkTQWTH4yl2PEOs51w', TODAY_DATE_STR = new Date().getDate().toString(), LAST_VISIT_DATE_KEY = 'lastVisitDate', DAY_DIGIT_COUNT = 2, MONTH_DIGIT_COUNT = 2, YEAR_DIGIT_COUNT = 4, QUOTAS_AMT_KEY = 'quotasAmt', QUOTAS_REFILL_AMT = 10000, QUOTAS_PER_CALL_AMT = 100, QUOTAS_PER_VID_DESC_AMT = 1, INLINE_STR = 'inline', BLOCK_STR = 'block', INLINE_BLOCK_STR = 'inline-block', FLEX_STR = 'flex', NONE_STR = 'none', MAX_SHORT_DESC_CHARS = 450, RESULT_KIND = { video: 'youtube#video', playlist: 'youtube#playlist', channel: 'youtube#channel' }, VIDEO_STR = 'video', CHANNEL_STR = 'channel';
(function init() {
    var _this = this;
    // header
    // left side
    searchInput = document.querySelector('#search-input');
    searchBtn = document.querySelector('#search-btn');
    searchBtn.onclick = function (e) {
        // prevent form redirect
        e.preventDefault();
        // prevent holding enter down
        searchBtn.blur();
        // update search query
        searchQuery = searchInput.value;
        var clearPrevious = true;
        showResults(clearPrevious);
    };
    channelInput = document.querySelector('#channel-input');
    clearChannelBtn = document.querySelector('#clear-channel-btn');
    clearChannelBtn.onclick = function () {
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
    var quotasStr = 'Quotas';
    quotasCostInfoLabel.title = "Search / Go to Channel: -".concat(QUOTAS_PER_CALL_AMT, " ").concat(quotasStr, "\nLoad more: -").concat(QUOTAS_PER_CALL_AMT, " ").concat(quotasStr, "\nVideo description: -").concat(QUOTAS_PER_VID_DESC_AMT, " ").concat(quotasStr);
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
    loadMoreResultsBtn.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // update next page token
            nextPageToken = jsonResp.nextPageToken;
            showResults();
            return [2 /*return*/];
        });
    }); };
    // big display	
    bigDisplayWrapper = document.querySelector('#big-display-wrapper');
    hideEl(bigDisplayWrapper);
    bigDisplayTitle = document.querySelector('#big-display-title');
    bigDisplayChannelBtn = document.querySelector('#big-display-channel-btn');
    bigDisplayDesc = document.querySelector('#big-display-desc');
    bigDisplayDescReadMoreBtn = document.querySelector('#big-display-desc-read-more-btn');
    // help vars
    // update dropdown values
    var dropdowns = Array.from(document.querySelectorAll('select'));
    var _loop_1 = function (dropdown) {
        updateDropdownValue(dropdown);
        dropdown.onchange = function () {
            updateDropdownValue(dropdown);
        };
    };
    for (var _i = 0, dropdowns_1 = dropdowns; _i < dropdowns_1.length; _i++) {
        var dropdown = dropdowns_1[_i];
        _loop_1(dropdown);
    }
    nextPageToken = '';
    channelId = '';
    // get/update quotas
    var lastVisitDateStr = localStorage.getItem(LAST_VISIT_DATE_KEY);
    // reset
    if (!lastVisitDateStr || lastVisitDateStr != TODAY_DATE_STR) {
        lastVisitDateStr = TODAY_DATE_STR;
        localStorage.setItem(LAST_VISIT_DATE_KEY, TODAY_DATE_STR);
        localStorage.setItem(QUOTAS_AMT_KEY, QUOTAS_REFILL_AMT.toString());
    }
    quotasAmt = parseInt(localStorage.getItem(QUOTAS_AMT_KEY));
    var updateStoredQuotas = false;
    updateQuotas(updateStoredQuotas);
    // handle big display show/hide
    document.body.onclick = function (e) {
        var elClicked = e.target;
        var elClickedClass = elClicked.className;
        var elClickedId = elClicked.id;
        // prevent the display from being removed
        if (elClickedClass.includes('big-display') || elClickedId.includes('big-display')) {
            return;
        }
        hideBigDisplay();
        if (elClickedClass.includes('result')) {
            // scroll to top
            window.scrollTo({ top: 0, left: 0 });
            // show result on big display
            var resultWrapper = (elClickedClass.includes('wrapper')) ? elClicked : elClicked.parentElement;
            showBigDisplay(resultWrapper);
        }
    };
})();
function showResults(clear) {
    if (clear === void 0) { clear = false; }
    return __awaiter(this, void 0, void 0, function () {
        var searchTypePart, vidDurationPart, vidQualityPart, vidEventTypePart, datetimeRangeValues, datetimeFromRange, publishedAfterPart, datetimeToRange, publishedBeforePart, channelIdPart, resultsLangPart, resp, searchResults, i, result, resultData, resultWrapper, resultTitle, resultChannelName, resultThumbnail, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (quotasAmt < QUOTAS_PER_CALL_AMT) {
                        alert('Not enough quotas available. Come back tomorrow');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    searchTypePart = (searchType != '') ? "&type=".concat(searchType) : '';
                    vidDurationPart = (searchType == VIDEO_STR && vidDuration != '') ? "&videoDuration=".concat(vidDuration) : '';
                    vidQualityPart = (searchType == VIDEO_STR && vidQuality != '') ? "&videoDefinition=".concat(vidQuality) : '';
                    vidEventTypePart = (searchType == VIDEO_STR && vidReleaseTime != '') ? "&eventType=".concat(vidReleaseTime) : '';
                    datetimeRangeValues = getDatetimeRange();
                    datetimeFromRange = datetimeRangeValues[0];
                    publishedAfterPart = (datetimeFromRange != '') ? "&publishedAfter=".concat(datetimeFromRange) : '';
                    datetimeToRange = datetimeRangeValues[1];
                    publishedBeforePart = (datetimeToRange != '') ? "&publishedBefore=".concat(datetimeToRange) : '';
                    channelIdPart = (channelId != '') ? "&channelId=".concat(channelId) : '';
                    resultsLangPart = (resultsLang != '') ? "&relevanceLanguage=".concat(resultsLang) : '';
                    return [4 /*yield*/, fetch("https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=".concat(resultsPerCall, "&pageToken=").concat(nextPageToken, "&q=").concat(searchQuery).concat(searchTypePart).concat(vidDurationPart).concat(vidQualityPart).concat(vidEventTypePart, "&order=").concat(resultsOrderBy).concat(publishedAfterPart).concat(publishedBeforePart).concat(channelIdPart).concat(resultsLangPart, "&safeSearch=").concat(safeSearch, "&key=").concat(API_KEY))];
                case 2:
                    resp = _a.sent();
                    return [4 /*yield*/, resp.json()];
                case 3:
                    jsonResp = _a.sent();
                    // results
                    // User has used their quotas outside this app as well
                    if (!jsonResp.hasOwnProperty('items')) {
                        alert('Not enough quotas available. Come back tomorrow');
                        console.log('User has used their quotas outside this app as well');
                        return [2 /*return*/];
                    }
                    // update quotas
                    quotasAmt -= QUOTAS_PER_CALL_AMT;
                    updateQuotas();
                    // clear previous results
                    if (clear) {
                        clearResults();
                    }
                    searchResults = jsonResp.items;
                    // no results
                    if (searchResults.length == 0) {
                        alert('No results found');
                        return [2 /*return*/];
                    }
                    // show/append results
                    for (i = 0; i < searchResults.length; i++) {
                        result = searchResults[i];
                        resultData = result.snippet;
                        resultWrapper = document.createElement('div');
                        resultWrapper.className = 'result-wrapper';
                        resultTitle = document.createElement('div');
                        resultTitle.className = 'result-title';
                        resultTitle.textContent = decodeEscaped(resultData.title);
                        resultWrapper.appendChild(resultTitle);
                        resultChannelName = document.createElement('div');
                        resultChannelName.className = 'result-channel-name';
                        resultChannelName.textContent = resultData.channelTitle;
                        resultWrapper.appendChild(resultChannelName);
                        resultThumbnail = document.createElement('img');
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
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.log('Exception occured: ', err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function clearResults() {
    // clear results
    for (var i = resultsWrapper.childElementCount - 1; i >= 0; i--) {
        resultsWrapper.children[i].remove();
    }
    hideEl(loadMoreResultsBtn);
    // reset next page token
    nextPageToken = '';
}
function showBigDisplay(resultWrapper) {
    // result metadata
    var resultMetadata = JSON.parse(resultWrapper.getAttribute('metadata'));
    var kind = resultMetadata.kind;
    // title 
    bigDisplayTitle.textContent = resultMetadata.title;
    // frame
    switch (kind) {
        case RESULT_KIND.video:
            var videoId = resultMetadata.videoId;
            bigDisplayFrame = document.createElement('iframe');
            bigDisplayFrame.src = "https://www.youtube.com/embed/".concat(videoId);
            bigDisplayFrame.allowFullscreen = true;
            // fetch full desc
            if (quotasAmt < QUOTAS_PER_VID_DESC_AMT) {
                break;
            }
            var fullDesc_1;
            fetch("https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=".concat(videoId, "&key=").concat(API_KEY))
                .then(function (data) { return data.json()
                .then(function (json) {
                fullDesc_1 = json.items[0].snippet.description;
                // update quotas
                quotasAmt -= QUOTAS_PER_VID_DESC_AMT;
                updateQuotas();
                // no desc
                if (fullDesc_1 == '') {
                    bigDisplayDesc.textContent = 'No description';
                    return;
                }
                // Replace search result desc version with video desc version
                var shortDescValues = getShortDescVersion(fullDesc_1);
                var shortDescVersion = shortDescValues[0];
                bigDisplayDesc.textContent = shortDescVersion;
                var hasMore = shortDescValues[1];
                if (hasMore) {
                    bigDisplayDescReadMoreBtn.onclick = function () {
                        bigDisplayDesc.textContent = fullDesc_1;
                        hideEl(bigDisplayDescReadMoreBtn);
                    };
                    setElDisplay(bigDisplayDescReadMoreBtn, INLINE_BLOCK_STR);
                }
            }); })
                .catch(function (e) { console.log('Exception occured: ', e); });
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
    bigDisplayChannelBtn.onclick = function () {
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
        var parser = new DOMParser().parseFromString(text, 'text/html');
        var decodedText = parser.documentElement.textContent;
        return decodedText;
    }
    catch (err) {
        console.log('Failed to decode html-escaped title');
        return text;
    }
}
function getShortDescVersion(fullDesc) {
    var hasMore = fullDesc.length > MAX_SHORT_DESC_CHARS;
    if (hasMore) {
        var shortDescVersion = fullDesc.substring(0, MAX_SHORT_DESC_CHARS) + '...';
        return [shortDescVersion, hasMore];
    }
    return [fullDesc, hasMore];
}
function isDatetimeFormatValid(text) {
    if (!text.includes('/')) {
        return false;
    }
    var pattern = '';
    for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
        var ch = text_1[_i];
        var chCode = ch.charCodeAt(0);
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
    var dateValues = ((pattern.includes(' ')) ? pattern.split(' ')[0] : pattern).split('/').join('');
    var maxDigits = DAY_DIGIT_COUNT + MONTH_DIGIT_COUNT + YEAR_DIGIT_COUNT;
    if (dateValues.length > maxDigits) {
        return false;
    }
    for (var _a = 0, dateValues_1 = dateValues; _a < dateValues_1.length; _a++) {
        var ch = dateValues_1[_a];
        if (ch != '#') {
            return false;
        }
    }
    return true;
}
function getDatetimeRange() {
    var rangeArr = [];
    var today = new Date();
    var thisYear = today.getFullYear();
    var thisMonth = today.getMonth();
    var thisDate = today.getDate();
    var thisDay = today.getDay();
    // from range
    var fromRange = '';
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
                var customDatetime = resultsDatetimeFromRangeCustomInput.value.trim();
                if (!isDatetimeFormatValid(customDatetime)) {
                    resultsDatetimeFromRangeCustomInput.value = '';
                    break;
                }
                var datetimeValues = customDatetime.includes(' ') ? customDatetime.split(' ') : [customDatetime];
                // custom date
                var customDateValues = datetimeValues[0].split('/');
                var customDate = customDateValues[0];
                var customMonth = (parseInt(customDateValues[1]) - 1).toString();
                var customYear = customDateValues[2];
                // custom time
                var customHours = void 0, customMins = void 0, customSecs = void 0;
                if (datetimeValues.length == 2) {
                    var customTimeValues = datetimeValues[1].split(':');
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
    var toRange = '';
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
                var customDatetime = resultsDatetimeToRangeCustomInput.value.trim();
                if (!isDatetimeFormatValid(customDatetime)) {
                    resultsDatetimeToRangeCustomInput.value = '';
                    break;
                }
                var datetimeValues = customDatetime.includes(' ') ? customDatetime.split(' ') : [customDatetime];
                // custom date
                var customDateValues = datetimeValues[0].split('/');
                var customDate = customDateValues[0];
                var customMonth = (parseInt(customDateValues[1]) - 1).toString();
                var customYear = customDateValues[2];
                // custom time
                var customHours = void 0, customMins = void 0, customSecs = void 0;
                if (datetimeValues.length == 2) {
                    var customTimeValues = datetimeValues[1].split(':');
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
    var year = datetime.getFullYear();
    var month = formatDatetimeValue(datetime.getMonth() + 1);
    var date = formatDatetimeValue(datetime.getDate());
    var hours = formatDatetimeValue(datetime.getHours());
    var mins = formatDatetimeValue(datetime.getMinutes());
    var secs = formatDatetimeValue(datetime.getSeconds());
    return "".concat(year, "/").concat(month, "/").concat(date, " ").concat(hours, ":").concat(mins, ":").concat(secs);
}
function convertDatetimeToRFC(datetime) {
    if (datetime == '') {
        return datetime;
    }
    var rfcDatetime = datetime;
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
function updateQuotas(updateStoredValue) {
    if (updateStoredValue === void 0) { updateStoredValue = true; }
    var quotasAmtStr = quotasAmt.toString();
    quotasAmtEl.textContent = quotasAmtStr;
    if (updateStoredValue) {
        localStorage.setItem(QUOTAS_AMT_KEY, quotasAmtStr);
    }
}
