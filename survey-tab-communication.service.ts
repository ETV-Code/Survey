import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SurveyTabCommunicationService {
  private createSurveyTabClickedSource = new Subject<void>();

  createSurveyTabClicked$ = this.createSurveyTabClickedSource.asObservable();

  triggerCreateSurveyTabClick() {
    this.createSurveyTabClickedSource.next();
  }
}
