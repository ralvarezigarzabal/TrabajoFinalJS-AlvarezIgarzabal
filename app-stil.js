
let carritoDeCompras = []

let stockProductos =[]

const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const botonComprar = document.getElementById('comprar')

const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');


$.getJSON('stock-stil.json', function (data) {
     console.log(data)
     data.forEach(elemento => stockProductos.push(elemento))

     mostrarProductos(stockProductos)

   })

class Productos{
    constructor(id,title,price,thumbnail){
        this.id= id;
        this.nombre = title;
        this.precio= price;
        this.img = thumbnail;
    }
}


function mostrarProductos(array){
   $('#contenedor-productos').empty();
    for (const producto of array) {
        let div = document.createElement('div');
        div.innerHTML += `
                    <div class="card h-100 shadow p-3 mb-1 bg-light rounded">
                        <div class="col">  
                            <div class="cards">
                                <div class="card-image">
                                    <img class="img-linea" src=${producto.img}>
                                    <span class="card-title">${producto.nombre}</span>
                                    <a id="boton${producto.id}" class="btn-addToCart"><i class="material-icons">add_shopping_cart</i></a>
                                </div> <br>
                                <div class="card-content">
                                    <p>Color: ${producto.desc}</p>
                                    <p>Precio: $${producto.precio}</p>
                                </div>
                            </div>
                        </div>
                    </div>`
        contenedorProductos.appendChild(div);
        
        let boton = document.getElementById(`boton${producto.id}`)

        boton.addEventListener('click', ()=>{
            agregarAlCarrito(producto.id)
        })
    }
    
}


function agregarAlCarrito(id) {
    let repetido = carritoDeCompras.find(prodR => prodR.id == id);
    if(repetido){
        repetido.cantidad = repetido.cantidad + 1;
        document.getElementById(`cantidad${repetido.id}`).innerHTML = `<p id="cantidad${repetido.id}">cantidad: ${repetido.cantidad}</p>`
        actualizarCarrito()
    }else{
        let productoAgregar = stockProductos.find(prod => prod.id == id);

        carritoDeCompras.push(productoAgregar);

        

        productoAgregar.cantidad = 1;
       
        actualizarCarrito()
        let div = document.createElement('div')
        div.classList.add('productoEnCarrito')
        div.innerHTML = `<p>${productoAgregar.nombre}</p>
                        <p>Precio: ${productoAgregar.precio}</p>
                        <p id="cantidad${productoAgregar.id}">cantidad: ${productoAgregar.cantidad}</p>
                        <button id="eliminar${productoAgregar.id}" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>`
        contenedorCarrito.appendChild(div)
        
        


        let botonEliminar = document.getElementById(`eliminar${productoAgregar.id}`)

        botonEliminar.addEventListener('click', ()=>{
            botonEliminar.parentElement.remove()
            carritoDeCompras = carritoDeCompras.filter(prodE => prodE.id != productoAgregar.id)
            localStorage.setItem('carrito',JSON.stringify(carritoDeCompras))
            actualizarCarrito()
        }) 
    }
     localStorage.setItem('carrito',JSON.stringify(carritoDeCompras))
}


function recuperar() {
    let recuperar = JSON.parse(localStorage.getItem('carrito'))
    if(recuperar){
        recuperar.forEach(el => {
            agregarAlCarrito(el.id)
        });
    }
}

function  actualizarCarrito (){
    contadorCarrito.innerText = carritoDeCompras.reduce((acc, el)=> acc + el.cantidad, 0);
   precioTotal.innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
}

botonComprar.innerHTML= `<button id="finalizar" class="btn btn-success">Comprar</button>`


$('#finalizar').on('click',()=>{
    $.post("https://jsonplaceholder.typicode.com/posts",JSON.stringify(carritoDeCompras), function (data, estado) {
        console.log(data,estado);
        if(estado){
            $('#carrito-contenedor').empty()
            $('#carrito-contenedor').append('<h6>Su pedido ha sido procesado orden N°900204</h6>')

            carritoDeCompras= []
            localStorage.clear()
            actualizarCarrito()
        }

      } )
})
  

