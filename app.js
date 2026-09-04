function toggleMenu() {

    document
        .getElementById("mobileMenu")
        .classList.toggle("active");

}


// ==========================
// RETURN TO PORTFOLIO
// ==========================

window.addEventListener("load", () => {

    if (window.location.hash === "#portfolio") {

        const section = document.getElementById("portfolio");

        if (section) {

            setTimeout(() => {

                section.scrollIntoView({
                    behavior: "instant",
                    block: "start"
                });

            }, 50);

        }

    }

});

const video = document.getElementById("btsVideo");
const playBtn = document.getElementById("playVideo");
const overlay = document.querySelector(".videoOverlay");

if (video && playBtn) {

    playBtn.addEventListener("click", async () => {

        try {

            video.controls = true;

            // Unmute after the user taps
            video.muted = false;

            await video.play();

            overlay.style.opacity = "0";
            overlay.style.pointerEvents = "none";

        } catch (err) {

            console.log(err);

        }

    });

}

const testimonialSwiper = new Swiper(".testimonialSwiper", {

    loop: true,

    centeredSlides: true,

    spaceBetween: 30,

    autoplay: {

        delay: 4000,

        disableOnInteraction: false,

    },

    pagination: {

        el: ".swiper-pagination",

        clickable: true,

    },

    breakpoints: {

        0: {

            slidesPerView: 1,

        },

        992: {

            slidesPerView: 2,

        }

    }

});

