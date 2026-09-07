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

    // Mobile viewer Overview tab nodes
    const viewerOverviewTitle = document.getElementById("viewerOverviewTitle");
    const viewerOverviewTagline = document.getElementById("viewerOverviewTagline");
    const viewerOverviewDesc = document.getElementById("viewerOverviewDesc");
    const viewerHighlights = document.getElementById("viewerHighlights");
    const viewerHighlightsBlock = document.getElementById("viewerHighlightsBlock");
    const viewerTechs = document.getElementById("viewerTechs");
    const viewerTechsBlock = document.getElementById("viewerTechsBlock");
    const viewerTabs = Array.from(document.querySelectorAll(".viewer-tab"));

    // Projects data is loaded via js/projects.js — degrade gracefully if it fails
    if (typeof myProjects === "undefined" || !Array.isArray(myProjects)) {
        console.warn("Pinava: project data unavailable. Projects section skipped.");
        return;
    }

    // Featured-first ordering (stable sort preserves original order within
    // each group). All project listings render from this base list.
    const orderedProjects = [...myProjects].sort(
        (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    );

    // Filter state — category is single-select, techs are multi-select (AND).
    const categoryLabels = {
        fullstack: "Fullstack",
        frontend: "Frontend",
        game: "Game"
    };
    let activeFilter = "all";
    let selectedTechs = []; // normalized (lowercased/trimmed) tech keys
    // Assigned by buildTechFilter(); keeps the trigger label/count in sync
    // when filters are cleared from the empty state.
    let updateTechFilterTrigger = null;

    function getVisibleProjects() {
        let list =
            activeFilter === "all"
                ? orderedProjects
                : orderedProjects.filter(p => p.category === activeFilter);

        // Technology filter: a project must contain EVERY selected tech
        // (AND matching). Comparison is case-insensitive; no tech selected
        // means the tech filter is inactive.
        if (selectedTechs.length) {
            list = list.filter(
                p =>
                    Array.isArray(p.techs) &&
                    selectedTechs.every(key =>
                        p.techs.some(
                            t =>
                                typeof t === "string" &&
                                t.trim().toLowerCase() === key
                        )
                    )
            );
        }

        return list;
    }

    // Resets both filters back to the default "everything visible" state.
    function clearAllFilters() {
        activeFilter = "all";
        selectedTechs = [];

        document
            .querySelectorAll("#projectFilters .project-filter-btn")
            .forEach(btn => {
                if (btn.dataset.filter) {
                    btn.setAttribute("aria-pressed", "true");
                }
            });

        document
            .querySelectorAll("#techFilterPanel input[type='checkbox']")
            .forEach(box => {
                box.checked = false;
            });

        updateTechFilterTrigger();

        buildRegistry();
        buildMobileGrid();
    }

    // Shared accessible empty state for desktop registry and mobile grid.
    function buildFiltersEmptyState() {
        const wrap = document.createElement("div");
        wrap.className = "filters-empty-state";

        const msg = document.createElement("p");
        msg.className = "empty-state";
        msg.textContent = "No projects match the selected filters.";

        const clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.className = "project-filter-btn empty-clear-btn";
        clearBtn.textContent = "Clear filters";
        clearBtn.addEventListener("click", clearAllFilters);

        wrap.append(msg, clearBtn);
        return wrap;
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

        if (project?.favicon) {
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
        if (!geometricMenu) return;
        buildRegistry();
    }

    // (Re)builds the registry from the currently filtered project list.
    function buildRegistry() {
        if (!geometricMenu) return;

        const visibleProjects = getVisibleProjects();
        if (!visibleProjects.length) {
            geometricMenu.innerHTML = "";
            geometricMenu.appendChild(buildFiltersEmptyState());
            return;
        }

        geometricMenu.innerHTML = "";

        visibleProjects.forEach((project, index) => {
            const indexString = String(index + 1).padStart(2, "0");

            const menuItem = document.createElement("button");
            menuItem.type = "button";
            menuItem.className =
                "menu-item" + (project.featured ? " featured" : "");

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
                ${project.featured ? '<span class="menu-item-featured" title="Featured project" aria-hidden="true"></span>' : ""}
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

        // Keep the presenter on the active project if it is still visible;
        // otherwise fall back to the first visible project.
        if (!visibleProjects.includes(activeProject)) {
            // Preserve existing fallback: select the first visible project;
            // never render when the filtered list is empty.
            if (visibleProjects.length) {
                renderPresenterWithAnimation(visibleProjects[0], "01");
            }
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

            if (project.techs?.length) {
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
    function initMobileGrid() {
        if (!mobileGrid) return;
        buildMobileGrid();
    }

    // (Re)builds the mobile grid from the currently filtered project list.
    function buildMobileGrid() {
        if (!mobileGrid) return;

        const visibleProjects = getVisibleProjects();

        if (!visibleProjects.length) {
            mobileGrid.innerHTML = "";
            mobileGrid.appendChild(buildFiltersEmptyState());
            return;
        }

        mobileGrid.innerHTML = "";

        visibleProjects.forEach(project => {
            const card = document.createElement("button");

            card.type = "button";
            card.className =
                "project-card" +
                (project.featured ? " featured" : "");

            const taglineHtml = project.tagline
                ? `<span class="card-tagline">${project.tagline}</span>`
                : "";

            const featuredBadgeHtml = project.featured
                ? '<span class="card-featured-badge">Featured</span>'
                : "";

            let techHtml = "";

            if (project.techs?.length) {
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
                    ${featuredBadgeHtml}
                </div>
                ${taglineHtml}
                <p>${project.description.substring(0, 100)}...</p>
                ${techHtml}
            `;

            card.setAttribute(
                "aria-label",
                `View project: ${project.title}` +
                    (project.featured ? " (Featured)" : "")
            );

            card.addEventListener("click", () => {
                openProjectInViewer(project, card);
            });

            mobileGrid.appendChild(card);
        });
    }

    // 3b. Category Filter Bar — single-select, derived from project data.
    function initProjectFilters() {
        const filterBar = document.getElementById("projectFilters");
        if (!filterBar || !myProjects.length) return;

        const filterButtons = [];

        const makeButton = (value, label) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "project-filter-btn";
            btn.dataset.filter = value;
            btn.textContent = label;
            btn.setAttribute(
                "aria-pressed",
                value === activeFilter ? "true" : "false"
            );

            btn.addEventListener("click", () => {
                if (btn.dataset.filter === activeFilter) return;
                selectFilter(btn.dataset.filter);
            });

            filterButtons.push(btn);
            filterBar.appendChild(btn);
        };

        makeButton("all", "All");

        // Derive categories from the actual project data.
        [...new Set(myProjects.map(p => p.category).filter(Boolean))]
            .forEach(category => {
                makeButton(
                    category,
                    categoryLabels[category] || category
                );
            });

        function selectFilter(value) {
            activeFilter = value;

            filterButtons.forEach(btn => {
                btn.setAttribute(
                    "aria-pressed",
                    String(btn.dataset.filter === value)
                );
            });

            // Both listings rebuild from the same featured-first ordered list,
            // so filtering never breaks the featured ordering.
            buildRegistry();
            buildMobileGrid();
        }

        // 3b-2. Tech Stack multi-select — options derived from the actual
        // project.techs arrays (deduplicated case-insensitively, original
        // display labels preserved). Matching is AND across selections.
        function buildTechFilter() {
            const techOptions = [];
            const seenKeys = new Set();

            myProjects.forEach(project => {
                if (!Array.isArray(project.techs)) return;
                project.techs.forEach(tech => {
                    if (typeof tech !== "string" || !tech.trim()) return;
                    const key = tech.trim().toLowerCase();
                    if (seenKeys.has(key)) return;
                    seenKeys.add(key);
                    techOptions.push({ key, label: tech.trim() });
                });
            });

            if (!techOptions.length) return;

            const wrapper = document.createElement("div");
            wrapper.className = "tech-filter";

            const trigger = document.createElement("button");
            trigger.type = "button";
            trigger.className =
                "project-filter-btn tech-filter-trigger";
            trigger.id = "techFilterTrigger";
            trigger.setAttribute("aria-expanded", "false");
            trigger.setAttribute("aria-controls", "techFilterPanel");

            // Label + chevron spans so the CSS-only chevron survives label updates.
            const triggerLabel = document.createElement("span");
            triggerLabel.className = "tech-filter-trigger-label";
            const chevron = document.createElement("span");
            chevron.className = "tech-filter-chevron";
            chevron.setAttribute("aria-hidden", "true");
            trigger.append(triggerLabel, chevron);

            const panel = document.createElement("div");
            panel.className = "tech-filter-panel";
            panel.id = "techFilterPanel";
            panel.hidden = true;
            panel.setAttribute("role", "group");
            panel.setAttribute("aria-label", "Filter projects by technologies");

            techOptions.forEach(option => {
                const optionLabel = document.createElement("label");
                optionLabel.className = "tech-filter-option";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = option.key;
                checkbox.name = "tech-filter";

                const text = document.createElement("span");
                text.textContent = option.label;

                optionLabel.append(checkbox, text);
                panel.appendChild(optionLabel);
            });

            const clearBtn = document.createElement("button");
            clearBtn.type = "button";
            clearBtn.className = "tech-filter-clear";
            clearBtn.textContent = "Clear";
            clearBtn.hidden = true;

            panel.appendChild(clearBtn);

            function updateTrigger() {
                const count = selectedTechs.length;
                triggerLabel.textContent =
                    count > 0 ? `Tech Stack (${count})` : "Tech Stack";
                trigger.classList.toggle("has-selection", count > 0);
                clearBtn.hidden = count === 0;
            }

            // Shared trigger label updater (also used by clearAllFilters).
            updateTechFilterTrigger = updateTrigger;
            updateTrigger();

            function openPanel() {
                panel.hidden = false;
                trigger.setAttribute("aria-expanded", "true");
            }

            function closePanel() {
                panel.hidden = true;
                trigger.setAttribute("aria-expanded", "false");
            }

            trigger.addEventListener("click", () => {
                if (panel.hidden) {
                    openPanel();
                } else {
                    closePanel();
                    trigger.focus();
                }
            });

            panel.addEventListener("change", e => {
                if (e.target?.type !== "checkbox") return;

                if (e.target.checked) {
                    if (!selectedTechs.includes(e.target.value)) {
                        selectedTechs.push(e.target.value);
                    }
                } else {
                    selectedTechs = selectedTechs.filter(
                        key => key !== e.target.value
                    );
                }

                updateTrigger();

                // Multiple selections stay applied without closing the panel.
                buildRegistry();
                buildMobileGrid();
            });

            clearBtn.addEventListener("click", () => {
                selectedTechs = [];
                panel
                    .querySelectorAll("input[type='checkbox']")
                    .forEach(box => {
                        box.checked = false;
                    });

                updateTrigger();
                buildRegistry();
                buildMobileGrid();
            });

            // Escape closes the panel. Bound to the wrapper so it never
            // interferes with the project modal's document-level Escape.
            wrapper.addEventListener("keydown", e => {
                if (e.key === "Escape" && !panel.hidden) {
                    closePanel();
                    trigger.focus();
                }
            });

            // Click outside closes the panel.
            document.addEventListener("pointerdown", e => {
                if (panel.hidden) return;
                if (!wrapper.contains(e.target)) {
                    closePanel();
                }
            });

            wrapper.append(trigger, panel);
            filterBar.appendChild(wrapper);
        }

        buildTechFilter();
    }

    // Populate the mobile Overview panel from existing project data
    // (title, tagline, description, highlights, tech stack).
    function renderViewerOverview(project) {
        if (!viewerOverviewTitle) return;

        viewerOverviewTitle.innerText = project.title;

        if (viewerOverviewTagline) {
            viewerOverviewTagline.innerText = project.tagline || "";
            viewerOverviewTagline.style.display = project.tagline ? "" : "none";
        }

        viewerOverviewDesc.innerText = project.description;

        if (viewerHighlights && viewerHighlightsBlock) {
            viewerHighlights.innerHTML = "";

            if (Array.isArray(project.highlights) && project.highlights.length) {
                project.highlights.forEach(highlight => {
                    if (typeof highlight !== "string" || !highlight.trim()) return;
                    const item = document.createElement("li");
                    item.textContent = highlight.trim();
                    viewerHighlights.appendChild(item);
                });
                viewerHighlightsBlock.hidden = !viewerHighlights.children.length;
            } else {
                viewerHighlightsBlock.hidden = true;
            }
        }

        if (viewerTechs && viewerTechsBlock) {
            viewerTechs.innerHTML = "";

            if (Array.isArray(project.techs) && project.techs.length) {
                project.techs.forEach(tech => {
                    const tag = document.createElement("span");
                    tag.className = "tech-tag";
                    tag.textContent = tech;
                    viewerTechs.appendChild(tag);
                });
            }
            viewerTechsBlock.hidden = !viewerTechs.children.length;
        }
    }

    // Mobile viewer tabs — accessible tab semantics with roving tabindex and
    // arrow-key navigation. Panels are toggled via the `hidden` attribute so
    // the iframe is never destroyed or reloaded when switching tabs.
    const viewerMobileQuery = window.matchMedia("(max-width: 768px)");

    function selectViewerTab(tabId) {
        viewerTabs.forEach(tab => {
            const selected = tab.id === tabId;
            tab.setAttribute("aria-selected", String(selected));
            tab.tabIndex = selected ? 0 : -1;

            const panel = document.getElementById(tab.getAttribute("aria-controls"));
            if (panel) {
                // Only the mobile tabbed experience hides panels; on desktop the
                // full stacked layout must stay visible at all times.
                panel.hidden = viewerMobileQuery.matches ? !selected : false;
            }
        });
    }

    function initViewerTabs() {
        viewerTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                selectViewerTab(tab.id);
            });

            tab.addEventListener("keydown", e => {
                const enabledTabs = viewerTabs.filter(t => !t.hidden);
                if (enabledTabs.length < 2) return;

                const currentIndex = enabledTabs.indexOf(tab);
                let targetIndex = null;

                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    targetIndex = (currentIndex + 1) % enabledTabs.length;
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    targetIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
                } else if (e.key === "Home") {
                    targetIndex = 0;
                } else if (e.key === "End") {
                    targetIndex = enabledTabs.length - 1;
                }

                if (targetIndex === null) return;
                e.preventDefault();
                selectViewerTab(enabledTabs[targetIndex].id);
                enabledTabs[targetIndex].focus();
            });
        });

        // Initial state: Overview selected, other panels hidden.
        selectViewerTab("tabOverview");

        // If the viewport crosses to desktop while a non-overview panel is
        // hidden, unhide all panels so the full desktop layout shows.
        if (typeof viewerMobileQuery.addEventListener === "function") {
            viewerMobileQuery.addEventListener("change", e => {
                if (!e.matches) {
                    viewerTabs.forEach(tab => {
                        const panel = document.getElementById(
                            tab.getAttribute("aria-controls")
                        );
                        if (panel) panel.hidden = false;
                    });
                }
            });
        }
    }

    // 4. Open project in viewer modal
    function openProjectInViewer(project, triggerEl) {
        lastFocusedElement = triggerEl || document.activeElement;

        projectViewer.classList.add("active");
        projectViewer.showModal();
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
        renderViewerOverview(project);

        // Show the Case Study tab only when there is case study content.
        const caseTab = viewerTabs.find(t => t.id === "tabCaseStudy");
        if (caseTab) {
            caseTab.hidden = !viewerCaseStudy || viewerCaseStudy.hidden;
        }

        // Always open on the Overview tab (mobile); no-op visually on desktop.
        selectViewerTab("tabOverview");

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
        projectViewer.close();
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

        // Reset to the Overview tab so reopening starts there (mobile).
        selectViewerTab("tabOverview");

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
        } else if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
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
    initProjectFilters();
    initSidebarRegistry();
    initMobileGrid();
    initViewerTabs();
    initScrollReveal();
    initNavActiveState();
});