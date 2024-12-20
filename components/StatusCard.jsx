import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

export function StatusCard({ title, value, icon, bgColor, color }) {
  return (
    <Paper
      sx={{
        p: 2,
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        color: color,
      }}
    >
      <Box sx={{mr: 2}}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h5">{value}</Typography>
      </Box>
    </Paper>
  );
}

