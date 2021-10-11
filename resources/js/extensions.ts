interface BooleanConstructor {
    isBoolean(value: any): boolean;
    toBoolean(value: any): boolean;
}

interface StringConstructor {
    humanize(value: string): string;
}

/**
 * Checks whether given value is boolean or not.
 * @param value Value to be checked.
 * @returns {boolean} Whether given valu is boolean.
 */
Boolean.isBoolean = (value: any): boolean => typeof value === 'boolean';

// Boolean.toBoolean = (value: any): boolean => (value === 'false' ? false : Boolean(value));

/**
 * Converts camel or pascal cased string into more readable format.
 * Example: "selectionType" is converted to "Selection type".
 * @param value String value to be formatted.
 * @returns {string} Formatted string value.
 */
String.humanize = (value: string): string => {
    return value
        .replace(/([A-Z]+)/g, ',$1')
        .replace(/^,/, '')
        .split(',')
        .flatMap((token, index) => (index === 0 ? token.charAt(0).toUpperCase() + token.slice(1) : token.toLowerCase()))
        .join(' ');
};
