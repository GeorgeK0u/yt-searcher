// constants
// get/update stored quotas
const TODAY_DATE_STR = new Date().getDate().toString(), LAST_VISIT_DATE_KEY = 'lastVisitDate', QUOTAS_AMT_KEY = 'quotasAmt', QUOTAS_REFILL_AMT_STR = '10000', QUOTAS_PER_CALL_AMT = 100, QUOTAS_PER_VID_DESC_AMT = 1;
// CSS display types
const INLINE_STR = 'inline', INLINE_BLOCK_STR = 'inline-block', BLOCK_STR = 'block', FLEX_STR = 'flex', NONE_STR = 'none'; 
// datetime validation
const REQ_DATE_PART_COUNT = 3, MIN_TIME_PART_COUNT = 2, MAX_TIME_PART_COUNT = 3, MIN_YEAR_DIGIT_COUNT = 4, MAX_YEAR_DIGIT_COUNT = 4, MIN_MONTH_DIGIT_COUNT = 1, MAX_MONTH_DIGIT_COUNT = 2, MIN_DAY_DIGIT_COUNT = 1, MAX_DAY_DIGIT_COUNT = 2, MIN_TIME_DIGIT_COUNT = 1, MAX_TIME_DIGIT_COUNT = 2, DATE_SEP_STR = '/', TIME_SEP_STR = ':', FIRST_NUM_ASCII_CODE = 48, LAST_NUM_ASCII_CODE = 57, NUMERIC_VALUE_STR = '#', DATETIME_RANGE_OPTIONS = { day: 'day', week: 'week', month: 'month', year: 'year', custom: 'custom' }, WEEK_DAY_COUNT = 7, MAX_MONTH_NUM = 12, LAST_HOUR_STR = '23', LAST_MIN_STR = '59', LAST_SEC_STR = 59;
// result types
const VIDEO_STR = 'video', CHANNEL_STR = 'channel';
// vid desc load more
const MAX_SHORT_DESC_CHAR_COUNT = 450; 

// Stored quotas handling
function checkResetStoredQuotasAmt()
{
	let lastVisitDateStr = localStorage.getItem(LAST_VISIT_DATE_KEY);
	// reset
	if (!lastVisitDateStr || lastVisitDateStr != TODAY_DATE_STR)
	{
		lastVisitDateStr = TODAY_DATE_STR;
		localStorage.setItem(LAST_VISIT_DATE_KEY, TODAY_DATE_STR);
		localStorage.setItem(QUOTAS_AMT_KEY, QUOTAS_REFILL_AMT_STR);
	}
}
function getStoredQuotasAmt()
{
	const quotasAmt = parseInt(localStorage.getItem(QUOTAS_AMT_KEY));
	return quotasAmt;
}
function setStoredQuotasAmt(quotasAmtStr)
{
	localStorage.setItem(QUOTAS_AMT_KEY, quotasAmtStr);
}

// Modify element display
function getElDisplay(el) 
{
    return el.style.display;
}
function setElDisplay(el, display) 
{
    if (getElDisplay(el) == display) 
	{
        return;
    }
    el.style.display = display;
}
function hideEl(el) 
{
    setElDisplay(el, NONE_STR);
}

