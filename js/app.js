document.addEventListener("DOMContentLoaded", () => {
    const geometricMenu = document.getElementById("geometricMenu");
    const mobileGrid = document.getElementById("mobileGrid");
    const glassPresenter = document.getElementById("glassPresenter");

    // Presenter Nodes
    const projectIndex = document.getElementById("projectIndex");
    const projectTitle = document.getElementById("projectTitle");
    const projectTagline = document.getElementById("projectTagline");
    const projectDesc = document.getElementById("projectDesc");
    const projectFavicon = document.getElementById("projectFavicon");
    const techTags = document.getElementById("techTags");
    const launchShowroomBtn = document.getElementById("launchShowroomBtn");

    // Modal Viewer Nodes
    const projectViewer = document.getElementById("projectViewer");
    const closeViewer = document.getElementById("closeViewer");
    const projectIframe = document.getElementById("projectIframe");
    const iframeLoader = document.getElementById("iframeLoader");
    const viewedProjectTitle = document.getElementById("viewedProjectTitle");
    const viewedProjectDesc = document.getElementById("viewedProjectDesc");
    const liveLink = document.getElementById("liveLink");
    const repoLink = document.getElementById("repoLink");

    let activeProject = null;
    let lastFocusedElement = null;
    const fallbackFavicon = "assets/favicon.svg";

    // Safe favicon setter with fallback
    function setFavicon(imgEl, project) {
        if (!imgEl) return;
        imgEl.onerror = function () {
            this.onerror = null;
            this.src = fallbackFavicon;
        };
        if (project && project.favicon) {
            imgEl.src = project.favicon;
        } else {
            imgEl.src = fallbackFavicon;
        }
    }

    // 1. Build Desktop Sidebar Registry Menu
    function initSidebarRegistry() {
        if (!geometricMenu || !myProjects.length) return;
        geometricMenu.innerHTML = "";

        myProjects.forEach((project, index) => {
            const indexString = String(index + 1).padStart(2, "0");

            const menuItem = document.createElement("button");
            menuItem.type = "button";
            menuItem.className = "menu-item";
            if (index === 0) menuItem.classList.add("active-menu-item");
            menuItem.setAttribute("aria-pressed", index === 0 ? "true" : "false");

            menuItem.innerHTML = `
                <span class="menu-item-index">${indexString}</span>
                <span class="menu-item-title">${project.title}</span>
            `;

            menuItem.addEventListener("click", () => {
                if (menuItem.classList.contains("active-menu-item")) return;

                document.querySelectorAll(".menu-item").forEach(item => {
                    item.classList.remove("active-menu-item");
                    item.setAttribute("aria-pressed", "false");
                });
                menuItem.classList.add("active-menu-item");
                menuItem.setAttribute("aria-pressed", "true");

                renderPresenterWithAnimation(project, indexString);
            });

            geometricMenu.appendChild(menuItem);
        });

        if (myProjects.length) {
            renderPresenterWithAnimation(myProjects[0], "01");
        }
    }

    // 2. Presentation render
    function renderPresenterWithAnimation(project, indexString) {
        activeProject = project;

        glassPresenter.classList.add("slide-fade-transition");
        glassPresenter.style.transition = "none";

        setTimeout(() => {
            projectIndex.innerText = indexString;
            projectTitle.innerText = project.title;
            if (projectTagline) {
                projectTagline.innerText = project.tagline || "";
                projectTagline.style.display = project.tagline ? "" : "none";
            }
            projectDesc.innerText = project.description;

            setFavicon(projectFavicon, project);

            techTags.innerHTML = "";
            if (project.techs && project.techs.length) {
                project.techs.forEach(tech => {
                    const tag = document.createElement("span");
                    tag.className = "tech-tag";
                    tag.innerText = tech;
                    techTags.appendChild(tag);
                });
            }

            glassPresenter.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
            glassPresenter.classList.remove("slide-fade-transition");
        }, 50);
    }

    // Connect Primary Click Actions to Launch Modal Viewer
    if (launchShowroomBtn) {
        launchShowroomBtn.addEventListener("click", () => {
            if (activeProject) openProjectInViewer(activeProject, launchShowroomBtn);
        });
    }

    // 3. Mobile Grid Building
    if (mobileGrid) {
        if (!myProjects.length) {
            mobileGrid.innerHTML = '<p class="empty-state">No projects to display.</p>';
        } else {
            myProjects.forEach(project => {
                const card = document.createElement("button");
                card.type = "button";
                card.className = "project-card";

                const taglineHtml = project.tagline
                    ? `<span class="card-tagline">${project.tagline}</span>`
                    : "";

                let techHtml = "";
                if (project.techs && project.techs.length) {
                    const techSpans = project.techs
                        .map(t => `<span class="card-tech-tag">${t}</span>`)
                        .join("");
                    techHtml = `<div class="card-techs">${techSpans}</div>`;
                }

                card.innerHTML = `
                    <div class="project-card-head">
                        <img src="${project.favicon || "assets/favicon.svg"}" alt="" class="project-card-favicon" width="32" height="32">
                        <h3>${project.title}</h3>
                    </div>
                    ${taglineHtml}
                    <p>${project.description.substring(0, 100)}...</p>
                    ${techHtml}
                `;

                card.addEventListener("click", () => openProjectInViewer(project, card));
                mobileGrid.appendChild(card);
            });
        }
    }

    // 4. Open project in viewer modal
    function openProjectInViewer(project, triggerEl) {
        lastFocusedElement = triggerEl || document.activeElement;

        projectViewer.classList.add("active");
        projectViewer.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        iframeLoader.style.display = "block";
        projectIframe.style.opacity = "0";

        projectIframe.src = project.liveUrl || "";
        viewedProjectTitle.innerText = project.title;
        viewedProjectDesc.innerText = project.description;

        if (project.liveUrl) {
            liveLink.href = project.liveUrl;
            liveLink.style.display = "";
        } else {
            liveLink.href = "#";
            liveLink.style.display = "none";
        }

        if (project.repoUrl) {
            repoLink.href = project.repoUrl;
            repoLink.style.display = "";
        } else {
            repoLink.href = "#";
            repoLink.style.display = "none";
        }

        projectIframe.onload = () => {
            iframeLoader.style.display = "none";
            projectIframe.style.transition = "opacity 0.4s ease";
            projectIframe.style.opacity = "1";
        };

        setTimeout(() => {
            closeViewer.focus();
        }, 100);
    }

    // 5. Close modal
    function closeProjectViewer() {
        projectViewer.classList.remove("active");
        projectViewer.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        projectIframe.src = "";

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    }

    if (closeViewer) {
        closeViewer.addEventListener("click", closeProjectViewer);
    }

    if (projectViewer) {
        projectViewer.addEventListener("click", (e) => {
            if (e.target === projectViewer) closeProjectViewer();
        });
    }

    // Escape to close
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && projectViewer.classList.contains("active")) {
            closeProjectViewer();
        }
    });

    // Focus trap within modal when active
    document.addEventListener("keydown", (e) => {
        if (e.key !== "Tab" || !projectViewer.classList.contains("active")) return;

        const focusableSelectors = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
        const focusable = projectViewer.querySelectorAll(focusableSelectors);
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // Boot App Setup
    initSidebarRegistry();
});
