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
import { generateStaffPDF } from "@/utils/pdfGenerator";
import FormRecordsSheet from "@/components/FormRecordsSheet";

interface StaffFormData {
  fecha: Date | undefined;
  nombreCompletoPersonal: string;
  noEmpleado: string;
  ibm: string;
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
  nombreAprobador: string;
}

const StaffForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StaffFormData>({
    fecha: undefined,
    nombreCompletoPersonal: "",
    noEmpleado: "",
    ibm: "",
    servicio: "",
    cargo: "",
    tipoDieta: "",
    desayuno: false,
    almuerzo: false,
    cena: false,
    refaccionNocturna: false,
    justificacion: "",
    nombreSolicitante: "",
    nombreColaborador: "",
    nombreAprobador: "",
  });

  const handleInputChange = (field: keyof StaffFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fecha) {
      toast({ title: "Error", description: "La fecha es obligatoria", variant: "destructive" });
      return;
    }
    
    if (!formData.nombreCompletoPersonal) {
      toast({ title: "Error", description: "El nombre completo es obligatorio", variant: "destructive" });
      return;
    }
    
    if (!formData.noEmpleado) {
      toast({ title: "Error", description: "El número de empleado es obligatorio", variant: "destructive" });
      return;
    }
    
    if (!formData.justificacion) {
      toast({ title: "Error", description: "La justificación es obligatoria", variant: "destructive" });
      return;
    }

    const tiemposSeleccionados = [
      formData.desayuno,
      formData.almuerzo,
      formData.cena,
      formData.refaccionNocturna
    ].some(tiempo => tiempo);

    if (!tiemposSeleccionados) {
      toast({ title: "Error", description: "Debe seleccionar al menos un tiempo de comida", variant: "destructive" });
      return;
    }

    const existingData = JSON.parse(localStorage.getItem('staffForms') || '[]');
    const newOrder = {
      id: Date.now(),
      type: 'staff',
      status: 'completed',
      ...formData,
      fechaCreacion: new Date().toISOString(),
    };
    existingData.push(newOrder);
    localStorage.setItem('staffForms', JSON.stringify(existingData));

    toast({ 
      title: "Éxito", 
      description: "Orden de alimentación para personal guardada correctamente" 
    });

    setFormData({
      fecha: undefined,
      nombreCompletoPersonal: "",
      noEmpleado: "",
      ibm: "",
      servicio: "",
      cargo: "",
      tipoDieta: "",
      desayuno: false,
      almuerzo: false,
      cena: false,
      refaccionNocturna: false,
      justificacion: "",
      nombreSolicitante: "",
      nombreColaborador: "",
      nombreAprobador: "",
    });
  };

  const handleGeneratePDF = () => {
    if (!formData.nombreCompletoPersonal) {
      toast({ title: "Error", description: "Complete al menos el nombre del personal para generar el PDF", variant: "destructive" });
      return;
    }
    generateStaffPDF(formData);
  };

  const handleEditRecord = (record: any) => {
    setFormData(record);
    toast({ title: "Formulario cargado", description: "Se ha cargado el formulario para editar" });
  };

  const handleGenerateRecordPDF = (record: any) => {
    generateStaffPDF(record);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
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
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Orden de Alimentación - Personal</h1>
                  <p className="text-sm text-gray-600">Formulario para personal del hospital</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGeneratePDF} variant="outline">
                Generar PDF
              </Button>
              <FormRecordsSheet 
                formType="staff" 
                onEditRecord={handleEditRecord}
                onGeneratePDF={handleGenerateRecordPDF}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>ORDEN TIEMPOS SUELTOS DE ALIMENTACIÓN PARA PERSONAL</CardTitle>
              <CardDescription>
                Complete todos los campos requeridos para generar la orden de alimentación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
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

              <div>
                <h3 className="text-lg font-semibold mb-4">Información del Personal</h3>
                <p className="text-sm text-gray-600 mb-4">Atentamente solicito a usted se brinde alimentación a:</p>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="nombreCompletoPersonal">Nombre completo *</Label>
                    <Input
                      id="nombreCompletoPersonal"
                      value={formData.nombreCompletoPersonal}
                      onChange={(e) => handleInputChange('nombreCompletoPersonal', e.target.value)}
                      placeholder="Ingrese el nombre completo del personal"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="noEmpleado">No. empleado *</Label>
                      <Input
                        id="noEmpleado"
                        value={formData.noEmpleado}
                        onChange={(e) => handleInputChange('noEmpleado', e.target.value)}
                        placeholder="Número de empleado"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ibm">IBM</Label>
                      <Input
                        id="ibm"
                        value={formData.ibm}
                        onChange={(e) => handleInputChange('ibm', e.target.value)}
                        placeholder="Identificador IBM"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cargo">Cargo</Label>
                      <Input
                        id="cargo"
                        value={formData.cargo}
                        onChange={(e) => handleInputChange('cargo', e.target.value)}
                        placeholder="Cargo del empleado"
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
                          <SelectItem value="emergencia">Emergencia</SelectItem>
                          <SelectItem value="hospitalizacion">Hospitalización</SelectItem>
                          <SelectItem value="servicios-varios-piloto">Servicios Varios Piloto</SelectItem>
                          <SelectItem value="servicios-varios-agentes">Servicios Varios Agentes</SelectItem>
                          <SelectItem value="servicios-varios-camareros">Servicios Varios Camareros</SelectItem>
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
                          <SelectItem value="vegetariana">Vegetariana</SelectItem>
                          <SelectItem value="diabetica">Diabética</SelectItem>
                          <SelectItem value="hiposodica">Hiposódica</SelectItem>
                          <SelectItem value="hipocalorica">Hipocalórica</SelectItem>
                          <SelectItem value="sin-gluten">Sin gluten</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              
              <div>
                <h3 className="text-lg font-semibold mb-4">Tiempos de Comida Solicitados</h3>
                <div className="grid md:grid-cols-2 gap-4">
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
                      id="refaccionNocturna"
                      checked={formData.refaccionNocturna}
                      onCheckedChange={(checked) => handleInputChange('refaccionNocturna', checked)}
                    />
                    <Label htmlFor="refaccionNocturna">Refacción nocturna</Label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Justificación</h3>
                <div>
                  <Label htmlFor="justificacion">Justificación *</Label>
                  <Textarea
                    id="justificacion"
                    value={formData.justificacion}
                    onChange={(e) => handleInputChange('justificacion', e.target.value)}
                    placeholder="Ingrese la justificación para la solicitud de alimentación"
                    rows={4}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Firmas</h3>
                <p className="text-sm text-gray-600 mb-4">Atentamente,</p>
                <div className="grid gap-6">
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
                    <Label htmlFor="nombreColaborador">Nombre del Colaborador</Label>
                    <Input
                      id="nombreColaborador"
                      value={formData.nombreColaborador}
                      onChange={(e) => handleInputChange('nombreColaborador', e.target.value)}
                      placeholder="Colaborador"
                    />
                    <p className="text-xs text-gray-500 mt-1">Firma</p>
                  </div>
                  <div>
                    <Label htmlFor="nombreAprobador">Vo. Bo. Administrador</Label>
                    <Input
                      id="nombreAprobador"
                      value={formData.nombreAprobador}
                      onChange={(e) => handleInputChange('nombreAprobador', e.target.value)}
                      placeholder="Vo. Bo. Administrador o persona responsable"
                    />
                    <p className="text-xs text-gray-500 mt-1">Firma y sello</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1">
                  Guardar Orden
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;
