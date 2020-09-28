import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../../core/models/team.interface';
import { StaffService } from '../../core/services/staff.service';

@Component({
  selector: 'app-table-result',
  templateUrl: './table-result.component.html',
  styleUrls: ['./table-result.component.scss']
})
export class TableResultComponent implements OnInit {
  teamProjectsToShow$: Observable<Team[]> = this.staffService.teamProjectsToShow;
  bestTeam$: Observable<Team> = this.staffService.bestTeam;
  @Input() fileName;
  @Input() noFiles;

  constructor(
    private staffService: StaffService
  ) { }

  ngOnInit(): void {
  }

}
