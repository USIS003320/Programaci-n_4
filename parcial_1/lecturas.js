Vue.component('v-select-cliente',VueSelect.VueSelect);
Vue.component('lectura',{
    data:()=>{
        return {
            buscar:'',
            lecturas:[],
            clientes:[],
            lecturas:{
                accion : 'nuevo',
                mostrar_msg : false,
                msg : '',
                cliente: {
                    id: '',
                    label: '',
                },
                idlectura : '',
                fecha: '',
                lanterior: '',
                lactual: '',
                zona: '',
            }
        }
    },
    methods:{
        buscandolectura(){
            this.obtenerlectura(this.buscar);
        },
        eliminarlectura(producto){
            if( confirm(`Esta seguro de eliminar la lectura ${lectura.fecha}?`) ){
                this.lectura.accion = 'eliminar';
                this.lectura.idlectura = lectura.idlectura;
                this.guardarlectura();
            }
            this.nuevalectura();
        },
        modificarlectura(datos){
            this.lectura = JSON.parse(JSON.stringify(datos));
            this.lectura.accion = 'modificar';
        },
        guardarlectura(){
            this.obtenerlectura();
            let lecturas = JSON.parse(localStorage.getItem('lecturas')) || [];
            if(this.lectura.accion=="nuevo"){
                this.lectura.idlectura = generarIdUnicoFecha();
                lecturas.push(this.lectura);
            } else if(this.lectura.accion=="modificar"){
                let index = lecturas.findIndex(lectura=>lectura.idlectura==this.lectura.idlectura);
                lecturas[index] = this.lectura;
            } else if( this.lectura.accion=="eliminar" ){
                let index = lecturas.findIndex(lectura=>lectura.idlectura==this.lectura.idlectura);
                productos.splice(index,1);
            }
            localStorage.setItem('lecturas', JSON.stringify(lecturas));
            this.nuevolectura();
            this.obtenerlectura();
            this.lecura.msg = 'lectura procesado con exito';
        },
        obtenerlectura(valor=''){
            this.lecturas = [];
            let lecturas = JSON.parse(localStorage.getItem('lecturas')) || [];
            this.lecturas = lecturas.filter(lectura=>lectura.fecha.toLowerCase().indexOf(valor.toLowerCase())>-1);

            this.clientes = [];
            let clientes = JSON.parse(localStorage.getItem('Clientes')) || [];
            this.clientes = clientes.map(Clientes=>{
                return {
                    id: cliente.idCliente,
                    label: cliente.codigo,
                }
            });
        },
        nuevolectura(){
            this.lectura.accion = 'nuevo';
            this.lectura.msg = '';
            this.lectura.idlectura = '';
            this.lectura.fecha = '';
            this.lectura.lanterior = '';
            this.lectura.lactual = '';
            this.lectura.zona = '';
        }
    },
    created(){
        this.obtenerlectura();
    },
    template:`
        <div id="appCiente">
            <div class="card text-white" id="carProducto">
                <div class="card-header bg-primary">
                    Registro de Productos

                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carProducto" aria-label="Close"></button>
                </div>
                <div class="card-body text-dark">
                    <form method="post" @submit.prevent="guardarProducto" @reset="nuevoProducto">
                        <div class="row p-1">
                            <div class="col col-md-2">
                                Categoria:
                            </div>
                            <div class="col col-md-3">
                                <v-select-categoria v-model="producto.categoria" 
                                    :options="categorias" placeholder="Seleccione una categoria"/>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el codigo" v-model="producto.codigo" pattern="[0-9]{3,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Nombre:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el nombre" v-model="producto.nombre" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Marca:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese la marca" v-model="producto.marca" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Precio:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el Precio" v-model="producto.precio" pattern="[0-9.]{1,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="producto.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ producto.msg }}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <div class="row m-2">
                            <div class="col col-md-5 text-center">
                                <input class="btn btn-success" type="submit" value="Guardar">
                                <input class="btn btn-warning" type="reset" value="Nuevo">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="card text-white" id="carBuscarProducto">
                <div class="card-header bg-primary">
                    Busqueda de Productos

                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarProducto" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th colspan="6">
                                    Buscar: <input @keyup="buscandoProducto" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>MARCA</th>
                                <th>PRECIO</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in productos" @click='modificarProducto( item )' :key="item.idProducto">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>{{item.marca}}</td>
                                <td>{{item.precio}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="eliminarProducto(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});