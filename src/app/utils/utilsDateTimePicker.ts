import * as moment from 'moment';
export class UtilsDateTimePicker {

    public static GetDatePickerOptions(
        placeholder= 'выберите дату'
    ): any {
        let options:any= {
            icon: 'fa fa-calendar',
            autoclose: true,
            clearBtn: true,
            todayHighlight: true,
            assumeNearbyYear: true,
            enableOnReadonly: true,
            language: 'ru',
            weekStart: 1,
            placeholder: placeholder,
            format: {
                    toDisplay: function (date, format, language) {
                        return moment(date).format("DD.MM.YYYY");
                    },
                    toValue: function (date, format, language) {
                        let parsed = 
                        moment.utc(date, [
                            "DDMMYYYY",
                            "DD.MM.YYYY"
                        ]);
                        if(parsed.isValid()) {
                            let res=parsed.toDate();
                            return res;
                        }
                        else return  null;
                    }
                }                
        };

        return options;
    }
    public static GetTimePickerOptions(): any {
        return {
            icon: 'fa fa-clock-o',
            icons: {
                up: 'fa fa-chevron-up',
                down: 'fa fa-chevron-down'
            },
            minuteStep: 5,
            showMeridian: false,
            defaultTime: false,
            placeholder: 'часы:минуты'
        };
    }
}