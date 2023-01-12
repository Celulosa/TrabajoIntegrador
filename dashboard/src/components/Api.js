//import React, {Component} from 'react';
//import PropTypes from 'prop-types';

//class Api extends Component {

//    constructor(props) {
//        super(props);
//        this.state = {
//            Api: ""
//        }
//        
//    }
//
//    apiCall(url, consecuencia) {
//        fetch(url)
//            .then( response => response.json())
//            .then( data => consecuencia(data))
//            .catch ( error => console.log(error))
//    }

//    mostrarApi = (data) => {
//        console.log(data)
//    }

//    componentDidMount() {
//        console.log("Me monte");
//        this.apiCall("https://khalo.onrender.com/api/totalusuarios", this.mostrarApi)
//    }

//    componentDidUpdate() {
//        console.log("Me actualice")
//    }

  //  render() {
//        let contenido;

//        if (this.state.Api == "") {
//            contenido = <p>Cargando...</p>
//        } else {
//            contenido = <p>{this.state.Api}</p>
//        }

//
//        return (
//            <div>
//                {contenido}
//            </div>
//        )
//    }
//}

//export default Api;