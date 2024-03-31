import { Box } from '@mui/material';
import React from 'react';

interface IMaterialSymbolsProps {
  name: string;
  sx?: any;
}


const MaterialSymbols:React.FC<IMaterialSymbolsProps> = (props:IMaterialSymbolsProps) => {
  return (
    <Box component={"span"} className='material-symbols-outlined select-none' sx={props.sx}>
      {props.name}
    </Box>
  );
};

export {MaterialSymbols};