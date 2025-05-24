
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PatientOrder {
  id?: string;
  fecha: string;
  nombre_completo_paciente: string;
  afiliacion_cui: string;
  no_cama: string;
  servicio: string;
  tipo_dieta: string;
  desayuno: boolean;
  almuerzo: boolean;
  cena: boolean;
  refaccion_am: boolean;
  refaccion_pm: boolean;
  refaccion_nocturna: boolean;
  justificacion: string;
  nombre_solicitante: string;
  nombre_paciente_firma: string;
  created_at?: string;
}

export const usePatientOrders = () => {
  const [orders, setOrders] = useState<PatientOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('patient_food_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patient orders:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las órdenes de pacientes",
          variant: "destructive"
        });
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching patient orders:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las órdenes de pacientes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (orderData: Omit<PatientOrder, 'id' | 'created_at'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('patient_food_orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Error creating patient order:', error);
        toast({
          title: "Error",
          description: "No se pudo guardar la orden del paciente",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Éxito",
        description: "Orden del paciente guardada correctamente"
      });

      await fetchOrders();
      return data;
    } catch (error) {
      console.error('Error creating patient order:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la orden del paciente",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('patient_food_orders')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting patient order:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar la orden del paciente",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Éxito",
        description: "Orden del paciente eliminada correctamente"
      });

      await fetchOrders();
    } catch (error) {
      console.error('Error deleting patient order:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la orden del paciente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    isLoading,
    fetchOrders,
    createOrder,
    deleteOrder
  };
};
