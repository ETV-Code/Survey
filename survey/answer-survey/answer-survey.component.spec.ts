import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { of } from 'rxjs';

import { AnswerSurveyComponent } from './answer-survey.component';
import { SurveyService } from 'src/app/shared/service/survey.service';
import { LoginService } from 'src/app/shared/service/login.service';

let component: AnswerSurveyComponent;
let fixture: ComponentFixture<AnswerSurveyComponent>;
const mockSurveyService = {getEncuestaById: jest.fn(),createRespuestaEncuesta: jest.fn(),getCursoByIdAsignacion: jest.fn()}
const mockLoginService = {getData: jest.fn()}
const mockMatDialog = { open: jest.fn() }
const mockRouter = { navigate: jest.fn() };
const mockRoute = { snapshot: { queryParamMap: { get: jest.fn() } } };

const responseGetEncuestaByIdMock = {
  "statusCode": 200,
  "body": {
    "status": "success",
    "message": "SUCCESS",
    "description": "Service executed successfully",
    "data": {
      "encuesta": {
        "idEncuesta": "1879e6fd-98df-4771-b268-9e21b1b6dccb",
        "nombreEncuesta": "Encuesta de percepcion",
        "descripcionEncuesta": "Percepción de acciones de formación",
        "estado": true,
        "fechaCreacion": "2023-11-29",
        "fechaActualizacion": "2023-11-30",
        "preguntas": [
          {
            "idPregunta": "711c41e4-9d2d-4786-ab73-c78a7c83f790",
            "nombrePregunta": "Le gusto el curso?",
            "tipoPregunta": 1,
            "numeroPregunta": 1,
            "opcionPreguntas": [
              {
                "idOpcionPregunta": "1b90bcf9-58a8-44e5-872e-03ebf025408a",
                "opcionPregunta": "No"
              },
              {
                "idOpcionPregunta": "815a6d51-b799-4470-8104-635fdc01aa85",
                "opcionPregunta": "Sí"
              }
            ]
          }
        ]
      }
    }
  }
}
const responseGetCursoByIdAsignacionMock = {
  "statusCode": 200,
  "body": {
      "status": "success",
      "message": "SUCCESS",
      "description": "Service executed successfully",
      "data": {
          "course": {
              "courseName": "Introducción a las Arquitecturas límpias",
              "idCurso": "CU172"
          }
      }
  }
}

const responsecreateRespuestaEncuestaMock = {
  "statusCode": 200,
  "body": {
    "status": "success",
    "message": "SUCCESS",
    "description": "Service executed successfully",
    "data": {
      "message": "Encuesta respondida con exito"
    }
  }
}
function configuredTestingModule() {
  TestBed.configureTestingModule({
    declarations: [AnswerSurveyComponent],
    providers: [
      FormBuilder,
      { provide: SurveyService, useValue: mockSurveyService },
      { provide: LoginService, useValue: mockLoginService },
      { provide: MatDialog, useValue: mockMatDialog },
      { provide: Router, useValue: mockRouter },
      { provide: ActivatedRoute, useValue: mockRoute }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  }).compileComponents();
  mockSurveyService.getEncuestaById.mockReturnValue(of(responseGetEncuestaByIdMock));
  mockSurveyService.getCursoByIdAsignacion.mockReturnValue(of(responseGetCursoByIdAsignacionMock));
  mockLoginService.getData.mockReturnValue({ idPersona: "P15518816", name: "Emmanuel Taborda Vera" });
  mockSurveyService.createRespuestaEncuesta.mockReturnValue(of(responsecreateRespuestaEncuestaMock));
  fixture = TestBed.createComponent(AnswerSurveyComponent);
  component = fixture.componentInstance;
}

function initializedPreguntasArrayControls(){
  component.preguntasArray = component.formBuilder.array([component.formBuilder.group({
    idPregunta: [null],
    nombrePregunta: [null,[Validators.required]],
    tipoPregunta: [null,[Validators.required]],
    numeroPregunta: [null],
    opcionPreguntas: component.formBuilder.array([
      component.formBuilder.group({
        opcionPregunta: [null,[Validators.required]]
      })
    ]),
    respuestas: [null,[Validators.required, Validators.maxLength(component.DEFAULT_INPUT_MAXLENGTH)]]
})]);
}

describe('GIVEN: AnswerSurveyComponent', () => {
  beforeEach(() => {
    configuredTestingModule();
  });

  it('THEN: It should create AnswerSurveyComponent', () => {
    expect(component).toBeTruthy();
  });
});

describe('GIVEN: AnswerSurveyComponent', () => {
  beforeEach(() => {
    configuredTestingModule();
  });

  describe('WHEN: ngOnInit is called', () => {
    it('THEN: It should call getOfferAsignacion method which call surveyService.getCursoByIdAsignacion', () => {
      component.ngOnInit();
      expect(mockSurveyService.getCursoByIdAsignacion).toHaveBeenCalled();
    });
    it('THEN: It should call getEncuestaById method which call surveyService.getEncuestaById', () => {
      component.ngOnInit();
      expect(mockSurveyService.getEncuestaById).toHaveBeenCalled();
    });
  })
});

describe('GIVEN: AnswerSurveyComponent', () => {
  beforeEach(() => {
    configuredTestingModule();
    initializedPreguntasArrayControls();
    const surveyQuestionMock = component.formBuilder.group({
      idPregunta: "711c41e4-9d2d-4786-ab73-c78a7c83f790",
      nombrePregunta: "Le gusto el curso?",
      tipoPregunta: 1,
      numeroPregunta: 1,
      opcionPreguntas: [
        {
          idOpcionPregunta: "1b90bcf9-58a8-44e5-872e-03ebf025408a",
          opcionPregunta: "No"
        },
        {
          idOpcionPregunta: "815a6d51-b799-4470-8104-635fdc01aa85",
          opcionPregunta: "Sí"
        }
      ],
      respuestas: [{
        "idPregunta":"711c41e4-9d2d-4786-ab73-c78a7c83f790",
        "respuestas":[
          "Sí"
        ]
      }]
    });
    component.preguntasArray.push(surveyQuestionMock)
  });

  describe('WHEN: saveAnswer is called', () => {
    it('THEN: It should call createRespuestaEncuesta method which call surveyService.createRespuestaEncuesta', () => {
      component.saveAnswer();
      expect(mockSurveyService.createRespuestaEncuesta).toHaveBeenCalled();
    });
  })
});
