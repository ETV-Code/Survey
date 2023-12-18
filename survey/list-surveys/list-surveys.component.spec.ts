import { async ,ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError,of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ListSurveysComponent } from './list-surveys.component';
import { Isurveys } from 'src/app/shared/domain/isurveys';
import { SurveyService } from 'src/app/shared/service/survey.service';
import { MatDialog } from '@angular/material/dialog';
import { SurveyTabCommunicationService } from 'src/app/shared/service/survey-tab-communication.service';

let component: ListSurveysComponent;
let fixture: ComponentFixture<ListSurveysComponent>;

const mockSurveyService = { listSurveys: jest.fn(),deleteSurvey: jest.fn() }
const mocksurveyTabCommunicationService = {triggerCreateSurveyTabClick: jest.fn()}
const mockMatDialog = { open: jest.fn(), afterClosed: jest.fn(), close: jest.fn(), }

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

const responseDeleteSurveyMock={
  "statusCode": 200,
  "body": {
      "status": "success",
      "message": "SUCCESS",
      "description": "Service executed successfully",
      "data": {
          "message": "Encuesta eliminada"
      }
  }
}
const responseErrorDeleteSurveyMock={
  "statusCode": 500,
  "body": {
      "status": "error",
      "message": "INTERNAL_SERVER_ERROR",
      "description": "Internal server error",
      "data": {
          "message": "No se puede eliminar la encuesta porque ya tiene respuestas asociadas"
      }
  }
}
function configuredTestingModule(){

  TestBed.configureTestingModule({
    declarations: [ ListSurveysComponent ],
    providers: [
      {provide: SurveyService, useValue: mockSurveyService},
      {provide: SurveyTabCommunicationService, useValue: mocksurveyTabCommunicationService},
      {provide: MatDialog, useValue: mockMatDialog},
    ],
    schemas: [NO_ERRORS_SCHEMA]
  }).compileComponents();
  mockSurveyService.listSurveys.mockReturnValue(of(responseListSurveysMock))
  fixture = TestBed.createComponent(ListSurveysComponent)
  component = fixture.componentInstance;
};

describe('GIVEN: ListSurveysComponent', () => {

  beforeEach(() => {
    configuredTestingModule();
  });

  test('THEN: It should create ListSurveysComponent', () => {
    expect(component).toBeTruthy();
  });

});

describe('GIVEN: ListSurveysComponent',()=>{
  beforeEach(() => {
    configuredTestingModule();
  });
  describe('WHEN: ngOnInit is called',()=>{
    test('THEN: it should call the surveyService.listSurveys method on ngOnInit',()=>{
      component.ngOnInit();
      expect(mockSurveyService.listSurveys).toHaveBeenCalled();

    })
  })

})

describe('GIVEN: ListSurveysComponent', ()=>{
  const emtyResponse = {
    body: {
      data: {
        encuestas: [],
      },
    },
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSurveysComponent ],
      providers: [
        {provide: SurveyService, useValue: mockSurveyService},
        {provide: SurveyTabCommunicationService, useValue: mocksurveyTabCommunicationService},
        {provide: MatDialog, useValue: mockMatDialog},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    mockSurveyService.listSurveys.mockReturnValue(of(emtyResponse))
    fixture = TestBed.createComponent(ListSurveysComponent)
    component = fixture.componentInstance;
  }));
  describe('WHEN: The list is empty and the crear encuesta button is clicked ',()=>{
    test('THEN: It should call onCreateSurveyClicked method', () => {
      component.listSurveys();
      fixture.detectChanges()

      const spying = spyOn(component, 'onCreateSurveyClicked');
      const crearButton = fixture.debugElement.nativeElement.querySelector('[test_data="create_button"]');
      crearButton.click()

      expect(spying).toHaveBeenCalled();

    })
  })
  describe('WHEN: The list is empty and the crear encuesta button is clicked ',()=>{});
})

