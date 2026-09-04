const galleryImages = document.querySelectorAll(".galleryItem img");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

const closeBtn = document.querySelector(".closeLightbox");
const prevBtn = document.querySelector(".prevBtn");
const nextBtn = document.querySelector(".nextBtn");

let currentIndex = 0;


/* =========================================================
   MOBILE CHECK
========================================================= */

function isMobile(){

    return window.matchMedia("(max-width:768px)").matches;

}


/* =========================================================
   IMAGE ORIENTATION
========================================================= */

function setOrientation(){

    if(!isMobile()){

        lightbox.classList.remove("isPortrait");
        lightbox.classList.remove("isLandscape");

        return;

    }

    if(lightboxImg.naturalHeight > lightboxImg.naturalWidth){

        lightbox.classList.add("isPortrait");
        lightbox.classList.remove("isLandscape");

    }else{

        lightbox.classList.add("isLandscape");
        lightbox.classList.remove("isPortrait");

    }

}


/* =========================================================
   OPEN
========================================================= */

galleryImages.forEach((img,index)=>{

    img.addEventListener("click",()=>{

        currentIndex = index;

        openLightbox();

    });

});


function openLightbox(){

    lightbox.classList.add("show");

    document.body.style.overflow = "hidden";

    lightboxImg.style.transition = "none";
    lightboxImg.style.transform = "translate3d(0,0,0)";

    lightboxImg.src = galleryImages[currentIndex].src;

    lightboxImg.alt =
        galleryImages[currentIndex].alt || "Gallery Image";

    lightboxImg.onload = ()=>{

        setOrientation();

    };

}


/* =========================================================
   CLOSE
========================================================= */

function closeLightbox(){

    lightbox.classList.remove("show");

    document.body.style.overflow = "";

    lightboxImg.style.transition = "none";

    lightboxImg.style.transform =
        "translate3d(0,0,0)";

    lightboxImg.classList.remove("dragging");

}


/* CLOSE BUTTON */

if(closeBtn){

    closeBtn.addEventListener("click",()=>{

        closeLightbox();

    });

}


/* CLICK BLACK BACKGROUND */

lightbox.addEventListener("click",(e)=>{

    if(e.target === lightbox){

        closeLightbox();

    }

});


/* =========================================================
   DESKTOP NEXT
========================================================= */

function nextImage(){

    currentIndex++;

    if(currentIndex >= galleryImages.length){

        currentIndex = 0;

    }

    changeImage("next");

}


/* =========================================================
   DESKTOP PREVIOUS
========================================================= */

function prevImage(){

    currentIndex--;

    if(currentIndex < 0){

        currentIndex = galleryImages.length - 1;

    }

    changeImage("prev");

}


/* =========================================================
   CHANGE IMAGE
========================================================= */

function changeImage(direction){

    if(!isMobile()){

        lightboxImg.style.transition =
            "transform .30s ease";

        if(direction === "next"){

            lightboxImg.style.transform =
                "translate3d(-100%,0,0)";

        }else{

            lightboxImg.style.transform =
                "translate3d(100%,0,0)";

        }

        setTimeout(()=>{

            lightboxImg.style.transition = "none";

            lightboxImg.src =
                galleryImages[currentIndex].src;

            lightboxImg.onload = ()=>{

                lightboxImg.style.transform =
                    "translate3d(0,0,0)";

                setOrientation();

            };

        },300);

        return;

    }


    /* ==========================
       MOBILE
    ========================== */

    lightboxImg.style.transition =
        "transform .25s ease";

    lightboxImg.style.transform =
        "translate3d(0,0,0)";

    lightboxImg.src =
        galleryImages[currentIndex].src;

    lightboxImg.onload = ()=>{

        setOrientation();

    };

}


/* =========================================================
   ARROWS
========================================================= */

if(nextBtn){

    nextBtn.addEventListener("click",(e)=>{

        e.stopPropagation();

        nextImage();

    });

}

if(prevBtn){

    prevBtn.addEventListener("click",(e)=>{

        e.stopPropagation();

        prevImage();

    });

}


/* =========================================================
   MOBILE SMOOTH DRAG
========================================================= */

let startX = 0;

let currentX = 0;

let dragDistance = 0;

let isDragging = false;

