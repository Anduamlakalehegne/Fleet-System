import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export function VehicleTable({ vehicles, onUpdateStatus }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Vehicle Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle._id}>
              <TableCell>{vehicle.name}</TableCell>
              <TableCell>
                <Box sx={{
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: 
                    vehicle.status === 'Active' ? '#4caf50' : 
                    vehicle.status === 'Maintenance' ? '#ff9800' : '#f44336',
                  color: 'white',
                  textAlign: 'center',
                  width:'30%'
                }}>
                  {vehicle.status}
                </Box>
              </TableCell>
              <TableCell>{new Date(vehicle.lastUpdated).toLocaleString()}</TableCell>
              <TableCell>
                <IconButton onClick={() => onUpdateStatus(vehicle)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

