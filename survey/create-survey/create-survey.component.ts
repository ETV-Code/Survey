import { Component, Input, OnInit } from "@angular/core";
import {FormArray,FormBuilder,FormGroup,Validators,} from "@angular/forms";

import { SurveyService } from "src/app/shared/service/survey.service";
import { MatDialog } from "@angular/material/dialog";
import { UpdateAlertComponent } from "../../modal/update-alert/update-alert.component";
import { CreateAlertComponent } from "../../modal/create-alert/create-alert.component";
import { Isurveys } from "src/app/shared/domain/isurveys";
import { PercepcionSurveyComponent } from "../../modal/percepcion-survey/percepcion-survey.component";

@Component({
  selector: "app-create-surey",
  templateUrl: "./create-survey.component.html",
  styleUrls: ["./create-survey.component.css"],
})
export class CreateSurveyComponent implements OnInit {

  public readonly DEFAULT_INPUT_MAXLENGTH: number = 150;
  public readonly DEFAULT_TIME_CLOSE_ALERT: number = 2100;
  public readonly DEFAULT_TIME_CLOSE_WARNINGS: number = 3100;

  /**
  * @name gettingIdEncuesta
  * @description This variable catch the IdEncuesta sent from the parent survey-tabs
  */
  @Input() gettingIdEncuesta: string = "";

  /**
  * @name gettingUpdateStatus
  * @description This variable indicates true to update or false to create sent from the parent survey-tabs
  */
  @Input() gettingUpdateStatus: boolean = false;

  /**
  * @name surveyForm
  * @description Is the FormGroup or controls, for create or update view, are the first controls you can watch when you go to the tab Crear encuesta
  */
  surveyForm: FormGroup

  /**
  * @name typesQuestions
  * @description contains the label and value for select with types of questions
  */
  typesQuestions = [
    { label: "Respuesta unica", value: 1 },
    { label: "Respuesta multiple", value: 2 },
    { label: "Respuesta abierta", value: 3 },
    { label: "Rango", value: 4 },
  ];
  typesSurvey = [
    { label: "Percepcion", value: "Percepcion" },
    { label: "Satisfaccion", value: "Satisfaccion" },
  ];

  selectedItem: number;
  selectedItemTypesSurvey: string;

  encuestas: Isurveys[]=[]

  constructor(
    private surveyService: SurveyService,
    public formBuilder: FormBuilder,
    public dialog : MatDialog
  ) {
    this.surveyForm = this.formBuilder.group({
      idEncuesta: [null],
      nombreEncuesta: [null, [Validators.required, Validators.maxLength(this.DEFAULT_INPUT_MAXLENGTH)]],
      descripcionEncuesta: [null,[Validators.required, Validators.maxLength(this.DEFAULT_INPUT_MAXLENGTH)]],
      tipoEncuesta:["Percepcion" ,[Validators.required]],
      estado: [null],
      fechaCreacion: [null],
      preguntas: this.formBuilder.array([], [Validators.required]),
    });
   }

  ngOnInit(): void {
    if (this.gettingUpdateStatus) {
      this.getEncuestaById(this.gettingIdEncuesta);
    } else {
      this.getEncuestaById(null);
    }
  }

  get preguntasArray(): FormArray {
    return this.surveyForm.get("preguntas") as FormArray;
  }

  opcionesPregunta(indexPregunta: number): FormArray {
    const preguntasArray = this.surveyForm.get('preguntas') as FormArray;
    const pregunta = preguntasArray.at(indexPregunta) as FormGroup;
    return pregunta.get('opcionPreguntas') as FormArray;
  }

