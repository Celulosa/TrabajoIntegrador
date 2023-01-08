const fetch = require("node-fetch");

let cartNumber = document.querySelector('.cart_number'); //se usa para cuando al dar click en vaciar carrito todo quede en ceros en la vista cart
let cartTotal = document.querySelector(".cart-total-price")//se usa para cuando al dar click en vaciar carrito todo quede en ceros en la vista cart
let cartRows = document.querySelector('.cartRows')//se usa para cuando al dar click en vaciar carrito todo quede en ceros en la vista cart

function setCarritoVacio() {
  localStorage.removeItem("carrito");//se usa para cuando al dar click en vaciar carrito todo quede en ceros en la vista cart
  cartNumber.innerText = 0;//se usa para cuando al dar click en vaciar carrito todo quede en ceros en la vista cart
  cartTotal.innerText = 0;//se usa para cuando al dar click en vaciar carrito todo quede en ceros en la vista cart
  cartRows.innerHTML = `
    <tr>     
        <td colspan="5"><div class="alert alert-warning my-2 text-center">No tienes products en el carrito</div></td>
    </tr>            
    `;
}
function vaciarCarrito() {
  localStorage.removeItem("carrito");
}

function calcularTotal(products) {
  return products.reduce(
    (acum, product) => (acum += product.precio * product.quantity),
    0
  );
}


let productos = [];

// De la linea 30 a la 35 se usa para remover items del carrito y actualizarlo
let carrito = (JSON.parse(localStorage.getItem('carrito')))
let removeItem = (index) => {
  carrito.splice(index, 1)
  localStorage.setItem("carrito", JSON.stringify(carrito))
  location.href = `/products/cart/`
}

 if(localStorage.carrito){
  
 
 let carrito = (JSON.parse(localStorage.getItem('carrito')))
 carrito.forEach((item, index) => {
  fetch(`/api/product/${item.id}`)
  .then((res) => res.json())
  .then((product)=> {
    if(product){
      cartRows.innerHTML += `
      <tr id="row${index}">
          <th scope="row"> ${index + 1}</th>
          <td> ${product.nombre}</td>
          <td> ${product.precio}</td>
          <td class="text-center"> ${item.quantity}</td>
          <td class="text-center"> ${parseFloat(product.precio * item.quantity,2).toFixed(0)}</td>
          <td><button class="btn btn-danger btn-sm" onclick=removeItem(${index})><i class="fa-sharp fa-solid fa-trash-can"</td>
      </tr>
          `
     //aqui abajo agrego los productos del carrito a la variable productos para poder hacer la suma del precio total desde esta variable
     productos.push({
      producto_id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      quantity: item.quantity
      
     })
     console.log('productos en el carrito', carrito)

    } else{
      //si el producto no está en la base de datos, lo borro del local storage
        carrito.splice(index,1)
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }
    
  

  }).then(() => {
    document.querySelector(".cart-total-price").innerText = `$ ${calcularTotal(productos)}`
  });
 });

  };


  let checkoutCart = document.querySelector('#checkoutCart');
  checkoutCart.onsubmit = (e) => {
    e.preventDefault();
    const formData ={
      orderItems: productos,
      paymentMethod: checkoutCart.paymentMethod.value,
      direccion: checkoutCart.direccion.value,
      total: calcularTotal(productos)
  }
  if(productos.length>0){
fetch("/api/checkout",{
      method: "POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(formData)
    })
    .then((r) => r.json())
    .then((res) => {
    if(res.ok){
      console.log('res',res)
      vaciarCarrito();
      location.href = `/products/pedido/${res.ventas.id}`
      //location.href = `/products/order`
    }
    });
}else{
  alert('No hay productos en el carrito')
}


}
