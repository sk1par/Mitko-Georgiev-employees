import { Component, OnInit } from '@angular/core';
import { StaffService } from '../../core/services/staff.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  noFiles: boolean;
  fileName: string;


  constructor(
    private staffService: StaffService
  ) { }

  ngOnInit(): void {
  }

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
