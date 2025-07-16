function crearMalla(malla) {
  const mallaContainer = document.getElementById("malla-container");

  malla.forEach(anio => {
    anio.semestres.forEach(semestre => {
      const semestreDiv = document.createElement("div");
      semestreDiv.className = "semestre";

      const tituloAnio = document.createElement("div");
      tituloAnio.className = "anio-titulo";
      tituloAnio.textContent = `Año ${anio.anio}`;

      const tituloSemestre = document.createElement("div");
      tituloSemestre.className = "semestre-titulo";
      tituloSemestre.textContent = `Semestre ${semestre.semestre}`;

      const promedioSemestre = document.createElement("div");
      promedioSemestre.className = "semestre-promedio";
      promedioSemestre.id = `prom-sem-${anio.anio}-${semestre.semestre}`;
      promedioSemestre.textContent = "Prom: -";

      semestreDiv.appendChild(tituloAnio);
      semestreDiv.appendChild(tituloSemestre);

      const ramosDiv = document.createElement("div");
      ramosDiv.className = "ramos";

      tituloSemestre.addEventListener("click", () => {
        const ramos = semestreDiv.querySelectorAll(".ramo:not(.bloqueado)");
        const todosAprobados = Array.from(ramos).every(r => r.classList.contains("aprobado"));
        ramos.forEach(ramo => {
          if (todosAprobados) {
            ramo.classList.remove("aprobado");
          } else {
            ramo.classList.add("aprobado");
          }
          guardarEstadoRamo(ramo);
        });
        actualizarEstadoRamos();
      });

      semestre.ramos.forEach(ramo => {
        const ramoDiv = document.createElement("div");
        ramoDiv.className = "ramo bloqueado";
        ramoDiv.setAttribute("data-codigo", ramo.codigo);
        ramoDiv.setAttribute("data-prereqs", JSON.stringify(ramo.prereqs));
        ramoDiv.setAttribute("data-anio", anio.anio);
        ramoDiv.setAttribute("data-semestre", semestre.semestre);
        ramoDiv.setAttribute("data-sct", ramo.sct);

        ramoDiv.innerHTML = `
          ${ramo.nombre}
          <span>${ramo.codigo}</span>
          <span>${ramo.sct} SCT</span>
          <div class="promedio" id="promedio-${ramo.codigo}"></div>
        `;

        ramoDiv.addEventListener("click", () => {
          if (!ramoDiv.classList.contains("bloqueado")) {
            ramoDiv.classList.toggle("aprobado");
            guardarEstadoRamo(ramoDiv);
            actualizarEstadoRamos();
          }
        });

        ramoDiv.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          const entrada = prompt("Ingresa tus notas con ponderaciones (ej: 6.0:40, 5.5:60):");
          if (entrada) {
            const pares = entrada.split(",").map(n => n.trim().split(":"));
            const notas = pares.map(p => parseFloat(p[0]));
            const pesos = pares.map(p => parseFloat(p[1] || 100));
            const sumaPesos = pesos.reduce((a, b) => a + b, 0);
            const promedio = (notas.reduce((acc, nota, i) => acc + nota * pesos[i], 0) / sumaPesos).toFixed(2);
            const promedioEl = ramoDiv.querySelector(`#promedio-${ramo.codigo}`);
            promedioEl.textContent = `Prom: ${promedio}`;
            guardarNotas(ramo.codigo, pares);
            actualizarPromedioSemestre(anio.anio, semestre.semestre);
            actualizarPromedioGlobal();
          }
        });

        const guardado = JSON.parse(localStorage.getItem(`ramo-${ramo.codigo}`));
        if (guardado) {
          if (guardado.aprobado) ramoDiv.classList.add("aprobado");
          const promedioEl = ramoDiv.querySelector(`#promedio-${ramo.codigo}`);
          if (guardado.notas && guardado.notas.length) {
            const notas = guardado.notas.map(p => parseFloat(p[0]));
            const pesos = guardado.notas.map(p => parseFloat(p[1] || 100));
            const sumaPesos = pesos.reduce((a, b) => a + b, 0);
            const promedio = (notas.reduce((acc, nota, i) => acc + nota * pesos[i], 0) / sumaPesos).toFixed(2);
            promedioEl.textContent = `Prom: ${promedio}`;
          }
        }

        ramosDiv.appendChild(ramoDiv);
      });

      semestreDiv.appendChild(ramosDiv);
      semestreDiv.appendChild(promedioSemestre);
      mallaContainer.appendChild(semestreDiv);

      actualizarPromedioSemestre(anio.anio, semestre.semestre);
    });
  });

  actualizarEstadoRamos();
  mostrarPromedioGlobalContainer();
  actualizarPromedioGlobal();
}

