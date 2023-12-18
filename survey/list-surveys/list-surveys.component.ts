import { Component, EventEmitter, OnInit, Output } from "@angular/core";

import { MatDialog } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";

import { SurveyService } from "src/app/shared/service/survey.service";
import { SurveyTabCommunicationService } from "src/app/shared/service/survey-tab-communication.service";

import { Isurveys } from "../../../shared/domain/isurveys";
import { ConfirmarComponent } from "src/app/shared/modal/confirmar/confirmar.component";
import { ViewSurveyComponent } from "../view-survey/view-survey.component";
import { DeleteAlertComponent } from "../../modal/delete-alert/delete-alert.component";
import { DeleteWarnAlertComponent } from "../../modal/delete-warn-alert/delete-warn-alert.component";
@Component({
  selector: "app-list-surveys",
  templateUrl: "./list-surveys.component.html",
  styleUrls: ["./list-surveys.component.css"],
})
export class ListSurveysComponent implements OnInit {

  public readonly DEFAULT_PER_PAGE: number = 12;
  public readonly DEFAULT_TIME_CLOSE_ALERT: number = 1200;
  public readonly DEFAULT_TIME_CLOSE_WARNINGS: number = 3100;
  public readonly DEFAULT_STATUS_SUCCESS: number = 200;


  /**
  * @name outgoingIdEncuesta
  * @description This variable emmit the IdEncuesta to the parent survey-tabs
  */
  @Output() outgoingIdEncuesta = new EventEmitter<string>();

  /**
  * @name outgoingUpdateStatus
  * @description This variable emmit the status to edit to the parent survey-tabs
  */
  @Output() outgoingUpdateStatus = new EventEmitter<boolean>();

  startIndex: number = 1;
  endIndex: number = 0;
  perPage: number = this.DEFAULT_PER_PAGE;
  currentPage: Isurveys[] = [];

  filtroFormControl = new FormControl("", []);

  dataSource: Isurveys[] = [];

  constructor(
    private surveyService: SurveyService,
    private surveyTabCommunicationService: SurveyTabCommunicationService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.listSurveys();
    this.outgoingIdEncuesta.emit("");
    this.outgoingUpdateStatus.emit(false);
  }

  applyFilter(event: any) {
    this.dataSource.filter = event.trim().toLowerCase();
  }

  /**
  * @name listSurveys
  * @description method which call the surveyService which have the listSurvey service created on backEnd,
  * it provides the survey data to list all surveys created
  */
  listSurveys() {
    this.surveyService.listSurveys().subscribe(
      (response: any) => {
        const surveyFromServer = response.body.data.encuestas;
        if (surveyFromServer) {
          this.dataSource = surveyFromServer.map((surveyObject) => ({
            idEncuesta: surveyObject.idEncuesta,
            nombreEncuesta: surveyObject.nombreEncuesta,
            tipoEncuesta: surveyObject.tipoEncuesta,
            estado: surveyObject.estado,
            fechaCreacion: surveyObject.fechaCreacion,
            fechaActualizacion: surveyObject.fechaActualizacion,
          }));
        } else {
          this.dataSource = [];
        }
        this.currentPage = this.dataSource.slice(0, this.perPage);
      },
      (error) => {
        console.error("Error al obtener las encuestas", error);
      }
    );
  }

  changePage(event: any): void {
    this.startIndex = (event.CurrentPage - 1) * event.PerPage;
    this.endIndex = this.startIndex + event.PerPage;
    this.currentPage = this.dataSource.slice(this.startIndex, this.endIndex);
  }

  /**
  * @name deleteSurvey
  * @description method which call the surveyService which have the deleteSurvey service created on backEnd,
  * it delete the all survey data in database
  */
  deleteSurvey(surveyObject: any) {
    this.surveyService.deleteSurvey(surveyObject.idEncuesta).subscribe(
      (response: any) => {
        if (response.statusCode == this.DEFAULT_STATUS_SUCCESS) {
          this.deletedSuccessful();
          this.listSurveys();
        }
      },
      (error) => {
        this.deletedWarn()
      }
    );
  }

  comportamientoAlertas(action, surveyObject): void {
    if (action == "eliminar") {
      this.confirmarEliminar(surveyObject);
    } else if (action == "ver") {
      this.confirmarVer(surveyObject);
    }
  }

  confirmarEliminar(surveyObject: any) {
    surveyObject.mensaje =
      "¿Realmente desea eliminar [ " + surveyObject.nombreEncuesta + " ] ?";

      surveyObject.boton = "Aceptar";
    const dialogRef = this.dialog.open(ConfirmarComponent, {
      width: "500px",
      data: surveyObject,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.deleteSurvey(surveyObject);
      }
    });
  }

  deletedSuccessful(){
    const deleteAlert = this.dialog.open(DeleteAlertComponent, {
      width: "500px",
      disableClose: true
    });

    setTimeout(()=>{
      deleteAlert.close()
    }, this.DEFAULT_TIME_CLOSE_ALERT)
  }
  deletedWarn(){
    const deleteAlert = this.dialog.open(DeleteWarnAlertComponent, {
      width: "500px",
      disableClose: true
    });

    setTimeout(()=>{
      deleteAlert.close()
    }, this.DEFAULT_TIME_CLOSE_WARNINGS)
  }

  confirmarVer(encuesta: any) {
    this.dialog.open(ViewSurveyComponent, {
      width: "80%",
      height: "80%",
      data: encuesta,
    });
  }

  onCreateSurveyClicked() {
    this.surveyTabCommunicationService.triggerCreateSurveyTabClick();
  }

  onUpdateSurvey(idEncuesta) {
    this.onCreateSurveyClicked();
    this.outgoingIdEncuesta.emit(idEncuesta);
    this.outgoingUpdateStatus.emit(true);
  }
}
