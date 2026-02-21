/**
 * Formats a date string, number, or Date object into a localized string based on user preferences.
 * 
 * @param date The date to format
 * @param timezone The target timezone (e.g., 'UTC', 'Asia/Kolkata')
 * @param format The time format preference ('12h' or '24h')
 * @param includeTime Whether to include the time in the output
 * @returns A formatted date/time string
 */
export const formatDate = (
    date: string | number | Date,
    timezone: string = 'UTC',
    format: '12h' | '24h' = '12h',
    includeTime: boolean = true
): string => {
    try {
        let d: Date;
        if (typeof date === 'string' && !date.includes('T') && !date.includes('Z') && !date.includes('+')) {
            // If it's a "YYYY-MM-DD HH:MM:SS" string from DB, assume UTC
            d = new Date(date.replace(' ', 'T') + 'Z');
        } else {
            d = new Date(date);
        }
        
        if (isNaN(d.getTime())) return 'Invalid Date';

        const options: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };

        if (includeTime) {
            options.hour = 'numeric';
            options.minute = 'numeric';
            options.second = 'numeric';
            options.hour12 = format === '12h';
        }

        return new Intl.DateTimeFormat('en-US', options).format(d);
    } catch (e) {
        console.error('Error formatting date:', e);
        return String(date);
    }
};

/**
 * Gets the current time in a specific timezone and format.
 */
export const getCurrentTime = (timezone: string = 'UTC', format: '12h' | '24h' = '12h'): string => {
    return formatDate(new Date(), timezone, format, true);
};
