
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sistema de Gestión de Órdenes de Alimentación
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gestiona eficientemente las órdenes de alimentación para pacientes y personal del IGSS
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Formulario Pacientes */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/formulario-paciente')}>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Orden para Pacientes</CardTitle>
              <CardDescription>
                Formulario SPS-110 para solicitar alimentación de pacientes hospitalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Llenar Formulario</Button>
            </CardContent>
          </Card>

          {/* Formulario Personal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/formulario-personal')}>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Orden para Personal</CardTitle>
              <CardDescription>
                Formulario SPS-110 A para solicitar alimentación de personal del IGSS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Llenar Formulario</Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Características del Sistema</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">✓ Formularios Digitales</h4>
              <p className="text-gray-600">Digitalización completa de los formularios SPS-110 y SPS-110 A</p>
              
              <h4 className="text-lg font-semibold text-gray-900">✓ Acceso Público</h4>
              <p className="text-gray-600">Formularios accesibles sin necesidad de registro o autenticación</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">✓ Generación de PDF</h4>
              <p className="text-gray-600">Genera documentos PDF listos para imprimir y archivar</p>
              
              <h4 className="text-lg font-semibold text-gray-900">✓ Interfaz Intuitiva</h4>
              <p className="text-gray-600">Diseño moderno y fácil de usar para todo el personal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
