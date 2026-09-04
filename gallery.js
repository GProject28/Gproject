const galleryImages = document.querySelectorAll(".galleryItem img");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

const closeBtn = document.querySelector(".closeLightbox");
const prevBtn = document.querySelector(".prevBtn");
const nextBtn = document.querySelector(".nextBtn");

let currentIndex = 0;

// =========================
// OPEN
// =========================

galleryImages.forEach((img,index)=>{

    img.addEventListener("click",()=>{

        currentIndex=index;

        updateImage();

        lightbox.classList.add("show");

    });

});

// =========================
// UPDATE IMAGE
// =========================

function updateImage(direction = "right"){

    lightboxImg.style.transition = "none";

    if(direction === "right"){

        lightboxImg.style.transform = "translateX(100%)";

    }else{

        lightboxImg.style.transform = "translateX(-100%)";

    }

    requestAnimationFrame(()=>{

        lightboxImg.src = galleryImages[currentIndex].src;

        requestAnimationFrame(()=>{

            lightboxImg.style.transition = "transform .35s ease";

            lightboxImg.style.transform = "translateX(0)";

        });

    });

}

// =========================
// NEXT
// =========================

function nextImage(){

    currentIndex++;

    if(currentIndex>=galleryImages.length){

        currentIndex=0;

    }

    updateImage("right");

}

// =========================
// PREVIOUS
// =========================

function prevImage(){

    currentIndex--;

    if(currentIndex<0){

        currentIndex=galleryImages.length-1;

    }

    updateImage("left");

}

nextBtn.addEventListener("click",nextImage);

prevBtn.addEventListener("click",prevImage);

// =========================
// CLOSE
// =========================

closeBtn.addEventListener("click",()=>{

    lightbox.classList.remove("show");

});

lightbox.addEventListener("click",(e)=>{

    if(e.target===lightbox){

        lightbox.classList.remove("show");

    }

});

// =========================
// KEYBOARD
// =========================

document.addEventListener("keydown",(e)=>{

    if(!lightbox.classList.contains("show")) return;

    if(e.key==="ArrowRight") nextImage();

    if(e.key==="ArrowLeft") prevImage();

    if(e.key==="Escape") lightbox.classList.remove("show");

});

// =========================
// MOBILE FACEBOOK-STYLE SWIPE
// PHONE ONLY
// =========================

let touchStartX = 0;
let touchCurrentX = 0;
let isDragging = false;

function isMobile(){

    return window.matchMedia("(max-width:768px)").matches;

}


// =========================
// TOUCH START
// =========================

lightbox.addEventListener("touchstart", (e) => {

    if(!isMobile()) return;

    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;

    isDragging = true;

    lightboxImg.style.transition = "none";

}, { passive:true });


// =========================
// TOUCH MOVE
// =========================

lightbox.addEventListener("touchmove", (e) => {

    if(!isMobile() || !isDragging) return;

    touchCurrentX = e.touches[0].clientX;

    const distance = touchCurrentX - touchStartX;

    /*
       IMAGE FOLLOWS YOUR FINGER
    */

    lightboxImg.style.transform =
        `translateX(${distance}px)`;

}, { passive:true });


// =========================
// TOUCH END
// =========================

lightbox.addEventListener("touchend", () => {

    if(!isMobile() || !isDragging) return;

    isDragging = false;

    const distance = touchCurrentX - touchStartX;

    const threshold = window.innerWidth * 0.20;


    // =========================
    // SWIPE LEFT → NEXT
    // =========================

    if(distance < -threshold){

        lightboxImg.style.transition =
            "transform .25s ease";

        lightboxImg.style.transform =
            "translateX(-100vw)";

        setTimeout(() => {

            nextImage();

        }, 180);

    }


    // =========================
    // SWIPE RIGHT → PREVIOUS
    // =========================

    else if(distance > threshold){

        lightboxImg.style.transition =
            "transform .25s ease";

        lightboxImg.style.transform =
            "translateX(100vw)";

        setTimeout(() => {

            prevImage();

        }, 180);

    }


    // =========================
    // NOT ENOUGH → RETURN
    // =========================

    else{

        lightboxImg.style.transition =
            "transform .25s ease";

        lightboxImg.style.transform =
            "translateX(0)";

    }

}, { passive:true });
