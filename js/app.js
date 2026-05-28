document.addEventListener("DOMContentLoaded", () => {
    const geometricMenu = document.getElementById("geometricMenu");
    const mobileGrid = document.getElementById("mobileGrid");
    const glassPresenter = document.getElementById("glassPresenter");
    
    // Presenter Nodes
    const projectIndex = document.getElementById("projectIndex");
    const projectTitle = document.getElementById("projectTitle");
    const projectDesc = document.getElementById("projectDesc");
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

    // 1. Build Desktop Sidebar Registry Menu
    function initSidebarRegistry() {
        if (!geometricMenu || !myProjects.length) return;
        geometricMenu.innerHTML = "";

        myProjects.forEach((project, index) => {
            const indexString = String(index + 1).padStart(2, '0');
            
            const menuItem = document.createElement("div");
            menuItem.className = "menu-item";
            if (index === 0) menuItem.classList.add("active-menu-item");

            menuItem.innerHTML = `
                <span class="menu-item-index">${indexString}</span>
                <span class="menu-item-title">${project.title}</span>
            `;

            // Hover or Click trigger to populate presentations smoothly
            menuItem.addEventListener("click", () => {
                if (menuItem.classList.contains("active-menu-item")) return;
                
                document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active-menu-item"));
                menuItem.classList.add("active-menu-item");
                
                renderPresenterWithAnimation(project, indexString);
            });

            geometricMenu.appendChild(menuItem);
        });

        // Initialize display with the first project parameters
        renderPresenterWithAnimation(myProjects[0], "01");
    }

    // 2. Cinematic Presentation Fade & Slide Animation Engine
    function renderPresenterWithAnimation(project, indexString) {
        activeProject = project;

        // Apply temporary tracking animations hooks
        glassPresenter.classList.add("slide-fade-transition");
        glassPresenter.style.transition = "none";

        // Defer DOM changes slightly to allow browser processing of style resets
        setTimeout(() => {
            projectIndex.innerText = indexString;
            projectTitle.innerText = project.title;
            projectDesc.innerText = project.description;
            
            // Map tech tags
            techTags.innerHTML = "";
            project.techs.forEach(tech => {
                const tag = document.createElement("span");
                tag.className = "tech-tag";
                tag.innerText = tech;
                techTags.appendChild(tag);
            });

            // Trigger hardware-accelerated presentation animations
            glassPresenter.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
            glassPresenter.classList.remove("slide-fade-transition");
        }, 50);
    }

    // Connect Primary Click Actions to Launch Modal Viewer
    if (launchShowroomBtn) {
        launchShowroomBtn.addEventListener("click", () => {
            if (activeProject) openProjectInViewer(activeProject);
        });
    }

    // 3. Fallback Viewport Grid Building (Mobile Systems)
    if (mobileGrid) {
        myProjects.forEach(project => {
            const card = document.createElement("div");
            card.className = "project-card";
            card.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description.substring(0, 100)}...</p>
            `;
            card.addEventListener("click", () => openProjectInViewer(project));
            mobileGrid.appendChild(card);
        });
    }

    // 4. Mount Active Selection Parameters inside Iframe Framework
    function openProjectInViewer(project) {
        projectViewer.classList.add("active");
        projectViewer.setAttribute("aria-hidden", "false");
        
        iframeLoader.style.display = "block";
        projectIframe.style.opacity = "0";
        
        projectIframe.src = project.vercelUrl;
        viewedProjectTitle.innerText = project.title;
        viewedProjectDesc.innerText = project.description;
        liveLink.href = project.vercelUrl;
        repoLink.href = project.githubUrl;

        projectIframe.onload = () => {
            iframeLoader.style.display = "none";
            projectIframe.style.transition = "opacity 0.4s ease";
            projectIframe.style.opacity = "1";
        };
    }

    // 5. Cleanup and Modal Teardowns
    if (closeViewer) {
        closeViewer.addEventListener("click", () => {
            projectViewer.classList.remove("active");
            projectViewer.setAttribute("aria-hidden", "true");
            projectIframe.src = "";
        });
    }

    if (projectViewer) {
        projectViewer.addEventListener("click", (e) => {
            if (e.target === projectViewer) closeViewer.click();
        });
    }

    // Boot App Setup
    initSidebarRegistry();
});
