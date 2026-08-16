const zonas = [...document.querySelectorAll(".zona")];

const elementos = {
    puntosTotales: document.getElementById("puntosTotales"),
    progresoTexto: document.getElementById("progresoTexto"),
    progresoBarra: document.getElementById("progresoBarra"),
    panelIcono: document.getElementById("panelIcono"),
    panelEstado: document.getElementById("panelEstado"),
    panelTitulo: document.getElementById("panelTitulo"),
    panelTema: document.getElementById("panelTema"),
    panelDescripcion: document.getElementById("panelDescripcion"),
    panelDificultad: document.getElementById("panelDificultad"),
    panelDuracion: document.getElementById("panelDuracion"),
    panelPuntos: document.getElementById("panelPuntos"),
    panelDisponibilidad: document.getElementById("panelDisponibilidad"),
    panelHabilidades: document.getElementById("panelHabilidades"),
    mensajeMilbot: document.getElementById("mensajeMilbot"),
    botonMision: document.getElementById("botonMision"),
    botonReiniciar: document.getElementById("botonReiniciar"),
    aviso: document.getElementById("avisoProximamente"),
    avisoTitulo: document.getElementById("avisoTitulo")
};

const niveles = [
    {
        id: "plaza",
        icono: "⌁",
        titulo: "Viral Plaza",
        tema: "False news and alarming messages",
        descripcion: "A post claims that all classes will be canceled tomorrow because of a storm. Investigate the content before it continues to spread.",
        dificultad: "Beginner",
        duracion: "5 minutes",
        recompensa: 100,
        habilidades: ["Sources", "Context", "Evidence"],
        mensaje: "The fog is thicker in Viral Plaza. Let us begin our investigation there.",
        archivo: "mision-plaza-viral.html",
        claveCompletada: "milbotMission01Complete",
        clavePuntos: "milbotMission01Score"
    },
    {
        id: "laboratorio",
        icono: "⌘",
        titulo: "AI Laboratory",
        tema: "Errors, biases, and fabricated answers",
        descripcion: "Analyze an answer created by artificial intelligence and uncover facts, quotations, and references that may have been fabricated.",
        dificultad: "Intermediate",
        duracion: "7 minutes",
        recompensa: 100,
        habilidades: ["Responsible AI", "Sources", "Bias"],
        mensaje: "Even a clear and convincing answer may contain incorrect information.",
        archivo: "mision-02-ai-lab.html",
        claveCompletada: "milbotMission02Complete",
        clavePuntos: "milbotMission02Score"
    },
    {
        id: "distrito",
        icono: "◉",
        titulo: "Visual District",
        tema: "Manipulated images and deepfakes",
        descripcion: "Examine photographs and videos to determine whether they were manipulated, generated with AI, or presented out of context.",
        dificultad: "Intermediate",
        duracion: "8 minutes",
        recompensa: 100,
        habilidades: ["Images", "Context", "Deepfakes"],
        mensaje: "An image can be real and still be used to tell a false story.",
        archivo: "mision-03-distrito-visual.html",
        claveCompletada: "milbotMission03Complete",
        clavePuntos: "milbotMission03Score"
    },
    {
        id: "mercado",
        icono: "◇",
        titulo: "Digital Market",
        tema: "Scams, prizes, and fake offers",
        descripcion: "Investigate an offer that seems too good to be true and protect the personal data of Infopolis residents.",
        dificultad: "Intermediate",
        duracion: "6 minutes",
        recompensa: 120,
        habilidades: ["Privacy", "Scams", "Security"],
        mensaje: "This district will open after the previous mission and its content are ready.",
        archivo: "mision-04-mercado-digital.html",
        claveCompletada: "milbotMission04Complete",
        clavePuntos: "milbotMission04Score"
    },
    {
        id: "foro",
        icono: "◌",
        titulo: "Citizen Forum",
        tema: "Hate speech and responsible participation",
        descripcion: "Decide how to respond to harmful content without escalating conflict or attacking other users.",
        dificultad: "Advanced",
        duracion: "8 minutes",
        recompensa: 150,
        habilidades: ["Empathy", "Dialogue", "Citizenship"],
        mensaje: "Complete every previous level to continue along the route.",
        archivo: "mision-05-foro-ciudadano.html",
        claveCompletada: "milbotMission05Complete",
        clavePuntos: "milbotMission05Score"
    },
    {
        id: "torre",
        icono: "♜",
        titulo: "Source Tower",
        tema: "Advanced information verification",
        descripcion: "A final mission that combines all the investigation skills learned throughout Infopolis.",
        dificultad: "Advanced",
        duracion: "12 minutes",
        recompensa: 250,
        habilidades: ["Investigation", "Comparison", "Decision"],
        mensaje: "The final challenge unlocks after all previous districts are complete.",
        archivo: "mision-06-torre-fuentes.html",
        claveCompletada: "milbotMission06Complete",
        clavePuntos: "milbotMission06Score"
    }
];

const VERSION_PROGRESO = "2";

function inicializarProgreso() {
    if (localStorage.getItem("milbotProgressVersion") === VERSION_PROGRESO) return;

    niveles.forEach(nivel => {
        localStorage.removeItem(nivel.claveCompletada);
        localStorage.removeItem(nivel.clavePuntos);
    });

    localStorage.setItem("milbotProgressVersion", VERSION_PROGRESO);
}

let nivelSeleccionado = niveles[0];
let temporizadorAviso;

function tieneRegistroCompletado(nivel) {
    return localStorage.getItem(nivel.claveCompletada) === "true";
}

