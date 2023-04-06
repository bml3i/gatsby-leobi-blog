function fileUploadReady(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function () {
        const sourceRowArray = reader.result.split(/\r?\n/);

        const singleSourceRowArray = new Array();

        sourceRowArray.forEach(row => {
            const contentArray = row.split(/\t/);

            let singleSourceRow = new SingleSourceRow(contentArray[0], contentArray[1], contentArray[3], contentArray[5]);
            singleSourceRowArray.push(singleSourceRow);
        });

        // sort
        singleSourceRowArray.sort(function (a, b) {
            return a.getBeginDate() - b.getBeginDate();
        });

        const monthAndYearSet = new Set();

        const overTimeResultMap = new Map();

        //console.log(singleSourceRowArray);
        singleSourceRowArray.forEach(row => {

            //console.log(row.getEmployeeChineseName());
            let monthAndYear = formatMonthAndYearString(row.getBeginDate());
            monthAndYearSet.add(monthAndYear);

            let uniqueMapKey = monthAndYear + "|" + row.getEmployeeEnglishName() + "|" + String(row.getOverTimeType());

            if (overTimeResultMap.has(uniqueMapKey)) {
                let overTimeResult = overTimeResultMap.get(uniqueMapKey);
                overTimeResult.appendOverTimeDates(formatDateString(row.getBeginDate()));
                overTimeResult.addOverTimeHours(row.getWorkHours());
                overTimeResult.appendOverTimeComments(row.getReason());
                overTimeResultMap.set(uniqueMapKey, overTimeResult);

            } else {
                let overTimeResult = new OverTimeResultRow(monthAndYear, row.getOverTimeType(), row.getEmployeeEnglishName(), row.getEmployeeChineseName());
                overTimeResult.setOverTimeDates(formatDateString(row.getBeginDate()));
                overTimeResult.setOverTimeHours(row.getWorkHours());
                overTimeResult.setOverTimeComments(row.getReason());
                overTimeResultMap.set(uniqueMapKey, overTimeResult);
            }

        });

        // build HTML elements
        monthAndYearSet.forEach(function (value) {

            let textContent = "";

            const qualifiedOverTimeResultArray = Array.from(overTimeResultMap.values()).filter(item => item.getMonthAndYear() === value);

            qualifiedOverTimeResultArray.forEach(function (qualifiedItem) {

                textContent = textContent.concat(qualifiedItem.getChineseName());
                textContent = textContent.concat("\t");
                textContent = textContent.concat(qualifiedItem.getEnglishName());
                textContent = textContent.concat("\t");
                textContent = textContent.concat(fetchTitleByEnglishName(qualifiedItem.getEnglishName()));
                textContent = textContent.concat("\t");
                textContent = textContent.concat("HY");
                textContent = textContent.concat("\t");

                if (qualifiedItem.getOverTimeType() === OverTimeType.WORKDAY) {
                    textContent = textContent.concat(qualifiedItem.getOverTimeDates());
                    textContent = textContent.concat("\t");
                    textContent = textContent.concat(qualifiedItem.getOverTimeHours());
                    textContent = textContent.concat("\t");
                } else {
                    textContent = textContent.concat("");
                    textContent = textContent.concat("\t");
                    textContent = textContent.concat("");
                    textContent = textContent.concat("\t");
                }

                if (qualifiedItem.getOverTimeType() === OverTimeType.WEEKEND) {
                    textContent = textContent.concat(qualifiedItem.getOverTimeDates());
                    textContent = textContent.concat("\t");
                    textContent = textContent.concat(qualifiedItem.getOverTimeHours());
                    textContent = textContent.concat("\t");
                } else {
                    textContent = textContent.concat("");
                    textContent = textContent.concat("\t");
                    textContent = textContent.concat("");
                    textContent = textContent.concat("\t");
                }

                if (qualifiedItem.getOverTimeType() === OverTimeType.HOLIDAY) {
                    textContent = textContent.concat(qualifiedItem.getOverTimeDates());
                    textContent = textContent.concat("\t");
                    textContent = textContent.concat(qualifiedItem.getOverTimeHours());
                    textContent = textContent.concat("\t");
                } else {
                    textContent = textContent.concat("");
                    textContent = textContent.concat("\t");
                    textContent = textContent.concat("");
                    textContent = textContent.concat("\t");
                }

                textContent = textContent.concat("");
                textContent = textContent.concat("\t");

                textContent = textContent.concat(qualifiedItem.getOverTimeComments());
                textContent = textContent.concat("\r\n");

            });

            buildTextAreaElement("resultArea", value, textContent, value);

        });

    };

    reader.onerror = function () {
        console.log(reader.error);
    };

}


const OverTimeType = Object.freeze({
    WORKDAY: Symbol("workday"),
    WEEKEND: Symbol("weekend"),
    HOLIDAY: Symbol("holiday")
});

const officialHolidays = [
    '04/05/2023',
    '06/22/2023',
    '09/29/2023',
    '10/01/2023'
]

const officialWeekends = [
    '05/02/2023',
    '05/03/2023',
    '06/23/2023',
    '10/02/2023',
    '10/03/2023',
    '10/04/2023',
    '10/05/2023',
    '10/06/2023'
]

const officialWorkDays = [
    '04/23/2023',
    '05/06/2023',
    '06/25/2023',
    '10/07/2023',
    '10/08/2023'
]

