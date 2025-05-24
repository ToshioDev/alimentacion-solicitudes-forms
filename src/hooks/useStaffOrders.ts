
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface StaffOrder {
  id?: string;
  fecha: string;
  nombre_completo_personal: string;
  no_empleado: string;
  servicio: string;
  cargo: string;
  tipo_dieta: string;
  desayuno: boolean;
  almuerzo: boolean;
  cena: boolean;
  refaccion_nocturna: boolean;
  justificacion: string;
  nombre_solicitante: string;
  nombre_colaborador: string;
  nombre_aprobador: string;
  created_at?: string;
}

export const useStaffOrders = () => {
  const [orders, setOrders] = useState<StaffOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff_food_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching staff orders:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las órdenes de personal",
          variant: "destructive"
        });
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching staff orders:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las órdenes de personal",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (orderData: Omit<StaffOrder, 'id' | 'created_at'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff_food_orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Error creating staff order:', error);
        toast({
          title: "Error",
          description: "No se pudo guardar la orden del personal",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Éxito",
        description: "Orden del personal guardada correctamente"
      });

      await fetchOrders();
      return data;
    } catch (error) {
      console.error('Error creating staff order:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la orden del personal",
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
        .from('staff_food_orders')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting staff order:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar la orden del personal",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Éxito",
        description: "Orden del personal eliminada correctamente"
      });

      await fetchOrders();
    } catch (error) {
      console.error('Error deleting staff order:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la orden del personal",
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
