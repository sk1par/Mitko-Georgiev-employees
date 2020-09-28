export class Period {
    employeeId: number;
    projectId: number;
    dateFrom: number;
    dateTo: number;

    constructor(employeeId: string, projectId: string, dateFrom: string, dateTo?: string) {
        this.employeeId = +employeeId;
        this.projectId = +projectId;

        if (isNaN(this.employeeId)) {
            throw new Error('Invalid employee ID');
        } else if (isNaN(this.projectId)) {
            throw new Error('Invalid project ID');
        }

        this.dateFrom = this.parseDate(dateFrom);

        if (isNaN(this.dateFrom)) {
            throw new Error(`Invalid start date ${dateFrom}`);
        }

        if (dateTo && dateTo.toLowerCase() !== 'null') {
            this.dateTo = this.parseDate(dateTo);
            if (isNaN(this.dateTo)) {
                throw new Error(`Invalid end date ${dateTo}`);
            }
        } else {
            this.dateTo = Date.now();
        }
    }

    private parseDate(dateString: string): number {

        // Check if format is -> YYYYMMDD
        if (dateString.length === 8 && !dateString.includes('-')) {
            dateString = `${dateString.substr(0, 4)}-${dateString.substr(4, 2)}-${dateString.substr(6, 2)}`;
        }

        return Date.parse(dateString);
    }
}
