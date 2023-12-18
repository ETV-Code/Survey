import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Isurveys } from 'src/app/shared/domain/isurveys';
import { SurveyService } from 'src/app/shared/service/survey.service';

@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.css']
})
export class ViewSurveyComponent implements OnInit {

  dataSourceSurvey: Isurveys = null;

  dataSourceSurveyQuestion: any[] = [];
  dataSourceSurveyAnswer: any[] = [];

  successStatusCode: number = 200;

  constructor(public dialogRef: MatDialogRef<ViewSurveyComponent>,
    private surveyService: SurveyService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
    this.getSurvey();
  }

  getSurvey() {
    this.surveyService.getEncuestaById(this.data.idEncuesta)
      .subscribe((responseObject) => {
        if (responseObject !== undefined) {
          this.dataSourceSurvey = responseObject.body.data.encuesta || null;

          this.dataSourceSurveyQuestion = responseObject.body.data.encuesta.preguntas || [];
          this.dataSourceSurveyQuestion.sort((a, b) => a.numeroPregunta - b.numeroPregunta);

          this.dataSourceSurveyQuestion.forEach(pregunta => {
            const opcionesPregunta = pregunta?.opcionPreguntas || [];
            this.dataSourceSurveyAnswer.push(...opcionesPregunta);
          });
          for (const question of this.dataSourceSurveyQuestion) {
            const answersForQuestion = this.dataSourceSurveyAnswer.filter(answer =>
              question.opcionPreguntas.some(option =>
                option.idOpcionPregunta === answer.idOpcionPregunta
              )
            );
            question.answers = answersForQuestion;
          }
        }
      }
      );
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
