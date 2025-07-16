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

        const contenido = document.createElement("div");
        contenido.innerHTML = `
          <span>${ramo.nombre} <span class="icono-apunte" title="Abrir Apuntes">❀</span></span>
          <span>${ramo.codigo}</span>
          <span>${ramo.sct} SCT</span>
          <div class="promedio" id="promedio-${ramo.codigo}"></div>
          <textarea class="area-apunte" id="nota-${ramo.codigo}" placeholder="Escribe tus apuntes aquí..."></textarea>
        `;

        ramoDiv.appendChild(contenido);

        const iconoApunte = contenido.querySelector(".icono-apunte");
        const areaApunte = contenido.querySelector(".area-apunte");
        areaApunte.style.display = "none";

        iconoApunte.addEventListener("click", (e) => {
          e.stopPropagation();
          areaApunte.style.display = areaApunte.style.display === "none" ? "block" : "none";
        });

        areaApunte.addEventListener("input", () => {
          localStorage.setItem(`nota-${ramo.codigo}`, areaApunte.value);
        });

        const guardado = localStorage.getItem(`nota-${ramo.codigo}`);
        if (guardado) {
          areaApunte.value = guardado;
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

crearMalla(malla);