describe('GIVEN: ListSurveysComponent', ()=>{

  beforeEach(() => {
    configuredTestingModule();
  });

  describe('WHEN: listSurveys method is called ',()=>{
    test('THEN: It should set the dataSource property with the survey data from the surveyService', () => {
      const mockSurveyData: Isurveys[] = [
        {
          idEncuesta: "bb37817e-a6fa-447f-8261-35e516a230e2",
          nombreEncuesta: "Encuesta Curso Java",
          estado: true,
          tipoEncuesta: "Percepcion",
          fechaCreacion: new Date('2023-11-29'),
          fechaActualizacion: null,
        },
        {
          idEncuesta: "1879e6fd-98df-4771-b268-9e21b1b6dccb",
          nombreEncuesta: "Encuesta de percepcion",
          estado: true,
          tipoEncuesta: "Percepcion",
          fechaCreacion: new Date('2023-11-29'),
          fechaActualizacion: new Date('2023-11-29'),
        },

      ];

      component.ngOnInit();

      expect(component.dataSource).toEqual(mockSurveyData);
    });
  })
})

describe('GIVEN: ListSurveysComponent', ()=>{
  beforeEach(() => {
    configuredTestingModule();
  });
  describe('WHEN: The eliminar button is clicked ',()=>{
    test('AND: the comportamientoAlertas method is called', () => {
      component.listSurveys();
      fixture.detectChanges()

      const spying = spyOn(component, 'comportamientoAlertas');
      const deleteButton = fixture.debugElement.nativeElement.querySelector('[test_data="delete_button"]');
      deleteButton.click()
      expect(spying).toHaveBeenCalledWith('eliminar',component.currentPage[0]);

    })

    test('THEN: It should call confirmarEliminar method',()=>{
      const spying = spyOn(component, 'confirmarEliminar');

      component.comportamientoAlertas('eliminar',component.currentPage[0])

      expect(spying).toHaveBeenCalledWith(component.currentPage[0])
    })
  })

})

describe('GIVEN: ListSurveysComponent',()=>{
  beforeEach(() => {
    configuredTestingModule();
  });
  describe('WHEN: confirmarEliminar method is called',()=>{
    test('AND: the matDialog is closed', () => {
      component.listSurveys();
      fixture.detectChanges()

      const openDialog = jest.spyOn(mockMatDialog, 'open')

      const dialogRefMock = {
        afterClosed: jest.fn(() => of({})),
      };
      openDialog.mockReturnValue(dialogRefMock);

      component.confirmarEliminar(component.currentPage[0]);

      expect(dialogRefMock.afterClosed).toHaveBeenCalled();

    })

    test('THEN: It should call deleteSurvey method',()=>{
      component.listSurveys();
      fixture.detectChanges()
      const spying = spyOn(component, 'deleteSurvey');

      component.confirmarEliminar(component.currentPage[0]);

      expect(spying).toHaveBeenCalledWith(component.currentPage[0])
    })
  })

})

describe('GIVEN: ListSurveysComponent', ()=>{
  beforeEach(() => {
    configuredTestingModule();
  });
  describe('WHEN: deleteSurvey method is called ',()=>{
    test('THEN: It should call the surveyService.deleteSurvey method when the deleteSurvey method is called', () => {
      const mockSurveyData: Isurveys = {
        idEncuesta: "bb37817e-a6fa-447f-8261-35e516a230e2",
        nombreEncuesta: "Encuesta Curso Java",
        estado: true,
        tipoEncuesta: "Percepcion",
        fechaCreacion: new Date('2023-11-29'),
        fechaActualizacion: null,
      };
      mockSurveyService.deleteSurvey.mockReturnValue(of(responseDeleteSurveyMock));

      component.deleteSurvey(mockSurveyData);

      expect(mockSurveyService.deleteSurvey).toHaveBeenCalledWith(mockSurveyData.idEncuesta);
    });
  })
})
describe('GIVEN: ListSurveysComponent', ()=>{
  beforeEach(() => {
    configuredTestingModule();
  });
  describe('WHEN: deleteSurvey response is error 500 ',()=>{
    test('THEN: It should call the deletedWarn method', () => {
      const mockSurveyData: Isurveys = {
        idEncuesta: "bb37817e-a6fa-447f-8261-35e516a230e2",
        nombreEncuesta: "Encuesta Curso Java",
        estado: true,
        tipoEncuesta: "Percepcion",
        fechaCreacion: new Date('2023-11-29'),
        fechaActualizacion: null,
      };
      const spying = spyOn(component, 'deletedWarn');
      mockSurveyService.deleteSurvey.mockReturnValue(throwError(responseErrorDeleteSurveyMock));
      component.deleteSurvey(mockSurveyData);
      expect(mockSurveyService.deleteSurvey).toHaveBeenCalledWith(mockSurveyData.idEncuesta);
      expect(spying).toHaveBeenCalled();
    });
  })
})
describe('GIVEN: ListSurveysComponent', ()=>{
  beforeEach(() => {
    configuredTestingModule();
  });
  describe('WHEN: deletedWarn method is called ',()=>{
    test('THEN: it should call the matDialog open method', () => {
      const openDialog = jest.spyOn(mockMatDialog, 'open');
      component.deletedWarn();
      expect(openDialog).toHaveBeenCalled();
    });
  })
})

