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

/* =========================================================
   HERO SLIDESHOW
   ========================================================= */

document.addEventListener("DOMContentLoaded", function(){

    const heroSlides = document.querySelectorAll(".heroSlide");
    const heroDots = document.querySelectorAll(".heroDot");
    const heroCurrent = document.getElementById("heroCurrent");

    const prevBtn = document.querySelector(".heroPrev");
    const nextBtn = document.querySelector(".heroNext");

    if(!heroSlides.length) return;

    let currentSlide = 0;
    let slideTimer;


    function showHeroSlide(index){

        if(index >= heroSlides.length){
            index = 0;
        }

        if(index < 0){
            index = heroSlides.length - 1;
        }

        heroSlides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });


        heroDots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });


        if(heroCurrent){
            heroCurrent.textContent =
                String(index + 1).padStart(2, "0");
        }


        currentSlide = index;
    }


    function nextHeroSlide(){
        showHeroSlide(currentSlide + 1);
    }


    function prevHeroSlide(){
        showHeroSlide(currentSlide - 1);
    }


    function startHeroSlideshow(){

        clearInterval(slideTimer);

        slideTimer = setInterval(() => {
            nextHeroSlide();
        }, 3000);

    }


    if(nextBtn){

        nextBtn.addEventListener("click", function(){

            nextHeroSlide();
            startHeroSlideshow();

        });

    }


    if(prevBtn){

        prevBtn.addEventListener("click", function(){

            prevHeroSlide();
            startHeroSlideshow();

        });

    }


    heroDots.forEach((dot, index) => {

        dot.addEventListener("click", function(){

            showHeroSlide(index);
            startHeroSlideshow();

        });

    });


    /* Initial */

    showHeroSlide(0);
    startHeroSlideshow();

});

/* =========================================
   MOBILE LOGO → HOME
========================================= */

document.addEventListener("DOMContentLoaded", function(){

    const mobileLogo = document.querySelector(".mobileLogo");

    if(mobileLogo){
        mobileLogo.style.cursor = "pointer";

        mobileLogo.addEventListener("click", function(){
            window.location.href = "index.html";
        });
    }

});

/* ==========================
   NAVBAR LOGO → HOME
========================== */
document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".navbar .logoBox").forEach(logo => {

        logo.addEventListener("click", function(e) {
            e.preventDefault();
            window.location.href = "index.html";
        });

    });

});

/* =========================================================
   OUR STORY — FINE ART COLLAGE SLIDESHOW
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const storyPhotos = document.querySelectorAll(
        ".storyCollage .storyPhoto"
    );

    if (!storyPhotos.length) return;

    let currentGroup = 0;

    /*
        15 photos = 5 groups
        Each group displays 3 photos:
        
        Group 1 → 1, 2, 3
        Group 2 → 4, 5, 6
        Group 3 → 7, 8, 9
        Group 4 → 10, 11, 12
        Group 5 → 13, 14, 15
    */

    function showStoryGroup(group){

        storyPhotos.forEach(photo => {
            photo.classList.remove("active");
        });

        const start = group * 3;

        for(let i = start; i < start + 3; i++){

            if(storyPhotos[i]){
                storyPhotos[i].classList.add("active");
            }

        }
    }

    // Initial group
    showStoryGroup(currentGroup);

    // Automatic change every 4 seconds
    setInterval(() => {

        currentGroup++;

        if(currentGroup >= 5){
            currentGroup = 0;
        }

        showStoryGroup(currentGroup);

    }, 4000);

});