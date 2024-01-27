import
	{ 
		QUOTAS_PER_CALL_AMT, QUOTAS_PER_VID_DESC_AMT, checkResetStoredQuotasAmt, getStoredQuotasAmt, setStoredQuotasAmt,
		INLINE_STR, INLINE_BLOCK_STR, BLOCK_STR, FLEX_STR, NONE_STR, getElDisplay, setElDisplay, hideEl, 
		DATETIME_RANGE_OPTIONS, getDatetimeRange,
		decodeEscaped, 
		VIDEO_STR, CHANNEL_STR,
		getShortDescVersion
	} from './helper.js'

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
let searchQuery, channelId, quotasAmt, jsonResp, nextPageToken, searchTypeTmp;
// dropdown selections
let resultsPerCall, searchType, vidDuration, vidQuality, vidReleaseTime, resultsOrderBy, resultsDatetimeFromRangeOption, resultsDatetimeToRangeOption, resultsLang, safeSearch;
// constants
// main api key 'AIzaSyDrn07slgPiKCk-HzkTQWTH4yl2PEOs51w'
// backup api key 'AIzaSyCHhXjOCJqs2FX58P_qhO9XGBZcWBMvMlk';
const API_KEY = 'AIzaSyDrn07slgPiKCk-HzkTQWTH4yl2PEOs51w';
const RESULT_KIND = { video: 'youtube#video', playlist: 'youtube#playlist', channel: 'youtube#channel' }, QUOTAS_STR = 'Quotas', METADATA_STR = 'metadata';

(function init()
{
	// header
	// left side
	searchInput = document.querySelector('#search-input');
	searchBtn = document.querySelector('#search-btn');
	searchBtn.onclick = (e) =>
		{
			// prevent form redirect
			e.preventDefault();
			// prevent form submitting on holding down
			searchBtn.blur();
			// update search query
			searchQuery = searchInput.value;
			const clearPrevious = true;
			showResults(clearPrevious);
		}
	channelInput = document.querySelector('#channel-input');
	clearChannelBtn = document.querySelector('#clear-channel-btn');
	clearChannelBtn.onclick = () =>
		{
			channelInput.value = '';
			channelId = '';
			hideEl(clearChannelBtn);
			clearResults();
			// change search type back to selection
			if (searchTypeTmp)
			{
				searchTypeDropdown.value = searchTypeTmp;
				updateDropdownValue(searchTypeDropdown);
				// reset
				searchTypeTmp = null;
			}
		}
	hideEl(clearChannelBtn);
	// right side
	quotasCostInfoLabel = document.querySelector('#quotas-cost-info-label');
	quotasCostInfoLabel.title = `Search / Go to Channel: -${QUOTAS_PER_CALL_AMT} ${QUOTAS_STR}\nLoad more: -${QUOTAS_PER_CALL_AMT} ${QUOTAS_STR}\nVideo description: -${QUOTAS_PER_VID_DESC_AMT} ${QUOTAS_STR}`;
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
	loadMoreResultsBtn.onclick = async () =>
		{
			// update next page token
			nextPageToken = jsonResp.nextPageToken;
			showResults();
		}
	// big display	
	bigDisplayWrapper = document.querySelector('#big-display-wrapper');
	hideEl(bigDisplayWrapper);
	bigDisplayTitle = document.querySelector('#big-display-title');
	bigDisplayChannelBtn = document.querySelector('#big-display-channel-btn');
	bigDisplayDesc = document.querySelector('#big-display-desc');
	bigDisplayDescReadMoreBtn = document.querySelector('#big-display-desc-read-more-btn');
	// help vars
	channelId = '';
	nextPageToken = '';
	// update dropdown values
	const dropdowns = [searchTypeDropdown, vidDurationDropdown, vidQualityDropdown, vidReleaseTimeDropdown, resultsDatetimeFromRangeDropdown, resultsDatetimeToRangeDropdown, resultsLangDropdown, safeSearchDropdown, resultsPerCallDropdown, resultsOrderByDropdown];
	for (const dropdown of dropdowns)
	{
		updateDropdownValue(dropdown);
		dropdown.onchange = () => 
			{
				updateDropdownValue(dropdown);
			}
	}
	// check reset quotas
	checkResetStoredQuotasAmt();
	// get quotas
	quotasAmt = getStoredQuotasAmt();
	const updateStoredQuotas = false;
	updateQuotas(updateStoredQuotas);
	// handle big display show/hide
	document.body.onclick = (e) =>
		{
			const elClicked = e.target;
			const elClickedClass = elClicked.className; 
			const elClickedId = elClicked.id;
			// prevent the display from being removed
			if (elClickedClass.includes('big-display') || elClickedId.includes('big-display'))
			{
				return;
			}
			hideBigDisplay();
			if (elClickedClass.includes('result'))
			{
				// scroll to top
				window.scrollTo({ top: 0, left: 0 });
				// show result on big display
				const resultWrapper = (elClickedClass.includes('wrapper')) ? elClicked : elClicked.parentElement;
				showBigDisplay(resultWrapper);
			}
		}
})();