describe('GIVEN: ListSurveysComponent', ()=>{
  beforeEach(() => {
    configuredTestingModule();
  });
  describe('WHEN: The editar button is clicked ',()=>{
    test('THEN: It should call onUpdateSurvey method', () => {
      component.listSurveys();
      fixture.detectChanges()

      const spying = spyOn(component, 'onUpdateSurvey');
      const updateButton = fixture.debugElement.nativeElement.querySelector('[test_data="update_button"]');

      updateButton.click()
      expect(spying).toHaveBeenCalled();

    })
  })

})

describe('GIVEN: ListSurveysComponent', ()=>{
  beforeEach(() => {
    configuredTestingModule();
  });
  describe('WHEN: onUpdateSurvey method is called ',()=>{
    test('THEN: It should emit outgoingIdEncuesta', () => {

      const idEncuesta = "bb37817e-a6fa-447f-8261-35e516a230e2"
      const spyoutgoingIdEncuesta = spyOn(component.outgoingIdEncuesta, 'emit');
      component.onUpdateSurvey(idEncuesta);
      expect(spyoutgoingIdEncuesta).toHaveBeenCalledWith(idEncuesta);



    });
  })
})

describe('GIVEN: ListSurveysComponent', ()=>{
  beforeEach(() => {
    configuredTestingModule();
  });
  describe('WHEN: onUpdateSurvey method is called ',()=>{
    test('THEN: It should emit outgoingUpdateStatus', () => {

      const idEncuesta = "bb37817e-a6fa-447f-8261-35e516a230e2"
      const spyoutgoingUpdateStatus = spyOn(component.outgoingUpdateStatus, 'emit');
      component.onUpdateSurvey(idEncuesta);
      expect(spyoutgoingUpdateStatus).toHaveBeenCalledWith(true);
    });
  })
})


describe('GIVEN: ListSurveysComponent', ()=>{
  beforeEach(() => {
    configuredTestingModule();
  });
  describe('WHEN: The ver button is clicked ',()=>{
    test('AND: the comportamientoAlertas method is called', () => {
      component.listSurveys();
      fixture.detectChanges()

      const spying = spyOn(component, 'comportamientoAlertas');
      const verButton = fixture.debugElement.nativeElement.querySelector('[test_data="ver_button"]');
      verButton.click()
      expect(spying).toHaveBeenCalledWith('ver',component.currentPage[0]);

    })

    test('THEN: It should call confirmarVer method',()=>{
      const spying = spyOn(component, 'confirmarVer');

      component.comportamientoAlertas('ver',component.currentPage[0])

      expect(spying).toHaveBeenCalledWith(component.currentPage[0])
    })
  })
})


describe('GIVEN: ListSurveysComponent',()=>{
  beforeEach(() => {
    configuredTestingModule();
  });
  describe('WHEN: confirmarVer method is called',()=>{
    test('THEN: it should call the matDialog open method', () => {
      component.listSurveys();
      fixture.detectChanges()

      const openDialog = jest.spyOn(mockMatDialog, 'open');

      component.confirmarVer(component.currentPage[0]);

      expect(openDialog).toHaveBeenCalled();

    })
  })

})