  /**
  * @name addQuestion
  * @description makes push for preguntasArray, adding the question to the surveyForm
  */
  addQuestion() {
    const preguntasArray = this.preguntasArray;

    preguntasArray.push(
      this.formBuilder.group({
        numeroPregunta: [preguntasArray.length + 1],
        nombrePregunta: [null,[Validators.required,Validators.maxLength(this.DEFAULT_INPUT_MAXLENGTH)]],
        tipoPregunta: [1, [Validators.required]],
        opcionPreguntas: this.formBuilder.array([]),
      })
    );
    const index = preguntasArray.controls.length - 1;
    const tipoPreguntaControl = preguntasArray.at(index).get('tipoPregunta');

    tipoPreguntaControl.valueChanges.subscribe((tipo) => {
      const opcionPreguntasControl = preguntasArray.at(index).get('opcionPreguntas');

      if (tipo === 1 || tipo === 2) {
        opcionPreguntasControl.setValidators([Validators.required]);
      } else {
        opcionPreguntasControl.clearValidators();
      }

      opcionPreguntasControl.updateValueAndValidity();
    });
  }

  deleteQuestion(indexPregunta: number) {
    const preguntasArray = this.preguntasArray;

    preguntasArray.removeAt(indexPregunta);

    for (let i = indexPregunta; i < preguntasArray.length; i++) {
      preguntasArray.at(i).get('numeroPregunta').setValue(i + 1);
    }
  }

  /**
  * @name addOption
  * @description makes push for opcionPreguntas, adding the opcion to the surveyForm
  */
  addOption(indexPregunta: number) {
    const opciones = this.opcionesPregunta(indexPregunta);

    opciones.push(
      this.formBuilder.group({
        opcionPregunta: ["", [Validators.required, Validators.maxLength(this.DEFAULT_INPUT_MAXLENGTH)]],
      })
    );
  }

  deleteOption(indexPregunta, indexOption) {
    const opciones = this.opcionesPregunta(indexPregunta);

    opciones.removeAt(indexOption);
  }

  showSelectedValue(evento: number) {
    const preguntasArray = this.preguntasArray;
    preguntasArray.get("tipoPregunta")?.setValue(evento);
  }
  showSelectedValueSurveyType(evento: string) {
    this.selectedItemTypesSurvey = evento;
  }

  /**
  * @name createSurvey
  * @description method which call the surveyService which have the createSurvey service created on backEnd, it creates the survey and save in database
  */
  async createSurvey() {
    if (this.surveyForm.valid) {
      try {
        const currentType = this.surveyForm.get('tipoEncuesta')?.value;
        const existPercepcionSurvey = await this.checkExistingPercepcionSurvey();
        if (existPercepcionSurvey && currentType === "Percepcion") {
          this.existingPercepcionSurvey();
        } else {
          this.surveyService.createSurvey(this.surveyForm.value).subscribe(
            (response: any) => {
              this.createSuccessful();
              setTimeout(()=>{
                window.location.reload();
              }, this.DEFAULT_TIME_CLOSE_ALERT)
            },
            (error) => {
              console.error("No se pudo crear la encuesta", error);
            }
          );
        }
      } catch (error) {
        console.error('Error en la creación de la encuesta:', error);
      }
    }
  }

  async checkExistingPercepcionSurvey(): Promise<boolean> {
    try {
      const response = await this.surveyService.listSurveys().toPromise();

      const surveyFromServer = response.body.data.encuestas;

      if (surveyFromServer) {
        this.encuestas = surveyFromServer.map((surveyObject) => ({
          tipoEncuesta: surveyObject.tipoEncuesta,
          estado: surveyObject.estado,
        }));
      } else {
        this.encuestas = [];
      }

      return this.encuestas.some(encuesta => encuesta.tipoEncuesta === 'Percepcion' && encuesta.estado === true);

    } catch (error) {
      console.error('Error al recuperar encuestas:', error);
      return false;
    }
  }

  createSuccessful(){
    const deleteAlert = this.dialog.open(CreateAlertComponent, {
      width: "500px",
      disableClose: true
    });

    setTimeout(()=>{
      deleteAlert.close()
    }, this.DEFAULT_TIME_CLOSE_ALERT)
  }
  existingPercepcionSurvey(){
    const deleteAlert = this.dialog.open(PercepcionSurveyComponent, {
      width: "500px",
      disableClose: true
    });

    setTimeout(()=>{
      deleteAlert.close()
    }, this.DEFAULT_TIME_CLOSE_WARNINGS)
  }

