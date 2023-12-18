import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SurveyService {
  private endpointCreateSurvey = "/encuesta/createEncuesta";
  private endpointListSurveys = "/encuesta/listEncuestas";
  private endpointDeleteSurvey = "/encuesta/deleteEncuesta";
  private endpointUpdateSurvey = "/encuesta/updateEncuesta";
  private endpointGetEncuestaById = "/encuesta/getEncuestaById";
  private endpointSurveyAlert = "/encuesta/emptyEncuestas?idPerson=";
  private endpointAnswerSurvey = "/response/createRespuestaEncuesta";
  private endpointGetCursoByIdAsignacion = "/response/encuesta";

  constructor(private http: HttpClient, private configService: ConfigService) {}

  public createSurvey(surveyObject: any): Observable<any> {
    return this.http.post(
      this.configService.settings.apiUrl + this.endpointCreateSurvey,surveyObject
    );
  }

  public listSurveys(): Observable<any> {
    return this.http.get(
      this.configService.settings.apiUrl + this.endpointListSurveys
    );
  }

  public updateSurvey(surveyObject: any): Observable<any> {
    return this.http.put(
      this.configService.settings.apiUrl + this.endpointUpdateSurvey,
      surveyObject
    );
  }

  public deleteSurvey(idEncuesta: string): Observable<any> {
    return this.http.delete(
      this.configService.settings.apiUrl +
        `${this.endpointDeleteSurvey}/${idEncuesta}`
    );
  }

  public getEncuestaById(idEncuesta: string): Observable<any> {
    return this.http.get(
      this.configService.settings.apiUrl +
        `${this.endpointGetEncuestaById}/${idEncuesta}`
    );
  }

  public getInfoSurveyAlert(idPersona: string): Observable<any> {
    return this.http.get(
      this.configService.settings.apiUrl +
        `${this.endpointSurveyAlert}${idPersona}`
    );
  }

  public createRespuestaEncuesta(answerObject:any): Observable<any>{
    return this.http.post(
      this.configService.settings.apiUrl + this.endpointAnswerSurvey,answerObject
    );
  }

  public getCursoByIdAsignacion(idAsignacion:string): Observable<any>{
    return this.http.get(
      this.configService.settings.apiUrl +
        `${this.endpointGetCursoByIdAsignacion}/${idAsignacion}`
    );
  }
}
