/* =========================================
   VASHQ INFINITE TESTIMONIAL MARQUEE
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const track = document.querySelector(
        "#testimonials .vashq-testimonial-track"
    );

    if (!track) {
        return;
    }

    const originalGroup = track.querySelector(
        ".vashq-testimonial-group"
    );

    if (!originalGroup) {
        return;
    }

    // Prevent duplicate cloning
    if (track.dataset.cloned === "true") {
        return;
    }

    // Duplicate the complete group of review cards
    const duplicateGroup = originalGroup.cloneNode(true);

    // Hide duplicate reviews from screen readers
    duplicateGroup.setAttribute("aria-hidden", "true");

    // Add the duplicate group to the track
    track.appendChild(duplicateGroup);

    // Mark as cloned
    track.dataset.cloned = "true";

});