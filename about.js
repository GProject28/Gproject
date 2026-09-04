const aboutSlides = document.querySelectorAll(".aboutSlider img");

let aboutIndex = 0;

setInterval(() => {

    aboutSlides[aboutIndex].classList.remove("active");

    aboutIndex++;

    if(aboutIndex >= aboutSlides.length){

        aboutIndex = 0;

    }

    aboutSlides[aboutIndex].classList.add("active");

}, 3500);