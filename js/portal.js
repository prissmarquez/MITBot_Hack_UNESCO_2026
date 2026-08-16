const missionData = [
    {
        title: "Viral Plaza",
        file: "mision-plaza-viral.html",
        skill: "Investigate a viral school alert",
    },
    {
        title: "AI Laboratory",
        file: "mision-02-ai-lab.html",
        skill: "Audit an AI-generated answer",
    },
    {
        title: "Visual District",
        file: "mision-03-distrito-visual.html",
        skill: "Restore an image's original context",
    },
    {
        title: "Digital Market",
        file: "mision-04-mercado-digital.html",
        skill: "Detect a persuasive digital scam",
    },
    {
        title: "Citizen Forum",
        file: "mision-05-foro-ciudadano.html",
        skill: "Moderate a harmful conversation",
    },
    {
        title: "Source Tower",
        file: "mision-06-torre-fuentes.html",
        skill: "Build a final evidence case",
    },
];
const recorded = (n) =>
    localStorage.getItem(`milbotMission0${n}Complete`) === "true";
const complete = (n) =>
    Array.from({ length: n }, (_, i) => recorded(i + 1)).every(Boolean);
const unlocked = (n) => n === 1 || complete(n - 1);
const points = (n) =>
    Number(localStorage.getItem(`milbotMission0${n}Score`) || 0);
const grid = document.getElementById("missionGrid");
if (grid)
    grid.innerHTML = missionData
        .map((m, i) => {
            const n = i + 1,
                state = complete(n) ? "complete" : unlocked(n) ? "current" : "locked",
                label = complete(n)
                    ? "Replay mission"
                    : unlocked(n)
                        ? "Start mission"
                        : "Complete previous mission";
            return `<article class="portal-card mission-card ${state}" data-number="0${n}"><span class="portal-tag">${complete(n) ? "✓ COMPLETED" : unlocked(n) ? "AVAILABLE" : "LOCKED"}</span><h2>${m.title}</h2><p>${m.skill}</p><span class="mission-score">${points(n)} / ${n < 4 ? 100 : n === 4 ? 120 : n === 5 ? 150 : 250} POINTS</span><a class="portal-button" href="${m.file}" aria-disabled="${!unlocked(n)}">${label}</a></article>`;
        })
        .join("");
const list = document.getElementById("progressList");
if (list) {
    const completed = missionData.filter((_, i) => complete(i + 1)).length,
        total = missionData.reduce((sum, _, i) => sum + points(i + 1), 0),
        max = [100, 100, 100, 120, 150, 250];
    document.getElementById("totalPoints").textContent = total;
    document.getElementById("completedCount").textContent = `${completed} / 6`;
    document.getElementById("averageScore").textContent = completed
        ? `${Math.round(missionData.reduce((sum, _, i) => sum + (complete(i + 1) ? (points(i + 1) / max[i]) * 100 : 0), 0) / completed)}%`
        : "0%";
    list.innerHTML = missionData
        .map(
            (m, i) =>
                `<div class="progress-row"><span>0${i + 1}</span><div><h3>${m.title}</h3><div class="track"><i style="width:${Math.min(100, (points(i + 1) / max[i]) * 100)}%"></i></div></div><strong class="progress-points">${points(i + 1)} / ${max[i]}</strong></div>`,
        )
        .join("");
}