function actualizarEstadoRamos() {
  const todosLosRamos = document.querySelectorAll(".ramo");

  todosLosRamos.forEach(ramo => {
    const prereqs = JSON.parse(ramo.getAttribute("data-prereqs"));
    const aprobados = Array.from(document.querySelectorAll(".ramo.aprobado")).map(r => r.getAttribute("data-codigo"));
    const todosAprobados = prereqs.every(pr => aprobados.includes(pr));

    if (todosAprobados) {
      ramo.classList.remove("bloqueado");
    } else {
      if (!ramo.classList.contains("aprobado")) {
        ramo.classList.add("bloqueado");
      }
    }
  });
}

function guardarEstadoRamo(ramoDiv) {
  const codigo = ramoDiv.getAttribute("data-codigo");
  const aprobado = ramoDiv.classList.contains("aprobado");
  const guardado = JSON.parse(localStorage.getItem(`ramo-${codigo}`)) || {};
  guardado.aprobado = aprobado;
  localStorage.setItem(`ramo-${codigo}`, JSON.stringify(guardado));
}

function guardarNotas(codigo, pares) {
  const guardado = JSON.parse(localStorage.getItem(`ramo-${codigo}`)) || {};
  guardado.notas = pares;
  localStorage.setItem(`ramo-${codigo}`, JSON.stringify(guardado));
}

function actualizarPromedioSemestre(anio, semestre) {
  const ramos = document.querySelectorAll(`.ramo[data-anio='${anio}'][data-semestre='${semestre}']`);
  let suma = 0;
  let totalCreditos = 0;

  ramos.forEach(ramo => {
    const codigo = ramo.getAttribute("data-codigo");
    const sct = parseFloat(ramo.getAttribute("data-sct"));
    const guardado = JSON.parse(localStorage.getItem(`ramo-${codigo}`));
    if (guardado && guardado.notas && guardado.notas.length) {
      const notas = guardado.notas.map(p => parseFloat(p[0]));
      const pesos = guardado.notas.map(p => parseFloat(p[1] || 100));
      const sumaPesos = pesos.reduce((a, b) => a + b, 0);
      const promedio = notas.reduce((acc, nota, i) => acc + nota * pesos[i], 0) / sumaPesos;
      suma += promedio * sct;
      totalCreditos += sct;
    }
  });

  const contenedor = document.getElementById(`prom-sem-${anio}-${semestre}`);
  if (totalCreditos > 0) {
    contenedor.textContent = `Prom Sem: ${(suma / totalCreditos).toFixed(2)}`;
  } else {
    contenedor.textContent = `Prom Sem: -`;
  }
}

function mostrarPromedioGlobalContainer() {
  const globalDiv = document.createElement("div");
  globalDiv.className = "global-promedio";
  globalDiv.id = "global-promedio";
  globalDiv.textContent = "Promedio General: -";
  document.body.appendChild(globalDiv);
}

function actualizarPromedioGlobal() {
  const ramos = document.querySelectorAll(".ramo");
  let suma = 0;
  let totalCreditos = 0;

  ramos.forEach(ramo => {
    const codigo = ramo.getAttribute("data-codigo");
    const sct = parseFloat(ramo.getAttribute("data-sct"));
    const guardado = JSON.parse(localStorage.getItem(`ramo-${codigo}`));
    if (guardado && guardado.notas && guardado.notas.length) {
      const notas = guardado.notas.map(p => parseFloat(p[0]));
      const pesos = guardado.notas.map(p => parseFloat(p[1] || 100));
      const sumaPesos = pesos.reduce((a, b) => a + b, 0);
      const promedio = notas.reduce((acc, nota, i) => acc + nota * pesos[i], 0) / sumaPesos;
      suma += promedio * sct;
      totalCreditos += sct;
    }
  });

  const contenedor = document.getElementById("global-promedio");
  if (totalCreditos > 0) {
    contenedor.textContent = `Promedio General: ${(suma / totalCreditos).toFixed(2)}`;
  } else {
    contenedor.textContent = `Promedio General: -`;
  }
}

crearMalla(malla);
