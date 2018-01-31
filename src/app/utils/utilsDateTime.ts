import * as moment from "moment";
import * as _ from "lodash";

export class UtilsDateTime {

    public static DateDisplayFormat="DD.MM.YYYY";
    public static DateTimeDisplayFormat="DD.MM.YYYY HH:mm:ss";

    public static TimeDisplayFormat="HH:mm:ss";
    public static DateRequestFormat="YYYY-MM-DD";

    public static readonly MONTH_NAMES_RU = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь"
    ]

    public static GetMonthNameByNumber(monthNumber: number): string {
        if (!monthNumber || monthNumber > 12 || monthNumber < 1) return '';
        return UtilsDateTime.MONTH_NAMES_RU[monthNumber - 1];
    }

    public static GetMonthNameByIndex(monthIndex: number): string {
        if (!_.isFinite(monthIndex) || monthIndex > 11 || monthIndex < 0) return '';
        return UtilsDateTime.MONTH_NAMES_RU[monthIndex];
    }

    public static GetDateFromStringFormatted(inputStr: string): Date {
        if (!inputStr) return null;
        let momentRes = this.GetMomentFromDateRequestString(inputStr)
        return momentRes ? momentRes.toDate() : null;
    }

    public static GetMomentFromDateRequestString(inputStr: string): moment.Moment {
        return UtilsDateTime.GetMomentFromString(inputStr, UtilsDateTime.DateRequestFormat);
    }

    public static GetMomentFromString(
        inputStr:string,
        format:string = null
    ):moment.Moment {
        if(!inputStr) return null;
        let res = format ? moment(inputStr, format) : moment(inputStr);
        return res.isValid() ? res : null;
    }

    public static GetDateStringFormatted(date: Date, format:string = UtilsDateTime.DateRequestFormat): string {
        if (!date) return null;
        return moment(date).format(format);
    }

    public static MomentToDateDisplayString(val: moment.Moment): string {
        return this.MomentToString(val,UtilsDateTime.DateDisplayFormat);
    }

    public static MomentToDateTimeDisplayString(val: moment.Moment): string {
        return this.MomentToString(val,UtilsDateTime.DateTimeDisplayFormat);
    }

    public static MomentToTimeDisplayString(val: moment.Moment): string {
        return this.MomentToString(val,UtilsDateTime.TimeDisplayFormat);
    }

    public static MomentToString(val: moment.Moment, format:string): string {
        if (!val || !val.isValid) return null;
        return val.format(format);
    }

    public static IsTimeMultipleOfMinutesCount(dateTime: Date, minutesCount: number): boolean {
        let timeMs = moment(dateTime).diff(moment(dateTime).startOf('day'));
        if (!timeMs) return false;
        return !((timeMs % (minutesCount * 60000)) > 0);
    }

    public static IsTimeMinutesMultipleOfMinutesCount(minutes: number, minutesCount: number): boolean {
        if (!minutes) return false;
        return !((minutes % minutesCount) > 0);
    }

    public static AreEqual(date1:Date, date2:Date):boolean {
        if(!date1 && !date2) return true;
        if(!date1 || !date2) return false;
        return date1.getTime()===date2.getTime();
    }
}
