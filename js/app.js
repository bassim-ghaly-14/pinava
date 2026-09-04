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
    const iframeFallback = document.getElementById("iframeFallback");
    const iframeFallbackLink = document.getElementById("iframeFallbackLink");
    const viewedProjectTitle = document.getElementById("viewedProjectTitle");
    const viewedProjectDesc = document.getElementById("viewedProjectDesc");
    const liveLink = document.getElementById("liveLink");
    const repoLink = document.getElementById("repoLink");
    const viewerCaseStudy = document.getElementById("viewerCaseStudy");

    // Projects data is loaded via js/projects.js — degrade gracefully if it fails
    if (typeof myProjects === "undefined" || !Array.isArray(myProjects)) {
        console.warn("Pinava: project data unavailable. Projects section skipped.");
        return;
    }

    let activeProject = null;
    let lastFocusedElement = null;
    let iframeTimeoutId = null;
    let presenterTimeoutId = null;
    const fallbackFavicon = "assets/favicon.svg";

    // Practical iframe-block detection: if no `load` event within this window,
    // assume the site refuses embedding (X-Frame-Options / CSP) and show fallback.
    const IFRAME_LOAD_TIMEOUT_MS = 12000;

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

    // Render the optional project case study into the viewer modal.
    // Built with DOM APIs + textContent only (no innerHTML with data).
    // Gracefully hides the container when caseStudy is missing or incomplete.
    function renderCaseStudy(caseStudy) {
        if (!viewerCaseStudy) return;

        viewerCaseStudy.innerHTML = "";

        const hasChallenge =
            caseStudy &&
            typeof caseStudy.challenge === "string" &&
            caseStudy.challenge.trim();

        const hasApproach =
            caseStudy &&
            typeof caseStudy.approach === "string" &&
            caseStudy.approach.trim();

        const hasDecisions = Boolean(
            caseStudy &&
            Array.isArray(caseStudy.decisions) &&
            caseStudy.decisions.length > 0 &&
            caseStudy.decisions.every(
                d => typeof d === "string" && d.trim()
            )
        );

        if (!hasChallenge && !hasApproach && !hasDecisions) {
            viewerCaseStudy.hidden = true;
            return;
        }

        viewerCaseStudy.hidden = false;

        const heading = document.createElement("h4");
        heading.className = "case-study-title";
        heading.textContent = "Case Study";
        viewerCaseStudy.appendChild(heading);

        const addBlock = (label, text) => {
            if (!text) return;

            const block = document.createElement("div");
            block.className = "case-study-block";

            const blockHeading = document.createElement("h5");
            blockHeading.className = "case-study-subtitle";
            blockHeading.textContent = label;
            block.appendChild(blockHeading);

            const paragraph = document.createElement("p");
            paragraph.className = "case-study-text";
            paragraph.textContent = text;
            block.appendChild(paragraph);

            viewerCaseStudy.appendChild(block);
        };

        if (hasChallenge) {
            addBlock("Challenge", caseStudy.challenge.trim());
        }

        if (hasApproach) {
            addBlock("Approach", caseStudy.approach.trim());
        }

        if (hasDecisions) {
            const block = document.createElement("div");
            block.className = "case-study-block";

            const blockHeading = document.createElement("h5");
            blockHeading.className = "case-study-subtitle";
            blockHeading.textContent = "Key Decisions";
            block.appendChild(blockHeading);

            const list = document.createElement("ul");
            list.className = "case-study-list";

            caseStudy.decisions.forEach(decision => {
                const item = document.createElement("li");
                item.textContent = decision.trim();
                list.appendChild(item);
            });

            block.appendChild(list);
            viewerCaseStudy.appendChild(block);
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

            if (index === 0) {
                menuItem.classList.add("active-menu-item");
            }

            menuItem.setAttribute(
                "aria-pressed",
                index === 0 ? "true" : "false"
            );

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

        // Prevent overlapping transitions when switching projects quickly
        if (presenterTimeoutId) {
            clearTimeout(presenterTimeoutId);
        }

        glassPresenter.classList.add("slide-fade-transition");
        glassPresenter.style.transition = "none";

        presenterTimeoutId = setTimeout(() => {
            presenterTimeoutId = null;

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

            glassPresenter.style.transition =
                "opacity 0.6s ease, transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";

            glassPresenter.classList.remove("slide-fade-transition");
        }, 50);
    }

    // Connect Primary Click Actions to Launch Modal Viewer
    if (launchShowroomBtn) {
        launchShowroomBtn.addEventListener("click", () => {
            if (activeProject) {
                openProjectInViewer(activeProject, launchShowroomBtn);
            }
        });
    }

    // 3. Mobile Grid Building
    if (mobileGrid) {
        if (!myProjects.length) {
            mobileGrid.innerHTML =
                '<p class="empty-state">No projects to display.</p>';
        } else {
            myProjects.forEach(project => {
                const card = document.createElement("button");

                card.type = "button";
                card.className =
                    "project-card" +
                    (project.featured ? " featured" : "");

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
                        <img
                            src="${project.favicon || fallbackFavicon}"
                            alt=""
                            class="project-card-favicon"
                            width="32"
                            height="32"
                            loading="lazy"
                            onerror="this.onerror=null;this.src='${fallbackFavicon}'"
                        >
                        <span class="project-card-title">${project.title}</span>
                    </div>
                    ${taglineHtml}
                    <p>${project.description.substring(0, 100)}...</p>
                    ${techHtml}
                `;

                card.setAttribute(
                    "aria-label",
                    `View project: ${project.title}`
                );

                card.addEventListener("click", () => {
                    openProjectInViewer(project, card);
                });

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

        iframeLoader.hidden = false;
        iframeFallback.hidden = true;
        projectIframe.style.opacity = "0";

        if (iframeTimeoutId) {
            clearTimeout(iframeTimeoutId);
        }

        // Only the "Explore Project" path loads the live site; no iframe exists until now.
        if (project.liveUrl) {
            projectIframe.title = `${project.title} — live preview`;
            projectIframe.src = project.liveUrl;

            // One-shot practical detection for embedding blocks
            // (X-Frame-Options / CSP frame-ancestors).
            // No polling, no repeated reloads.
            iframeTimeoutId = setTimeout(() => {
                iframeTimeoutId = null;
                iframeLoader.hidden = true;
                iframeFallback.hidden = false;
            }, IFRAME_LOAD_TIMEOUT_MS);
        } else {
            projectIframe.removeAttribute("src");
            iframeLoader.hidden = true;
            iframeFallback.hidden = false;
        }

        viewedProjectTitle.innerText = project.title;
        viewedProjectDesc.innerText = project.description;

        renderCaseStudy(project.caseStudy);

        if (project.liveUrl) {
            liveLink.href = project.liveUrl;
            liveLink.style.display = "";
        } else {
            liveLink.href = "#";
            liveLink.style.display = "none";
        }

        iframeFallbackLink.href = project.liveUrl || "#";

        if (project.repoUrl) {
            repoLink.href = project.repoUrl;
            repoLink.style.display = "";
        } else {
            repoLink.href = "#";
            repoLink.style.display = "none";
        }

        projectIframe.onload = () => {
            if (iframeTimeoutId) {
                clearTimeout(iframeTimeoutId);
                iframeTimeoutId = null;
            }

            iframeLoader.hidden = true;
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

        // Release iframe resources without triggering a navigation to the parent page
        if (iframeTimeoutId) {
            clearTimeout(iframeTimeoutId);
            iframeTimeoutId = null;
        }

        projectIframe.onload = null;
        projectIframe.removeAttribute("src");
        projectIframe.src = "about:blank";
        projectIframe.title = "Project Live Preview";

        iframeLoader.hidden = true;
        iframeFallback.hidden = true;

        if (viewerCaseStudy) {
            viewerCaseStudy.innerHTML = "";
            viewerCaseStudy.hidden = true;
        }

        if (
            lastFocusedElement &&
            typeof lastFocusedElement.focus === "function"
        ) {
            lastFocusedElement.focus();
        }
    }

    if (closeViewer) {
        closeViewer.addEventListener("click", closeProjectViewer);
    }

    if (projectViewer) {
        projectViewer.addEventListener("click", e => {
            if (e.target === projectViewer) {
                closeProjectViewer();
            }
        });
    }

    // Escape to close
    document.addEventListener("keydown", e => {
        if (
            e.key === "Escape" &&
            projectViewer.classList.contains("active")
        ) {
            closeProjectViewer();
        }
    });

    // Focus trap within modal when active
    document.addEventListener("keydown", e => {
        if (
            e.key !== "Tab" ||
            !projectViewer.classList.contains("active")
        ) {
            return;
        }

        const focusableSelectors =
            "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

        const focusable =
            projectViewer.querySelectorAll(focusableSelectors);

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

    // 6. Scroll Reveal with IntersectionObserver
    function initScrollReveal() {
        const revealElements =
            document.querySelectorAll(".reveal, .reveal-stagger");

        if (!("IntersectionObserver" in window)) {
            // Fallback: show all content if IO is unavailable
            revealElements.forEach(el => el.classList.add("revealed"));
            return;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // 7. Navigation Active State
    function initNavActiveState() {
        const sections = document.querySelectorAll("section[id]");
        const navLinks =
            document.querySelectorAll(".header-nav-link[data-nav]");

        if (!sections.length || !navLinks.length) return;

        const navObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;

                    navLinks.forEach(link => {
                        link.classList.toggle(
                            "active",
                            link.dataset.nav === id
                        );
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: "-80px 0px -40% 0px"
        });

        sections.forEach(section => navObserver.observe(section));
    }

    // Boot App Setup
    initSidebarRegistry();
    initScrollReveal();
    initNavActiveState();
});