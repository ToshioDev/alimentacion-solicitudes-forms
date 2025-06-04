import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("dashboard");

  const renderContent = () => {
    switch (selected) {
      case "dashboard":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Bienvenido al Panel de Administración</CardTitle>
              <CardDescription>
                Usa la barra lateral para navegar entre las diferentes secciones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aquí puedes administrar las órdenes de alimentación y el personal.
              </p>
            </CardContent>
          </Card>
        );
      case "gestion":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Datos</CardTitle>
              <CardDescription>Accede a la gestión completa de órdenes de alimentación</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="default" onClick={() => navigate('/gestion-datos')}>
                Ir a Gestión de Datos
              </Button>
            </CardContent>
          </Card>
        );
      case "personal":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Personal</CardTitle>
              <CardDescription>Crear y administrar registros de personal</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="default" onClick={() => navigate('/personal')}>
                Ir a Gestión de Personal
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 border-r border-gray-200 flex flex-col">
        <div className="p-4 text-xl font-bold border-b">Panel de Administración</div>
        <nav className="flex-1 flex flex-col p-2 space-y-1">
          <button
            className={`text-left px-4 py-2 rounded-md ${selected === "dashboard" ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`}
            onClick={() => setSelected("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`text-left px-4 py-2 rounded-md ${selected === "gestion" ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`}
            onClick={() => setSelected("gestion")}
          >
            Gestión de Datos
          </button>
          <button
            className={`text-left px-4 py-2 rounded-md ${selected === "personal" ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`}
            onClick={() => setSelected("personal")}
          >
            Gestión de Personal
          </button>
        </nav>
        <div className="p-4 text-sm text-muted-foreground border-t">© 2025 IGSS</div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <ScrollArea className="h-full">{renderContent()}</ScrollArea>
      </main>
    </div>
  );
};

export default Admin;
