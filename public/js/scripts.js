function productosEnElcarrito() {
    return localStorage.carrito ? JSON.parse(localStorage.carrito).length : 0

}

window.addEventListener("load", function () {

    let botonesComprar = document.querySelectorAll('.agregar_carrito');
    let cartNumber = document.querySelector('.cart_number');
    cartNumber.innerText = productosEnElcarrito();
    botonesComprar.forEach((boton) => {
        //escuchar el click   
        boton.addEventListener("click", (e) => {

            if (localStorage.carrito) {

                let carrito = JSON.parse(localStorage.getItem('carrito'));
                //console.log(carrito)
                //***si mi producto esta en el carrito le sumo 1
                //***si no lo agrego con push
                let index = carrito.findIndex((item) => item.id == e.target.dataset.id)// dataset.id viene del html listado de productos o la vista que tenga el boton de agregar producto o comprar
                if (index != -1) {
                    carrito[index].quantity = carrito[index].quantity + 1//le agrego uno cada vez que se agrega el mismo producto
                } else {
                    carrito.push({ id: e.target.dataset.id, quantity: 1 })
                }
                localStorage.setItem('carrito', JSON.stringify(carrito));
            }
            else {
                //let ensayo = [{ id: e.target.dataset.id, quantity: 1 }];
                //localStorage.setItem("carrito", JSON.stringify(ensayo));
                //console.log('estoy en el else de script')
                localStorage.setItem("carrito",JSON.stringify([{ id: e.target.dataset.id, quantity: 1 }]))
            };

        
            cartNumber.innerText = productosEnElcarrito();

        });

    });
   // var today = new Date().toISOString().split('T')[0];
   // document.getElementsByName("cumpleanos")[0].setAttribute('max', today);
});