// Custom datetime range validation
function validateDate(dateStr) 
{
    // date seperator check
    if (!dateStr.includes(DATE_SEP_STR)) 
	{
        return false;
    }
    // replace number chars to specific char
    let pattern = '';
    for (const ch of dateStr)
	{
        const chCode = ch.charCodeAt(0);
        if (chCode >= FIRST_NUM_ASCII_CODE && chCode <= LAST_NUM_ASCII_CODE)
		{
            pattern += NUMERIC_VALUE_STR;
        }
        else if (ch == NUMERIC_VALUE_STR)
		{
            pattern += `[${NUMERIC_VALUE_STR}]`;
        }
        else 
		{
            pattern += ch;
        }
    }
    const patternParts = pattern.split(DATE_SEP_STR);
    // check if date part count is year, month and day
    if (patternParts.length != REQ_DATE_PART_COUNT) 
	{
        return false;
    }
    // min and max digit counts
	const [yearDigits, monthDigits, dayDigits] = patternParts;
    const yearDigitCount = yearDigits.length, monthDigitCount = monthDigits.length, dayDigitCount = dayDigits.length;
    if (yearDigitCount < MIN_YEAR_DIGIT_COUNT || yearDigitCount > MAX_YEAR_DIGIT_COUNT || monthDigitCount < MIN_MONTH_DIGIT_COUNT || monthDigitCount > MAX_MONTH_DIGIT_COUNT || dayDigitCount < MIN_DAY_DIGIT_COUNT || dayDigitCount > MAX_DAY_DIGIT_COUNT) 
	{
        return false;
    }
    // only numeric chars in-between date seperator check
    const patternPartsStr = patternParts.join('');
    for (const ch of patternPartsStr)
	{
        if (ch != NUMERIC_VALUE_STR)
		{
            return false;
        }
    }
	// check if month is valid
	const [yearStr, monthStr, dayStr] = dateStr.split(DATE_SEP_STR);
	const monthNum = parseInt(monthStr);
	if (monthNum == 0 || monthNum > MAX_MONTH_NUM)
	{
		return false;
	}
	// check if day is valid
	const dayNum = parseInt(dayStr);
	const maxDayNumOfMonth = new Date(yearStr, monthStr, 0).getDate();
	if (dayNum == 0 || dayNum > maxDayNumOfMonth)
	{
		return false;
	}
    return true;
}
function validateTime(timeStr) 
{
    // time seperator check
    if (!timeStr.includes(TIME_SEP_STR)) 
	{
        return false;
    }
    // replace number chars to specific char
    let pattern = '';
    for (const ch of pattern)
	{
        const chCode = ch.charCodeAt(0);
        if (chCode >= FIRST_NUM_ASCII_CODE && chCode <= LAST_NUM_ASCII_CODE)
		{
            pattern += NUMERIC_VALUE_STR;
        }
        else if (ch == NUMERIC_VALUE_STR)
		{
            pattern += `[${NUMERIC_VALUE_STR}]`;
        }
        else 
		{
            pattern += ch;
        }
    }
    const patternParts = pattern.split(TIME_SEP_STR);
    // check if time part count is either hours and mins or hours, mins and secs
    if (patternParts.length != MIN_TIME_PART_COUNT && patternParts.length != MAX_TIME_PART_COUNT) 
	{
        return false;
    }
    // min and max digit counts
    for (const patternPart of patternParts)
	{
        if (patternPart.length < MIN_TIME_DIGIT_COUNT || patternPart.length > MAX_TIME_DIGIT_COUNT)
		{
            return false;
        }
    }
    // only numeric chars in-between time seperator check
    const patternPartsStr = patternParts.join('');
    for (const ch of patternPartsStr)
	{
        if (ch != NUMERIC_VALUE_STR)
		{
            return false;
        }
    }
    return true;
}

