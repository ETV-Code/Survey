import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { SurveyTabCommunicationService } from "src/app/shared/service/survey-tab-communication.service";
import { LoginService } from 'src/app/shared/service/login.service';

@Component({
  selector: "app-survey-tabs",
  templateUrl: "./survey-tabs.component.html",
  styleUrls: ["./survey-tabs.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class SurveyTabsComponent implements OnInit {
  title: string = "Encuestas";
  selectedTabIndex: number = 0;

  /**
  * @name containsIdEncuesta
  * @description This variable save the IdEncuesta sent from the child list-surveys
  */
  containsIdEncuesta: string;

  /**
  * @name containsUpdateStatus
  * @description This variable save true to update or false to create sent from the child list-surveys
  */
  containsUpdateStatus: boolean;

  constructor(
    private surveyTabCommunicationService: SurveyTabCommunicationService,
    public loginService : LoginService
  ) { }

  ngOnInit(): void {
    this.loginService.refresh();
    this.surveyTabCommunicationService.createSurveyTabClicked$.subscribe(() => {
      this.selectedTabIndex = 1;
    });
  }

  /**
  * @name onSaveIdEncuesta
  * @description method which receives an event which emits the idEncuesta sent from the child list-surveys
  */
  onSaveIdEncuesta(idEncuesta: string) {
    if (this.containsUpdateStatus) {
      this.containsIdEncuesta = null;
    } else {
      this.containsIdEncuesta = idEncuesta;
    }
  }

  /**
  * @name onSaveUpdateStatus
  * @description method which receives an event which emits true  to update or false to create sent from the child list-surveys
  */
  onSaveUpdateStatus(status: boolean) {
    this.containsUpdateStatus = status;
  }
}
