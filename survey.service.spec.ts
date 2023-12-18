import { of } from 'rxjs';
import { SurveyService } from "./survey.service";

let service: SurveyService;
const mockApiUrl = { settings: jest.fn() };
const httpMock = { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn(), }

const bodyCreateSurveyMock = {
  "nombreEncuesta": "Encuesta de satisfaccion",
  "descripcionEncuesta": "Satisfaccion de acciones de formación",
  "tipoEncuesta": "Satisfaccion",
  "estado": true,
  "preguntas": [
    {
      "nombrePregunta": "¿Le ha gustado el curso?",
      "tipoPregunta": 1,
      "numeroPregunta": 1,
      "opcionPreguntas": [
        {
          "opcionPregunta": "Sí"
        },
        {
          "opcionPregunta": "No"
        }
      ]
    },
    {
      "nombrePregunta": "¿A quien recomendaria este curso?",
      "tipoPregunta": 2,
      "numeroPregunta": 2,
      "opcionPreguntas": [
        {
          "opcionPregunta": "Familiares"
        },
        {
          "opcionPregunta": "Amigos"
        },
        {
          "opcionPregunta": "Compañeros de trabajo"
        }
      ]
    },
    {
      "nombrePregunta": "¿Denos a conocer su opinion sobre el curso?",
      "tipoPregunta": 3,
      "numeroPregunta": 3,
      "opcionPreguntas": []
    },
    {
      "nombrePregunta": "¿Denos a conocer su opinion sobre el curso?",
      "tipoPregunta": 4,
      "numeroPregunta": 4,
      "opcionPreguntas": []
    }
  ]
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

const responseListSurveysMock = {
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
          "fechaCreacion": "2023-11-30",
          "fechaActualizacion": null
        },
        {
          "idEncuesta": "1879e6fd-98df-4771-b268-9e21b1b6dccb",
          "nombreEncuesta": "Encuesta de percepcion",
          "estado": true,
          "tipoEncuesta": "Percepcion",
          "fechaCreacion": "2023-11-29",
          "fechaActualizacion": "2023-11-30"
        }
      ]
    }
  }
}

