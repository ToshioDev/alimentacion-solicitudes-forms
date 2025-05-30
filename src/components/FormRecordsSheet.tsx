import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Eye, Edit, Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

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

  const getRecordTitle = (record: FormRecord) => {
    return record.nombreCompletoPaciente || record.nombreCompletoPersonal || 'Sin nombre';
  };

  const getRecordSubtitle = (record: FormRecord) => {
    if (record.fecha) {
      return format(new Date(record.fecha), 'dd/MM/yyyy', { locale: es });
    }
    return format(new Date(record.fechaCreacion), 'dd/MM/yyyy HH:mm', { locale: es });
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="completed" className="gap-2">
                Llenados
                <Badge variant="secondary">{completedRecords.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                Pendientes
                <Badge variant="outline">{pendingRecords.length}</Badge>
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
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FormRecordsSheet;
