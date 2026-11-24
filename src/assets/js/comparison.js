document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    const section = document.getElementById("vashq-comparison");

    // Section page-il illenkil script stop cheyyuka.
    if (!section) return;

    const stage = section.querySelector("#vashq-stage");
    const toggle = section.querySelector("#vashq-toggle");
    const status = section.querySelector("#vashq-status");

    const leftList = section.querySelector("#vashq-list-left");
    const rightList = section.querySelector("#vashq-list-right");

    const orbitRotor = section.querySelector("#vashq-orbit-rotor");

    // Single source of truth.
    let isVashqEnabled = false;

    let isAnimating = false;
    let currentRotation = 0;
    let animationTimer = null;
    let unlockTimer = null;

    const ANIMATION_DURATION = 1000;
    const CONTENT_CHANGE_DELAY = 450;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    // ==========================================
    // BUSINESS CHALLENGES
    // ==========================================

    const challenges = [
        {
            title: "Billing Confusion",
            // description: "Reduce billing errors and payment confusion.",
            icon: "fa-receipt"
        },
        {
            title: "No Job Status Visibility",
            // description: "Know which vehicles are waiting or in progress.",
            icon: "fa-list-check"
        },
        {
            title: "Manual Report Analysis",
            // description: "Stop spending hours preparing reports.",
            icon: "fa-chart-column"
        },
        {
            title: "No Multi Branch Visibility",
            // description: "Manage disconnected branches and operations.",
            icon: "fa-building"
        },
        {
            title: "Employee Accountability Issues",
            // description: "Understand employee activity and responsibility.",
            icon: "fa-users"
        },
        {
            title: "Customer Dispute Management",
            // description: "Resolve disagreements without clear records.",
            icon: "fa-comments"
        },
        {
            title: "No Real-Time Business Visibility",
            // description: "Make decisions without live business insights.",
            icon: "fa-gauge-high"
        },
        {
            title: "No Quality Control",
            // description: "Maintain consistent service quality.",
            icon: "fa-shield-halved"
        }
    ];

    // ==========================================
    // VASHQ SOLUTIONS
    // ==========================================

    const solutions = [
        {
            title: "Fast Vehicle Check-in",
            // description: "Register incoming vehicles quickly.",
            icon: "fa-car"
        },
        {
            title: "Live Job Tracking",
            // description: "Follow every job from start to finish.",
            icon: "fa-list-check"
        },
        {
            title: "Daily Revenue Dashboard",
            // description: "Track revenue and business performance.",
            icon: "fa-chart-line"
        },
        {
            title: "Before & After Vehicle Inspections",
            // description: "Document vehicle condition with photos.",
            icon: "fa-camera"
        },
        {
            title: "Complete Customer & Vehicle History",
            // description: "Access previous visits and service records.",
            icon: "fa-clock-rotate-left"
        },
        {
            title: "Digital Invoices & Online Payments",
            // description: "Simplify billing and digital collections.",
            icon: "fa-credit-card"
        },
        {
            title: "Quality Control Tracking",
            // description: "Monitor inspections and service standards.",
            icon: "fa-shield-halved"
        },
        {
            title: "AI Assistance",
            // description: "Get smarter assistance for daily operations.",
            icon: "fa-wand-magic-sparkles"
        }
    ];

    // ==========================================
    // CREATE ITEM
    // ==========================================

    function createItem(item, index) {

        const li = document.createElement("li");
        li.className = "vashq-item";

        li.style.animationDelay = `${index * 45}ms`;

        const iconWrapper = document.createElement("span");
        iconWrapper.className = "vashq-item-icon";
        iconWrapper.setAttribute("aria-hidden", "true");

        const icon = document.createElement("i");
        icon.className = `fa-solid ${item.icon}`;

        iconWrapper.appendChild(icon);

        const content = document.createElement("div");
        content.className = "vashq-item-content";

        const heading = document.createElement("h3");
        heading.textContent = item.title;

        const description = document.createElement("p");
        description.textContent = item.description;

        content.appendChild(heading);
        content.appendChild(description);

        // Left side: text then icon.
        // Right side: icon then text.
        if (index < 4) {
            li.append(content, iconWrapper);
        } else {
            li.append(iconWrapper, content);
        }

        return li;
    }

    // ==========================================
    // RENDER ITEMS
    // ==========================================

    function renderItems(items, state) {

        const leftFragment = document.createDocumentFragment();
        const rightFragment = document.createDocumentFragment();

        items.forEach(function (item, index) {

            const element = createItem(item, index);

            if (index < 4) {
                leftFragment.appendChild(element);
            } else {
                rightFragment.appendChild(element);
            }

        });

        leftList.replaceChildren(leftFragment);
        rightList.replaceChildren(rightFragment);

        const listLabel = state
            ? "VASHQ solutions"
            : "Business challenges";

        leftList.setAttribute("aria-label", listLabel);
        rightList.setAttribute("aria-label", listLabel);
    }

    // ==========================================
    // UPDATE STATE
    // ==========================================

    function updateState(state) {

        isVashqEnabled = state;

        section.dataset.state = String(isVashqEnabled);
        toggle.checked = isVashqEnabled;

        // Exact mapping:
        // false = VASHQ ENABLED
        // true  = VASHQ DISABLED

        status.textContent = isVashqEnabled
            ? "VASHQ ENABLED"
            : "VASHQ DISABLED";

        const items = isVashqEnabled
            ? solutions
            : challenges;

        renderItems(items, isVashqEnabled);
    }

    // ==========================================
    // ROTATE ORBIT
    // ==========================================

    function rotateOrbit(state) {

        // false -> true: clockwise 180 degrees.
        // true -> false: counterclockwise 180 degrees.

        currentRotation += state ? 180 : -180;

        orbitRotor.style.transform =
            `rotate(${currentRotation}deg)`;
    }

    // ==========================================
    // HANDLE TOGGLE
    // ==========================================

    function handleToggle() {

        // Ignore clicks while animation is running.
        if (isAnimating) {
            toggle.checked = isVashqEnabled;
            return;
        }

        const nextState = toggle.checked;

        if (nextState === isVashqEnabled) return;

        // Reduced motion: update immediately.
        if (reducedMotion.matches) {
            updateState(nextState);
            return;
        }

        isAnimating = true;

        clearTimeout(animationTimer);
        clearTimeout(unlockTimer);

        stage.classList.remove("vashq-content-entering");

        // Start outgoing animation.
        stage.classList.add("vashq-is-transitioning");

        // Rotate in the appropriate direction.
        rotateOrbit(nextState);

        // Change content during the rotation.
        animationTimer = setTimeout(function () {

            updateState(nextState);

            stage.classList.remove("vashq-is-transitioning");
            stage.classList.add("vashq-content-entering");

        }, CONTENT_CHANGE_DELAY);

        // Finish animation and allow the next click.
        unlockTimer = setTimeout(function () {

            stage.classList.remove("vashq-is-transitioning");
            stage.classList.remove("vashq-content-entering");

            isAnimating = false;

            toggle.checked = isVashqEnabled;

        }, ANIMATION_DURATION);
    }

    // ==========================================
    // INITIALISE
    // ==========================================

    updateState(false);

    orbitRotor.style.transform = "rotate(0deg)";

    toggle.addEventListener("change", handleToggle);

});