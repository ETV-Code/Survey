import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import { SurveyService } from '../../../shared/service/survey.service';
import { LoginService } from 'src/app/shared/service/login.service';
import { Isurveys } from 'src/app/shared/domain/isurveys';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { SaveAnswerAlertComponent } from '../../modal/save-answer-alert/save-answer-alert.component';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-answer-survey',
  templateUrl: './answer-survey.component.html',
  styleUrls: ['./answer-survey.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class AnswerSurveyComponent implements OnInit {

  public readonly DEFAULT_TIME_CLOSE_ALERT: number = 2000;
  public readonly DEFAULT_INPUT_MAXLENGTH: number = 150;

  dataSource: Isurveys;

  formulario: FormGroup

  preguntasArray: FormArray;

  userName: string = this.loginService.getData().nombre ;
  userAsignacion: string;

  constructor(
    private surveyService: SurveyService,
    private loginService: LoginService,
    public formBuilder: FormBuilder,
    public dialog : MatDialog,
    private router: Router,
    private route: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.preguntasArray = this.formBuilder.array([])
    this.getOfferAsignacion()
    this.getEncuestaById()
  }

  getEncuestaById(){
    this.surveyService.getEncuestaById(this.route.snapshot.queryParamMap.get('idEncuesta')).subscribe(
      (response)=>{
        this.dataSource = response.body.data.encuesta;
          this.dataSource.preguntas.sort((a, b) => a.numeroPregunta - b.numeroPregunta);
          this.dataSource.preguntas.forEach((q) => {
            const surveyQuestion = this.formBuilder.group({
              idPregunta: q.idPregunta,
              nombrePregunta: q.nombrePregunta,
              tipoPregunta: q.tipoPregunta,
              numeroPregunta: q.numeroPregunta,
              opcionPreguntas: [q.opcionPreguntas],
              respuestas: ['',[Validators.required, Validators.maxLength(this.DEFAULT_INPUT_MAXLENGTH)]]
            });
          this.preguntasArray.push(surveyQuestion)
        })
      }, (error)=>{
        console.error('error', error);

      }
    )
  }

  saveAnswer(){

    const respuestas = this.preguntasArray.controls.map((pregunta) => {
      const respuesta = pregunta.get('respuestas').value;
      const idPregunta = pregunta.get('idPregunta').value;

      const respuestaArray = Array.isArray(respuesta) ? respuesta : [respuesta];

      return {
        idPregunta,
        respuestas: respuestaArray,
      };
    });

    const request = {
      idPersona: this.loginService.getData().idPersona,
      idAsignacionEncuesta: this.route.snapshot.queryParamMap.get('idAsignacion'),
      preguntas: respuestas
    }

    this.surveyService.createRespuestaEncuesta(request).subscribe(
      (response)=>{
        this.saveSuccessful();
        this.router.navigate(["/welcome"]);
    })
  }
  saveSuccessful(){
    const deleteAlert = this.dialog.open(SaveAnswerAlertComponent, {
      width: "500px",
      disableClose: true
    });

    setTimeout(()=>{
      deleteAlert.close()
    }, this.DEFAULT_TIME_CLOSE_ALERT)
  }

  getOfferAsignacion(){
    this.surveyService.getCursoByIdAsignacion(
      this.route.snapshot.queryParamMap.get('idAsignacion')).subscribe((response)=>{
        this.userAsignacion = response.body.data.course.courseName
    })
  }
}
