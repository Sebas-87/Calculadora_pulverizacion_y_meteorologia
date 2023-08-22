// Función para calcular la cantidad de caldo total.
function calcularCantidadCaldo() {
    const hectareasTotales = parseFloat(document.getElementById("hectareasTotales").value);
    const litrosPorHectarea = parseFloat(document.getElementById("litrosPorHectarea").value);

    if (!hectareasTotales || !litrosPorHectarea) {
        Swal.fire({
            icon: 'warning',
            title: 'Por favor, ingrese valores válidos para las hectáreas totales y los litros por hectárea!',
        })
        return;
    }

    if (hectareasTotales <= 0 || litrosPorHectarea <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Los valores de hectareas y litros deben ser positivos!',
        })
        return;
    }

    const cantidadCaldo = hectareasTotales * litrosPorHectarea;

    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Operación exitosa!',
        showConfirmButton: false,
        timer: 1300
    })

    const caldoContainer = document.getElementById("caldoContainer");
    caldoContainer.innerHTML = `<p><u>Cantidad de Caldo Necesaria</u>: <strong>${cantidadCaldo.toFixed(2)} litros</strong></p>
                                    <p> Para aplicar <strong>${hectareasTotales.toFixed(2)} has</strong></p>`;
}

const tiposFormulacion = {
    "Bolsas hidrosolubles": 1,
    "Polvos mojables (WP)": 2,
    "Granulados dispersables (WG)": 3,
    "Granulados solubles (SG)": 4,
    "Dispersiones oleosas (OD)": 5,
    "Suspensiones concentradas (SC)": 6,
    "Formulaciones (ZC)": 7,
    "Suspensiones de encapsulados (CS)": 8,
    "Suspo-emulsiones (SE)": 9,
    "Emulsiones de aceite en agua (EW)": 10,
    "Concentrados emulsionables (EC)": 11,
    "Concentrados solubles (SL)": 12,
    "Otros adyuvantes como aceites/surfactantes": 13,
    "Micro nutrientes/fertilizantes foliares": 14,
};

let ordenMezcla = 1; // Contador de orden de mezcla

// Función para agregar agroquímicos.
function agregarAgroquimico() {
    const container = document.getElementById("agroquimicosContainer");

    const agroquimicoDiv = document.createElement("div");
    agroquimicoDiv.innerHTML = "<hr>"
    agroquimicoDiv.className = "agroquimico mt-3";

    const nombreInput = document.createElement("input");
    nombreInput.type = "text";
    nombreInput.placeholder = "Nombre del agroquímico";
    nombreInput.className = "form-control mb-1";
    agroquimicoDiv.appendChild(nombreInput);

    const tipoSelect = document.createElement("select");
    tipoSelect.className = "form-select";
    for (const tipo in tiposFormulacion) {
        const option = document.createElement("option");
        option.value = tipo;
        option.textContent = tipo;
        tipoSelect.appendChild(option);
    }
    agroquimicoDiv.appendChild(tipoSelect);

    const cantidadInput = document.createElement("input");
    cantidadInput.type = "number";
    cantidadInput.placeholder = "Cantidad";
    cantidadInput.className = "form-control mt-4 mb-1"
    agroquimicoDiv.appendChild(cantidadInput);

    const unidadSelect = document.createElement("select");
    unidadSelect.id = "unidadDosis";
    unidadSelect.className = "form-select"
    const litrosOption = document.createElement("option");
    litrosOption.value = "litros";
    litrosOption.textContent = "Litros";
    unidadSelect.appendChild(litrosOption);
    const kilogramosOption = document.createElement("option");
    kilogramosOption.value = "kilogramos";
    kilogramosOption.textContent = "Kilogramos";
    unidadSelect.appendChild(kilogramosOption);
    agroquimicoDiv.appendChild(unidadSelect);

    const eliminarButton = document.createElement("button");
    eliminarButton.textContent = "Eliminar";
    eliminarButton.className = "btn btn-danger fw-semibold mt-1"
    eliminarButton.onclick = function () {
        Swal.fire({
            title: 'Confirmar',
            text: '¿Estás seguro de que deseas eliminar este agroquímico?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                agroquimicoDiv.remove(); // Cambio en esta línea para evitar eliminar los cálculos guardados.
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Agroquímico eliminado',
                    showConfirmButton: false,
                    timer: 1300
                });
            }
        });
    };
    agroquimicoDiv.appendChild(eliminarButton);

    container.appendChild(agroquimicoDiv);
}

