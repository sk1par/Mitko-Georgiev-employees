import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Team, Period,  } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private workLogList: Period[];
  private teamProjects: Team[];
  private accumulatedTeams: Team[];

  private teamProjectsToShowSubject = new BehaviorSubject<Team[]>([]);
  public teamProjectsToShow = this.teamProjectsToShowSubject.asObservable().pipe(distinctUntilChanged());

  private bestTeamSubject = new BehaviorSubject<Team>(null);
  public bestTeam = this.bestTeamSubject.asObservable().pipe(distinctUntilChanged());

  constructor() { }

  public parseFileData(textContent: string): void {
    // Regex for new line
    const rows = textContent.split(/\r\n|\n/g);
    if (rows.length === 0) {
      return;
    }

    this.workLogList = [];

    rows.forEach(row => {
      // Regex to remove commas after week days in some date formats
      row = row.replace(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\,/, '$1');

      const columns = row.split(',');
      this.workLogList.push(new Period(
        columns[0].trim(),
        columns[1].trim(),
        columns[2].trim(),
        columns[3]?.trim()
      ));
    });
  }

  public executeWorkList(): void {
    this.resetEmployeesLists();

    for (let i = 0; i < this.workLogList.length - 1; i++) {
      for (let j = i + 1; j < this.workLogList.length; j++) {
        const firstList: Period = this.workLogList[i];
        const secondList: Period = this.workLogList[j];

        if (firstList.projectId === secondList.projectId && this.checkOverlap(firstList, secondList)) {
          const overlappingDays: number = this.findOverlappingDays(firstList, secondList);
          if (overlappingDays > 0) {
            this.updateEmployeeLists(firstList, secondList, overlappingDays);
          }
        }
      }
    }

    // Sort the list
    this.accumulatedTeams.sort((p1, p2) => p2.daysWorked - p1.daysWorked);
    this.bestTeamSubject.next(this.accumulatedTeams[0]);
    const teamProjects = this.teamProjects.filter(p => this.isTheSamePair(p, this.bestTeamSubject.value));
    this.teamProjectsToShowSubject.next(teamProjects);

    console.log('Best employees pair: ', this.bestTeamSubject.value);
  }

  public updateEmployeeLists(firstLog: Period, secondLog: Period, overlappingDays: number): void {
    const teamProject: Team = {
      firstEmployeeId: firstLog.employeeId,
      secondEmployeeId: secondLog.employeeId,
      projectId: firstLog.projectId,
      daysWorked: overlappingDays
    };

    this.teamProjects.push(teamProject);

    const existingTeam = this.accumulatedTeams.find(p => this.hasExistingPair(p, firstLog, secondLog));
    // This pair of employees already exists in the list --> only add the overlappying days  
    if (existingTeam) {
      existingTeam.daysWorked += overlappingDays;
    } else {
      this.accumulatedTeams.push({
        firstEmployeeId: teamProject.firstEmployeeId,
        secondEmployeeId: teamProject.secondEmployeeId,
        daysWorked: overlappingDays
      });
    }
  }

  resetEmployeesLists(): void {
    this.teamProjects = [];
    this.accumulatedTeams = [];
    this.teamProjectsToShowSubject.next([]);
    this.bestTeamSubject.next(null);
  }

  checkOverlap(firstLog: Period, secondLog: Period): boolean {
    return (firstLog.dateFrom <= secondLog.dateTo) && (firstLog.dateTo >= secondLog.dateFrom);
  }

  findOverlappingDays(firstLog: Period, secondLog: Period): number {
    const startTime = firstLog.dateFrom < secondLog.dateFrom ? secondLog.dateFrom : firstLog.dateFrom;
    const endTime = firstLog.dateTo < secondLog.dateTo ? firstLog.dateTo : secondLog.dateTo;
    return Math.round(Math.abs((startTime - endTime) / (24 * 60 * 60 * 1000)));
  }

  isTheSamePair(pair1: Team, pair2: Team): boolean {
    return (
      (pair1.firstEmployeeId === pair2.firstEmployeeId && pair1.secondEmployeeId === pair2.secondEmployeeId) ||
      (pair1.firstEmployeeId === pair2.secondEmployeeId && pair1.secondEmployeeId === pair2.firstEmployeeId)
    );
  }

  hasExistingPair(pair: Team, workLog1: Period, workLog2: Period): boolean {
    return (
      (pair.firstEmployeeId === workLog1.employeeId && pair.secondEmployeeId === workLog2.employeeId) ||
      (pair.firstEmployeeId === workLog2.employeeId && pair.secondEmployeeId === workLog1.employeeId)
    );
  }
}
