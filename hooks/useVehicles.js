import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../constants';

export default function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/vehicles`);
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const addVehicle = async (newVehicle) => {
    try {
      await axios.post(`${API_URL}/vehicles`, newVehicle);
      await fetchVehicles();
      toast.success("Vehicle added successfully!");
      return true;
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Failed to add vehicle.");
      return false;
    }
  };

  const updateVehicleStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/vehicles/${id}`, { status });
      await fetchVehicles();
      toast.info("Status updated!");
      return true;
    } catch (error) {
      console.error("Error updating vehicle status:", error);
      toast.error("Failed to update status.");
      return false;
    }
  };

  return { vehicles, loading, addVehicle, updateVehicleStatus };
}

