import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { LoginService } from 'src/app/shared/service/login.service';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/shared/material.module';
import { SurveyAlertComponent } from './surveyAlert.component';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const survey: any = {
  idPersona: "id123",
  surveys: [
    {
      encuesta: "Encuesta de percepcion",
      idAny: "5f16907f-5326-4040-ba8d-43c6a1caa1fb",
      idEncuesta: "d4cf1530-4922-4ed7-8601-90b0964f54a8",
      idSurveyAssignment: "d2bde73b-3688-4e6c-91b0-223ce79cb2d9",
      nombreOferta: "[ (N) Criptografía, certificados digitales y PKI]",
      persona: "CRISTINA",
      status: false,
    }
  ]
};

describe('SurveyAlertComponent', () => {
  let surveyAlertComponent: SurveyAlertComponent;
  let fixture: ComponentFixture<SurveyAlertComponent>;
  const mockLoginService: any = { getName: jest.fn() };
  const mockMatDialog: any = { open: jest.fn(), afterClosed: jest.fn(), closeAll: jest.fn() };
  const mockData: any = survey;
  const mockRouter = { navigate: jest.fn() };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyAlertComponent],
      imports: [MaterialModule, BrowserAnimationsModule, RouterTestingModule],
      providers: [{ provide: LoginService, useValue: mockLoginService },
      { provide: MatDialog, useValue: mockMatDialog },
      { provide: MAT_DIALOG_DATA, useValue: mockData },
      { provide: Router, useValue: mockRouter }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    const mockGetName: string = "Name Lastname";

    mockLoginService.getName.mockReturnValue(of(mockGetName));
    fixture = TestBed.createComponent(SurveyAlertComponent);
    surveyAlertComponent = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe("goToSurvey method", () => {
    test("should navigate to an specific survey", async(() => {
      const url = "/encuestas-responder";
      const idEncuesta = "d4cf1530-4922-4ed7-8601-90b0964f54a8";
      const idAsignacion = "d2bde73b-3688-4e6c-91b0-223ce79cb2d9"
      const queryParams = { idEncuesta, idAsignacion };

      surveyAlertComponent.goToSurvey(idEncuesta, idAsignacion);
      expect(mockRouter.navigate).toHaveBeenCalledWith([url], { queryParams });
    }));
    test("should call the function closeDialog", async(() => {
      const closeDialogSpy = jest.spyOn(surveyAlertComponent, 'closeDialog');
      surveyAlertComponent.goToSurvey("id1", "id2");
      expect(closeDialogSpy).toHaveBeenCalled();
    }));
    test("should go to survey", async(() => {
      const methodResponse: any = surveyAlertComponent.goToSurvey("id1", "id2");
      expect(methodResponse).toEqual(undefined);
    }));
  });
  describe("closeDialog method", () => {
    test("should call the closeAll method from the dialog, to close the survey alert dialog", async(() => {
      const closeAllSpy = jest.spyOn(mockMatDialog, 'closeAll');
      surveyAlertComponent.closeDialog();
      expect(closeAllSpy).toHaveBeenCalled();
    }))
    test("should close dialog", async(() => {
      const methodResponse: any = surveyAlertComponent.closeDialog();
      expect(methodResponse).toEqual(undefined);
    }));
  });
});
