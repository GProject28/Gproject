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

/* =========================================================
   MOBILE PACKAGE PHOTO VIEWER
   PHONE ONLY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const posters = document.querySelectorAll(".servicePoster img");

    const viewer = document.getElementById("mobilePackageViewer");
    const viewerImage = document.getElementById("packageViewerImage");

    const closeBtn = document.getElementById("packageViewerClose");
    const prevBtn = document.getElementById("packageViewerPrev");
    const nextBtn = document.getElementById("packageViewerNext");

    if (!posters.length || !viewer || !viewerImage) return;

    let currentIndex = 0;

    let touchStartX = 0;
    let touchEndX = 0;

    function isMobile(){
        return window.matchMedia("(max-width: 768px)").matches;
    }

    function showPackage(index){

        if(index < 0){
            index = posters.length - 1;
        }

        if(index >= posters.length){
            index = 0;
        }

        currentIndex = index;

        viewerImage.src = posters[currentIndex].src;
        viewerImage.alt = posters[currentIndex].alt || "Photography Package";
    }

    function openViewer(index){

        if(!isMobile()) return;

        showPackage(index);

        viewer.classList.add("active");
        document.body.classList.add("packageViewerOpen");
    }

    function closeViewer(){

        viewer.classList.remove("active");
        document.body.classList.remove("packageViewerOpen");

        viewerImage.src = "";
    }

    function nextPackage(){

        showPackage(currentIndex + 1);
    }

    function previousPackage(){

        showPackage(currentIndex - 1);
    }


    /* =========================
       OPEN PACKAGE
    ========================= */

    posters.forEach((poster, index) => {

        poster.addEventListener("click", () => {

            if(!isMobile()) return;

            openViewer(index);

        });

    });


    /* =========================
       BUTTONS
    ========================= */

    closeBtn.addEventListener("click", closeViewer);

    nextBtn.addEventListener("click", nextPackage);

    prevBtn.addEventListener("click", previousPackage);


    /* =========================
       SWIPE
    ========================= */

    viewer.addEventListener("touchstart", (e) => {

        touchStartX = e.changedTouches[0].screenX;

    }, { passive:true });


    viewer.addEventListener("touchend", (e) => {

        touchEndX = e.changedTouches[0].screenX;

        const difference = touchEndX - touchStartX;

        /* minimum swipe distance */

        if(Math.abs(difference) < 50) return;

        if(difference < 0){

            /* SWIPE LEFT = NEXT */

            nextPackage();

        }else{

            /* SWIPE RIGHT = PREVIOUS */

            previousPackage();

        }

    }, { passive:true });


    /* =========================
       DOUBLE TAP = CLOSE
    ========================= */

    let lastTap = 0;

    viewerImage.addEventListener("touchend", () => {

        const now = Date.now();

        if(now - lastTap < 350){

            closeViewer();

        }

        lastTap = now;

    });


    /* =========================
       ESCAPE
       (IF KEYBOARD IS USED)
    ========================= */

    document.addEventListener("keydown", (e) => {

        if(!viewer.classList.contains("active")) return;

        if(e.key === "Escape"){

            closeViewer();

        }

        if(e.key === "ArrowRight"){

            nextPackage();

        }

        if(e.key === "ArrowLeft"){

            previousPackage();

        }

    });

});