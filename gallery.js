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
// TOUCH SWIPE
// =========================

let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener("touchstart", (e) => {

    touchStartX = e.touches[0].clientX;

});

lightbox.addEventListener("touchend", (e) => {

    touchEndX = e.changedTouches[0].clientX;

    const distance = touchStartX - touchEndX;

    if(Math.abs(distance) < 60) return;

    if(distance > 0){

        nextImage();

    }else{

        prevImage();

    }

});