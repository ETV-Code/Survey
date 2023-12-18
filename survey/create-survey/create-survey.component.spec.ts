import {ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import {FormArray,FormBuilder,ReactiveFormsModule, Validators} from "@angular/forms";

import { SurveyService } from 'src/app/shared/service/survey.service';
import { CreateSurveyComponent } from "./create-survey.component";

let component: CreateSurveyComponent;
let fixture: ComponentFixture<CreateSurveyComponent>;
const mockSurveyService = { createSurvey: jest.fn(),listSurveys: jest.fn(),getEncuestaById: jest.fn(),updateSurvey: jest.fn() }
const mockMatDialog = { open: jest.fn() }

const ConstructorSurveyFormMock = {
    idEncuesta: 'bb37817e-a6fa-447f-8261-35e516a230e2',
    nombreEncuesta: 'Constructor Encuesta Curso Java' ,
    descripcionEncuesta: 'Constructor Encuesta Curso Java',
    tipoEncuesta: 'Percepcion' ,
    estado: true ,
    fechaCreacion: new Date('2023-11-29') ,
    preguntas: [],
};

const surveyFormWithPreguntas = {
  idEncuesta: 'bb37817e-a6fa-447f-8261-35e516a230e2',
  nombreEncuesta: 'surveyFormWithPreguntas Encuesta Curso Java' ,
  descripcionEncuesta: 'surveyFormWithPreguntas Encuesta Curso Java',
  tipoEncuesta: 'Percepcion' ,
  estado: true ,
  fechaCreacion: new Date('2023-11-29') ,
  preguntas: [{
    numeroPregunta: 1,
    nombrePregunta: "surveyFormWithPreguntas Le gusto el curso?",
    tipoPregunta: 1,
    opcionPreguntas: []
  }],
}

const surveyFormWithPreguntasAndOpciones = {
  idEncuesta: 'bb37817e-a6fa-447f-8261-35e516a230e2',
  nombreEncuesta: 'Encuesta Curso Java' ,
  descripcionEncuesta: 'Encuesta Curso Java',
  tipoEncuesta: 'Percepcion' ,
  estado: true ,
  fechaCreacion: new Date('2023-11-29') ,
  preguntas: [{
    numeroPregunta: 1,
    nombrePregunta: "Le gusto el curso?",
    tipoPregunta: 1,
    opcionPreguntas: [{
      opcionPregunta: 'No',
    }]
  }],
}

const responseCreateSurveyMock = {
  "statusCode": 200,
  "body": {
    "status": "success",
    "message": "SUCCESS",
    "description": "Service executed successfully",
    "data": {
      "message": "Encuesta creada"
    }
  }
}
const responseListSurveysMockEmpty ={
  "statusCode": 200,
  "body": {
    "status": "success",
    "message": "SUCCESS",
    "description": "Service executed successfully",
    "data": {}
  }
}
const responseListSurveysMock ={
  "statusCode": 200,
  "body": {
    "status": "success",
    "message": "SUCCESS",
    "description": "Service executed successfully",
    "data": {
      "encuestas": [
        {
          "idEncuesta": "bb37817e-a6fa-447f-8261-35e516a230e2",
          "nombreEncuesta": "Encuesta Curso Java",
          "estado": true,
          "tipoEncuesta": "Percepcion",
          "fechaCreacion": new Date('2023-11-29'),
          "fechaActualizacion": null
        },
        {
          "idEncuesta": "1879e6fd-98df-4771-b268-9e21b1b6dccb",
          "nombreEncuesta": "Encuesta de percepcion",
          "estado": true,
          "tipoEncuesta": "Percepcion",
          "fechaCreacion": new Date('2023-11-29'),
          "fechaActualizacion": new Date('2023-11-29')
        }
      ]
    }
  }
}
const responseListSurveysMockForCheckExistingPercepcionSurveyMethod ={
  "statusCode": 200,
  "body": {
    "status": "success",
    "message": "SUCCESS",
    "description": "Service executed successfully",
    "data": {
      "encuestas": [
        {
          "idEncuesta": "bb37817e-a6fa-447f-8261-35e516a230e2",
          "nombreEncuesta": "Encuesta Curso Java",
          "estado": true,
          "tipoEncuesta": "Satisfaccion",
          "fechaCreacion": new Date('2023-11-29'),
          "fechaActualizacion": null
        },
      ]
    }
  }
}

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

const responseUpdateSurveyMock = {
  "statusCode": 200,
  "body": {
    "status": "success",
    "message": "SUCCESS",
    "description": "Service executed successfully",
    "data": {
      "message": "Encuesta actualizada"
    }
  }
}

function configuredTestingModule(){
  TestBed.configureTestingModule({
    declarations: [CreateSurveyComponent],
    imports: [ReactiveFormsModule],
    providers: [
      FormBuilder,
      {provide: SurveyService, useValue: mockSurveyService},
      {provide: MatDialog, useValue: mockMatDialog},
    ],
    schemas: [NO_ERRORS_SCHEMA]
  }).compileComponents();
  mockSurveyService.listSurveys.mockReturnValue(of(responseListSurveysMock))
  mockSurveyService.createSurvey.mockReturnValue(of(responseCreateSurveyMock))
  mockSurveyService.updateSurvey.mockReturnValue(of(responseUpdateSurveyMock))
  fixture = TestBed.createComponent(CreateSurveyComponent);
  component = fixture.componentInstance;
}

function constructorInitializedSurveyForm(){
  component.surveyForm = component.formBuilder.group({
    idEncuesta: [null],
    nombreEncuesta: [null],
    descripcionEncuesta: [null],
    tipoEncuesta:["Percepcion"],
    estado: [null],
    fechaCreacion: [null],
    preguntas: component.formBuilder.array([]),
  });
}
function initializedSurveyForm(){
  component.surveyForm = component.formBuilder.group({
    idEncuesta: [null],
    nombreEncuesta: [null,[Validators.required]],
    descripcionEncuesta: [null,[Validators.required]],
    tipoEncuesta:["Percepcion",[Validators.required]],
    estado: [null],
    fechaCreacion: [null],
    preguntas: component.formBuilder.array([component.formBuilder.group(
      {
        idPregunta: [null],
        nombrePregunta: [null,[Validators.required]],
        tipoPregunta: [null,[Validators.required]],
        numeroPregunta: [null],
        opcionPreguntas: component.formBuilder.array([
          component.formBuilder.group({
            opcionPregunta: [null,[Validators.required]] ,
          })
        ])
      }
    )],[Validators.required]),
  });
}

describe("GIVEN: CreateSurveyComponent", () => {

  beforeEach(() => {
    configuredTestingModule();
  });

  test("THEN: it should create CreateSurveyComponent", () => {
    expect(component).toBeTruthy();
  });
});

describe('GIVEN: CreateSurveyComponent',()=>{
  beforeEach(() => {
    configuredTestingModule();
    constructorInitializedSurveyForm();
  });
  describe('WHEN: the component is created',()=>{
    test('THEN: it should set up the form values ',()=>{
      component.surveyForm.patchValue(ConstructorSurveyFormMock);
      expect(component.surveyForm.value).toEqual(ConstructorSurveyFormMock);
    })

  })
})

describe("GIVEN: CreateSurveyComponent", () => {

  beforeEach(() => {
    configuredTestingModule();
  });

  describe("WHEN: ngOnInit is called", () => {
    test('THEN:It should call getEncuestaById method if gettinUpdateStatus is true', () => {
      component.gettingUpdateStatus = true;
      const spying = spyOn(component, 'getEncuestaById');
      component.ngOnInit();
      expect(spying).toHaveBeenCalledTimes(1);
    });
    test('THEN:It should call getEncuestaById method if gettinUpdateStatus is false, but with it param in null', () => {
      const spying = spyOn(component, 'getEncuestaById');
      component.ngOnInit();
      expect(spying).toHaveBeenCalledWith(null);
    });
  });
});

describe("GIVEN: CreateSurveyComponent", () => {
  beforeEach(() => {
    configuredTestingModule();
    initializedSurveyForm();
    component.surveyForm.patchValue(surveyFormWithPreguntas);
  });
  describe("WHEN: preguntasArray is initialized", () => {
    test('THEN:It should return preguntasArray correctly', () => {
      expect(component.preguntasArray).toEqual(component.surveyForm.get('preguntas') as FormArray);
    });
  });
});

describe("GIVEN: CreateSurveyComponent", () => {
  beforeEach(() => {
    configuredTestingModule();
    initializedSurveyForm();
    component.surveyForm.patchValue(surveyFormWithPreguntasAndOpciones);
  });
  describe("WHEN: opcionesPregunta is initialized", () => {
    test('THEN:It should return opcionesPregunta correctly', () => {
      const index = 0;
      const opcionesPregunta = component.opcionesPregunta(index);
      expect(opcionesPregunta).toEqual(component.preguntasArray.controls[index].get('opcionPreguntas') as FormArray);
    });
  });

});

describe("GIVEN: CreateSurveyComponent", () => {
  beforeEach(() => {
    configuredTestingModule();
    initializedSurveyForm();
    component.surveyForm.patchValue(surveyFormWithPreguntas);
  });

  describe("WHEN: the button agregar pregunta is clicked", () => {
    test('THEN:It should add a new question to the surveyForm', () => {
      component.addQuestion();
      const preguntasArray = component.surveyForm.get('preguntas') as FormArray;

      expect(preguntasArray.length).toBe(2);

    });
  });
});

describe("GIVEN: CreateSurveyComponent", () => {
  beforeEach(() => {
    configuredTestingModule();
    initializedSurveyForm();
    component.surveyForm.patchValue(surveyFormWithPreguntas);
  });

  describe("WHEN: the deleteQuestion is called", () => {
    test('THEN:It should delete a question from the surveyForm', () => {
      const indexQuestion = 0;
      component.deleteQuestion(indexQuestion);
      const preguntasArray = component.surveyForm.get('preguntas') as FormArray;
      expect(preguntasArray.length).toBe(0);
    });
  });
});

describe("GIVEN: CreateSurveyComponent", () => {
  beforeEach(() => {
    configuredTestingModule();
    initializedSurveyForm();
    component.surveyForm.patchValue(surveyFormWithPreguntasAndOpciones);
  });

  describe("WHEN: addOption method is called", () => {
    test('THEN:It should add a new option to the preguntas on the surveyForm', () => {
      const indexPregunta = 0;
      component.addQuestion();
      const initialOptionsLength = component.opcionesPregunta(indexPregunta).controls.length;
      component.addOption(indexPregunta);
      const finalOptionsLength = component.opcionesPregunta(indexPregunta).controls.length;
      expect(finalOptionsLength).toBe(initialOptionsLength + 1);

    });
  });
});
describe("GIVEN: CreateSurveyComponent", () => {
  beforeEach(() => {
    configuredTestingModule();
    initializedSurveyForm();
    component.surveyForm.patchValue(surveyFormWithPreguntasAndOpciones);
  });

  describe("WHEN: deleteOption method is called", () => {
    test('THEN:It should delete an option from the preguntas on the surveyForm', () => {
      const indexQuestion = 0;
      const indexOption = 0;
      component.deleteOption(indexQuestion,indexOption);
      const opcionPreguntas = component.opcionesPregunta(indexQuestion);
      expect(opcionPreguntas.length).toBe(0);
    });
  });
});

describe("GIVEN: CreateSurveyComponent", () => {
  beforeEach(() => {
    configuredTestingModule();
    initializedSurveyForm();
  });

  describe("WHEN: showSelectedValue is called", () => {
    test('THEN:It should return the value of the selected option', () => {
      console.log('show selected value',component.showSelectedValue(2));

      expect(() => {component.showSelectedValue(2)}).not.toThrow();
    });

  });
});

describe("GIVEN: CreateSurveyComponent", () => {
  beforeEach(() => {
    configuredTestingModule();
    initializedSurveyForm();
    component.surveyForm.patchValue(surveyFormWithPreguntasAndOpciones);
  });

  describe("WHEN: the createSurvey is called", () => {
    test('THEN:It should call checkExistingPercepcionSurvey method', async () => {
      const spying = spyOn(component, 'checkExistingPercepcionSurvey');
      await component.createSurvey();
      expect(spying).toHaveBeenCalled();
    });
    describe("WHEN: checkExistingPercepcionSurvey method is called", () => {
      test('AND: checkExistingPercepcionSurvey return false THEN: It should call surveyService.createSurvey ', async () => {

        const checkExistingPercepcionSurvey = jest.spyOn(component, 'checkExistingPercepcionSurvey');
        checkExistingPercepcionSurvey.mockResolvedValue(false);

        const spyingCreateSuccessful = spyOn(component, 'createSuccessful');
        await component.createSurvey();

        expect(checkExistingPercepcionSurvey).toHaveBeenCalled();
        expect(mockSurveyService.createSurvey).toHaveBeenCalled();
        expect(spyingCreateSuccessful).toHaveBeenCalled();
      });
      test('AND: checkExistingPercepcionSurvey return true THEN: It should call existingPercepcionSurvey method ', async () => {

        const checkExistingPercepcionSurvey = jest.spyOn(component, 'checkExistingPercepcionSurvey');
        checkExistingPercepcionSurvey.mockResolvedValue(true);

        const spyingexistingPercepcionSurvey = spyOn(component, 'existingPercepcionSurvey');
        await component.createSurvey();

        expect(checkExistingPercepcionSurvey).toHaveBeenCalled();
        expect(spyingexistingPercepcionSurvey).toHaveBeenCalled();
      });
    });
  });
});

describe("GIVEN: CreateSurveyComponent", () => {
  describe("WHEN: checkExistingPercepcionSurvey method is called", () => {
    beforeEach(() => {
      configuredTestingModule();
    });
    test('AND:there are a survey with tipoEncuesta = Percepcion and estado = true THEN: It should return true', async () => {
      const result = await component.checkExistingPercepcionSurvey();
      expect(result).toBe(true);
    });
  });
  describe("WHEN: checkExistingPercepcionSurvey method is called", () => {
    beforeEach(() => {
      configuredTestingModule();
      mockSurveyService.listSurveys.mockReturnValue(of(responseListSurveysMockForCheckExistingPercepcionSurveyMethod))

    });
    test('AND:there arent a survey with tipoEncuesta = Percepcion and estado = true THEN: It should return false', async () => {
      const result = await component.checkExistingPercepcionSurvey();
      expect(result).toBe(false);
    });
  });
  describe("WHEN: checkExistingPercepcionSurvey method is called", () => {
    beforeEach(() => {
      configuredTestingModule();
      mockSurveyService.listSurveys.mockReturnValue(of(responseListSurveysMockEmpty))

    });
    test('AND:there arent a surveys THEN: It should return false', async () => {
      const result = await component.checkExistingPercepcionSurvey();
      expect(result).toBe(false);
    });
  });
});
describe("GIVEN: CreateSurveyComponent", () => {
  beforeEach(() => {
    configuredTestingModule();
  });
  describe("WHEN: existingPercepcionSurvey method is called", () => {
    test('THEN:It should call the matDialog open method', () => {
      const openDialog = jest.spyOn(mockMatDialog, 'open');
      component.existingPercepcionSurvey();
      expect(openDialog).toHaveBeenCalled();
    });
  });
});

describe("GIVEN: CreateSurveyComponent", () => {
  beforeEach(() => {
    configuredTestingModule();
  });
  describe("WHEN: getEncuestaById method is called", () => {
    test('THEN:It should call the surveyService.getEncuestaById method', () => {
      const idEncuesta = '1879e6fd-98df-4771-b268-9e21b1b6dccb';

      mockSurveyService.getEncuestaById.mockReturnValue(of(responseGetEncuestaByIdMock))
      component.getEncuestaById(idEncuesta);

      expect(mockSurveyService.getEncuestaById).toHaveBeenCalledWith('1879e6fd-98df-4771-b268-9e21b1b6dccb');
    });
  });
});
describe("GIVEN: CreateSurveyComponent", () => {
  beforeEach(() => {
    configuredTestingModule();
    initializedSurveyForm();
    component.surveyForm.patchValue(surveyFormWithPreguntasAndOpciones);
  });
  describe("WHEN: updateSurvey method is called", () => {
    test('THEN:It should call the surveyService.updateSurvey method', () => {
      component.updateSurvey();
      expect(mockSurveyService.updateSurvey).toHaveBeenCalled();

    });
  });
});
