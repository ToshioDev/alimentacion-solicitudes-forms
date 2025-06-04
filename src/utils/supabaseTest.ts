import { supabase } from "@/integrations/supabase/client";

export async function testGetPersonalInfoByNoEmpleado(noEmpleado: string) {
  try {
    const { data, error } = await (supabase.rpc as any)('get_personal_info_by_no_empleado', { p_no_empleado: noEmpleado });

    if (error) {
      console.error("Error al llamar a la función RPC:", error);
      return null;
    }

    console.log("Datos recibidos de la función RPC:", data);
    return data;
  } catch (err) {
    console.error("Error inesperado:", err);
    return null;
  }
}
