function info() {
  return fetch('http://localhost:3040/api/productomasvendido')
  .then(response => response.json())
  .then(data => console.log(data))}

export default info