let touchMoved = false;


/* TOUCH START */

lightbox.addEventListener("touchstart",(e)=>{

    if(!isMobile()) return;

    if(!lightbox.classList.contains("show")) return;

    startX = e.touches[0].clientX;

    currentX = startX;

    dragDistance = 0;

    isDragging = true;

    touchMoved = false;

    lightboxImg.classList.add("dragging");

}, {passive:true});


/* =========================================================
   TOUCH MOVE
========================================================= */

lightbox.addEventListener("touchmove",(e)=>{

    if(!isMobile()) return;

    if(!isDragging) return;

    currentX = e.touches[0].clientX;

    dragDistance = currentX - startX;

    if(Math.abs(dragDistance) > 5){

        touchMoved = true;

    }


    /*
       PHOTO FOLLOWS FINGER
    */

    lightboxImg.style.transform =
        `translate3d(${dragDistance}px,0,0)`;

}, {passive:true});


/* =========================================================
   TOUCH END
========================================================= */

lightbox.addEventListener("touchend",()=>{

    if(!isMobile()) return;

    if(!isDragging) return;

    isDragging = false;

    lightboxImg.classList.remove("dragging");


    const screenWidth = window.innerWidth;

    const threshold = Math.min(100, screenWidth * 0.20);


    /* ==========================
       SWIPE LEFT
       NEXT
    ========================== */

    if(dragDistance < -threshold){

        animateToNext();

        return;

    }


    /* ==========================
       SWIPE RIGHT
       PREVIOUS
    ========================== */

    if(dragDistance > threshold){

        animateToPrevious();

        return;

    }


    /* ==========================
       NOT ENOUGH
       RETURN TO CENTER
    ========================== */

    lightboxImg.style.transition =
        "transform .25s ease";

    lightboxImg.style.transform =
        "translate3d(0,0,0)";

});


/* =========================================================
   ANIMATE NEXT
========================================================= */

function animateToNext(){

    lightboxImg.style.transition =
        "transform .22s ease";

    lightboxImg.style.transform =
        "translate3d(-100vw,0,0)";


    setTimeout(()=>{

        currentIndex++;

        if(currentIndex >= galleryImages.length){

            currentIndex = 0;

        }

        lightboxImg.style.transition = "none";

        lightboxImg.style.transform =
            "translate3d(100vw,0,0)";

        lightboxImg.src =
            galleryImages[currentIndex].src;

        lightboxImg.alt =
            galleryImages[currentIndex].alt ||
            "Gallery Image";


        lightboxImg.onload = ()=>{

            setOrientation();

            requestAnimationFrame(()=>{

                requestAnimationFrame(()=>{

                    lightboxImg.style.transition =
                        "transform .22s ease";

                    lightboxImg.style.transform =
                        "translate3d(0,0,0)";

                });

            });

        };

    },220);

}


/* =========================================================
   ANIMATE PREVIOUS
========================================================= */

function animateToPrevious(){

    lightboxImg.style.transition =
        "transform .22s ease";

    lightboxImg.style.transform =
        "translate3d(100vw,0,0)";


    setTimeout(()=>{

        currentIndex--;

        if(currentIndex < 0){

            currentIndex =
                galleryImages.length - 1;

        }

        lightboxImg.style.transition = "none";

        lightboxImg.style.transform =
            "translate3d(-100vw,0,0)";

        lightboxImg.src =
            galleryImages[currentIndex].src;

        lightboxImg.alt =
            galleryImages[currentIndex].alt ||
            "Gallery Image";


        lightboxImg.onload = ()=>{

            setOrientation();

            requestAnimationFrame(()=>{

                requestAnimationFrame(()=>{

                    lightboxImg.style.transition =
                        "transform .22s ease";

                    lightboxImg.style.transform =
                        "translate3d(0,0,0)";

                });

            });

        };

    },220);

}


/* =========================================================
   KEYBOARD
   DESKTOP
========================================================= */

document.addEventListener("keydown",(e)=>{

    if(!lightbox.classList.contains("show")) return;

    if(e.key === "Escape"){

        closeLightbox();

    }

    if(e.key === "ArrowRight"){

        nextImage();

    }

    if(e.key === "ArrowLeft"){

        prevImage();

    }

});