function estaCompletado(nivel) {
    const indice = niveles.indexOf(nivel);

    return niveles
        .slice(0, indice + 1)
        .every(tieneRegistroCompletado);
}

function estaDesbloqueado(indice) {
    return indice === 0 || estaCompletado(niveles[indice - 1]);
}

function puntosDe(nivel) {
    const puntos = Number(localStorage.getItem(nivel.clavePuntos) || 0);
    return Number.isFinite(puntos) ? Math.max(0, puntos) : 0;
}

function estadoDe(nivel, indice) {
    if (estaCompletado(nivel)) return "COMPLETED";
    if (!estaDesbloqueado(indice)) return "LOCKED";
    if (!nivel.archivo) return "COMING SOON";
    return "MISSION AVAILABLE";
}

function actualizarProgreso() {
    const completados = niveles.filter(estaCompletado).length;
    const puntuacionTotal = niveles.reduce(
        (total, nivel) => total + (estaCompletado(nivel) ? puntosDe(nivel) : 0),
        0
    );

    elementos.puntosTotales.textContent = `${String(puntuacionTotal).padStart(3, "0")} POINTS`;
    elementos.progresoTexto.textContent = `${completados} / ${niveles.length}`;
    elementos.progresoBarra.style.width = `${(completados / niveles.length) * 100}%`;

    zonas.forEach((zona, indice) => {
        const nivel = niveles[indice];
        const estado = estadoDe(nivel, indice);
        const etiqueta = zona.querySelector(".zona-estado");

        zona.classList.toggle("completada", estado === "COMPLETED");
        zona.classList.toggle("disponible", estado === "MISSION AVAILABLE");
        zona.classList.toggle("actual", estado === "MISSION AVAILABLE" && !estaCompletado(nivel));
        zona.classList.toggle("bloqueada", estado === "LOCKED");
        zona.setAttribute("aria-disabled", estado === "LOCKED" ? "true" : "false");
        etiqueta.textContent = estado === "COMPLETED" ? `✓ COMPLETED · ${puntosDe(nivel)} PTS` : estado;
    });
}

function seleccionarZona(nivel) {
    const indice = niveles.indexOf(nivel);
    const estado = estadoDe(nivel, indice);
    nivelSeleccionado = nivel;

    zonas.forEach(zona => zona.classList.toggle("seleccionada", zona.dataset.zona === nivel.id));
    elementos.panelIcono.textContent = nivel.icono;
    elementos.panelEstado.textContent = estado;
    elementos.panelTitulo.textContent = nivel.titulo;
    elementos.panelTema.textContent = nivel.tema;
    elementos.panelDescripcion.textContent = nivel.descripcion;
    elementos.panelDificultad.textContent = nivel.dificultad;
    elementos.panelDuracion.textContent = nivel.duracion;
    elementos.panelPuntos.textContent = estaCompletado(nivel)
        ? `${puntosDe(nivel)} / ${nivel.recompensa} points`
        : `${nivel.recompensa} points`;
    elementos.panelDisponibilidad.textContent = estado === "COMPLETED" ? "Completed" : estado.toLowerCase();
    elementos.mensajeMilbot.textContent = nivel.mensaje;
    elementos.panelHabilidades.replaceChildren(...nivel.habilidades.map(habilidad => {
        const etiqueta = document.createElement("span");
        etiqueta.textContent = habilidad;
        return etiqueta;
    }));

    const sePuedeAbrir = Boolean(nivel.archivo) && estaDesbloqueado(indice);
    elementos.botonMision.disabled = !sePuedeAbrir;
    elementos.botonMision.textContent = sePuedeAbrir
        ? `${estaCompletado(nivel) ? "Replay" : "Enter"} ${nivel.titulo} →`
        : estado === "LOCKED" ? "Complete the previous level" : "Coming soon";
}

function mostrarAviso(texto) {
    clearTimeout(temporizadorAviso);
    elementos.avisoTitulo.textContent = texto;
    elementos.aviso.classList.add("visible");
    temporizadorAviso = setTimeout(() => elementos.aviso.classList.remove("visible"), 3200);
}

zonas.forEach((zona, indice) => {
    zona.addEventListener("click", () => {
        const nivel = niveles[indice];
        const estado = estadoDe(nivel, indice);
        seleccionarZona(nivel);
        if (estado === "LOCKED") mostrarAviso("Complete the previous level first");
        if (estado === "COMING SOON") mostrarAviso(`${nivel.titulo} is coming soon`);
    });
});

elementos.botonMision.addEventListener("click", () => {
    if (nivelSeleccionado.archivo && estaDesbloqueado(niveles.indexOf(nivelSeleccionado))) {
        window.location.href = nivelSeleccionado.archivo;
    }
});

elementos.botonReiniciar.addEventListener("click", () => {
    const confirmar = window.confirm("Restart the entire game? All mission progress and the total score will return to 0.");
    if (!confirmar) return;

    Object.keys(localStorage)
        .filter(clave => clave.startsWith("milbot"))
        .forEach(clave => localStorage.removeItem(clave));

    localStorage.setItem("milbotProgressVersion", VERSION_PROGRESO);

    actualizarProgreso();
    seleccionarZona(niveles[0]);
});

inicializarProgreso();
actualizarProgreso();
const siguienteNivel = niveles.find((nivel, indice) => estaDesbloqueado(indice) && !estaCompletado(nivel)) || niveles[0];
seleccionarZona(siguienteNivel);
