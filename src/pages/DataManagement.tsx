
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowLeft, Search, Download, Users, FileText, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { generatePatientPDF, generateStaffPDF } from "@/utils/pdfGenerator";
import { usePatientOrders, PatientOrder } from "@/hooks/usePatientOrders";
import { useStaffOrders, StaffOrder } from "@/hooks/useStaffOrders";

const DataManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { 
    orders: patientOrders, 
    isLoading: patientLoading, 
    deleteOrder: deletePatientOrder 
  } = usePatientOrders();

  const { 
    orders: staffOrders, 
    isLoading: staffLoading, 
    deleteOrder: deleteStaffOrder 
  } = useStaffOrders();

  const filteredPatientOrders = patientOrders.filter(order =>
    order.nombre_completo_paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.afiliacion_cui.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.servicio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaffOrders = staffOrders.filter(order =>
    order.nombre_completo_personal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.no_empleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.servicio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMealBadges = (order: PatientOrder | StaffOrder) => {
    const meals = [];
    if (order.desayuno) meals.push("Desayuno");
    if (order.almuerzo) meals.push("Almuerzo");
    if (order.cena) meals.push("Cena");
    if ('refaccion_am' in order && order.refaccion_am) meals.push("Ref. AM");
    if ('refaccion_pm' in order && order.refaccion_pm) meals.push("Ref. PM");
    if (order.refaccion_nocturna) meals.push("Ref. Nocturna");
    return meals;
  };

  const handleGeneratePatientPDF = (order: PatientOrder) => {
    generatePatientPDF({
      fecha: new Date(order.fecha),
      nombreCompletoPaciente: order.nombre_completo_paciente,
      afiliacionCUI: order.afiliacion_cui,
      noCama: order.no_cama,
      servicio: order.servicio,
      tipoDieta: order.tipo_dieta,
      desayuno: order.desayuno,
      almuerzo: order.almuerzo,
      cena: order.cena,
      refaccionAM: order.refaccion_am,
      refaccionPM: order.refaccion_pm,
      refaccionNocturna: order.refaccion_nocturna,
      justificacion: order.justificacion,
      nombreSolicitante: order.nombre_solicitante,
      nombrePacienteFirma: order.nombre_paciente_firma,
    });
  };

  const handleGenerateStaffPDF = (order: StaffOrder) => {
    generateStaffPDF({
      fecha: new Date(order.fecha),
      nombreCompletoPersonal: order.nombre_completo_personal,
      noEmpleado: order.no_empleado,
      servicio: order.servicio,
      cargo: order.cargo,
      tipoDieta: order.tipo_dieta,
      desayuno: order.desayuno,
      almuerzo: order.almuerzo,
      cena: order.cena,
      refaccionNocturna: order.refaccion_nocturna,
      justificacion: order.justificacion,
      nombreSolicitante: order.nombre_solicitante,
      nombreColaborador: order.nombre_colaborador,
      nombreAprobador: order.nombre_aprobador,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Gestión de Datos</h1>
                  <p className="text-sm text-gray-600">Administración de órdenes de alimentación</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/formulario-paciente')} variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Nuevo Paciente
              </Button>
              <Button onClick={() => navigate('/formulario-personal')} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Nuevo Personal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nombre, afiliación/empleado o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Órdenes de Pacientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {patientLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : patientOrders.length}
              </div>
              <p className="text-xs text-muted-foreground">Total registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Órdenes de Personal</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {staffLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : staffOrders.length}
              </div>
              <p className="text-xs text-muted-foreground">Total registradas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tables */}
        <Tabs defaultValue="patients" className="space-y-4">
          <TabsList>
            <TabsTrigger value="patients">Órdenes de Pacientes ({filteredPatientOrders.length})</TabsTrigger>
            <TabsTrigger value="staff">Órdenes de Personal ({filteredStaffOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Órdenes de Alimentación - Pacientes</CardTitle>
                <CardDescription>
                  Listado completo de todas las órdenes registradas para pacientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {patientLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Paciente</TableHead>
                          <TableHead>Afiliación/CUI</TableHead>
                          <TableHead>Cama</TableHead>
                          <TableHead>Servicio</TableHead>
                          <TableHead>Tipo Dieta</TableHead>
                          <TableHead>Tiempos</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPatientOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              {order.fecha ? format(new Date(order.fecha), "dd/MM/yyyy") : "N/A"}
                            </TableCell>
                            <TableCell>{order.nombre_completo_paciente}</TableCell>
                            <TableCell>{order.afiliacion_cui}</TableCell>
                            <TableCell>{order.no_cama || "N/A"}</TableCell>
                            <TableCell>{order.servicio || "N/A"}</TableCell>
                            <TableCell>{order.tipo_dieta || "N/A"}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {getMealBadges(order).map((meal, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {meal}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleGeneratePatientPDF(order)}
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => order.id && deletePatientOrder(order.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredPatientOrders.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No se encontraron órdenes de pacientes
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Órdenes de Alimentación - Personal</CardTitle>
                <CardDescription>
                  Listado completo de todas las órdenes registradas para personal
                </CardDescription>
              </CardHeader>
              <CardContent>
                {staffLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Personal</TableHead>
                          <TableHead>No. Empleado</TableHead>
                          <TableHead>Cargo</TableHead>
                          <TableHead>Servicio</TableHead>
                          <TableHead>Tipo Dieta</TableHead>
                          <TableHead>Tiempos</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStaffOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              {order.fecha ? format(new Date(order.fecha), "dd/MM/yyyy") : "N/A"}
                            </TableCell>
                            <TableCell>{order.nombre_completo_personal}</TableCell>
                            <TableCell>{order.no_empleado}</TableCell>
                            <TableCell>{order.cargo || "N/A"}</TableCell>
                            <TableCell>{order.servicio || "N/A"}</TableCell>
                            <TableCell>{order.tipo_dieta || "N/A"}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {getMealBadges(order).map((meal, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {meal}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleGenerateStaffPDF(order)}
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => order.id && deleteStaffOrder(order.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredStaffOrders.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No se encontraron órdenes de personal
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataManagement;