const bodyUpdateSurveyMock = {
  "idEncuesta": "1879e6fd-98df-4771-b268-9e21b1b6dccb",
  "nombreEncuesta": "Encuesta de percepcion",
  "descripcionEncuesta": "Percepción de acciones de formación",
  "estado": true,
  "preguntas": [
    {
      "nombrePregunta": "Le gusto el curso?",
      "tipoPregunta": 1,
      "numeroPregunta": 1,
      "opcionPreguntas": [
        {
          "opcionPregunta": "Sí"
        },
        {
          "opcionPregunta": "No"
        }
      ]
    }
  ]
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

const responseDeleteSurveyMock = {
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

const bodycreateRespuestaEncuestaMock = {
  "idAsignacionEncuesta": "ea426127-e433-42be-af2e-48ff1a3b1d00",
  "preguntas": [
    {
      "idPregunta": "711c41e4-9d2d-4786-ab73-c78a7c83f790",
      "respuestas": [
        "Sí"
      ]
    }
  ]
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
const responseGetInfoSurveyAlertMock = {
  statusCode: 200,
  body: {
    status: "success",
    message: "SUCCESS",
    description: "Service executed successfully",
    data: {
      objects: [{
        encuesta: "Encuesta de percepcion",
        idAny: "5f16907f-5326-4040-ba8d-43c6a1caa1fb",
        idEncuesta: "d4cf1530-4922-4ed7-8601-90b0964f54a8",
        idSurveyAssignment: "d2bde73b-3688-4e6c-91b0-223ce79cb2d9",
        nombreOferta: "[ (N) Criptografía, certificados digitales y PKI]",
        persona: "CRISTINA",
        status: false,
      }]
    }
  }
}

function setupServiceWithMockHttp() {
  service = new SurveyService(httpMock as any, mockApiUrl as any);
  return service;
}

describe("GIVEN: EncuestasService", () => {

  describe("WHEN: The createSurvey method is called", () => {
    beforeEach(() => {
      setupServiceWithMockHttp();
    })

    test("THEN: it should make an insert and return  status 200", () => {
      httpMock.post.mockReturnValue(of(responseCreateSurveyMock));
      service.createSurvey(bodyCreateSurveyMock).subscribe((res) => {
        expect(res).toEqual(responseCreateSurveyMock)
        expect(httpMock.post).toHaveBeenCalled();
      })

    })
  })
});

describe("GIVEN: EncuestasService", () => {

  describe("WHEN: The listSurveys method is called", () => {
    beforeEach(() => {
      setupServiceWithMockHttp();
    });

    test("THEN: it should return an observable with an object which contains a list of surveys", () => {
      httpMock.get.mockReturnValue(of(responseListSurveysMock));
      service.listSurveys().subscribe((res) => {
        expect(responseListSurveysMock).toEqual(res);
      })
    });
  })
});

describe("GIVEN: EncuestasService", () => {

  describe("WHEN: The updateSurvey method is called", () => {
    beforeEach(() => {
      setupServiceWithMockHttp();
    })

    test("THEN: it should make an update and return status 200", () => {
      httpMock.put.mockReturnValue(of(responseUpdateSurveyMock));
      service.updateSurvey(bodyUpdateSurveyMock).subscribe((res) => {
        expect(res).toEqual(responseUpdateSurveyMock)
        expect(httpMock.put).toHaveBeenCalled();
      })
    })
  })
});

describe("GIVEN: EncuestasService", () => {

  describe("WHEN: The deleteSurvey method is called", () => {
    beforeEach(() => {
      setupServiceWithMockHttp();
    });

    test("THEN: it should make a delete and return status 200", () => {
      const idEncuesta = "1879e6fd-98df-4771-b268-9e21b1b6dccb";
      httpMock.delete.mockReturnValue(of(responseDeleteSurveyMock));

      service.deleteSurvey(idEncuesta).subscribe((res) => {
        expect(responseDeleteSurveyMock).toEqual(res);
      });
    });
  })
});

describe("GIVEN: EncuestasService", () => {

  describe("WHEN: The getEncuestaById method is called", () => {
    beforeEach(() => {
      setupServiceWithMockHttp();
    });

    test("THEN: it should return an observable with an object which contains the info of a survey", () => {
      const idEncuesta = "1879e6fd-98df-4771-b268-9e21b1b6dccb";
      httpMock.get.mockReturnValue(of(responseGetEncuestaByIdMock));
      service.getEncuestaById(idEncuesta).subscribe((res) => {
        expect(responseGetEncuestaByIdMock).toEqual(res);
      });
    });
  })
});

describe("GIVEN: EncuestasService", () => {

  describe("WHEN: The createRespuestaEncuesta method is called", () => {
    beforeEach(() => {
      setupServiceWithMockHttp();
    })

    test("THEN: it should make an insert and return  status 200", () => {
      httpMock.post.mockReturnValue(of(responsecreateRespuestaEncuestaMock));
      service.createSurvey(bodycreateRespuestaEncuestaMock).subscribe((res) => {
        expect(res).toEqual(responsecreateRespuestaEncuestaMock)
        expect(httpMock.post).toHaveBeenCalled();
      })

    })
  })
});

describe("GIVEN: EncuestasService", () => {

  describe("WHEN: The getCursoByIdAsignacion method is called", () => {
    beforeEach(() => {
      setupServiceWithMockHttp();
    });

    test("THEN: it should return an observable with an object which contains the info of a course", () => {
      const idAsignacion = "85a4f07e-1d2d-451e-9d5d-99c8b2cfbe27";
      httpMock.get.mockReturnValue(of(responseGetCursoByIdAsignacionMock));
      service.getCursoByIdAsignacion(idAsignacion).subscribe((res) => {
        expect(responseGetCursoByIdAsignacionMock).toEqual(res);
      })
    })
  })
});

describe("GIVEN: EncuestasService", () => {

  describe("WHEN: The getInfoSurveyAlert method is called", () => {
    beforeEach(() => {
      setupServiceWithMockHttp();
    });

    test("THEN: it should return an observable with an object that contains the information of the pending surveys", () => {
      const idPersona = "id1234";
      httpMock.get.mockReturnValue(of(responseGetInfoSurveyAlertMock));
      service.getInfoSurveyAlert(idPersona).subscribe((res) => {
        expect(responseGetInfoSurveyAlertMock).toEqual(res);
      })
    })
  })
});
