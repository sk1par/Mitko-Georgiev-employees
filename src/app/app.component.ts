import { Component } from '@angular/core';
import { StaffService } from './core/services/staff.service';
import { Observable } from 'rxjs';
import { Team } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'assignment-team';
  noFiles: boolean;
  fileName: string;
  teamProjectsToShow$: Observable<Team[]> = this.staffService.teamProjectsToShow;
  bestTeam$: Observable<Team> = this.staffService.bestTeam;

  constructor(
    private staffService: StaffService
  ) {}

  // Read selected file
  onFileChange(event: Event): void {
    const fileInput: HTMLInputElement = event.target as HTMLInputElement;
    if (fileInput.files.length === 0) {
      return;
    }

    const file = fileInput.files[0];
    this.fileName = file.name;

    const reader = new FileReader();
    reader.onload = () => this.onFileLoad(reader.result as string);
    reader.readAsText(file);
  }

  // Pass data to Staff service if file is not empty
  onFileLoad(readerResult: string): void {
    if (readerResult.length === 0) {
      this.noFiles = true;
      return;
    } else {
      this.noFiles = false;
      this.staffService.parseFileData(readerResult);
      this.staffService.executeWorkList();
    }
  }
}
