export interface Isurveys {
  idEncuesta: string;
  nombreEncuesta: string;
  descripcionEncuesta?: string;
  estado: boolean;
  tipoEncuesta: string;
  fechaCreacion: Date;
  preguntas?: Array<IsurveyQuestion>;
  fechaActualizacion: Date;
}

interface IsurveyQuestion {
  idPregunta: string;
  numeroPregunta: number;
  nombrePregunta: string;
  tipoPregunta: number;
  opcionPreguntas: Array<ISurveyOptions>;
}

interface ISurveyOptions {
  idOpcionPregunta: string;
  opcionPregunta: string;
}
