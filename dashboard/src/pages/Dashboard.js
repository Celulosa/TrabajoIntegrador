import React from 'react';
import {Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Navbar from "../components/Navbar";
import 'fontsource-roboto';
import '../assets/css/Dashboard.css';
import YouTubeIcon from '@material-ui/icons/YouTube';
import PublicIcon from '@material-ui/icons/Public';
import VideocamIcon from '@material-ui/icons/Videocam';
import CardsHeader from '../components/CardsHeader';
import Cards from '../components/Cards';
import Graphics from '../components/Graphics';
import TableMaterial from '../components/TableMaterial';
import Api from '../components/Api';

const useStyles= makeStyles(()=>({
root:{
    flexGrow: 1
},
iconos:{
    color: 'white'
},
container:{
    paddingTop: '40px',
    alignItems: 'center'
},
containerGrafica:{
    marginTop: '40px'
},
containerTabla:{
    marginTop: '40px'
}
}));

const data = [
    {
      id:1,
      producto:
        "Cartera Khalo",
      fecha: "1 de ene. 2023",
      Id: 3,
      imagen: require("../assets/img/Khalo2.png")
    },
    {
      id:2,
      producto:
        "Conjunto Primavera",
      fecha: "1 de ene. 2023",
      Id: 1,
      imagen: require("../assets/img/ConjuntoPrimavera.jpeg")
    },
    {
      id:3,
      producto:
          "Top Perla",
        fecha: "1 de ene. 2023",
        Id: 2,
        imagen: require("../assets/img/top-perla1.jpg"),
      },
  ];

function Dashboard(props) {
    const classes= useStyles();
    return (
      <div className={classes.root}>
      <Grid container spacing={3}>

          <Grid item xs={12}>
              <Navbar/>
          </Grid>

          
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
             <CardsHeader icono={<YouTubeIcon className={classes.iconos}/>} titulo="TIENDA" texto="Khalo Store" color="#c7b5a7" font="black"/>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
          <CardsHeader icono={<PublicIcon className={classes.iconos}/>} titulo="PAÍS" texto="Colombia" color="#c7b5a7" font="black"/>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
          <CardsHeader icono={<VideocamIcon className={classes.iconos}/>} titulo="???" texto="85" color="#c7b5a7" font="black"/>
          </Grid>

          <Grid container spacing={1} className={classes.container} xs={12} sm={12} md={6} lg={6} xl={6} >
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Cards titulo="TOTAL VENTAS" texto="50"/>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Cards titulo="VENTAS POR MES" texto="111,092"/>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Cards titulo="TOTAL USUARIOS" texto={Api}/>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Cards titulo="USUARIOS POR MES" texto="12"/>
              </Grid>

              </Grid>

              <Grid item xs={0} sm={0} md={1} lg={1} xl={1}></Grid>

              <Grid item xs={12} sm={12} md={5} lg={5} xl={5} className={classes.containerGrafica}>
                  <Graphics />
              </Grid>


              <Grid item xs={12} className={classes.containerTabla}>
              <TableMaterial data={data}/>
              </Grid>


      </Grid>
  </div>
);
}

export default Dashboard;