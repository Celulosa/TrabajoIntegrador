import React from 'react';
import {Line} from 'react-chartjs-2';
import '../assets/css/Graphics.css';

function Graphics(props) {
    const data={
        labels:["Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto"],
        datasets:[
            {
            label:"Productos más vendidos",
            fill: false,
            backgroundColor: '#c7b5a7',
            borderColor:'#c7b5a7',
            pointBorderColor:'#c7b5a7)',
            pointBorderWidth:1,
            pointHoverRadius:5,
            pointHoverBackgroundColor:'#c7b5a7',
            pointHoverBorderColor:'#c7b5a7',
            pointRadius: 1,
            pointHitRadius: 10,
            data: [0.17, 19, 156, 357, 565, 1149]
            }
        ]
    }
    return (
        <div className="containerGrafica">
            <Line data={data}/>
        </div>
    );
}

export default Graphics;