  invalidFieldHandler(field: string) {
    return (
      this.surveyForm.controls[field]?.hasError("required") &&
      this.surveyForm.controls[field].touched
    );
  }

  /**
  * @name getEncuestaById
  * @description method which call the surveyService which have the getEncuestaById service created on backEnd,
  * it provides the survey data to print it on the controls for survey form for editing
  */
  getEncuestaById(idEncuesta) {
    if (idEncuesta) {
      this.surveyService.getEncuestaById(idEncuesta).subscribe(
        (response: any) => {
          this.handleGetEncuestaByIdResponse(response);
        },
        (error) => {
          console.error("Error al obtener la encuesta ", error);
        }
      );
    }
  }

  handleGetEncuestaByIdResponse(response:any){
    const surveyObject = response.body.data.encuesta;
    this.patchBaseForm(surveyObject)
    this.setEstadoValue(surveyObject)
    this.pushPreguntasArray(surveyObject)
  }
  patchBaseForm(surveyObject: any){
    this.surveyForm.patchValue({
      idEncuesta: surveyObject.idEncuesta,
      nombreEncuesta: surveyObject.nombreEncuesta,
      descripcionEncuesta: surveyObject.descripcionEncuesta,
      fechaCreacion: surveyObject.fechaCreacion,
      fechaActualizacion: surveyObject.fechaActualizacion,
    });
  }
  setEstadoValue(surveyObject: any){
    const estadoControl = this.surveyForm.get("estado");

    if (surveyObject.estado === true) {
      estadoControl.setValue("true");
    } else {
      estadoControl.setValue("false");
    }
  }
  pushPreguntasArray(surveyObject:any){
    const preguntasArray = this.surveyForm.get("preguntas") as FormArray;
      preguntasArray.clear();

    if (surveyObject.preguntas) {
      const preguntasOrdenadas = surveyObject.preguntas.sort(
        (a, b) => a.numeroPregunta - b.numeroPregunta
      );
      preguntasOrdenadas.forEach((preguntaData) => {
        const opcionesArray = preguntaData.opcionPreguntas
          ? preguntaData.opcionPreguntas.map((opcionData) =>
            this.formBuilder.group({
              idOpcionPregunta: opcionData.idOpcionPregunta,
              opcionPregunta: [opcionData.opcionPregunta,[Validators.required,Validators.maxLength(this.DEFAULT_INPUT_MAXLENGTH)]],
            })
          )
          : [];
        preguntasArray.push(
          this.formBuilder.group({
            idPregunta: preguntaData.idPregunta,
            numeroPregunta: preguntaData.numeroPregunta,
            nombrePregunta: [preguntaData.nombrePregunta,[Validators.required,Validators.maxLength(this.DEFAULT_INPUT_MAXLENGTH)]],
            tipoPregunta: preguntaData.tipoPregunta,
            opcionPreguntas: this.formBuilder.array(opcionesArray),
          })
        );
      });
    }
  }

  /**
  * @name updateSurvey
  * @description method which call the surveyService which have the updateSurvey service created on backEnd,
  * it update the survey data to save and rewrite in database
  */
  updateSurvey() {
    if (this.surveyForm.valid) {
      this.surveyService.updateSurvey(this.surveyForm.value).subscribe(
        (response: any) => {
          this.updateSuccessful();
          window.location.reload();
        },
        (error) => {
          console.error("Error al editar la encuesta", error);
        }
      );
    }
  }
  updateSuccessful(){
    const deleteAlert = this.dialog.open(UpdateAlertComponent, {
      width: "500px",
      disableClose: true
    });

    setTimeout(()=>{
      deleteAlert.close()
    }, this.DEFAULT_TIME_CLOSE_ALERT)
  }
}
