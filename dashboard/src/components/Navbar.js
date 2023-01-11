import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {AppBar, Toolbar, IconButton, Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles= makeStyles(()=>({
    root:{
        flexGrow: 1
    },
    menuButton:{
        marginRight: '16px'
    },
    title:{
        flexGrow: 1
    },
    imagen:{
        borderRadius: '50%'
    }
    }));
function Navbar() {
    const classes= useStyles();
    return (
        <div className={classes.root}>
            <AppBar position="static" style={{ background: '#5D535E' }} >
                <Toolbar color="#c7b5a7">
                    <IconButton edge="start" className={classes.menuButton} color="#c7b5a7">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ color: 'black', fontWeight: 'bold' }} className={classes.title}>
                       Khalo Store Dashboard
                    </Typography>

                    <IconButton color="#c7b5a7">
                            <img src={require('../assets/img/LogoKhaloStore-03.png')} width="40px" height="40px" className={classes.imagen}/>
                            </IconButton>
                </Toolbar>

            </AppBar>
            
        </div>
    );
}

export default Navbar;