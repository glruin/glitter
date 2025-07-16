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
          <div class="ramo-contenido">
            <div class="ramo-header">
              <span>${ramo.nombre} <span class="icono-apunte" title="Apuntes">❀</span></span>
              <span>${ramo.codigo}</span>
              <span>${ramo.sct} SCT</span>
              <div class="promedio" id="promedio-${ramo.codigo}"></div>
            </div>
            <textarea class="area-apunte" id="nota-${ramo.codigo}" placeholder="Escribe tus apuntes aquí..."></textarea>
          </div>
        `;

        const iconoApunte = ramoDiv.querySelector(".icono-apunte");
        const areaApunte = ramoDiv.querySelector(".area-apunte");
        areaApunte.style.display = "none";

        iconoApunte.addEventListener("click", (e) => {
          e.stopPropagation();
          areaApunte.style.display = areaApunte.style.display === "none" ? "block" : "none";
        });

        areaApunte.addEventListener("input", () => {
          localStorage.setItem(`nota-${ramo.codigo}`, areaApunte.value);
        });

        const textoGuardado = localStorage.getItem(`nota-${ramo.codigo}`);
        if (textoGuardado) {
          areaApunte.value = textoGuardado;
        }

        ramoDiv.addEventListener("click", () => {
          if (!ramoDiv.classList.contains("bloqueado")) {
            ramoDiv.classList.toggle("aprobado");
            guardarEstadoRamo(ramoDiv);
            actualizarEstadoRamos();
          }
        });

        ramosDiv.appendChild(ramoDiv);
      });

      semestreDiv.appendChild(ramosDiv);
      semestreDiv.appendChild(promedioSemestre);
      mallaContainer.appendChild(semestreDiv);
    });
  });

  actualizarEstadoRamos();
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

crearMalla(malla);
