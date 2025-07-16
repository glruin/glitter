function crearMalla(malla) {
  const contenedor = document.getElementById("malla-container");
  const selectorPomodoro = document.getElementById("selector-pomodoro");

  contenedor.innerHTML = ""; // limpiar

  malla.forEach(anio => {
    anio.semestres.forEach(semestre => {
      const divSemestre = document.createElement("div");
      divSemestre.className = "semestre";

      const divAnio = document.createElement("div");
      divAnio.className = "anio-titulo";
      divAnio.textContent = `Año ${anio.anio}`;

      const divSemestreTitulo = document.createElement("div");
      divSemestreTitulo.className = "semestre-titulo";
      divSemestreTitulo.textContent = `Semestre ${semestre.semestre}`;

      const promSemestre = document.createElement("div");
      promSemestre.className = "semestre-promedio";
      promSemestre.id = `prom-sem-${anio.anio}-${semestre.semestre}`;
      promSemestre.textContent = "Prom: -";

      divSemestre.appendChild(divAnio);
      divSemestre.appendChild(divSemestreTitulo);

      const divRamos = document.createElement("div");
      divRamos.className = "ramos";

      divSemestreTitulo.addEventListener("click", () => {
        const ramosNoBloq = divRamos.querySelectorAll(".ramo:not(.bloqueado)");
        const todosAprobados = Array.from(ramosNoBloq).every(r => r.classList.contains("aprobado"));
        ramosNoBloq.forEach(ramo => {
          if (todosAprobados) ramo.classList.remove("aprobado");
          else ramo.classList.add("aprobado");
          guardarEstadoRamo(ramo);
        });
        actualizarEstadoRamos();
        actualizarPromedios();
      });

      semestre.ramos.forEach(ramo => {
        const divRamo = document.createElement("div");
        divRamo.className = "ramo bloqueado";
        divRamo.dataset.codigo = ramo.codigo;
        divRamo.dataset.prereqs = JSON.stringify(ramo.prereqs);
        divRamo.dataset.anio = anio.anio;
        divRamo.dataset.semestre = semestre.semestre;
        divRamo.dataset.sct = ramo.sct;

const estadoGuardado = JSON.parse(localStorage.getItem(`ramo-${ramo.codigo}`));
if (estadoGuardado?.aprobado) {
  divRamo.classList.add("aprobado");
}
        divRamo.innerHTML = `
          <div class="ramo-contenido">
            <span>${ramo.nombre}</span> <br>
            <small>${ramo.codigo} - ${ramo.sct} SCT</small>
            <div class="promedio" id="promedio-${ramo.codigo}"></div>
            <div class="nota-box" style="display:none;">
              <label>Nota: <input type="number" step="0.1" min="1" max="7" id="nota-${ramo.codigo}" class="nota-input"></label>
            </div>
            <div class="estadistica-box" id="stats-${ramo.codigo}"></div>
          </div>
        `;

        divRamo.addEventListener("click", () => {
          if (!divRamo.classList.contains("bloqueado")) {
            divRamo.classList.toggle("aprobado");
            guardarEstadoRamo(divRamo);
            actualizarEstadoRamos();
            actualizarPromedios();
          }
        });

        divRamo.addEventListener("dblclick", () => {
          const notaBox = divRamo.querySelector(".nota-box");
          notaBox.style.display = notaBox.style.display === "none" ? "block" : "none";
        });

        const inputNota = divRamo.querySelector(".nota-input");
        inputNota.addEventListener("input", () => {
          const val = parseFloat(inputNota.value);
          if (!isNaN(val)) {
            localStorage.setItem(`nota-${ramo.codigo}`, val);
            actualizarPromedios();
          }
        });

        const notaGuardada = localStorage.getItem(`nota-${ramo.codigo}`);
        if (notaGuardada) inputNota.value = notaGuardada;

        divRamos.appendChild(divRamo);

        const option = document.createElement("option");
        option.value = ramo.codigo;
        option.textContent = ramo.nombre;
        selectorPomodoro.appendChild(option);

        actualizarEstadisticasRamo(ramo.codigo);
      });

      divSemestre.appendChild(divRamos);
      divSemestre.appendChild(promSemestre);
      contenedor.appendChild(divSemestre);
    });
  });

  actualizarEstadoRamos();
  actualizarPromedios();
}

