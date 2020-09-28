import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { UploadComponent } from './upload/upload.component';
import { TableResultComponent } from './table-result/table-result.component';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    TableResultComponent
  ],
  imports: [
    BrowserModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
