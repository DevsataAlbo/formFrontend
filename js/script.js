document.addEventListener('DOMContentLoaded', function() {
    actualizarTabla();

    document.getElementById('formulario').addEventListener('submit', agregarRegistro);
});

function agregarRegistro(e) {
    e.preventDefault();

    const nombre = document.getElementById('txtNombre');
    const edad = document.getElementById('txtEdad');
    const correo = document.getElementById('txtEmail');
    const fecha = document.getElementById('txtFecha');
    const genero = document.getElementById('cboGenero');

    let aux = true;

    if (!/^[a-zA-Z\s]+$/.test(nombre.value)) {
        nombre.classList.add('is-invalid');
        aux = false;
    } else {
        nombre.classList.remove('is-invalid');
    }

    if (!/^\d+$/.test(edad.value)) {
        edad.classList.add('is-invalid');
        aux = false;
    } else {
        edad.classList.remove('is-invalid');
    }

    if (!/^[a-zA-Z0-9._%+-]+@inacapmail\.cl$/.test(correo.value)) {
        correo.classList.add('is-invalid');
        aux = false;
    } else {
        correo.classList.remove('is-invalid');
    }

    if (aux) {
        const persona = {
            id: new Date().getTime(),
            nombre: escapeHTML(nombre.value),
            edad: escapeHTML(edad.value),
            correo: escapeHTML(correo.value),
            fecha: escapeHTML(fecha.value),
            genero: escapeHTML(genero.value)
        };

        let basededatos = JSON.parse(localStorage.getItem('registros')) || [];
        basededatos.push(persona);
        localStorage.setItem('registros', JSON.stringify(basededatos));

        Swal.fire({
            title: "Guardado",
            text: "Información almacenada!",
            icon: "success"
        });

        nombre.value = ''; 
        edad.value = ''; 
        correo.value = ''; 
        fecha.value = ''; 
        genero.value = ''; 

        actualizarTabla();
    } else {
        Swal.fire({
            title: "Error en formulario",
            text: "Por favor, corrige el formulario!",
            icon: "error"
        });
    }
}

function actualizarTabla() {
    const tabla = document.getElementById('tablaRegistros');
    let basededatos = JSON.parse(localStorage.getItem('registros')) || [];
    
    if (basededatos.length === 0) {
        tabla.innerHTML = "<h3 class='text-center mt-5'>No existen registros en la base de datos</h3>";
    } else {
        let contenidoTabla = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Edad</th>
                        <th>Correo</th>
                        <th>Fecha</th>
                        <th>Género</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>`;
        
        basededatos.forEach(persona => {
            contenidoTabla += `
                <tr>
                    <td>${persona.nombre}</td>
                    <td>${persona.edad}</td>
                    <td>${persona.correo}</td>
                    <td>${persona.fecha}</td>
                    <td>${persona.genero}</td>
                    <td>
                        <button class="btn btn-warning" style="background-color: #F6D025;" onclick="editarRegistro(${persona.id})">Editar</button>
                        <button class="btn btn-danger" style="background-color: #E61212;" onclick="borrarRegistro(${persona.id})">Borrar</button>
                    </td>
                </tr>`;
        });

        contenidoTabla += `
                </tbody>
            </table>`;
        
        tabla.innerHTML = contenidoTabla;
    }
}

function borrarRegistro(id) {
    let basededatos = JSON.parse(localStorage.getItem('registros')) || [];
    basededatos = basededatos.filter(persona => persona.id !== id);
    localStorage.setItem('registros', JSON.stringify(basededatos));
    actualizarTabla();
    Swal.fire({
        title: "Borrado",
        text: "Registro eliminado!",
        icon: "success"
    });
}

function editarRegistro(id) {
    let basededatos = JSON.parse(localStorage.getItem('registros')) || [];
    const persona = basededatos.find(persona => persona.id === id);

    if (persona) {
        document.getElementById('txtNombre').value = persona.nombre;
        document.getElementById('txtEdad').value = persona.edad;
        document.getElementById('txtEmail').value = persona.correo;
        document.getElementById('txtFecha').value = persona.fecha;
        document.getElementById('cboGenero').value = persona.genero;

        const formulario = document.getElementById('formulario');
        formulario.removeEventListener('submit', agregarRegistro);
        formulario.addEventListener('submit', function actualizarRegistro(e) {
            e.preventDefault();

            persona.nombre = escapeHTML(document.getElementById('txtNombre').value);
            persona.edad = escapeHTML(document.getElementById('txtEdad').value);
            persona.correo = escapeHTML(document.getElementById('txtEmail').value);
            persona.fecha = escapeHTML(document.getElementById('txtFecha').value);
            persona.genero = escapeHTML(document.getElementById('cboGenero').value);

            const indice = basededatos.findIndex(p => p.id === id);
            basededatos[indice] = persona;
            localStorage.setItem('registros', JSON.stringify(basededatos));
            actualizarTabla();

            Swal.fire({
                title: "Editado",
                text: "Información actualizada!",
                icon: "success"
            });

            formulario.reset();
            formulario.removeEventListener('submit', actualizarRegistro);
            formulario.addEventListener('submit', agregarRegistro);
        }, { once: true });
    }
}

function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
