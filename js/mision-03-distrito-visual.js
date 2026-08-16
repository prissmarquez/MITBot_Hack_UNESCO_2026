const screens = [...document.querySelectorAll(".screen")],
    progress = [...document.querySelectorAll(".progress i")];
let score = 0;
function goTo(step) {
    screens.forEach((s) =>
        s.classList.toggle("active", Number(s.dataset.step) === step),
    );
    progress.forEach((p, i) => {
        p.className = i < step ? "done" : i === step ? "active" : "";
    });
    document.getElementById("score").textContent = `${score} / 100`;
    window.scrollTo({ top: 0, behavior: "smooth" });
}
document
    .querySelectorAll("[data-go]")
    .forEach((b) => (b.onclick = () => goTo(Number(b.dataset.go))));
const viewer = document.getElementById("comparisonViewer"),
    canvas = viewer.querySelector(".viewer-canvas"),
    image = document.getElementById("comparisonImage"),
    zoomLabel = viewer.querySelector("[data-zoom-label]");
let scale = 1,
    x = 0,
    y = 0,
    dragging = false,
    startX = 0,
    startY = 0;
function updateViewer() {
    image.style.transform = `translate(${x}px,${y}px) scale(${scale})`;
    zoomLabel.textContent = `${Math.round(scale * 100)}%`;
    canvas.classList.toggle("zoomed", scale > 1);
}
function zoom(delta) {
    scale = Math.min(4, Math.max(1, scale + delta));
    if (scale === 1) x = y = 0;
    updateViewer();
}
viewer.querySelector("[data-zoom-in]").onclick = () => zoom(0.25);
viewer.querySelector("[data-zoom-out]").onclick = () => zoom(-0.25);
viewer.querySelector("[data-reset]").onclick = () => {
    scale = 1;
    x = y = 0;
    updateViewer();
};
canvas.addEventListener(
    "wheel",
    (e) => {
        e.preventDefault();
        zoom(e.deltaY < 0 ? 0.2 : -0.2);
    },
    { passive: false },
);
canvas.addEventListener("pointerdown", (e) => {
    if (scale === 1) return;
    dragging = true;
    startX = e.clientX - x;
    startY = e.clientY - y;
    canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    x = e.clientX - startX;
    y = e.clientY - startY;
    updateViewer();
});
canvas.addEventListener("pointerup", () => (dragging = false));
document.querySelectorAll(".viewer-tab").forEach(
    (tab) =>
    (tab.onclick = () => {
        document
            .querySelectorAll(".viewer-tab")
            .forEach((t) => t.classList.toggle("active", t === tab));
        const a = tab.dataset.image === "a";
        image.src = a ? "../assets/imagen_ia.jpeg" : "../assets/imagen_real.jpg";
        image.alt = a
            ? "Image A showing a wide flooded city with rescue boats"
            : "Image B showing a real flood scene with submerged vehicles";
        scale = 1;
        x = y = 0;
        updateViewer();
    }),
);
const observations = [...document.querySelectorAll(".observation")];
observations.forEach(
    (o) =>
    (o.onclick = () => {
        o.classList.toggle("selected");
        const count = observations.filter((x) =>
            x.classList.contains("selected"),
        ).length;
        document.getElementById("observationCount").textContent =
            `${count} observations recorded${count < 4 ? " · select at least 4" : " · ready to continue"}`;
        document.getElementById("inspectionNext").disabled = count < 4;
    }),
);
document.getElementById("inspectionNext").onclick = () => {
    score = 25;
    goTo(2);
};
function setupQuestion(
    containerId,
    feedbackId,
    nextId,
    correctPoints,
    wrongPoints,
    correctMessage,
    wrongMessage,
) {
    const container = document.getElementById(containerId),
        feedback = document.getElementById(feedbackId),
        next = document.getElementById(nextId);
    container.querySelectorAll(".option").forEach(
        (option) =>
        (option.onclick = () => {
            if (container.dataset.locked) return;
            container.dataset.locked = "true";
            const correct = option.dataset.correct === "true";
            container.querySelectorAll(".option").forEach((o) => {
                o.disabled = true;
                if (o.dataset.correct === "true") o.classList.add("correct");
            });
            if (!correct) option.classList.add("wrong");
            score += correct ? correctPoints : wrongPoints;
            feedback.className = "feedback show";
            feedback.innerHTML = correct
                ? `<b>Correct.</b> ${correctMessage}`
                : `<b>Not quite.</b> ${wrongMessage}`;
            next.disabled = false;
            document.getElementById("score").textContent = `${score} / 100`;
        }),
    );
}
setupQuestion(
    "classificationOptions",
    "classificationFeedback",
    "classificationNext",
    35,
    15,
    "Image A is the AI-generated file. The conclusion comes from a pattern of anomalies and known provenance.",
    "The highlighted response identifies the AI-generated file. Compare the small text, vehicles, architecture, and lighting pattern.",
);
document.getElementById("classificationNext").onclick = () => goTo(3);
setupQuestion(
    "evidenceOptions",
    "evidenceFeedback",
    "finishMission",
    40,
    15,
    "Visual artifacts support the investigation, while provenance and independent verification provide stronger confirmation.",
    "A visual anomaly is a clue—not universal proof. Confirm where the file came from and how it was created.",
);
document.getElementById("finishMission").onclick = () => {
    const old = Number(localStorage.getItem("milbotMission03Score") || 0);
    localStorage.setItem("milbotMission03Complete", "true");
    localStorage.setItem("milbotMission03Score", Math.max(old, score));
    document.getElementById("finalScore").textContent = score;
    document.getElementById("accuracy").textContent = `${score}%`;
    goTo(4);
    progress.forEach((p) => (p.className = "done"));
};
updateViewer();
