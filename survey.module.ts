import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTabsModule } from "@angular/material/tabs";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../shared/material.module";
import { BcButtonModule } from "@bancolombia/design-system-web/bc-button";
import { BcIconModule } from "@bancolombia/design-system-web/bc-icon";
import { BcCardModule } from "@bancolombia/design-system-web/bc-card";
import { BcTableModule } from "@bancolombia/design-system-web/bc-table";
import { BcTooltipModule } from "@bancolombia/design-system-web/bc-tooltip";
import { BcModalModule } from "@bancolombia/design-system-web/bc-modal";
import { BcTabsModule } from "@bancolombia/design-system-web/bc-tabs-group";
import { BcSearchModule } from "@bancolombia/design-system-web/bc-search";
import { BcInputModule } from "@bancolombia/design-system-web/bc-input";
import { BcRadioModule } from "@bancolombia/design-system-web/bc-radio";


import { SurveyTabsComponent } from "./survey/survey-tabs.component";
import { ListSurveysComponent } from "./survey/list-surveys/list-surveys.component";
import { CreateSurveyComponent } from "./survey/create-survey/create-survey.component";
import { BcPaginatorModule } from "@bancolombia/design-system-web/bc-paginator";
import { BcInputSelectModule } from "@bancolombia/design-system-web/bc-input-select";
import { AnswerSurveyComponent } from './survey/answer-survey/answer-survey.component';
import { ViewSurveyComponent } from './survey/view-survey/view-survey.component';
import { BcCheckboxModule } from "@bancolombia/design-system-web/bc-checkbox";
import { DeleteAlertComponent } from './modal/delete-alert/delete-alert.component';
import { UpdateAlertComponent } from './modal/update-alert/update-alert.component';
import { CreateAlertComponent } from './modal/create-alert/create-alert.component';
import { SaveAnswerAlertComponent } from './modal/save-answer-alert/save-answer-alert.component';
import { PercepcionSurveyComponent } from './modal/percepcion-survey/percepcion-survey.component';
import { AdminSurveyComponent } from './survey/admin-survey/admin-survey.component';
import { ViewDetailSurveyComponent } from './modal/view-detail-survey/view-detail-survey.component';
import { BcIconButtonModule } from "@bancolombia/design-system-web/bc-icon-button";
import { MailSentAlertComponent } from './modal/mail-sent-alert/mail-sent-alert.component';

@NgModule({
  declarations: [
    AdminSurveyComponent,
    SurveyTabsComponent,
    CreateSurveyComponent,
    ListSurveysComponent,
    AnswerSurveyComponent,
    ViewSurveyComponent,
    DeleteAlertComponent,
    UpdateAlertComponent,
    CreateAlertComponent,
    SaveAnswerAlertComponent,
    PercepcionSurveyComponent,
    AdminSurveyComponent,
    ViewDetailSurveyComponent,
    MailSentAlertComponent,
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    MatTabsModule,
    BcButtonModule,
    BcIconModule.forRoot({
      path: "https://library-sdb.apps.bancolombia.com/bds.min.css",
    }),
    BcCardModule,
    BcTableModule,
    BcTooltipModule,
    BcModalModule,
    BcTabsModule,
    BcSearchModule,
    BcInputModule,
    BcPaginatorModule,
    BcInputSelectModule,
    BcRadioModule,
    BcCheckboxModule,
    BcIconButtonModule,
  ],
  providers: [ListSurveysComponent, CreateSurveyComponent],
})
export class SurveyModule { }
