      // Definición de objeto y funciones
      const Agroquimico = {
        nombre: "",
        superficie: 0,
        dosis: 0,
        unidad: "",
        cantidadAgroquimicos: 0,
        setNombre: function (nombre) {
            this.nombre = nombre;
        },
        setSuperficie: function (superficie) {
            if (!isNaN(superficie)) {
                this.superficie = superficie;
            }
        },
        setDosis: function (dosis) {
            if (!isNaN(dosis)) {
                this.dosis = dosis;
            }
        },
        setUnidad: function (unidad) {
            this.unidad = unidad;
        },
        calcularCantidadAgroquimicos: function () {
            this.cantidadAgroquimicos = this.superficie * this.dosis;
            if (Number.isInteger(this.cantidadAgroquimicos)) {
                // Si la cantidad es un número entero, no mostramos decimales
                this.cantidadAgroquimicos = this.cantidadAgroquimicos.toFixed(0);
            } else {
                // Si la cantidad tiene decimales, mostramos solo dos decimales
                this.cantidadAgroquimicos = this.cantidadAgroquimicos.toFixed(2);
                // Eliminamos los ceros finales si el tercer decimal es cero
                this.cantidadAgroquimicos = parseFloat(this.cantidadAgroquimicos);
            }
            this.cantidadAgroquimicos += " " + this.unidad;
        },
    };

    let calculosAgroquimicos = []; // Array para almacenar los cálculos de agroquímicos

    function calcularAgroquimicos() {
        let agroquimico = Object.create(Agroquimico);

        let nombreInput = document.getElementById("nombre");
        let superficieInput = document.getElementById("superficie");
        let dosisInput = document.getElementById("dosis");
        let unidadInput = document.getElementById("unidad");

        let nombre = nombreInput.value;
        let superficie = parseFloat(superficieInput.value);
        let dosis = parseFloat(dosisInput.value);
        let unidad = unidadInput.value;

        if (isNaN(superficie) || isNaN(dosis)) {
            alert("Valor(es) ingresado(s) no válido(s). Por favor, ingrese valores numéricos válidos.");
            return;
        }

        agroquimico.setNombre(nombre);
        agroquimico.setSuperficie(superficie);
        agroquimico.setDosis(dosis);
        agroquimico.setUnidad(unidad);
        agroquimico.calcularCantidadAgroquimicos();

        calculosAgroquimicos.push(agroquimico); // Agregar el cálculo al array de calculosAgroquimicos

        // Mostrar el resultado en la consola
        console.log("Cantidad de agroquímicos a utilizar para " + agroquimico.nombre + ": " + agroquimico.cantidadAgroquimicos);

        // Mostrar el resultado en la pantalla
        let resultadosTable = document.getElementById("resultados");
        let newRow = resultadosTable.insertRow(-1);

        let calculoCell = newRow.insertCell(0);
        calculoCell.textContent = calculosAgroquimicos.length;

        let nombreCell = newRow.insertCell(1);
        nombreCell.textContent = agroquimico.nombre;

        let superficieCell = newRow.insertCell(2);
        superficieCell.textContent = agroquimico.superficie;

        let dosisCell = newRow.insertCell(3);
        dosisCell.textContent = agroquimico.dosis;

        let unidadCell = newRow.insertCell(4);
        unidadCell.textContent = agroquimico.unidad;

        let cantidadAgroquimicosCell = newRow.insertCell(5);
        cantidadAgroquimicosCell.textContent = agroquimico.cantidadAgroquimicos;

        let borrarButton = document.createElement("button");
        borrarButton.textContent = "Borrar";
        borrarButton.addEventListener("click", function () {
            let fila = this.parentNode.parentNode;
            fila.parentNode.removeChild(fila);
            calculosAgroquimicos.splice(fila.rowIndex - 1, 1);
        });

        let borrarCell = newRow.insertCell(6);
        borrarCell.appendChild(borrarButton);
    }