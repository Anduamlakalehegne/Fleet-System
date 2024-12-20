import React, { useState, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Grid,
  Typography,
  InputAdornment,
  Menu,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Car, Wrench, AlertCircle, Activity } from 'lucide-react';

import  useVehicles  from '../hooks/useVehicles';
import { StatusCard } from '../components/StatusCard';
import { VehicleTable } from '../components/VehicleTable';
import { STATUS_OPTIONS, FILTER_OPTIONS } from '../constants';

function App() {
  const { vehicles, loading, addVehicle, updateVehicleStatus } = useVehicles();
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [newVehicle, setNewVehicle] = useState({ name: '', status: STATUS_OPTIONS.ACTIVE });
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterStatus, setFilterStatus] = useState(FILTER_OPTIONS.ALL);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle =>
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === FILTER_OPTIONS.ALL || 
       (filterStatus === FILTER_OPTIONS.ACTIVE && vehicle.status === STATUS_OPTIONS.ACTIVE) ||
       (filterStatus === FILTER_OPTIONS.MAINTENANCE && vehicle.status === STATUS_OPTIONS.MAINTENANCE) ||
       (filterStatus === FILTER_OPTIONS.OUT_OF_SERVICE && vehicle.status === STATUS_OPTIONS.OUT_OF_SERVICE))
    );
  }, [vehicles, searchTerm, filterStatus]);

  const statusCounts = useMemo(() => {
    return vehicles.reduce((counts, vehicle) => {
      counts[vehicle.status] = (counts[vehicle.status] || 0) + 1;
      return counts;
    }, {});
  }, [vehicles]);

  const handleAddVehicle = async () => {
    if (await addVehicle(newVehicle)) {
      setOpen(false);
      setNewVehicle({ name: '', status: STATUS_OPTIONS.ACTIVE });
    }
  };

  const handleUpdateOpen = (vehicle) => {
    setSelectedVehicle(vehicle);
    setUpdateOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (await updateVehicleStatus(selectedVehicle._id, selectedVehicle.status)) {
      setUpdateOpen(false);
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (status) => {
    setAnchorEl(null);
    setFilterStatus(status || FILTER_OPTIONS.ALL);
  };

  const cardData = [
    {
      title: 'Total Vehicles',
      value: vehicles.length,
      icon: <Car size={50} />,
      bgColor: '#e3f2fd',
      color: '#1d4ed8',
    },
    {
      title: 'Active Vehicles',
      value: statusCounts[STATUS_OPTIONS.ACTIVE] || 0,
      icon: <Activity size={50} />,
      bgColor: '#e8f5e9',
      color: '#1b5e20',
    },
    {
      title: 'In Maintenance',
      value: statusCounts[STATUS_OPTIONS.MAINTENANCE] || 0,
      icon: <Wrench size={50} />,
      bgColor: '#fff3e0',
      color: '#ff9800',
    },
    {
      title: 'Inactive Vehicles',
      value: statusCounts[STATUS_OPTIONS.OUT_OF_SERVICE] || 0,
      icon: <AlertCircle size={50} />,
      bgColor: '#ffebee',
      color: '#b71c1c',
    },
  ];

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3, fontFamily: 'Arial' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Vehicle Management Dashboard</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add Vehicle
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatusCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Search vehicles..."
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Box>
          <IconButton onClick={handleFilterClick}>
            <FilterListIcon />
          </IconButton>
          <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleFilterClose()}
          >
            {Object.values(FILTER_OPTIONS).map((option) => (
              <MenuItem key={option} onClick={() => handleFilterClose(option)}>{option}</MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      <VehicleTable vehicles={filteredVehicles} onUpdateStatus={handleUpdateOpen} />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Vehicle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Vehicle Name"
            fullWidth
            value={newVehicle.name}
            onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label-add">Status</InputLabel>
            <Select
              labelId="status-label-add"
              id="status-select-add"
              value={newVehicle.status}
              label="Status"
              onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
            >
              {Object.values(STATUS_OPTIONS).map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddVehicle}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)}>
        <DialogTitle>Update Vehicle Status</DialogTitle>
        <DialogContent>
          {selectedVehicle && (
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status-select"
                value={selectedVehicle.status}
                label="Status"
                onChange={(e) => setSelectedVehicle({ ...selectedVehicle, status: e.target.value })}
              >
                {Object.values(STATUS_OPTIONS).map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus}>Update</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
}

export default App;

