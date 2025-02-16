


export class Utils {
  /**
   * Capitalize strings
   * @param str string
   * @returns string
   */
  static capitalize(str: string) {
    return (str ?? '')
      .split(' ')
      .map(
        (e) => e.substring(0, 1).toUpperCase() + e.substring(1).toLowerCase(),
      )
      .join('');
  }

  static localDateTime(dateInput: unknown) {
    // Create a new Date object from the input (if it's not already a Date object)
    const date = new Date(dateInput as never);

    // Format the date using Intl.DateTimeFormat with Lagos time zone
    const options = {
      timeZone: 'Africa/Lagos',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,  // For 12-hour format, set to false if you want 24-hour format
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options as Intl.DateTimeFormatOptions);
    return formatter.format(date);
  }



  static calculateAge(dateOfBirth: string) {
    // Convert dateOfBirth to a Date object
    const birthDate = new Date(dateOfBirth);

    // Get the current date
    const currentDate = new Date();

    // Calculate the age
    let age = currentDate.getFullYear() - birthDate.getFullYear();

    // Adjust the age based on the month and day
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() == birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Return the age
    return age;
  }

  /**
   * Add 'n' days to a specified date and returns the new data in milliseconds
   * @param date DateTime
   * @param days number
   */
  static addDaysToDate(date: Date, days: number): number {
    if (!date) date = new Date();
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000).valueOf();
  }

  static moneyFormat(num: number, symbol?: string) {
    const p = num.toFixed(2).split('.');
    const e = p[0]
      .split('')
      .reverse()
      .reduce(function (acc, num, i) {
        return num == '-' ? acc : num + (i && !(i % 3) ? ',' : '') + acc;
      });
    return `${!symbol ? '₦' : symbol} ${e}.${p[1]}`;
  }

  /**
   * Removes whitespace from string
   * @param text string
   */
  static removeWhitespace(text: string): string {
    return text
      .trim()
      .split('')
      .filter((e) => {
        return e !== ' ';
      })
      .join('');
  }

  /**
   * Add 'n' minutes to a specified date and returns the new data in milliseconds
   * @param minutes number
   * @param date DateTime
   */
  static addMinutesToDate(minutes: number, date?: Date): number {
    if (!date) date = new Date();
    return new Date(date.getTime() + minutes * 60 * 1000).valueOf();
  }

  /**
   * Returns a string representing the current date and time in a specific time zone.
   *
   * @return {string} A string containing the time and date in the format 'time zone'
   */
  static getDateTimeString() {
    // Create a new Date object for the current date and time
    const now = new Date();

    // Format the date string for a specific time zone
    const timeZone = 'Africa/Lagos';
    const dateString = now.toLocaleString('en-US', { dateStyle: "full", timeZone });
    const timeString = now.toLocaleTimeString('en-US', { timeZone });

    return timeString + " " + dateString;
  }


  /**
   * Determines the device name based on the user agent string.
   *
   * @param {string} userAgent - The user agent string.
   * @return {string} The device name, or "Unknown Device" if the user agent does not match any known devices.
   */
  static getDeviceName(userAgent:string) {
    const deviceList = [
      { name: "iPhone", regex: /iPhone/i },
      { name: "iPad", regex: /iPad/i },
      { name: "Android", regex: /Android/i },
      { name: "Windows Phone", regex: /Windows Phone/i },
      { name: "Mac", regex: /Macintosh/i },
      { name: "Windows", regex: /Windows NT/i },
      { name: "Linux", regex: /Linux/i }
    ];

    for (const device of deviceList) {
      if (device.regex.test(userAgent)) {
        return device.name;
      }
    }

    return "Unknown Device";
  }

  /**
   * Randoms list of array
   * @param array Array<any>
   */
  static shuffleArray(array: Array<any>): Array<any> {
    return array.sort(() => Math.random() - 0.5);
  }

  /**
   * Generate random (N) char string with optional prefix for customization
   */
  static generateRef(prefix = '', length = 24): string {
    const src =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789TUVWXYZabcdefghGHIJKLM';
    const strLength = src.length;
    let ref = '';

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * strLength);
      ref += src[index];
    }

    return prefix + ref;
  }

  /**
   * Generate random numbers
   * @pram limit: Number (Max is 10)
   */
  static generateNumber(limit = 10) {
    const random = Date.now().toString();

    const salt = Math.floor(100 + Math.random() * 900);

    return Number(`${salt}${random.substring(6, random.length)}`)
      .toString()
      .substring(0, limit);
  }

  /**
   * Mask email address
   * @param arg string
   * @returns string
   */
  static maskEmail(arg: string) {
    const arr = arg.split('@');
    return `${arr[0].substring(0, arr[0].length / 2)}****@${arr[1]}`;
  }

  /**
   * Mask telephone number
   * @param arg string
   * @returns string
   */
  static maskTel(arg: string) {
    return `*****${arg.substring(arg.length - 4, arg.length)}`;
  }


  /**
   * Checks if a file mime type is valid
   * @param mimeType string
   * @param whiteList Array<string>
   * @returns boolean
   */
  isMimeTypeValid(mimeType: string, whiteList: Array<string>): boolean {
    return whiteList.includes(mimeType.toLowerCase());
  }

  static numToWord(num: number): string {
    const words = [
      '',
      'First',
      'Second',
      'Third',
      'Fourth',
      'Fifth',
      'Sixth',
      'Seventh',
      'Eighth',
      'Ninth',
      'Tenth',
      'Eleventh',
      'Twelfth',
      'Thirteenth',
      'Fourteenth',
      'Fifteenth',
      'Sixteenth',
      'Seventeenth',
      'Eighteenth',
      'Nineteenth',
      'Twentieth',
      'Twenty-First',
      'Twenty-Second',
      'Twenty-Third',
      'Twenty-Fourth',
      'Twenty-Fifth',
      'Twenty-Sixth',
      'Twenty-Seventh',
      'Twenty-Eighth',
      'Twenty-Ninth',
      'Thirtieth',
      'Thirty-First',
      'Thirty-Second',
      'Thirty-Third',
      'Thirty-Fourth',
      'Thirty-Fifth',
      'Thirty-Sixth',
      'Thirty-Seventh',
      'Thirty-Eighth',
      'Thirty-Ninth',
      'Fortieth',
      'Forty-First',
      'Forty-Second',
      'Forty-Third',
      'Forty-Fourth',
      'Forty-Fifth',
      'Forty-Sixth',
      'Forty-Seventh',
      'Forty-Eighth',
      'Forty-Ninth',
      'Fiftieth',
      'Fifty-First',
      'Fifty-Second',
      'Fifty-Third',
      'Fifty-Fourth',
      'Fifty-Fifth',
      'Fifty-Sixth',
      'Fifty-Seventh',
      'Fifty-Eighth',
      'Fifty-Ninth',
      'Sixtieth',
      'Sixty-First',
      'Sixty-Second',
      'Sixty-Third',
      'Sixty-Fourth',
      'Sixty-Fifth',
      'Sixty-Sixth',
      'Sixty-Seventh',
      'Sixty-Eighth',
      'Sixty-Ninth',
      'Seventieth',
      'Seventy-First',
      'Seventy-Second',
      'Seventy-Third',
      'Seventy-Fourth',
      'Seventy-Fifth',
      'Seventy-Sixth',
      'Seventy-Seventh',
      'Seventy-Eighth',
      'Seventy-Ninth',
      'Eightieth',
      'Eighty-First',
      'Eighty-Second',
      'Eighty-Third',
      'Eighty-Fourth',
      'Eighty-Fifth',
      'Eighty-Sixth',
      'Eighty-Seventh',
      'Eighty-Eighth',
      'Eighty-Ninth',
      'Ninetieth',
      'Ninety-First',
      'Ninety-Second',
      'Ninety-Third',
      'Ninety-Fourth',
      'Ninety-Fifth',
      'Ninety-Sixth',
      'Ninety-Seventh',
      'Ninety-Eighth',
      'Ninety-Ninth',
      'Hundredth',
    ];

    if (num < 1 || num > 100) {
      return 'Number out of range';
    }

    return words[num];
  }
}

export default Utils;
