
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, ArrowLeft, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { generatePatientPDF } from "@/utils/pdfGenerator";

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

const PatientForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PatientFormData>({
    fecha: undefined,
    nombreCompletoPaciente: "",
    afiliacionCUI: "",
    noCama: "",
    servicio: "",
    tipoDieta: "",
    desayuno: false,
    almuerzo: false,
    cena: false,
    refaccionAM: false,
    refaccionPM: false,
    refaccionNocturna: false,
    justificacion: "",
    nombreSolicitante: "",
    nombrePacienteFirma: "",
  });

  const handleInputChange = (field: keyof PatientFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.fecha) {
      toast({ title: "Error", description: "La fecha es obligatoria", variant: "destructive" });
      return;
    }
    
    if (!formData.nombreCompletoPaciente) {
      toast({ title: "Error", description: "El nombre completo es obligatorio", variant: "destructive" });
      return;
    }
    
    if (!formData.afiliacionCUI) {
      toast({ title: "Error", description: "La afiliación/CUI es obligatoria", variant: "destructive" });
      return;
    }
    
    if (!formData.justificacion) {
      toast({ title: "Error", description: "La justificación es obligatoria", variant: "destructive" });
      return;
    }

    // Al menos un tiempo de comida debe estar seleccionado
    const tiemposSeleccionados = [
      formData.desayuno,
      formData.almuerzo,
      formData.cena,
      formData.refaccionAM,
      formData.refaccionPM,
      formData.refaccionNocturna
    ].some(tiempo => tiempo);

    if (!tiemposSeleccionados) {
      toast({ title: "Error", description: "Debe seleccionar al menos un tiempo de comida", variant: "destructive" });
      return;
    }

    // Guardar en localStorage (simulando base de datos)
    const existingData = JSON.parse(localStorage.getItem('patientOrders') || '[]');
    const newOrder = {
      id: Date.now(),
      type: 'patient',
      ...formData,
      fechaCreacion: new Date().toISOString(),
    };
    existingData.push(newOrder);
    localStorage.setItem('patientOrders', JSON.stringify(existingData));

    toast({ 
      title: "Éxito", 
      description: "Orden de alimentación para paciente guardada correctamente" 
    });

    // Limpiar formulario
    setFormData({
      fecha: undefined,
      nombreCompletoPaciente: "",
      afiliacionCUI: "",
      noCama: "",
      servicio: "",
      tipoDieta: "",
      desayuno: false,
      almuerzo: false,
      cena: false,
      refaccionAM: false,
      refaccionPM: false,
      refaccionNocturna: false,
      justificacion: "",
      nombreSolicitante: "",
      nombrePacienteFirma: "",
    });
  };

  const handleGeneratePDF = () => {
    if (!formData.nombreCompletoPaciente) {
      toast({ title: "Error", description: "Complete al menos el nombre del paciente para generar el PDF", variant: "destructive" });
      return;
    }
    generatePatientPDF(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Orden de Alimentación - Pacientes</h1>
                  <p className="text-sm text-gray-600">Formulario SPS-110</p>
                </div>
              </div>
            </div>
            <Button onClick={handleGeneratePDF} variant="outline">
              Generar PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>ORDEN TIEMPOS SUELTOS DE ALIMENTACIÓN PARA PACIENTES</CardTitle>
              <CardDescription>
                Complete todos los campos requeridos para generar la orden de alimentación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Información General */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Información General</h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="fecha">Fecha *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.fecha && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.fecha ? format(formData.fecha, "PPP") : <span>Seleccionar fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.fecha}
                          onSelect={(date) => handleInputChange('fecha', date)}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Información del Paciente */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Información del Paciente</h3>
                <p className="text-sm text-gray-600 mb-4">Atentamente solicito a usted se brinde alimentación a:</p>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="nombreCompletoPaciente">Nombre completo *</Label>
                    <Input
                      id="nombreCompletoPaciente"
                      value={formData.nombreCompletoPaciente}
                      onChange={(e) => handleInputChange('nombreCompletoPaciente', e.target.value)}
                      placeholder="Ingrese el nombre completo del paciente"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="afiliacionCUI">Afiliación/CUI *</Label>
                      <Input
                        id="afiliacionCUI"
                        value={formData.afiliacionCUI}
                        onChange={(e) => handleInputChange('afiliacionCUI', e.target.value)}
                        placeholder="Número de afiliación o CUI"
                      />
                    </div>
                    <div>
                      <Label htmlFor="noCama">No. Cama</Label>
                      <Input
                        id="noCama"
                        value={formData.noCama}
                        onChange={(e) => handleInputChange('noCama', e.target.value)}
                        placeholder="Número de cama"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="servicio">Servicio</Label>
                      <Select value={formData.servicio} onValueChange={(value) => handleInputChange('servicio', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medicina-interna">Medicina Interna</SelectItem>
                          <SelectItem value="cirugia">Cirugía</SelectItem>
                          <SelectItem value="pediatria">Pediatría</SelectItem>
                          <SelectItem value="ginecologia">Ginecología</SelectItem>
                          <SelectItem value="ortopedia">Ortopedia</SelectItem>
                          <SelectItem value="cardiologia">Cardiología</SelectItem>
                          <SelectItem value="neurologia">Neurología</SelectItem>
                          <SelectItem value="uci">UCI</SelectItem>
                          <SelectItem value="emergencia">Emergencia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tipoDieta">Tipo de dieta</Label>
                      <Select value={formData.tipoDieta} onValueChange={(value) => handleInputChange('tipoDieta', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo de dieta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="blanda">Blanda</SelectItem>
                          <SelectItem value="liquida">Líquida</SelectItem>
                          <SelectItem value="diabetica">Diabética</SelectItem>
                          <SelectItem value="hiposodica">Hiposódica</SelectItem>
                          <SelectItem value="hipocalorica">Hipocalórica</SelectItem>
                          <SelectItem value="hipoproteica">Hipoproteica</SelectItem>
                          <SelectItem value="enteral">Enteral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tiempos de Comida */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Tiempos de Comida Solicitados</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="desayuno"
                      checked={formData.desayuno}
                      onCheckedChange={(checked) => handleInputChange('desayuno', checked)}
                    />
                    <Label htmlFor="desayuno">Desayuno</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="almuerzo"
                      checked={formData.almuerzo}
                      onCheckedChange={(checked) => handleInputChange('almuerzo', checked)}
                    />
                    <Label htmlFor="almuerzo">Almuerzo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cena"
                      checked={formData.cena}
                      onCheckedChange={(checked) => handleInputChange('cena', checked)}
                    />
                    <Label htmlFor="cena">Cena</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="refaccionAM"
                      checked={formData.refaccionAM}
                      onCheckedChange={(checked) => handleInputChange('refaccionAM', checked)}
                    />
                    <Label htmlFor="refaccionAM">Refacción AM</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="refaccionPM"
                      checked={formData.refaccionPM}
                      onCheckedChange={(checked) => handleInputChange('refaccionPM', checked)}
                    />
                    <Label htmlFor="refaccionPM">Refacción PM</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="refaccionNocturna"
                      checked={formData.refaccionNocturna}
                      onCheckedChange={(checked) => handleInputChange('refaccionNocturna', checked)}
                    />
                    <Label htmlFor="refaccionNocturna">Refacción nocturna</Label>
                  </div>
                </div>
              </div>

              {/* Justificación */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Justificación</h3>
                <div>
                  <Label htmlFor="justificacion">Justificación *</Label>
                  <Textarea
                    id="justificacion"
                    value={formData.justificacion}
                    onChange={(e) => handleInputChange('justificacion', e.target.value)}
                    placeholder="Ingrese la justificación médica para la solicitud de alimentación"
                    rows={4}
                  />
                </div>
              </div>

              {/* Firmas */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Firmas</h3>
                <p className="text-sm text-gray-600 mb-4">Atentamente,</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nombreSolicitante">Nombre del Solicitante</Label>
                    <Input
                      id="nombreSolicitante"
                      value={formData.nombreSolicitante}
                      onChange={(e) => handleInputChange('nombreSolicitante', e.target.value)}
                      placeholder="Personal responsable del servicio solicitante"
                    />
                    <p className="text-xs text-gray-500 mt-1">Firma y sello</p>
                  </div>
                  <div>
                    <Label htmlFor="nombrePacienteFirma">Nombre del Paciente</Label>
                    <Input
                      id="nombrePacienteFirma"
                      value={formData.nombrePacienteFirma}
                      onChange={(e) => handleInputChange('nombrePacienteFirma', e.target.value)}
                      placeholder="Paciente"
                    />
                    <p className="text-xs text-gray-500 mt-1">Firma o huella</p>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1">
                  Guardar Orden
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/gestion-datos')}>
                  Ver Registros
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
