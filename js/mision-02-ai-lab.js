const panels = [...document.querySelectorAll(".audit-panel")];
const progressItems = [...document.querySelectorAll(".audit-progress > span")];
let score = 0;
let currentStep = 0;

function updateScore() {
    document.getElementById("score").textContent = `${score} / 100`;
}

function goTo(step) {
    currentStep = step;
    panels.forEach(panel => panel.classList.toggle("active", Number(panel.dataset.step) === step));
    progressItems.forEach((item, index) => {
        item.classList.toggle("done", index < step);
        item.classList.toggle("current", index === step);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function addPoints(points) {
    score += points;
    updateScore();
}

const hotspots = [...document.querySelectorAll(".hotspot")];
const scanSubmit = document.getElementById("scanSubmit");

hotspots.forEach(hotspot => {
    hotspot.addEventListener("click", () => {
        hotspot.classList.toggle("selected");
        const selected = hotspots.filter(item => item.classList.contains("selected")).length;
        document.getElementById("scanCount").textContent = `${selected} / 3`;
        scanSubmit.disabled = selected !== 3;
    });
});

scanSubmit.addEventListener("click", () => {
    hotspots.forEach(item => item.classList.add("confirmed"));
    document.getElementById("scanFeedback").innerHTML = "<b>Risk pattern detected.</b> Absolute language hides uncertainty and missing evidence.";
    scanSubmit.disabled = true;
    scanSubmit.textContent = "Scan complete ✓";
    addPoints(25);
    setTimeout(() => goTo(1), 900);
});

const sourceFiles = [...document.querySelectorAll("[data-source]")];
sourceFiles.forEach(file => {
    file.querySelector(".trace-button").addEventListener("click", event => {
        file.classList.add("checked");
        event.currentTarget.disabled = true;
        event.currentTarget.textContent = "Checked ✓";
        document.getElementById("traceNext").disabled = !sourceFiles.every(source => source.classList.contains("checked"));
    });
});

document.getElementById("traceNext").addEventListener("click", () => {
    addPoints(25);
    goTo(2);
});

const contextChips = [...document.querySelectorAll(".context-chip")];
contextChips.forEach(chip => chip.addEventListener("click", () => chip.classList.toggle("selected")));

document.getElementById("contextSubmit").addEventListener("click", event => {
    const correct = contextChips.filter(chip => chip.dataset.correct === "true");
    const wrong = contextChips.filter(chip => chip.dataset.correct === "false");
    const success = correct.every(chip => chip.classList.contains("selected")) && wrong.every(chip => !chip.classList.contains("selected"));
    const feedback = document.getElementById("contextFeedback");

    if (!success) {
        feedback.innerHTML = "<b>Context still incomplete.</b> Select evidence about the full life cycle and local conditions—not popularity or stronger wording.";
        feedback.className = "tool-feedback show warning";
        return;
    }

    correct.forEach(chip => chip.classList.add("confirmed"));
    feedback.innerHTML = "<b>Balanced context restored.</b> The claim can now be limited and compared responsibly.";
    feedback.className = "tool-feedback show success";
    event.currentTarget.disabled = true;
    addPoints(25);
    setTimeout(() => goTo(3), 900);
});

const workflowCards = [...document.querySelectorAll(".workflow-card")];
const workflowSlots = [...document.querySelectorAll(".workflow-slots span")];
let workflow = [];

function renderWorkflow() {
    workflowSlots.forEach((slot, index) => {
        const card = workflow[index];
        slot.textContent = card ? `${index + 1}. ${card.querySelector("b").textContent}` : String(index + 1);
        slot.classList.toggle("filled", Boolean(card));
    });
    workflowCards.forEach(card => card.disabled = workflow.includes(card));
    document.getElementById("workflowSubmit").disabled = workflow.length !== 3;
}

workflowCards.forEach(card => card.addEventListener("click", () => {
    if (workflow.length < 3) workflow.push(card);
    renderWorkflow();
}));

document.getElementById("workflowReset").addEventListener("click", () => {
    workflow = [];
    document.getElementById("workflowFeedback").className = "tool-feedback";
    renderWorkflow();
});

document.getElementById("workflowSubmit").addEventListener("click", () => {
    const success = workflow.every((card, index) => Number(card.dataset.order) === index + 1);
    const feedback = document.getElementById("workflowFeedback");

    if (!success) {
        feedback.innerHTML = "<b>Workflow out of order.</b> Evidence must be verified before the answer is rewritten or disclosed.";
        feedback.className = "tool-feedback show warning";
        return;
    }

    addPoints(25);
    finishMission();
});

function finishMission() {
    const previous = Number(localStorage.getItem("milbotMission02Score") || 0);
    localStorage.setItem("milbotMission02Complete", "true");
    localStorage.setItem("milbotMission02Score", String(Math.max(previous, score)));
    document.getElementById("finalScore").textContent = score;
    document.getElementById("accuracy").textContent = `${score}%`;
    document.getElementById("resultTitle").textContent = score === 100 ? "AI Evidence Auditor" : "AI Audit Apprentice";
    document.getElementById("resultText").textContent = "You scanned risky language, traced fabricated citations, restored missing context, and repaired the verification workflow.";
    goTo(4);
    progressItems.forEach(item => { item.classList.remove("current"); item.classList.add("done"); });
}

document.getElementById("restartMission").addEventListener("click", () => window.location.reload());

renderWorkflow();
updateScore();
