
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Eye, Edit, Download } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

interface FormRecord {
  id: number;
  type: 'patient' | 'staff';
  status: 'completed' | 'pending';
  fechaCreacion: string;
  nombreCompletoPaciente?: string;
  nombreCompletoPersonal?: string;
  fecha?: Date;
  [key: string]: any;
}

interface FormRecordsSheetProps {
  formType: 'patient' | 'staff';
  onEditRecord: (record: FormRecord) => void;
  onGeneratePDF: (record: FormRecord) => void;
}

const FormRecordsSheet = ({ formType, onEditRecord, onGeneratePDF }: FormRecordsSheetProps) => {
  const [records, setRecords] = useState<FormRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<FormRecord>>({});
  const [uploading, setUploading] = useState(false);

  const storageKey = formType === 'patient' ? 'patientForms' : 'staffForms';
  const formTitle = formType === 'patient' ? 'Formularios de Pacientes' : 'Formularios de Personal';

  useEffect(() => {
    loadRecords();
  }, [formType]);

  const loadRecords = () => {
    const savedRecords = localStorage.getItem(storageKey);
    if (savedRecords) {
      const parsedRecords = JSON.parse(savedRecords);
      setRecords(parsedRecords);
    }
  };

  const saveRecords = (updatedRecords: FormRecord[]) => {
    localStorage.setItem(storageKey, JSON.stringify(updatedRecords));
    setRecords(updatedRecords);
  };

  const getRecordTitle = (record: FormRecord) => {
    return record.nombreCompletoPaciente || record.nombreCompletoPersonal || 'Sin nombre';
  };

  const getRecordSubtitle = (record: FormRecord) => {
    if (record.fecha) {
      return format(new Date(record.fecha), 'dd/MM/yyyy');
    }
    return format(new Date(record.fechaCreacion), 'dd/MM/yyyy HH:mm');
  };

  const completedRecords = records.filter(r => r.status === 'completed');
  const pendingRecords = records.filter(r => r.status === 'pending');

  const handleEdit = (record: FormRecord) => {
    onEditRecord(record);
    setIsOpen(false);
  };

  const handleGeneratePDF = (record: FormRecord) => {
    onGeneratePDF(record);
  };

  const handleInputChange = (field: keyof FormRecord, value: any) => {
    setNewRecord(prev => ({ ...prev, [field]: value }));
  };

  const handleAddRecord = () => {
    if (!newRecord.nombreCompletoPersonal || !newRecord.fechaCreacion) {
      alert('El nombre completo y la fecha son obligatorios');
      return;
    }
    const newId = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1;
    const recordToAdd: FormRecord = {
      id: newId,
      type: formType,
      status: 'pending',
      fechaCreacion: newRecord.fechaCreacion,
      nombreCompletoPersonal: newRecord.nombreCompletoPersonal,
      fecha: newRecord.fecha,
      ...newRecord,
    };
    const updatedRecords = [...records, recordToAdd];
    saveRecords(updatedRecords);
    setNewRecord({});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
      const newRecords: FormRecord[] = jsonData.map((item, index) => {
        const newId = records.length + index + 1;
        return {
          id: newId,
          type: formType,
          status: 'pending',
          fechaCreacion: item.fechaCreacion || new Date().toISOString(),
          nombreCompletoPersonal: item.nombreCompletoPersonal || item.nombre || 'Sin nombre',
          fecha: item.fecha ? new Date(item.fecha) : undefined,
          ...item,
        };
      });
      const updatedRecords = [...records, ...newRecords];
      saveRecords(updatedRecords);
      setUploading(false);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Ver Registros
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>{formTitle}</SheetTitle>
          <SheetDescription>
            Gestiona tus formularios guardados y pendientes
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue="completed" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="completed" className="gap-2">
                Llenados
                <Badge variant="secondary">{completedRecords.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                Pendientes
                <Badge variant="outline">{pendingRecords.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="add" className="gap-2">
                Agregar Personal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="completed" className="mt-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {completedRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay formularios completados
                </div>
              ) : (
                completedRecords.map((record) => (
                  <Card key={record.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{getRecordTitle(record)}</CardTitle>
                          <CardDescription>{getRecordSubtitle(record)}</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          Completado
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="w-3 h-3" />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleGeneratePDF(record)}
                        >
                          <Download className="w-3 h-3" />
                          PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {pendingRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay formularios pendientes
                </div>
              ) : (
                pendingRecords.map((record) => (
                  <Card key={record.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{getRecordTitle(record)}</CardTitle>
                          <CardDescription>{getRecordSubtitle(record)}</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-orange-200 text-orange-700">
                          Pendiente
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleEdit(record)}
                        >
                          <Edit className="w-3 h-3" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleGeneratePDF(record)}
                        >
                          <Download className="w-3 h-3" />
                          PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="add" className="mt-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Agregar Personal Manualmente</CardTitle>
                  <CardDescription>Rellena los datos para agregar un nuevo registro</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre Completo *</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                      value={newRecord.nombreCompletoPersonal || ''}
                      onChange={(e) => handleInputChange('nombreCompletoPersonal', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Creación *</label>
                    <input
                      type="date"
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                      value={newRecord.fechaCreacion ? newRecord.fechaCreacion.slice(0, 10) : ''}
                      onChange={(e) => handleInputChange('fechaCreacion', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cargo</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                      value={newRecord.cargo || ''}
                      onChange={(e) => handleInputChange('cargo', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Servicio</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                      value={newRecord.servicio || ''}
                      onChange={(e) => handleInputChange('servicio', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Dieta</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                      value={newRecord.tipoDieta || ''}
                      onChange={(e) => handleInputChange('tipoDieta', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Justificación</label>
                    <textarea
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                      value={newRecord.justificacion || ''}
                      onChange={(e) => handleInputChange('justificacion', e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddRecord} disabled={uploading}>
                      {uploading ? 'Agregando...' : 'Agregar Registro'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Subir archivo Excel</CardTitle>
                  <CardDescription>Sube un archivo Excel para agregar múltiples registros</CardDescription>
                </CardHeader>
                <CardContent>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FormRecordsSheet;