// Función para el calculo de la pulverización.
function calcularPulverizacion() {
    const hectareasTotales = parseFloat(document.getElementById("hectareasTotales").value);

    if (!hectareasTotales) {
        Swal.fire({
            icon: 'warning',
            title: 'Por favor, ingrese un valor válido!',
        })
        return;
    }

    const agroquimicosDivs = document.querySelectorAll("#agroquimicosContainer .agroquimico");

    const agroquimicos = [];
    for (const agroquimicoDiv of agroquimicosDivs) {
        const agroquimico = {
            nombre: agroquimicoDiv.querySelector("input[type='text']").value,
            formulacion: agroquimicoDiv.querySelector("select").value,
            cantidad: parseFloat(agroquimicoDiv.querySelector("input[type='number']").value),
            unidad: agroquimicoDiv.querySelector("#unidadDosis").value,
        };

        if (agroquimico.cantidad <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Ingrese un valor positivo para el agroquímico: ' + agroquimico.nombre,
            })
            return;
        }

        agroquimicos.push(agroquimico);
    }

    agroquimicos.sort((a, b) => tiposFormulacion[a.formulacion] - tiposFormulacion[b.formulacion]);

    const resultadosContainer = document.getElementById("resultadosContainer");
    resultadosContainer.innerHTML = "";

    for (let i = 0; i < agroquimicos.length; i++) {
        const agroquimico = agroquimicos[i];

        const cantidadTotal = (agroquimico.cantidad * hectareasTotales).toFixed(2);

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Operación exitosa!',
            showConfirmButton: false,
            timer: 1300
        });

        const resultadoDiv = document.createElement("div");
        resultadoDiv.innerHTML = `
        <p><strong>#.Orden de Mezcla en Tanque:</strong> ${ordenMezcla++}</p>
        <p><strong>#.Agroquímico:</strong> ${agroquimico.nombre}</p>
        <p><strong>#.Formulación:</strong> ${agroquimico.formulacion}</p>
        <p><strong>#.Cantidad total:</strong> ${cantidadTotal.replace('.', ',')} ${agroquimico.unidad}</p>
        <hr>
      `;
        resultadosContainer.appendChild(resultadoDiv);
    }
}

// Función para guardar los datos.
function guardarPulverizacion() {
    const cantidadCaldo = document.getElementById("caldoContainer").innerHTML;
    const resultadosPulverizacion = document.getElementById("resultadosContainer").innerHTML;

    localStorage.setItem("cantidadCaldo", cantidadCaldo);
    localStorage.setItem("resultadoPulverizacion", resultadosPulverizacion);

    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cálculo guardado correctamente.',
        showConfirmButton: false,
        timer: 1250
    })
}

// Función para resetaer datos de pantalla.
function resetearCalculador() {
    Swal.fire({
        icon: "warning",
        title: "Confirmar reinicio",
        text: "¿Estás seguro de que deseas reiniciar la calculadora?",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Restablecer valores de la calculadora
            document.getElementById("hectareasTotales").value = "";
            document.getElementById("litrosPorHectarea").value = "";

            const agroquimicosDivs = document.querySelectorAll("#agroquimicosContainer .agroquimico");
            for (const agroquimicoDiv of agroquimicosDivs) {
                const inputsInsideDiv = agroquimicoDiv.querySelectorAll('input');
                inputsInsideDiv.forEach(input => {
                    if (input.type === 'text' || input.type === 'number') {
                        input.value = '';
                    }
                });
            }

            ordenMezcla = 1;

            const caldoContainer = document.getElementById("caldoContainer");
            caldoContainer.innerHTML = ""; // Limpiar resultados de la pantalla

            const resultadosContainer = document.getElementById("resultadosContainer");
            resultadosContainer.innerHTML = ""; // Limpiar resultados de la pantalla

            Swal.fire("Reinicio completo", "", "success");
        }
    });
}

// Función para recuperar los datos guardados en la memoria.
function recuperarPulverizacionGuardada() {
    Swal.fire({
        title: 'Mostrar pulverización guardada',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar!'
    }).then((result) => {
        if (result.isConfirmed) {
            const cantidadCaldoGuardada = localStorage.getItem("cantidadCaldo");
            const resultadosPulverizacionGuardados = localStorage.getItem("resultadoPulverizacion");

            if (!cantidadCaldoGuardada && !resultadosPulverizacionGuardados) {
                Swal.fire({
                    icon: 'info',
                    title: 'No hay operaciones guardadas',
                });
            } else {
                if (cantidadCaldoGuardada) {
                    document.getElementById("caldoContainer").innerHTML = cantidadCaldoGuardada;
                }

                if (resultadosPulverizacionGuardados) {
                    document.getElementById("resultadosContainer").innerHTML = resultadosPulverizacionGuardados;
                }

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Cálculo recuperado!',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        }
    });
}

// Función para borrar los datos guardados en la memoria.
function borrarLoGuardado() {
    Swal.fire({
        title: '¿Estás seguro de querer borrar los datos?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, borrar!'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear(); // Borra los datos

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se ha borrado correctamente.',
                showConfirmButton: false,
                timer: 2000
            });

            // Actualiza la pantalla para mostrar que los datos se han borrado.
            document.getElementById("caldoContainer").innerHTML = "";
            document.getElementById("resultadosContainer").innerHTML = "";
        }
    });
}

// Función para descargar los resultados
function descargarResultados() {
    const contenidoCaldo = document.getElementById('caldoContainer').textContent;
    const contenidoResultados = document.getElementById('resultadosContainer').textContent;

    const contenidoTotal = `Resultados Caldo:\n${contenidoCaldo}\n\nResultados:\n${contenidoResultados}`;

    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenidoTotal);
    enlaceDescarga.download = 'resultados.txt';
    enlaceDescarga.style.display = 'none';

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
}

// Función para compartir por WhatsApp
function compartirWhatsapp() {
    const contenidoCaldo = document.getElementById('caldoContainer').textContent;
    const contenidoResultados = document.getElementById('resultadosContainer').textContent;

    const contenidoTotal = `Resultados Caldo:\n${contenidoCaldo}\n\nResultados:\n${contenidoResultados}`;

    const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(contenidoTotal)}`;
    window.open(whatsappURL);
}

// Asigna la función de descarga al botón
document.getElementById('descargarButton').addEventListener('click', descargarResultados);

// Asigna la función de compartir en WhatsApp al botón
document.getElementById('compartirWhatsappButton').addEventListener('click', compartirWhatsapp);