// Datetime formatting
function formatDatetimeValue(datetimeValue) 
{
    return datetimeValue.toString().padStart(2, '0');
}
function formatDatetime(datetime) 
{
    const year = datetime.getFullYear();
    const month = formatDatetimeValue(datetime.getMonth() + 1);
    const day = formatDatetimeValue(datetime.getDate());
    const hours = formatDatetimeValue(datetime.getHours());
    const mins = formatDatetimeValue(datetime.getMinutes());
    const secs = formatDatetimeValue(datetime.getSeconds());
    return `${year}/${month}/${day} ${hours}:${mins}:${secs}`;
}
// API requires datetime range value to be in RFC format
function convertDatetimeToRFC(datetimeStr) 
{
    if (datetimeStr == '') 
	{
        return datetimeStr;
    }
    let rfcDatetime = datetimeStr;
    rfcDatetime = rfcDatetime.replaceAll(DATE_SEP_STR, '-');
    rfcDatetime = rfcDatetime.replace(' ', 'T');
    rfcDatetime += 'Z';
    return rfcDatetime;
}
function getCustomDatetimeRange(resultsDatetimeRangeCustomInput, defaultDate, defaultTime)
{
	// get custom datetime
	const customDatetime = resultsDatetimeRangeCustomInput.value.trim();
	const customDatetimeParts = customDatetime.split(' ');
	// get custom date
	const customDate = customDatetimeParts[0];
	// get custom time
	const customTime = customDatetimeParts[1] || customDatetimeParts[0];
	// validate date
	const isDateValid = validateDate(customDate);
	let customYear, customMonth, customDay;
	if (!isDateValid) 
	{
		// default date
		customYear = defaultDate.year;
		customMonth = defaultDate.month;
		customDay = defaultDate.day;
	}
	else 
	{
		// get date
		const customDateValues = customDate.split(DATE_SEP_STR);
		customYear = customDateValues[0];
		customMonth = (parseInt(customDateValues[1]) - 1).toString();
		customDay = customDateValues[2];
	}
	// validate time
	const isTimeValid = validateTime(customTime);
	let customHours, customMins, customSecs;
	if (!isTimeValid) 
	{
		// default time
		customHours = defaultTime.hours;
		customMins = defaultTime.mins;
		customSecs = defaultTime.secs;
	}
	else 
	{
		// get time
		const customTimeValues = customTime.split(TIME_SEP_STR);
		customHours = customTimeValues[0];
		customMins = customTimeValues[1];
		// secs can be omitted
		customSecs = customTimeValues[2] || formatDatetimeValue(0);
	}
	const rangeValue = formatDatetime(new Date(customYear, customMonth, customDay, customHours, customMins, customSecs));
	// update custom range input value
	if (customDatetime != rangeValue) 
	{
		resultsDatetimeRangeCustomInput.value = rangeValue;
	}
	return rangeValue;
}
function getDatetimeRange(resultsDatetimeFromRangeOption, resultsDatetimeFromRangeCustomInput, resultsDatetimeToRangeOption, resultsDatetimeToRangeCustomInput)
{
    const rangeArr = [];
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    const dayOfMonth = today.getDate();
    const dayOfWeek = today.getDay();
    // from range
    let fromRange = '';
    switch (resultsDatetimeFromRangeOption) 
	{
		case DATETIME_RANGE_OPTIONS.day:
            fromRange = formatDatetime(new Date(thisYear, thisMonth, dayOfMonth));
            break;
		case DATETIME_RANGE_OPTIONS.week:
			// JS date has Sunday as first day of week
            fromRange = formatDatetime(new Date(thisYear, thisMonth, ((dayOfWeek > 0) ? dayOfMonth-dayOfWeek : dayOfMonth-WEEK_DAY_COUNT)+1));
            break;
		case DATETIME_RANGE_OPTIONS.month:
            fromRange = formatDatetime(new Date(thisYear, thisMonth, 1));
            break;
		case DATETIME_RANGE_OPTIONS.year:
            fromRange = formatDatetime(new Date(thisYear, 0, 1));
            break;
		case DATETIME_RANGE_OPTIONS.custom:
			const defaultDate = { year: '1970', month: formatDatetimeValue(0), day: formatDatetimeValue(1) };
			const defaultTime = { hours: formatDatetimeValue(0), mins: formatDatetimeValue(0), secs: formatDatetimeValue(0) };
			fromRange = getCustomDatetimeRange(resultsDatetimeFromRangeCustomInput, defaultDate, defaultTime);
    }
    rangeArr.push(convertDatetimeToRFC(fromRange));
    // to range
    let toRange = '';
    switch (resultsDatetimeToRangeOption) 
	{
		case DATETIME_RANGE_OPTIONS.day:
            toRange = formatDatetime(new Date(thisYear, thisMonth, dayOfMonth-1, LAST_HOUR_STR, LAST_MIN_STR, LAST_SEC_STR));
            break;
		case DATETIME_RANGE_OPTIONS.week:
			// JS date has Sunday as first day of week
            toRange = formatDatetime(new Date(thisYear, thisMonth, (dayOfWeek > 0) ? dayOfMonth-dayOfWeek : dayOfMonth-WEEK_DAY_COUNT, LAST_HOUR_STR, LAST_MIN_STR, LAST_SEC_STR));
            break;
		case DATETIME_RANGE_OPTIONS.month:
            toRange = formatDatetime(new Date(thisYear, (thisMonth > 0) ? thisMonth-1 : thisMonth, 0, LAST_HOUR_STR, LAST_MIN_STR, LAST_SEC_STR));
            break;
		case DATETIME_RANGE_OPTIONS.year:
            toRange = formatDatetime(new Date(thisYear, 0, 0, LAST_HOUR_STR, LAST_MIN_STR, LAST_SEC_STR));
            break;
		case DATETIME_RANGE_OPTIONS.custom:
			const defaultDate = { year: thisYear, month: thisMonth, day: dayOfMonth };
			const defaultTime = { hours: LAST_HOUR_STR, mins: LAST_MIN_STR, secs: LAST_SEC_STR };
			toRange = getCustomDatetimeRange(resultsDatetimeToRangeCustomInput, defaultDate, defaultTime);
	}
    rangeArr.push(convertDatetimeToRFC(toRange));
    return rangeArr;
}

// API returns url-escaped titles
function decodeEscaped(text) 
{
	let doc;
    try
	{
        const parser = new DOMParser();
		doc = parser.parseFromString(text, 'text/html');
        const decodedText = doc.documentElement.textContent;
        return decodedText;
    }
    catch (e) 
	{
        console.log('Failed to decode url-escaped title');
        return text;
    }
	finally
	{
		if (doc)
		{
			doc.close();
		}
	}
}

// short and full video description
function getShortDescVersion(fullDesc) 
{
    const hasMore = fullDesc.length > MAX_SHORT_DESC_CHAR_COUNT;
	let descVersion;
    if (hasMore) 
	{
        const shortDesc = fullDesc.substring(0, MAX_SHORT_DESC_CHAR_COUNT) + '...';
		descVersion = shortDesc;
    }
	else
	{
		descVersion = fullDesc;
	}
    return [descVersion, hasMore];
}

export
	{ 
		QUOTAS_PER_CALL_AMT, QUOTAS_PER_VID_DESC_AMT, checkResetStoredQuotasAmt, getStoredQuotasAmt, setStoredQuotasAmt,
		INLINE_STR, INLINE_BLOCK_STR, BLOCK_STR, FLEX_STR, NONE_STR, setElDisplay, hideEl, 
		DATETIME_RANGE_OPTIONS, getDatetimeRange,
		decodeEscaped, 
		VIDEO_STR, CHANNEL_STR,
		getShortDescVersion
	};