async function showResults(clear=false)
{
	if (quotasAmt < QUOTAS_PER_CALL_AMT)
	{
		alert('Not enough quotas available. Come back tomorrow');
		return;
	}
	// results type
	const searchTypePart = (searchType != '') ? `&type=${searchType}` : '';
	// video specific filters
	const vidDurationPart = (searchType == VIDEO_STR && vidDuration != '') ? `&videoDuration=${vidDuration}` : '';
	const vidQualityPart = (searchType == VIDEO_STR && vidQuality != '') ? `&videoDefinition=${vidQuality}` : '';
	const vidEventTypePart = (searchType == VIDEO_STR && vidReleaseTime != '') ? `&eventType=${vidReleaseTime}` : '';
	// datetime range
	const datetimeRangeValues = getDatetimeRange(resultsDatetimeFromRangeOption, resultsDatetimeFromRangeCustomInput, resultsDatetimeToRangeOption, resultsDatetimeToRangeCustomInput);
	const datetimeFromRange = datetimeRangeValues[0];
	const publishedAfterPart = (datetimeFromRange != '') ? `&publishedAfter=${datetimeFromRange}` : '';
	const datetimeToRange = datetimeRangeValues[1];
	const publishedBeforePart = (datetimeToRange != '') ? `&publishedBefore=${datetimeToRange}` : '';
	// channel id
	const channelIdPart = (channelId != '') ? `&channelId=${channelId}` : '';
	// results language
	const resultsLangPart = (resultsLang != '') ? `&relevanceLanguage=${resultsLang}` : '';
	try
	{
		const resp = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${resultsPerCall}&pageToken=${nextPageToken}&q=${searchQuery}${searchTypePart}${vidDurationPart}${vidQualityPart}${vidEventTypePart}&order=${resultsOrderBy}${publishedAfterPart}${publishedBeforePart}${channelIdPart}${resultsLangPart}&safeSearch=${safeSearch}&key=${API_KEY}`);
		jsonResp = await resp.json();
		// results
		// User has used their quotas outside this app as well
		if (!jsonResp.hasOwnProperty('items'))
		{
			alert('Not enough quotas available. Come back tomorrow');
			console.log('User has used their quotas outside this app as well');
			return;
		}
		// update quotas
		quotasAmt -= QUOTAS_PER_CALL_AMT;
		updateQuotas();
		// clear previous results
		if (clear)
		{
			clearResults();
		}
		const searchResults = jsonResp.items;
		// no results
		if (searchResults.length == 0)
		{
			alert('No results found');
			return;
		}
		// show/append results
		for (let i = 0; i < searchResults.length; i++)
		{
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
			resultWrapper.setAttribute(METADATA_STR, JSON.stringify(
				{ 
					kind: result.id.kind,
					channelId: resultData.channelId,
					videoId: (result.id.hasOwnProperty('videoId')) ? result.id.videoId : '',
					title: resultTitle.textContent,
					channelName: resultChannelName.textContent,
					thumbnailSrc: resultThumbnail.src,
					desc: resultData.description
				}
			));
		}
		// update load more btn visibility
		if (jsonResp.hasOwnProperty('nextPageToken'))
		{
			setElDisplay(loadMoreResultsBtn, INLINE_BLOCK_STR);
		}
		else
		{
			// hide when no more results available
			hideEl(loadMoreResultsBtn);
		}
	}
	catch (err)
	{
		console.log('Exception occured: ', err);
	}
}
function clearResults()
{
	// clear results
	for (let i = resultsWrapper.childElementCount-1; i >= 0; i--)
	{
		resultsWrapper.children[i].remove();
	}
	hideEl(loadMoreResultsBtn);
	// reset next page token
	nextPageToken = '';
}

function showBigDisplay(resultWrapper)
{
	// result metadata
	const resultMetadata = JSON.parse(resultWrapper.getAttribute(METADATA_STR));
	const kind = resultMetadata.kind;
	// title 
	bigDisplayTitle.textContent = resultMetadata.title;
	// frame
	switch (kind)
	{
		case RESULT_KIND.video:
			const videoId = resultMetadata.videoId;
			bigDisplayFrame = document.createElement('iframe');
			bigDisplayFrame.src = `https://www.youtube.com/embed/${videoId}`;
			bigDisplayFrame.allowFullscreen = true;
			// fetch full desc
			if (quotasAmt < QUOTAS_PER_VID_DESC_AMT)
			{
				alert('Not enough quotas to load full description');
				break;
			}
			let fullDesc;
			fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`)
				.then((data) => data.json()
					  .then((json) => 
						{	
							fullDesc = json.items[0].snippet.description;
							// update quotas
							quotasAmt -= QUOTAS_PER_VID_DESC_AMT;
							updateQuotas();
							// no desc
							if (fullDesc == '')
							{
								bigDisplayDesc.textContent = 'No description';
								return;
							}
							// Replace search result desc version with video desc version
							const [shortDescVersion, hasMore] = getShortDescVersion(fullDesc);
							bigDisplayDesc.textContent = shortDescVersion;
							if (hasMore)
							{
								bigDisplayDescReadMoreBtn.onclick = () =>
									{
										bigDisplayDesc.textContent = fullDesc;
										hideEl(bigDisplayDescReadMoreBtn);
									}
								setElDisplay(bigDisplayDescReadMoreBtn, INLINE_BLOCK_STR);
							}
						})
					 )
				 .catch((e) => { console.log('Exception occured: ', e) })
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
	bigDisplayChannelBtn.onclick = () =>
		{
			// clear search query
			searchInput.value = '';
			// update channel
			channelInput.value = resultMetadata.channelName;
			channelId = resultMetadata.channelId;
			setElDisplay(clearChannelBtn, INLINE_BLOCK_STR);
			// temp change search type to channel default listing
			if (searchTypeDropdown.value == CHANNEL_STR)
			{
				// store search type selection
				searchTypeTmp = searchType;
				// change to type all
				searchTypeDropdown.value = ''; 
				updateDropdownValue(searchTypeDropdown);
			}
			// trigger search
			searchBtn.click();
		}
	bigDisplayChannelBtn.textContent = resultMetadata.channelName;
	// desc
	if (kind == RESULT_KIND.video && quotasAmt >= QUOTAS_PER_VID_DESC_AMT)
	{
		bigDisplayDesc.textContent = 'Loading...';
	}
	else
	{
		bigDisplayDesc.textContent = resultMetadata.desc;
	}
	setElDisplay(bigDisplayWrapper, FLEX_STR);
}
function hideBigDisplay()
{
	// remove frame
	if (bigDisplayFrame)
	{
		bigDisplayFrame.remove();
		bigDisplayFrame = null;
	}
	hideEl(bigDisplayDescReadMoreBtn);
	hideEl(bigDisplayWrapper);
}

function updateQuotas(updateStoredValue=true)
{
	const quotasAmtStr = quotasAmt.toString();
	quotasAmtEl.textContent = quotasAmtStr;
	if (updateStoredValue)
	{
		setStoredQuotasAmt(quotasAmtStr);
	}
}

// on dropdown selection change
function updateDropdownValue(dropdown) 
{
    if (dropdown.id == searchTypeDropdown.id) 
	{
        searchType = dropdown.value;
        setElDisplay(vidDurationDropdownWrapper, (searchType == VIDEO_STR) ? BLOCK_STR : NONE_STR);
        setElDisplay(vidQualityDropdownWrapper, (searchType == VIDEO_STR) ? BLOCK_STR : NONE_STR);
        setElDisplay(vidReleaseTimeDropdownWrapper, (searchType == VIDEO_STR) ? BLOCK_STR : NONE_STR);
        setElDisplay(channelVideoCountOrderByOption, (searchType == CHANNEL_STR) ? INLINE_STR : NONE_STR);
    }
    else if (dropdown.id == vidDurationDropdown.id) 
	{
        vidDuration = dropdown.value;
    }
    else if (dropdown.id == vidQualityDropdown.id) 
	{
        vidQuality = dropdown.value;
    }
    else if (dropdown.id == vidReleaseTimeDropdown.id) 
	{
        vidReleaseTime = dropdown.value;
    }
    else if (dropdown.id == resultsDatetimeFromRangeDropdown.id) 
	{
        resultsDatetimeFromRangeOption = dropdown.value;
        if (resultsDatetimeFromRangeOption == DATETIME_RANGE_OPTIONS.custom)
		{
            setElDisplay(resultsDatetimeFromRangeCustomInput, INLINE_BLOCK_STR);
        }
		else
		{
			hideEl(resultsDatetimeFromRangeCustomInput);
        }
    }
    else if (dropdown.id == resultsDatetimeToRangeDropdown.id) 
	{
        resultsDatetimeToRangeOption = dropdown.value;
        if (resultsDatetimeToRangeOption == DATETIME_RANGE_OPTIONS.custom) 
		{
            setElDisplay(resultsDatetimeToRangeCustomInput, INLINE_BLOCK_STR);
        }
		else
		{
			hideEl(resultsDatetimeToRangeCustomInput);
        }
    }
    else if (dropdown.id == resultsLangDropdown.id) 
	{
        resultsLang = dropdown.value;
    }
    else if (dropdown.id == safeSearchDropdown.id) 
	{
        safeSearch = dropdown.value;
    }
    else if (dropdown.id == resultsPerCallDropdown.id) 
	{
        resultsPerCall = parseInt(dropdown.value);
    }
    else if (dropdown.id == resultsOrderByDropdown.id) 
	{
        resultsOrderBy = dropdown.value;
    }
}