function calcOverTimeType(dt) {
    let dateStr = formatDateString(dt);

    if (officialHolidays.includes(dateStr)) {
        return OverTimeType.HOLIDAY;
    }

    if (officialWeekends.includes(dateStr)) {
        return OverTimeType.WEEKEND;
    }

    if (officialWorkDays.includes(dateStr)) {
        return OverTimeType.WORKDAY;
    }

    let dayOfWeek = dt.getDay();
    if ((dayOfWeek === 6) || (dayOfWeek === 0)) {
        return OverTimeType.WEEKEND;
    } else {
        return OverTimeType.WORKDAY;
    }
}

function formatDateString(date) {
    return (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatMonthAndYearString(date) {
    return monthNames[date.getMonth()] + ", " + date.getFullYear();
}

const titleArray = [
    ['TGVvIEJp', 'Team Lead'], //Leo B
    ['UGh5bGxpcyBDaGVuZw==', 'SPA'], //Phyll
    ['VHlsZXIgWGll', 'SPA'], //Tyler
    ['Qm9iIFhpZQ==', 'Team Lead'], //Bob X
    ['RmFpdGggV2FuZw==', 'Jr. Team Lead'], //Faith
    ['TmF0aGFuIFh1', 'SPA'], //Natha
    ['TG91aXMgTGl1', 'SPA'], //Louis
    ['U2hhd24gR2Fv', 'SPA'], //Shawn
    ['TGVhbW9uIExp', 'SPA'], //Leamo
    ['QnJpbGxhbnQgRHU=', 'SPA'], //Brill
    ['U3RldmVuIExlaQ==', 'PA'], //Steve
    ['QWxhbiBEaW5n', 'SPA'], //Alan 
    ['UmlvIExp', 'PA'], //Rio L
    ['Q2FsbHVtIFNvbmc=', 'SPA'], //Callu S
    ['Q2xvdWQgU3Vu', 'SPA'] //Clou S
]

function fetchTitleByEnglishName(englishName) {
    let tempStr = btoa(englishName);
    const titleMap = new Map(titleArray);
    if (titleMap.has(tempStr)) {
        return titleMap.get(tempStr);
    } else {
        return "";
    }
}

class SingleSourceRow {
    constructor(employeeName, beginDateTime, workHours, reason) {
        this.setEmployeeName(employeeName);
        this.setBeginDateTime(beginDateTime);
        this.setWorkHours(workHours);
        this.setReason(reason);
    }

    getEmployeeEnglishName() {
        return this.employeeEnglishName;
    }

    getEmployeeChineseName() {
        return this.employeeChineseName;
    }

    setEmployeeName(val) {
        const tempNameArray = val.replace('(', ',').replace(')', ',').split(/,/);
        this.employeeEnglishName = tempNameArray[1];
        this.employeeChineseName = tempNameArray[0];
    }

    getBeginDate() {
        return this.beginDate;
    }

    setBeginDateTime(val) {
        this.beginDate = new Date(val.substring(0, 10));
        this.setOverTimeType(calcOverTimeType(this.beginDate));
    }

    getWorkHours() {
        return this.workHours;
    }

    setWorkHours(val) {
        this.workHours = parseFloat(val);
    }

    getReason() {
        return this.reason;
    }

    setReason(val) {
        this.reason = val;
    }

    getOverTimeType() {
        return this.overTimeType;
    }

    setOverTimeType(val) {
        this.overTimeType = val;
    }

}


class OverTimeResultRow {
    constructor(monthAndYear, overtimeType, englishName, chineseName) {
        this.setMonthAndYear(monthAndYear);
        this.setOverTimeType(overtimeType);
        this.setEnglishName(englishName);
        this.setChineseName(chineseName);
    }

    getEnglishName() {
        return this.englishName;
    }

    setEnglishName(val) {
        this.englishName = val;
    }

    getChineseName() {
        return this.chineseName;
    }

    setChineseName(val) {
        this.chineseName = val;
    }

    getOverTimeType() {
        return this.overTimeType;
    }

    setOverTimeType(val) {
        this.overTimeType = val;
    }

    getMonthAndYear() {
        return this.monthAndYear;
    }

    setMonthAndYear(val) {
        this.monthAndYear = val;
    }

    getOverTimeDates() {
        return this.overTimeDates;
    }

    setOverTimeDates(val) {
        this.overTimeDates = val;
    }

    appendOverTimeDates(val) {
        if (!this.overTimeDates.includes(val)) {
            this.overTimeDates = this.overTimeDates + ", " + val;
        }
    }

    getOverTimeHours() {
        return this.overTimeHours;
    }

    setOverTimeHours(val) {
        this.overTimeHours = val;
    }

    addOverTimeHours(val) {
        this.overTimeHours = this.overTimeHours + val;
    }

    getOverTimeComments() {
        return this.overTimeComments;
    }

    setOverTimeComments(val) {
        this.overTimeComments = val;
    }

    appendOverTimeComments(val) {
        if (!this.overTimeComments.includes(val)) {
            this.overTimeComments = this.overTimeComments + "; " + val;
        }
    }
}

function buildTextAreaElement(holderElementId, newElementId, textContent, labelName) {
    let holder = document.getElementById(holderElementId);

    let lineBreak = document.createElement("BR");
    let lineBreak2 = document.createElement("BR");
    let labelNameElement = document.createElement("DIV");
    let textAreaElement = document.createElement("TEXTAREA");

    labelNameElement.innerHTML = "<span>" + labelName + "</span>";
    textAreaElement.setAttribute("id", newElementId);
    textAreaElement.setAttribute("rows", 10);
    textAreaElement.setAttribute("cols", 140);
    textAreaElement.value = textContent;

    holder.appendChild(labelNameElement);
    holder.appendChild(textAreaElement);
    holder.appendChild(lineBreak);
    holder.appendChild(lineBreak2);
}