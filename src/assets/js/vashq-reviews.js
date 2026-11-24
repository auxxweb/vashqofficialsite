document.addEventListener("DOMContentLoaded", function () {

    const section = document.getElementById("vashqReviews");

    if (!section) return;

    const reviewList = section.querySelector(".vashq-reviews-list");

    const reviews = section.querySelectorAll(".vashq-review-item");

    const logo = document.getElementById("vashqCompanyLogo");

    const logoFallback = document.getElementById("vashqLogoFallback");

    const title = document.getElementById("vashqPreviewTitle");

    const reviewText = document.getElementById("vashqPreviewReview");

    const company = document.getElementById("vashqPreviewCompany");

    const role = document.getElementById("vashqPreviewRole");

    const stars = document.getElementById("vashqPreviewStars");

    if (!reviewList || !reviews.length || !logo || !title) {
        return;
    }


    /* Update the right-side customer preview */

    function updateReview(item) {

        reviews.forEach(function (review) {
            review.classList.remove("active");
        });

        item.classList.add("active");


        /* Customer information */

        const companyName = item.dataset.company || "Customer";

        const reviewerRole = item.dataset.role || "";

        const reviewHeading = item.querySelector("h3");

        const reviewParagraph = item.querySelector(":scope > p");

        const rating = Math.max(
            0,
            Math.min(5, Number(item.dataset.rating) || 0)
        );


        title.textContent = reviewHeading
            ? reviewHeading.textContent
            : companyName;

        reviewText.textContent = item.dataset.review ||
            (reviewParagraph ? reviewParagraph.textContent.trim() : "");

        company.textContent = companyName;

        role.textContent = reviewerRole;

        stars.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);

        stars.setAttribute(
            "aria-label",
            rating + " out of 5 stars"
        );


        /* Update company logo */

        const logoPath = item.dataset.logo;

        if (!logoPath) {

            logo.removeAttribute("src");

            logo.style.display = "none";

            logoFallback.hidden = false;

            logoFallback.textContent = companyName
                .split(/\s+/)
                .map(function (word) {
                    return word.charAt(0);
                })
                .join("")
                .slice(0, 3)
                .toUpperCase();

        } else {

            const tempImage = new Image();

            tempImage.onload = function () {

                logo.src = logoPath;

                logo.alt = companyName + " logo";

                logo.style.display = "block";

                logoFallback.hidden = true;

            };

            tempImage.onerror = function () {

                logo.removeAttribute("src");

                logo.style.display = "none";

                logoFallback.hidden = false;

                logoFallback.textContent = companyName
                    .split(/\s+/)
                    .map(function (word) {
                        return word.charAt(0);
                    })
                    .join("")
                    .slice(0, 3)
                    .toUpperCase();

            };

            tempImage.src = logoPath;
        }


        /* Restart the preview animation */

        const preview = section.querySelector(
            ".vashq-review-preview-inner"
        );

        preview.style.animation = "none";

        void preview.offsetWidth;

        preview.style.animation = "";
    }


    /* Detect the review closest to the centre */

    function detectActiveReview() {

        const listRect = reviewList.getBoundingClientRect();

        const listCenter = listRect.top + listRect.height / 2;

        let closestReview = null;

        let shortestDistance = Infinity;


        reviews.forEach(function (item) {

            const rect = item.getBoundingClientRect();

            const itemCenter = rect.top + rect.height / 2;

            const distance = Math.abs(itemCenter - listCenter);

            if (distance < shortestDistance) {

                shortestDistance = distance;

                closestReview = item;
            }
        });


        if (
            closestReview &&
            !closestReview.classList.contains("active")
        ) {
            updateReview(closestReview);
        }
    }


    /* Scroll without showing a scrollbar */

    reviewList.addEventListener(
        "scroll",
        detectActiveReview,
        { passive: true }
    );


    /* Initialise first review */

    updateReview(reviews[0]);

    requestAnimationFrame(detectActiveReview);

});