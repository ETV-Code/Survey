import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginService } from 'src/app/shared/service/login.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";

@Component({
  selector: 'app-survey-alert',
  templateUrl: './surveyAlert.component.html',
  styleUrls: ['./surveyAlert.component.css']
})
export class SurveyAlertComponent implements OnInit {

  name: string;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  goToSurvey(idEncuesta: string, idAsignacion: string) {
    this.closeDialog();
    this.router.navigate(
      ['/encuestas-responder'],
      { queryParams: { idEncuesta, idAsignacion } }
    );
  }

  closeDialog(){
    this.dialog.closeAll();
  }
}
