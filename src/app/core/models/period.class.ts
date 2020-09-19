export class Period {
    employeeId: number;
    projectId: number;
    dateFrom: number;
    dateTo: number;

    constructor(employeeId: string, projectId: string, dateFrom: string, dateTo?: string) {
        this.employeeId = +employeeId;
        this.projectId = +projectId;
        this.dateFrom = Date.parse(dateFrom);
        this.dateTo = Date.parse(dateTo);

        if (isNaN(this.employeeId)) {
            throw new Error('ID of the employee is invalid');
        } else if (isNaN(this.projectId)) {
            throw new Error('ID of the project is invalid');
        } else if (isNaN(this.dateFrom)) {
            throw new Error(`Invalid start date ${dateFrom}`);
        }

        if (dateTo && dateTo.toLowerCase() !== 'null') {
            if (isNaN(this.dateTo)) {
                throw new Error(`Invalid end date ${dateTo}`);
            }
        } else {
            this.dateTo = Date.now();
        }
    }
}