function actualizarEstadoRamos() {
  const todosRamos = document.querySelectorAll(".ramo");
  const aprobados = Array.from(document.querySelectorAll(".ramo.aprobado")).map(r => r.dataset.codigo);

  todosRamos.forEach(ramo => {
    const prereqs = JSON.parse(ramo.dataset.prereqs);
    const cumple = prereqs.every(p => aprobados.includes(p));
    if (cumple) ramo.classList.remove("bloqueado");
    else if (!ramo.classList.contains("aprobado")) ramo.classList.add("bloqueado");
  });
}

function guardarEstadoRamo(divRamo) {
  const codigo = divRamo.dataset.codigo;
  const aprobado = divRamo.classList.contains("aprobado");
  const estado = JSON.parse(localStorage.getItem(`ramo-${codigo}`)) || {};
  estado.aprobado = aprobado;
  localStorage.setItem(`ramo-${codigo}`, JSON.stringify(estado));
}

function actualizarPromedios() {
  const semestres = document.querySelectorAll(".semestre");
  let totalNotas = 0;
  let totalSCT = 0;

  semestres.forEach(sem => {
    const ramos = sem.querySelectorAll(".ramo");
    let suma = 0;
    let scts = 0;

    ramos.forEach(ramo => {
      const sct = parseInt(ramo.dataset.sct);
      const codigo = ramo.dataset.codigo;
      const nota = parseFloat(localStorage.getItem(`nota-${codigo}`));
      if (!isNaN(nota)) {
        suma += nota * sct;
        scts += sct;
        totalNotas += nota * sct;
        totalSCT += sct;
      }
    });

    const promElem = sem.querySelector(".semestre-promedio");
    promElem.textContent = scts > 0 ? `Prom: ${(suma / scts).toFixed(2)}` : "Prom: -";
  });

  const globalElem = document.getElementById("promedio-global");
  if (globalElem) {
    globalElem.textContent = totalSCT > 0 ? `Promedio Global: ${(totalNotas / totalSCT).toFixed(2)}` : "Promedio Global: -";
  }
}

function registrarEstudio(codigoRamo, minutosEstudio = 25) {
  const key = `stats-${codigoRamo}`;
  const ahora = new Date();
  const fecha = ahora.toISOString().split("T")[0];
  const stats = JSON.parse(localStorage.getItem(key)) || { sesiones: [], totalMin: 0 };
  stats.sesiones.push({ fecha, minutos: minutosEstudio });
  stats.totalMin += minutosEstudio;
  localStorage.setItem(key, JSON.stringify(stats));
  actualizarEstadisticasRamo(codigoRamo);
}

function actualizarEstadisticasRamo(codigo) {
  const statsBox = document.getElementById(`stats-${codigo}`);
  if (!statsBox) return;
  const stats = JSON.parse(localStorage.getItem(`stats-${codigo}`)) || { sesiones: [], totalMin: 0 };

  const totalHoras = (stats.totalMin / 60).toFixed(2);
  const dias = [...new Set(stats.sesiones.map(s => s.fecha))].length;
  const promDiario = dias > 0 ? (stats.totalMin / dias / 60).toFixed(2) : "0.00";

  statsBox.innerHTML = `
    <small>
      Horas totales: ${totalHoras} <br>
      Sesiones: ${stats.sesiones.length} <br>
      Prom. diario: ${promDiario} h
    </small>
  `;
}

let pomodoroInterval = null;
let tiempoRestante = 25 * 60;
let enMarcha = false;

function iniciarPomodoroGlobal() {
  if (enMarcha) return;
  const codigo = document.getElementById("selector-pomodoro").value;
  if (!codigo) return alert("Selecciona un ramo");
  enMarcha = true;
  pomodoroInterval = setInterval(() => {
    if (tiempoRestante > 0) {
      tiempoRestante--;
      mostrarPomodoroGlobal();
    } else {
      clearInterval(pomodoroInterval);
      alert("¡Pomodoro completado!");
      registrarEstudio(codigo);
      enMarcha = false;
      tiempoRestante = 25 * 60;
      mostrarPomodoroGlobal();
    }
  }, 1000);
}
function pausarPomodoroGlobal() {
  clearInterval(pomodoroInterval);
  enMarcha = false;
}
function reiniciarPomodoroGlobal() {
  tiempoRestante = 25 * 60;
  mostrarPomodoroGlobal();
}
function mostrarPomodoroGlobal() {
  const min = Math.floor(tiempoRestante / 60).toString().padStart(2, "0");
  const seg = (tiempoRestante % 60).toString().padStart(2, "0");
  document.getElementById("timer-global").textContent = `${min}:${seg}`;
}

crearMalla(malla);
mostrarPomodoroGlobal();
actualizarEstadoRamos();
actualizarPromedios();
