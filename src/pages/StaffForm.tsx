import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, ArrowLeft, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { generateStaffPDF } from "@/utils/pdfGenerator";
import FormRecordsSheet from "@/components/FormRecordsSheet";
import { useStaffOrders } from "@/hooks/useStaffOrders";
import { supabase } from "@/integrations/supabase/client";
import { createClient } from '@supabase/supabase-js';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
}

interface PersonalInfo {
  no_empleado: string;
  nombre_completo: string;
  plaza_nominal: string;
}

const anonSupabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const StaffForm = () => {
  const navigate = useNavigate();
  const { createOrder, orders, isLoading } = useStaffOrders();

const [formData, setFormData] = useState<StaffFormData>({
  fecha: new Date(),
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
});

  const [ibmResults, setIbmResults] = useState<PersonalInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGeneratePDF = () => {
    if (!formData.nombreCompletoPersonal) {
      toast({ title: "Error", description: "Complete al menos el nombre del personal para generar el PDF", variant: "destructive" });
      return;
    }
    generateStaffPDF(formData);
  };

  const handleEditRecord = (record: any) => {
    setFormData({
      fecha: record.fecha ? new Date(record.fecha) : undefined,
      nombreCompletoPersonal: record.nombre_completo_personal || record.nombreCompletoPersonal || "",
      noEmpleado: record.no_empleado || record.noEmpleado || "",
      ibm: record.ibm || "",
      servicio: record.servicio || "",
      cargo: record.cargo || "",
      tipoDieta: record.tipo_dieta || record.tipoDieta || "",
      desayuno: record.desayuno || false,
      almuerzo: record.almuerzo || false,
      cena: record.cena || false,
      refaccionNocturna: record.refaccion_nocturna || record.refaccionNocturna || false,
      justificacion: record.justificacion || "",
      nombreSolicitante: "", // Campo removido, se envía vacío
      nombreColaborador: record.nombre_colaborador || record.nombreColaborador || "",
    });
    toast({ title: "Formulario cargado", description: "Se ha cargado el formulario para editar" });
  };

  const handleGenerateRecordPDF = (record: any) => {
    const pdfData = {
      fecha: record.fecha ? new Date(record.fecha) : undefined,
      nombreCompletoPersonal: record.nombre_completo_personal || record.nombreCompletoPersonal || "",
      noEmpleado: record.no_empleado || record.noEmpleado || "",
      ibm: record.ibm || "",
      servicio: record.servicio || "",
      cargo: record.cargo || "",
      tipoDieta: record.tipo_dieta || record.tipoDieta || "",
      desayuno: record.desayuno || false,
      almuerzo: record.almuerzo || false,
      cena: record.cena || false,
      refaccionNocturna: record.refaccion_nocturna || record.refaccionNocturna || false,
      justificacion: record.justificacion || "",
      nombreSolicitante: "", // Campo removido, se envía vacío
      nombreColaborador: record.nombre_colaborador || record.nombreColaborador || "",
    };
    generateStaffPDF(pdfData);
  };

  const handleInputChange = (field: keyof StaffFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fetchStaffByIBM = async (ibm: string) => {
    if (!ibm) {
      setIbmResults([]);
      return;
    }

    // Cast to any to avoid type errors with custom RPC
    const { data, error } = await (supabase.rpc as any)('get_personal_info_by_no_empleado', { p_no_empleado: ibm });

    if (error) {
      setIbmResults([]);
      return;
    }

    if (data && data.length > 0) {
      setIbmResults(data);
      const personal = data[0];
      setFormData(prev => ({
        ...prev,
        nombreCompletoPersonal: personal.nombre_completo || "",
        noEmpleado: personal.no_empleado || "",
        cargo: personal.plaza_nominal || "",
      }));
    } else {
      setIbmResults([]);
    }
  };

  const fetchStaffByIBMSimilar = async (ibm: string) => {
    console.log("fetchStaffByIBMSimilar called with:", ibm);
    if (!ibm) {
      setIbmResults([]);
      return;
    }
    // Consulta directa a la tabla personal_info con filtro LIKE para IBM similares
    const { data, error } = await anonSupabase
      .from('personal_info' as any)
      .select('no_empleado, nombre_completo, plaza_nominal')
      .ilike('no_empleado', `%${ibm}%`)
      .limit(10);
    console.log("fetchStaffByIBMSimilar result data:", data, "error:", error);

    if (error) {
      console.error("Error al buscar IBM similares:", error);
      toast({ title: "Error", description: `Error al buscar IBM similares: ${error.message}`, variant: "destructive" });
      setIbmResults([]);
      return;
    }

    if (Array.isArray(data) && data.length > 0) {
      setIbmResults(data as unknown as PersonalInfo[]);
    } else {
      setIbmResults([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fecha) {
      toast({ title: "Error", description: "La fecha es obligatoria", variant: "destructive" });
      return;
    }

    if (!formData.nombreCompletoPersonal) {
      toast({ title: "Error", description: "El nombre completo es obligatorio", variant: "destructive" });
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

    // Save to Supabase
    const orderData = {
      fecha: format(formData.fecha, "yyyy-MM-dd"),
      nombre_completo_personal: formData.nombreCompletoPersonal,
      no_empleado: formData.noEmpleado,
      servicio: formData.servicio,
      cargo: formData.cargo,
      tipo_dieta: formData.tipoDieta,
      desayuno: formData.desayuno,
      almuerzo: formData.almuerzo,
      cena: formData.cena,
      refaccion_nocturna: formData.refaccionNocturna,
      justificacion: formData.justificacion,
      nombre_solicitante: "", // Campo removido, se envía vacío
      nombre_colaborador: formData.nombreColaborador,
      nombre_aprobador: "", // Remove this field as requested
    };

    const result = await createOrder(orderData);

    if (result) {
      // Reset form on success
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
      });
    }
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
                  <h1 className="text-xl font-bold text-gray-900">Solicitud de tiempos de alimentación para personal</h1>
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
              <CardTitle>SOLICITUD DE TIEMPOS DE ALIMENTACIÓN PARA PERSONAL</CardTitle>
              <CardDescription>
                Complete todos los campos requeridos para generar la solicitud de alimentación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              
              <section>
                <h3 className="text-lg font-semibold mb-4">Información General</h3>
                <div className="grid gap-2 max-w-sm">
                  <div>
                    <Label htmlFor="fecha">Fecha *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative w-full">
                          <Input
                            id="fecha"
                            placeholder="Selecciona una fecha"
                            value={formData.fecha ? formData.fecha.toLocaleDateString() : ""}
                            readOnly
                            className="cursor-pointer pr-8"
                          />
                          <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.fecha}
                          onSelect={(date) => handleInputChange('fecha', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-4">Información del Personal Solicitante</h3>
                <p className="text-sm text-gray-600 mb-4">Atentamente solicito a usted se brinde alimentación a:</p>
                <div className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ibm">IBM</Label>
                      <div className="relative">
                        <Input
                          id="ibm"
                          value={formData.ibm}
                          onChange={async (e) => {
                            const value = e.target.value;
                            console.log("IBM input changed:", value);
                            handleInputChange('ibm', value);
                            if (value.length > 0) {
                              console.log("Consultando Supabase con IBM:", value);
                              await fetchStaffByIBMSimilar(value);
                              setShowSuggestions(true);
                            } else {
                              setIbmResults([]);
                              setShowSuggestions(false);
                            }
                          }}
                          onBlur={() => {
                            // Ocultar sugerencias al perder foco
                            setTimeout(() => setShowSuggestions(false), 200);
                          }}
                          onFocus={() => {
                            // Mostrar sugerencias al enfocar si hay resultados
                            if (ibmResults.length > 0) {
                              setShowSuggestions(true);
                            }
                          }}
                          placeholder="Identificador IBM"
                          autoComplete="off"
                        />
                        {formData.ibm.length > 0 && showSuggestions && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md max-h-60 overflow-auto shadow-lg mt-1"
                            style={{ width: '100%' }}
                          >
                            {ibmResults.length > 0 ? (
                              ibmResults.map((item) => (
                                <div
                                  key={item.no_empleado}
                                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                  onClick={() => {
                                    handleInputChange('ibm', item.no_empleado);
                                    handleInputChange('nombreCompletoPersonal', item.nombre_completo);
                                    handleInputChange('noEmpleado', item.no_empleado);
                                    handleInputChange('cargo', item.plaza_nominal);
                                    setIbmResults([]);
                                    setShowSuggestions(false);
                                  }}
                                >
                                  <div className="font-semibold">{item.no_empleado}</div>
                                  <div className="text-sm text-gray-600">{item.nombre_completo}</div>
                                  <div className="text-xs text-gray-500">{item.plaza_nominal}</div>
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-sm text-gray-500">No se encontraron resultados</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="nombreCompletoPersonal">Nombre completo *</Label>
                      <Input
                        id="nombreCompletoPersonal"
                        value={formData.nombreCompletoPersonal}
                        onChange={(e) => handleInputChange('nombreCompletoPersonal', e.target.value)}
                        placeholder="Ingrese el nombre completo del personal"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="cargo">Cargo</Label>
                      <Input
                        id="cargo"
                        value={formData.cargo}
                        onChange={(e) => handleInputChange('cargo', e.target.value)}
                        placeholder="Cargo del empleado"
                      />
                    </div>
                    <div>
                      <Label htmlFor="servicio">Servicio</Label>
                      <Select value={formData.servicio} onValueChange={(value) => handleInputChange('servicio', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Emergencia">Emergencia</SelectItem>
                          <SelectItem value="Hospitalización">Hospitalización</SelectItem>
                          <SelectItem value="Servicios Varios Piloto">Servicios Varios Piloto</SelectItem>
                          <SelectItem value="Servicios Varios Agentes">Servicios Varios Agentes</SelectItem>
                          <SelectItem value="Servicios Varios Camareros">Servicios Varios Camareros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tipoDieta">Tipo de Dieta</Label>
                      <Select value={formData.tipoDieta} onValueChange={(value) => handleInputChange('tipoDieta', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo de dieta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Diabetes">Diabetes</SelectItem>
                          <SelectItem value="Hipertensión">Hipertensión</SelectItem>
                          <SelectItem value="Renal">Renal</SelectItem>
                          <SelectItem value="Vegetariana">Vegetariana</SelectItem>
                          <SelectItem value="Vegana">Vegana</SelectItem>
                          <SelectItem value="Sin Sal">Sin Sal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </section>

              <section>
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
              </section>

              <section>
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
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-4">Firmas</h3>
                <p className="text-sm text-gray-600 mb-4">Atentamente,</p>
                <div className="grid gap-6 max-w-sm">
                  <div>
                    <Label htmlFor="nombreColaborador">Responsable del Servicio Solicitante</Label>
                    <Input
                      id="nombreColaborador"
                      value={formData.nombreColaborador}
                      onChange={(e) => handleInputChange('nombreColaborador', e.target.value)}
                      placeholder="Personal responsable del servicio solicitante"
                    />
                    <p className="text-xs text-gray-500 mt-1">Firma y sello</p>
                  </div>
                </div>
              </section>

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar Solicitud"}
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
