import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";

const PersonalManagement = () => {
  const { toast } = useToast();

  const [staffList, setStaffList] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state for creating new staff
  const [newStaff, setNewStaff] = useState({
    nombre_completo: "",
    no_empleado: "",
    plaza_nominal: "",
    renglon_presupuestario: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setNewStaff(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearchIBM = async (value: string) => {
    if (value.length < 3) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const { data, error } = await (supabase.rpc as any)('get_personal_info_by_no_empleado', { p_no_empleado: value });
    if (error) {
      setSearchResults([]);
    } else {
      setSearchResults(data || []);
    }
    setSearchLoading(false);
  };

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("personal_info" as any)
        .select("*")
        .order("no_empleado", { ascending: true });
      if (error) {
        console.error("Error fetching personal:", error);
        toast({ title: "Error", description: "Error al cargar personal." });
        setStaffList([]);
      } else {
        console.log("Personal data fetched:", data);
        setStaffList(data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching personal:", err);
      toast({ title: "Error", description: "Error inesperado al cargar personal." });
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async () => {
    if (!newStaff.no_empleado || !newStaff.nombre_completo) {
      toast({ title: "Error", description: "El nombre y número de empleado son obligatorios." });
      return;
    }
    const { data, error } = await supabase
      .from("personal_info" as any)
      .insert([
        {
          no_empleado: newStaff.no_empleado,
          nombre_completo: newStaff.nombre_completo,
          plaza_nominal: newStaff.plaza_nominal || null,
          renglon_presupuestario: newStaff.renglon_presupuestario || null,
        },
      ]);
    if (error) {
      toast({ title: "Error", description: "Error al agregar personal." });
    } else {
      toast({ title: "Éxito", description: "Personal agregado correctamente." });
      setNewStaff({
        nombre_completo: "",
        no_empleado: "",
        plaza_nominal: "",
        renglon_presupuestario: "",
      });
      fetchStaff();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) {
        setIsImporting(false);
        toast({ title: "Error", description: "No se pudo leer el archivo." });
        return;
      }
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      const importedStaff = jsonData.map((row, index) => ({
        id: `imported-${index}`,
        fecha: new Date().toISOString(),
        nombre_completo: row["Nombre"] || "",
        no_empleado: row["No. De Empleado"] ? String(row["No. De Empleado"]) : "",
        plaza_nominal: row["Plaza Nominal"] || "",
        renglon_presupuestario: row["Renglon Presupuestario"] ? String(row["Renglon Presupuestario"]) : "",
      }));

      setStaffList(prev => [...prev, ...importedStaff]);
      setIsImporting(false);
      toast({ title: "Éxito", description: "Archivo Excel importado correctamente." });
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 p-6 relative">
      <h1 className="text-2xl font-bold mb-6">Gestión de Personal</h1>

      <Card className="mb-6 relative z-20">
        <CardHeader>
          <CardTitle>Crear Nuevo Personal</CardTitle>
          <CardDescription>Ingrese los datos para registrar un nuevo colaborador</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <Input
              name="nombre_completo"
              placeholder="Nombre Completo"
              value={newStaff.nombre_completo}
              onChange={handleInputChange}
            />
            <div className="relative">
              <Input
                name="no_empleado"
                placeholder="No. de Empleado"
                value={newStaff.no_empleado}
                onChange={(e) => {
                  handleInputChange(e);
                  handleSearchIBM(e.target.value);
                }}
                autoComplete="off"
                list="ibm-suggestions"
              />
              <datalist id="ibm-suggestions">
                {searchResults.map((item) => (
                  <option key={item.no_empleado} value={item.no_empleado}>
                    {item.nombre_completo} - {item.plaza_nominal}
                  </option>
                ))}
              </datalist>
              {searchLoading && <div className="text-sm text-gray-500 mt-1">Buscando...</div>}
              {searchResults.length > 0 && (
                <div className="border border-gray-300 rounded-md max-h-60 overflow-auto mt-1 bg-white shadow-lg absolute w-full z-30">
                  {searchResults.map((item) => (
                    <div
                      key={item.no_empleado}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setNewStaff(prev => ({
                          ...prev,
                          no_empleado: item.no_empleado,
                          nombre_completo: item.nombre_completo,
                          plaza_nominal: item.plaza_nominal,
                          renglon_presupuestario: item.renglon_presupuestario,
                        }));
                        setSearchResults([]);
                      }}
                    >
                      <div className="font-semibold">{item.no_empleado}</div>
                      <div className="text-sm text-gray-600">{item.nombre_completo}</div>
                      <div className="text-xs text-gray-500">{item.plaza_nominal}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Input
              name="plaza_nominal"
              placeholder="Plaza Nominal"
              value={newStaff.plaza_nominal}
              onChange={handleInputChange}
            />
            <Input
              name="renglon_presupuestario"
              placeholder="Renglón Presupuestario"
              value={newStaff.renglon_presupuestario}
              onChange={handleInputChange}
            />
            <div>
              <Button onClick={handleAddStaff} className="mt-4" variant="default" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Agregar Personal"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cargar Datos de Personal desde Excel</CardTitle>
          <CardDescription>Importar archivo Excel para agregar múltiples registros</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            disabled={isImporting}
            className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100
            "
          />
          {isImporting && (
            <div className="flex items-center space-x-2 text-green-700 mt-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Importando archivo...</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Personal</CardTitle>
          <CardDescription>Personal registrado e importado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>No. Empleado</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Plaza Nominal</TableHead>
                  <TableHead>Renglón Presupuestario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No hay personal registrado
                    </TableCell>
                  </TableRow>
                ) : (
                  staffList.map((staff, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{staff.no_empleado}</TableCell>
                      <TableCell>{staff.nombre_completo}</TableCell>
                      <TableCell>{staff.plaza_nominal}</TableCell>
                      <TableCell>{staff.renglon_presupuestario}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalManagement;
