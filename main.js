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
    caldoContainer.innerHTML = `<p>Cantidad de Caldo Necesaria: ${cantidadCaldo.toFixed(2)} litros</p>`;
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

function agregarAgroquimico() {
    const container = document.getElementById("agroquimicosContainer");

    const agroquimicoDiv = document.createElement("div");
    agroquimicoDiv.className = "agroquimico";

    const nombreInput = document.createElement("input");
    nombreInput.type = "text";
    nombreInput.placeholder = "Nombre del agroquímico";
    agroquimicoDiv.appendChild(nombreInput);

    const tipoSelect = document.createElement("select");
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
    agroquimicoDiv.appendChild(cantidadInput);

    const unidadSelect = document.createElement("select");
    unidadSelect.id = "unidadDosis";
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
    eliminarButton.onclick = function () {
        agroquimicoDiv.remove(); // Cambio en esta línea para evitar eliminar los cálculos guardados.
    };
    agroquimicoDiv.appendChild(eliminarButton);

    container.appendChild(agroquimicoDiv);
}

function calcularPulverizacion() {
    const hectareasTotales = parseFloat(document.getElementById("hectareasTotales").value);

    if (!hectareasTotales) {
        Swal.fire({
            icon: 'warning',
            title: 'Por favor, ingrese un valor válido para las hectáreas totales!',
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
        <p><strong>Orden de Mezcla en Tanque:</strong> ${ordenMezcla++}</p>
        <p><strong>Agroquímico:</strong> ${agroquimico.nombre}</p>
        <p><strong>Formulación:</strong> ${agroquimico.formulacion}</p>
        <p><strong>Cantidad total:</strong> ${cantidadTotal.replace('.', ',')} ${agroquimico.unidad}</p>
        <hr>
      `;
        resultadosContainer.appendChild(resultadoDiv);
    }
}

function guardarPulverizacion() {
    const cantidadCaldo = document.getElementById("caldoContainer").innerHTML;
    const resultadosPulverizacion = document.getElementById("resultadosContainer").innerHTML;

    localStorage.setItem("cantidadCaldo", cantidadCaldo);
    localStorage.setItem("resultadoPulverizacion", resultadosPulverizacion);

    Swal.fire({
        title: '¿Estas seguro de querer guardar los datos?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#00FF00',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI, Guardar!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Cálculo guardado correctamente.',
                showConfirmButton: false,
                timer: 1250
            })
        }
    })
}

function recuperarPulverizacionGuardada() {
    const cantidadCaldoGuardada = localStorage.getItem("cantidadCaldo");
    const resultadosPulverizacionGuardados = localStorage.getItem("resultadoPulverizacion");

    if (cantidadCaldoGuardada) {
        document.getElementById("caldoContainer").innerHTML = cantidadCaldoGuardada;
    }

    if (resultadosPulverizacionGuardados) {
        document.getElementById("resultadosContainer").innerHTML = resultadosPulverizacionGuardados;
    }
}

function resetearCalculador() {
    document.getElementById("hectareasTotales").value = "";
    document.getElementById("litrosPorHectarea").value = "";

    const agroquimicosDivs = document.querySelectorAll("#agroquimicosContainer .agroquimico");
    for (const agroquimicoDiv of agroquimicosDivs) {
        document.getElementById("agroquimicosContainer").removeChild(agroquimicoDiv);
    }

    ordenMezcla = 1;

    const caldoContainer = document.getElementById("caldoContainer");
    caldoContainer.innerHTML = ""; // Limpiar resultados de la pantalla

    const resultadosContainer = document.getElementById("resultadosContainer");
    resultadosContainer.innerHTML = ""; // Limpiar resultados de la pantalla
}

function mostrarCalculoGuardado() {
    const cantidadCaldoGuardada = localStorage.getItem("cantidadCaldo");
    const resultadosPulverizacionGuardados = localStorage.getItem("resultadoPulverizacion");

    const calculoGuardadoContainer = document.getElementById("calculoGuardadoContainer");
    calculoGuardadoContainer.innerHTML = "";

    if (cantidadCaldoGuardada) {
        const cantidadCaldoDiv = document.createElement("div");
        cantidadCaldoDiv.innerHTML = `<p>Cantidad de Caldo Necesaria (Guardada): ${cantidadCaldoGuardada}</p>`;
        calculoGuardadoContainer.appendChild(cantidadCaldoDiv);
    }

    if (resultadosPulverizacionGuardados) {
        const resultadosPulverizacionDiv = document.createElement("div");
        resultadosPulverizacionDiv.innerHTML = `<p>Resultados de Pulverización (Guardados):</p>${resultadosPulverizacionGuardados}`;
        calculoGuardadoContainer.appendChild(resultadosPulverizacionDiv);
    }
}

// Esta función borra los datos guardados en la memoria.
function borrarLoGuardado() {
    localStorage.clear();

    Swal.fire({
        title: '¿Estas seguro de querer borrar los datos?',
        text: "No sera posible despues de esta accion recuperar los datos!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI, borrar!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se ha borrado correctamente.',
                showConfirmButton: false,
                timer: 2000
            })
        }
    })

    // Actualiza la pantalla para mostrar que los datos se han borrado.
    document.getElementById("caldoContainer").innerHTML = "";
    document.getElementById("resultadosContainer").innerHTML = "";
}
