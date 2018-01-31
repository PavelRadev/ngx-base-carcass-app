import * as _ from 'lodash';
import {UtilsNumbers} from "./utilsNumbers";


export class UtilsString {
    public static readonly MONEY_INT_PART_SEPARATOR = ',';
    public static readonly MONEY_BLOCK_SEPARATOR = ' ';

    public static readonly DIGITS_ONLY_REGEXP = '([0-9]*((,|.)00)?)';


    public static StringHasNumbers(inputStr: string, countNumbers: number = null): boolean {
        if (!inputStr) return false;
        if (!countNumbers) {
            let regexp = new RegExp('[0-9]+');
            return regexp.test(inputStr);
        }
        else return countNumbers == this.GetStringJustNumbers(inputStr).length;

    }

    public static GetStringJustNumbers(inputStr: string): string {
        let resStr = '';
        let regex = new RegExp('[0-9]', "g");
        let match;
        while ((match = regex.exec(inputStr)) != null) {
            resStr += match[0];
        }
        return resStr;
    }

    public static ParseResponseErrorMessage(error: string): string {
        // '400 - Bad Request {"status":"error","data":{"message":"Сообщение"}}';
        let separator = '"message":"';
        if (!error || !_.includes(error, separator)) return '';
        let substr = _.split(error, separator)[1];
        return _.split(substr, '"')[0];
    }

    public static CompareStringsWithNumbers(str1: string, str2: string) {
        if (!str1 && !str2) {
            return 0;
        }
        if (!str1) {
            return -1;
        }
        if (!str2) {
            return 1;
        }

        let numerAsStr1 = '';
        let numerAsStr2 = '';

        let maxLength = _.max([str1.length, str2.length]);
        let isDigitPrevWasAdd1 = false;
        let isDigitPrevWasAdd2 = false;

        for (let i = 0; i < maxLength; i++) {
            let s1 = str1[i];
            let s2 = str2[i];

            let n1 = parseInt(s1);
            let n2 = parseInt(s2);
            let isDigit1 = !isNaN(n1);
            let isDigit2 = !isNaN(n2);

            let wasNotDigits = !numerAsStr1 && !numerAsStr2;
            if (isDigit1 && (isDigitPrevWasAdd1 || wasNotDigits)) {
                numerAsStr1 = numerAsStr1 + s1;
                isDigitPrevWasAdd1 = true;
            } else isDigitPrevWasAdd1 = false;

            if (isDigit2 && (isDigitPrevWasAdd2 || wasNotDigits)) {
                numerAsStr2 += s2;
                isDigitPrevWasAdd2 = true;
            } else isDigitPrevWasAdd2 = false;

            if (!isDigit1 && !isDigit2) {
                if (numerAsStr1 || numerAsStr2) {
                    let res = UtilsString.CompareStringsJustNumbers(numerAsStr1, numerAsStr2);
                    if (res != 0) return res;
                }
                if (!s1) {
                    return -1;
                }
                if (!s2) {
                    return 1;
                }
                if (s1 < s2) {
                    return -1;
                }
                if (s2 < s1) {
                    return 1;
                }
            }

            if (i == maxLength - 1) {
                return UtilsString.CompareStringsJustNumbers(numerAsStr1, numerAsStr2);
            }
        }


    }

    public static CompareStringsJustNumbers(strNumbers1: string, strNumbers2: string): number {
        if (!strNumbers1 && !strNumbers2) {
            return 0;
        }
        if (!strNumbers1) {
            return 1;
        }
        if (!strNumbers2) {
            return -1;
        }
        let number1 = parseInt(strNumbers1);
        let number2 = parseInt(strNumbers2);
        if (number1 < number2) {
            return -1;
        }
        if (number1 > number2) {
            return 1;
        }
        return 0;
    }

    public static GetMoneyFormattedOrDefaultString(
        val: number,
        defaultRes:string = ''
    ):string{
        val=+val;
        if (!val) return defaultRes;
        
        let digits = UtilsNumbers.GetDigits(val, 2);
        let digitsPart = digits === 0 ? '00' : (digits+'000').slice(2,4);

        let intPart = UtilsNumbers.GetInteger(val);
        let intPartStr = "" + intPart;

        const blockSize = 3;
        let arr: string[] = [];
        for (let i = intPartStr.length - 1; i >= 0; i--) {
            arr.push(intPartStr[i]);
            if ((arr.length+1) % (blockSize+1) === 0) arr.push(UtilsString.MONEY_BLOCK_SEPARATOR);
        }

        arr.reverse();
        let res = arr.join('').trim()+UtilsString.MONEY_INT_PART_SEPARATOR+digitsPart;

        return res;
    }

    public static FormatMoney(val: number): string {
        if (val === 0) return '0' + UtilsString.MONEY_INT_PART_SEPARATOR + '00';
        return UtilsString.GetMoneyFormattedOrDefaultString(val);
    }

    public static GetRouteWithoutQueryParams(route:String){
            console.log(route);

        let withoutQueryParams = route.match(/.+?(?=\?|$)/g);

        return withoutQueryParams && withoutQueryParams.length>0 ? withoutQueryParams[0] : "";
    }
}