import { format } from "date-fns";

interface PatientFormData {
  fecha: Date | undefined;
  nombreCompletoPaciente: string;
  afiliacionCUI: string;
  noCama: string;
  servicio: string;
  tipoDieta: string;
  desayuno: boolean;
  almuerzo: boolean;
  cena: boolean;
  refaccionAM: boolean;
  refaccionPM: boolean;
  refaccionNocturna: boolean;
  justificacion: string;
  nombreSolicitante: string;
  nombrePacienteFirma: string;
}

interface StaffFormData {
  fecha: Date | undefined;
  nombreCompletoPersonal: string;
  noEmpleado: string;
  ibm?: string;
  servicio: string;
  cargo: string;
  tipoDieta: string;
  desayuno: boolean;
  almuerzo: boolean;
  cena: boolean;
  refaccionNocturna: boolean;
  justificacion: string;
  nombreSolicitante: string;
  nombreColaborador: string;
}

const createPDFWindow = (content: string, title: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              margin: 20px;
              color: #000;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 15px;
              position: relative;
            }
            .logo {
              position: absolute;
              left: 0;
              top: 0;
              width: 80px;
              height: 80px;
            }
            .institution {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 5px;
            }
            .form-title {
              font-weight: bold;
              font-size: 14px;
              margin: 10px 0;
            }
            .section {
              margin: 20px 0;
            }
            .section-title {
              font-weight: bold;
              font-size: 13px;
              margin-bottom: 10px;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
            }
            .field {
              margin: 8px 0;
              display: flex;
              align-items: center;
            }
            .field-label {
              font-weight: bold;
              min-width: 120px;
              margin-right: 10px;
            }
            .field-value {
              border-bottom: 1px solid #000;
              flex: 1;
              min-height: 18px;
              padding: 2px 5px;
            }
            .checkbox-group {
              display: flex;
              flex-wrap: wrap;
              gap: 15px;
              margin: 10px 0;
            }
            .checkbox-item {
              display: flex;
              align-items: center;
              gap: 5px;
            }
            .checkbox {
              width: 12px;
              height: 12px;
              border: 1px solid #000;
              display: inline-block;
              text-align: center;
              line-height: 10px;
              font-size: 10px;
            }
            .justification {
              border: 1px solid #000;
              min-height: 60px;
              padding: 10px;
              margin: 10px 0;
            }
            .signatures {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              gap: 20px;
            }
            .signature-box {
              flex: 1;
              text-align: center;
              border-top: 1px solid #000;
              padding-top: 5px;
              margin-top: 40px;
            }
            .signature-label {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .signature-desc {
              font-size: 10px;
              color: #666;
            }
            .intro-text {
              margin: 15px 0;
              font-style: italic;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${content}
          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Imprimir PDF
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; font-size: 14px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
              Cerrar
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

export const generatePatientPDF = (data: PatientFormData) => {
  const fechaStr = data.fecha ? format(data.fecha, "dd/MM/yyyy") : "___________";
  
  const content = `
    <div class="header">
      <img src="/lovable-uploads/31eb0619-cbda-4f2f-a770-0972a9741cda.png" alt="Logo IGSS" class="logo">
      <div class="institution">INSTITUTO GUATEMALTECO DE SEGURIDAD SOCIAL</div>
      <div class="institution">IGSS</div>
      <div class="form-title">ORDEN TIEMPOS SUELTOS DE ALIMENTACIÓN PARA PACIENTES</div>
    </div>

    <div class="section">
      <div class="section-title">INFORMACIÓN GENERAL</div>
      <div class="field">
        <span class="field-label">Fecha:</span>
        <span class="field-value">${fechaStr}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">INFORMACIÓN DEL PACIENTE</div>
      <div class="intro-text">Atentamente solicito a usted se brinde alimentación a:</div>
      
      <div class="field">
        <span class="field-label">Nombre completo:</span>
        <span class="field-value">${data.nombreCompletoPaciente || ''}</span>
      </div>
      
      <div class="field">
        <span class="field-label">Afiliación/CUI:</span>
        <span class="field-value">${data.afiliacionCUI || ''}</span>
      </div>
      
      <div class="field">
        <span class="field-label">No. Cama:</span>
        <span class="field-value">${data.noCama || ''}</span>
      </div>
      
      <div class="field">
        <span class="field-label">Servicio:</span>
        <span class="field-value">${data.servicio || ''}</span>
      </div>
      
      <div class="field">
        <span class="field-label">Tipo de dieta:</span>
        <span class="field-value">${data.tipoDieta || ''}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">TIEMPOS DE COMIDA SOLICITADOS</div>
      <div class="checkbox-group">
        <div class="checkbox-item">
          <span class="checkbox">${data.desayuno ? '✓' : ''}</span>
          <span>Desayuno</span>
        </div>
        <div class="checkbox-item">
          <span class="checkbox">${data.almuerzo ? '✓' : ''}</span>
          <span>Almuerzo</span>
        </div>
        <div class="checkbox-item">
          <span class="checkbox">${data.cena ? '✓' : ''}</span>
          <span>Cena</span>
        </div>
        <div class="checkbox-item">
          <span class="checkbox">${data.refaccionAM ? '✓' : ''}</span>
          <span>Refacción AM</span>
        </div>
        <div class="checkbox-item">
          <span class="checkbox">${data.refaccionPM ? '✓' : ''}</span>
          <span>Refacción PM</span>
        </div>
        <div class="checkbox-item">
          <span class="checkbox">${data.refaccionNocturna ? '✓' : ''}</span>
          <span>Refacción nocturna</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">JUSTIFICACIÓN</div>
      <div class="justification">${data.justificacion || ''}</div>
    </div>

    <div class="section">
      <div class="intro-text">Atentamente,</div>
      <div class="signatures">
        <div class="signature-box">
          <div class="signature-label">Firma y sello</div>
          <div style="margin: 20px 0; min-height: 30px;">${data.nombreSolicitante || ''}</div>
          <div class="signature-desc">Personal responsable del servicio solicitante</div>
        </div>
        <div class="signature-box">
          <div class="signature-label">Firma o huella</div>
          <div style="margin: 20px 0; min-height: 30px;">${data.nombrePacienteFirma || ''}</div>
          <div class="signature-desc">Paciente</div>
        </div>
      </div>
    </div>
  `;

  createPDFWindow(content, `Orden_Paciente_${data.nombreCompletoPaciente || 'Sin_Nombre'}`);
};

export const generateStaffPDF = (data: StaffFormData) => {
  const fechaStr = data.fecha ? format(data.fecha, "dd/MM/yyyy") : "___________";

  const content = `
    <div class="header">
      <img src="/lovable-uploads/31eb0619-cbda-4f2f-a770-0972a9741cda.png" alt="Logo IGSS" class="logo">
      <div class="institution">INSTITUTO GUATEMALTECO DE SEGURIDAD SOCIAL</div>
      <div class="institution">IGSS</div>
      <div class="form-title">SOLICITUD DE TIEMPOS DE ALIMENTACIÓN PARA PERSONAL</div>
    </div>

    <div class="section">
      <div class="field">
        <span class="field-label">Fecha:</span>
        <span class="field-value">${fechaStr}</span>
      </div>
    </div>

    <div class="section">
      <div>Atentamente solicito a usted se brinde alimentación a:</div>

      <div class="field">
        <span class="field-label">Nombre completo:</span>
        <span class="field-value">${data.nombreCompletoPersonal || ''}</span>
      </div>

      <div class="field">
        <span class="field-label">No. empleado:</span>
        <span class="field-value">${data.noEmpleado || ''}</span>
      </div>

      <div class="field">
        <span class="field-label">Cargo:</span>
        <span class="field-value">${data.cargo || ''}</span>
      </div>

      <div class="field">
        <span class="field-label">Servicio:</span>
        <span class="field-value">${data.servicio || ''}</span>
      </div>

      <div class="field">
        <span class="field-label">Tipo de dieta:</span>
        <span class="field-value">${data.tipoDieta || ''}</span>
      </div>
    </div>

    <div class="section">
      <div>TIEMPOS DE COMIDA SOLICITADOS</div>
      <div class="checkbox-group" style="gap: 10px;">
        <div class="checkbox-item" style="gap: 5px;">
          <span class="checkbox" style="width: 15px; height: 15px; border: 1px solid #000; display: inline-block; text-align: center; line-height: 15px; font-size: 14px;">${data.desayuno ? 'X' : ''}</span>
          <span>Desayuno</span>
        </div>
        <div class="checkbox-item" style="gap: 5px;">
          <span class="checkbox" style="width: 15px; height: 15px; border: 1px solid #000; display: inline-block; text-align: center; line-height: 15px; font-size: 14px;">${data.almuerzo ? 'X' : ''}</span>
          <span>Almuerzo</span>
        </div>
        <div class="checkbox-item" style="gap: 5px;">
          <span class="checkbox" style="width: 15px; height: 15px; border: 1px solid #000; display: inline-block; text-align: center; line-height: 15px; font-size: 14px;">${data.cena ? 'X' : ''}</span>
          <span>Cena</span>
        </div>
        <div class="checkbox-item" style="gap: 5px;">
          <span class="checkbox" style="width: 15px; height: 15px; border: 1px solid #000; display: inline-block; text-align: center; line-height: 15px; font-size: 14px;">${data.refaccionNocturna ? 'X' : ''}</span>
          <span>Refacción nocturna</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div>JUSTIFICACIÓN</div>
      <div class="justification" style="border: 1px solid #000; min-height: 60px; padding: 10px; margin-top: 5px;">${data.justificacion || ''}</div>
    </div>

    <div class="section" style="margin-top: 40px;">
      <div>Atentamente,</div>
      <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div style="text-align: center; flex: 1; border-top: 1px solid #000; padding-top: 5px; margin-right: 20px;">
          Firma y sello<br>
          <div style="min-height: 30px; margin-top: 20px;">${data.nombreSolicitante || ''}</div>
          Personal responsable del servicio solicitante
        </div>
        <div style="text-align: center; flex: 1; border-top: 1px solid #000; padding-top: 5px;">
          Firma y sello<br>
          <div style="min-height: 30px; margin-top: 20px;">&nbsp;</div>
          ${data.nombreSolicitante || ''}
        </div>
        <div style="text-align: center; flex: 1; border-top: 1px solid #000; padding-top: 5px; margin-left: 20px;">
          Firma y sello<br>
          <div style="min-height: 30px; margin-top: 20px;">${data.nombreColaborador || ''}</div>
          Solicitante
        </div>
      </div>
    </div>
  `;

  createPDFWindow(content, `Solicitud_Personal_${data.nombreCompletoPersonal || 'Sin_Nombre'}`);
};
