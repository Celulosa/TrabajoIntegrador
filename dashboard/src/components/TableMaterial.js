import React from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const StyledTableCell= withStyles(()=>({
    head:{
        color: 'Black',
        background: '#c7b5a7',
        textAlign: 'center'
    },
   body:{
        fontSize: 14,
    },
    }))(TableCell);

function TableMaterial(props) {
    return (
        <TableContainer>
            <Table>
            <TableHead>
            <TableRow>
               <StyledTableCell>Producto</StyledTableCell> 
               <StyledTableCell>Fecha de Creacción</StyledTableCell> 
               <StyledTableCell>Id</StyledTableCell> 
            </TableRow>
            </TableHead>
            <TableBody>
                {props.data.map(elemento=>(
                    <TableRow key={elemento.id}>
                        <TableCell><img src={elemento.imagen} width="35px" height="25px"/>{"  "}{elemento.producto}</TableCell>
                        <TableCell align="center">{elemento.fecha}</TableCell>
                        <TableCell align="center">{elemento.Id}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TableMaterial;