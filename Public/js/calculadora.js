class CalculadoraBasica extends HTMLElement {
    constructor() { 
        super();
        
        // Se crea el Shadow DOM para trabajar con nuestro propio HTML y estilos
        this.shadow = this.attachShadow({ mode: 'open'});

        // Se agrega el HTML y los estilos de Bootstrap dentro del shadow
        this.shadow.innerHTML = `
        <!-- Se importa Bootstrap para estilos -->
        <link rel="stylesheet" href="/public/lib/bootstrap-5.3.6-dist/css/bootstrap.min.css">

        <!-- Contenedor principal de la calculadora -->
        <div class="card p-3 mt4">
            <h4 class="mb-3">Calculadora Básica</h4>

            <!-- Campo para escribir el primer número -->
            <div class="mb-2">
                <input type="number" id="numero1" class="form-control" placeholder="Ingrese el primer número">
            </div>

            <!-- Campo para escribir el segundo número -->
            <div class="mb-2">
                <input type="number" id="numero2" class="form-control" placeholder="Ingrese el segundo número">
            </div>

             <!-- Menú para escoger la operación (suma, resta, etc.) -->
            <div class="mb-2">
                <select id="operacion" class="form-select">
                    <option value="suma">Suma</option>
                    <option value="resta">Resta</option>
                    <option value="multiplicacion">Multiplicación</option>
                    <option value="division">División</option>
                </select>
            </div>

            <!-- Botón para hacer el cálculo -->
            <button id="calcular" class="btn btn-primary w-100">Calcular</button>

            <!-- Aquí se muestra el resultado después del cálculo -->
            <div id="resultado" class="alert alert-info mt-3" role="alert">
                Resulatdo: <span id="valor">---</span>
            </div>

            <!-- Lista para mostrar el historial de cálculos -->
            <ul id="lista-historial" class="list-group mt-3"></ul>
        </div>
        `;

        this.historial = []; // Aquí guardaremos el historial de cálculos
    }

    // Esto se ejecuta cuando el componente ya está en la página
    connectedCallback() {
        // Buscamos el botón y le ponemos un evento para que funcione al hacer clic
        const btn = this.shadow.querySelector('#calcular');
        btn.addEventListener('click', () => this.realizarCalculo())
    }

    // Función para realizar el cálculo
    realizarCalculo() {
        // Se obtienen los datos ingresados
        const n1 = this.shadow.querySelector('#numero1').value;
        const n2 = this.shadow.querySelector('#numero2').value;
        const operacion = this.shadow.querySelector('#operacion').value;
        const resultado = this.shadow.querySelector('#valor');

        // Se convierte los valores a números
        const numero1 = parseFloat(n1);
        const numero2 = parseFloat(n2);

        //  Se verifica si los números son válidos
        if (isNaN(numero1) || isNaN(numero2)) {
            resultado.textContent = "Los datos no son correctos";
            return;
        }

        // Se realiza la operación según lo que se elija
        let res = 0;
        switch (operacion) {
            case "suma":
                res = numero1 + numero2;
                break;
            case "resta":
                res = numero1 - numero2;
                break;
            case "multiplicacion":
                res = numero1 * numero2;
                break;
            case "division":
                if (numero2 === 0) {
                    resultado.textContent = "No se puede dividir entre cero";
                    return;
                } 
                res = numero1 / numero2;
                break;
        }

        resultado.textContent = res.toFixed(2); // Mostramos el resultado con dos decimales

        // Extra: Se envia un  evento personalizado al documento principal con el resultado
        this.dispatchEvent(new CustomEvent('resultado-calculado', {
            detail: { resultado: res },
            bubbles: true, // Permite que el evento suba por el DOM
            composed: true // Permite que el evento atraviese Shadow DOM
        }));

        // Se guarda el resultado en el historial
        const textoOperacion = `${numero1} ${this.simboloOperacion(operacion)} ${numero2} = ${res.toFixed(2)}`;
        this.historial.push(textoOperacion);

        // Se muestra el historial en la consola
        const lista = this.shadow.querySelector('#lista-historial');
        const item = document.createElement('li');
        item.textContent = textoOperacion;
        item.classList.add('list-group-item');
        lista.appendChild(item);
    }

    simboloOperacion(operacion) {
        // Devuelve el símbolo de la operación
        switch (operacion) {
            case "suma": return "+";
            case "resta": return "-";
            case "multiplicacion": return "*";
            case "division": return "/";
            default: return "";
        }
    }

}

// Registramos nuestro nuevo componente con el nombre que usaremos en HTML
customElements.define('calculadora-basica', CalculadoraBasica);