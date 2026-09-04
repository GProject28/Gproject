console.log("CONTACT JS LOADED");

// =====================================
// CONFIG
// =====================================

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbx5ukgcaj6J5f8tGx3Zsvpfw_-xK4IwWuf2T4gsS93W8NXTRv1p1ul0M-Lz4B7mBBSeCg/exec";

// =====================================
// ELEMENTS
// =====================================

const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");

const paymentMethod = document.getElementById("paymentMethod");
const proofSection = document.getElementById("proofSection");
const proofFile = document.getElementById("proofFile");

const paymentQR = document.querySelector(".gcashQR img");

const dateInput = document.getElementById("date");

const startTime = document.getElementById("startTime");
const endTime = document.getElementById("endTime");

const availabilityMessage =
document.getElementById("availabilityMessage");

// =====================================
// PAGE LOAD
// =====================================

window.addEventListener("DOMContentLoaded", () => {

    proofSection.style.display = "none";

    availabilityMessage.innerHTML = "";

});

// =====================================
// DATE CHANGED
// =====================================

dateInput.addEventListener("change", async () => {

    await loadBookedTimes();

    checkBookingAvailability();

});

// =====================================
// TIME CHANGED
// =====================================

startTime.addEventListener("change", () => {

    checkBookingAvailability();

});

endTime.addEventListener("change", () => {

    checkBookingAvailability();

});

// =====================================
// PAYMENT METHOD
// =====================================

paymentMethod.addEventListener("change", () => {

    if(
        paymentMethod.value === "GCash" ||
        paymentMethod.value === "Bank Transfer"
    ){

        proofSection.style.display = "block";

        proofFile.required = true;

        if(paymentMethod.value === "GCash"){

            paymentQR.src = "images/gcash-qr.jpg";

            paymentQR.alt = "GCash QR";

        }

        if(paymentMethod.value === "Bank Transfer"){

            paymentQR.src = "images/bank-qr.jpg";

            paymentQR.alt = "Bank QR";

        }

    }

    else{

        proofSection.style.display = "none";

        proofFile.required = false;

        proofFile.value = "";

    }

});

// =====================================
// RESET BOOKING FORM
// =====================================

function resetBookingForm(){

    form.reset();

    proofSection.style.display = "none";

    proofFile.value = "";

    availabilityMessage.innerHTML = "";

}

// =====================================
// CLOSE SUCCESS MODAL
// =====================================

function closeSuccessModal(e){

    if(e){

        e.preventDefault();

        e.stopPropagation();

    }

    document
        .getElementById("successModal")
        .classList.remove("show");

    resetBookingForm();

}

// =====================================
// SUBMIT BOOKING
// =====================================

form.addEventListener("submit", async function(e){

    e.preventDefault();

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if(!dateInput.value){

        alert("Please select booking date.");

        return;

    }

    if(!startTime.value){

        alert("Please select Start Time.");

        return;

    }

    if(!endTime.value){

        alert("Please select End Time.");

        return;

    }

const startMinutes = convertToMinutes(startTime.value);
const endMinutes = convertToMinutes(endTime.value);

// Same Start & End
if (startMinutes === endMinutes) {

    alert("Start Time and End Time cannot be the same.");

    submitBtn.disabled = false;
    submitBtn.innerHTML = "Book Now";

    return;

}

// End is earlier than Start
if (startMinutes > endMinutes) {

    alert("End Time must be later than Start Time.");

    submitBtn.disabled = false;
    submitBtn.innerHTML = "Book Now";

    return;

}
    // -----------------------------
    // CHECK FRONTEND AVAILABILITY
    // -----------------------------

    const available = await isTimeAvailable();

    if(!available){

       showError(
    "Already Booked",
    "Please choose another available time."
);

        return;

    }

    // -----------------------------
    // LOADING
    // -----------------------------

    submitBtn.disabled = true;

    submitBtn.innerHTML = "Sending...";

    try{

        const formData = new FormData();

        formData.append("name",
            document.getElementById("name").value);

        formData.append("phone",
            document.getElementById("phone").value);

        formData.append("email",
            document.getElementById("email").value);

        formData.append("session",
            document.getElementById("session").value);

        formData.append("date",
            dateInput.value);

        formData.append("startTime",
            startTime.value);

        formData.append("endTime",
            endTime.value);

        formData.append("message",
            document.getElementById("message").value);

        formData.append("paymentMethod",
            paymentMethod.value);

        // -----------------------------
        // Upload Proof
        // -----------------------------

        if(proofFile.files.length){

            const file = proofFile.files[0];

            if(file.size > 20 * 1024 * 1024){

                alert("Maximum upload is 20MB.");

                submitBtn.disabled = false;

                submitBtn.innerHTML = "Book Now";

                return;

            }

            const base64 = await fileToBase64(file);

            formData.append("proof", base64);

            formData.append("proofName", file.name);

        }

        // -----------------------------
        // SENDconst res = await fetch(SCRIPT_URL + "?action=getBookedTimes");
        const response = await fetch(SCRIPT_URL,{

            method:"POST",

            body:formData

        });

        const data = await response.json();

        console.log(data);

        if(!data.success){

            alert(data.message);

            return;

        }

        document.getElementById("referenceNo").textContent =
        data.inquiryID;

        document
        .getElementById("successModal")
        .classList.add("show");

        resetBookingForm();

        await loadBookedTimes();

    }

  catch(err){

    console.error(err);

    alert(err.message);

}

    finally{

        submitBtn.disabled = false;

        submitBtn.innerHTML = "Book Now";

    }

});

// =====================================
// LOAD BOOKED TIMES
// =====================================

let bookedSchedules = [];

async function loadBookedTimes() {

    if (!dateInput.value) return;

    try {

        const res = await fetch(
            SCRIPT_URL + "?action=getBookedTimes"
        );

        bookedSchedules = await res.json();

        console.log(bookedSchedules);

      const currentStart = startTime.value;
const currentEnd = endTime.value;

        startTime.querySelectorAll("option").forEach(option => {

            if (!option.value) return;

            option.disabled = false;
            option.textContent = option.textContent.replace(" 🔒 Booked", "");

        });

        bookedSchedules.forEach(book => {

            if (book.date !== dateInput.value) return;

            const bookedStart = convertToMinutes(book.start);
            const bookedEnd   = convertToMinutes(book.end);

            startTime.querySelectorAll("option").forEach(option => {

                if (!option.value) return;

                const optionTime = convertToMinutes(option.value);

                // Disable ALL hours inside the booked range
                if (
                    optionTime >= bookedStart &&
                    optionTime < bookedEnd
                ) {

                    option.disabled = true;

                    if (!option.textContent.includes("🔒")) {

                        option.textContent += " 🔒 Booked";

                    }

                }

            });

        });

        
if (currentStart && !startTime.querySelector(`option[value="${currentStart}"]`)?.disabled) {
    startTime.value = currentStart;
}

if (currentEnd) {
    endTime.value = currentEnd;
}


    }
    

    catch(err){

        console.error(err);

    }

}

// =====================================
// CHECK IF AVAILABLE
// =====================================

async function isTimeAvailable(){

    if(
        !dateInput.value ||
        !startTime.value ||
        !endTime.value
    ){

        return false;

    }

    const newStart =
        convertToMinutes(startTime.value);

    const newEnd =
        convertToMinutes(endTime.value);

    for(const booking of bookedSchedules){

        if(booking.date !== dateInput.value){

            continue;

        }

     const bookedStart =
    convertToMinutes(
        String(booking.start).substring(0,5)
    );

const bookedEnd =
    convertToMinutes(
        String(booking.end).substring(0,5)
    );

        // OVERLAP

        if(

            newStart < bookedEnd &&

            newEnd > bookedStart

        ){

            return false;

        }

    }

    return true;

}

// =====================================
// LIVE CHECK
// =====================================

async function checkBookingAvailability(){

    if(
        !dateInput.value ||
        !startTime.value ||
        !endTime.value
    ){

        availabilityMessage.innerHTML="";

        return;

    }

    const available =
        await isTimeAvailable();

    if(available){

        availabilityMessage.innerHTML =
            "✅ Time slot available.";

        availabilityMessage.style.color =
            "#2e7d32";

    }

    else{

        availabilityMessage.innerHTML =
            "❌ Time slot already booked.";

        availabilityMessage.style.color =
            "#d32f2f";

    }

}

// =====================================
// CONVERT TIME TO MINUTES
// =====================================

function convertToMinutes(time){

    if(!time) return 0;

    time = String(time).trim();

    // 24-hour format
    if(!time.includes("AM") && !time.includes("PM")){

        const [hour, minute] = time.split(":").map(Number);

        return hour * 60 + minute;

    }

    // 12-hour format
    let [clock, ampm] = time.split(" ");

    let [hour, minute] = clock.split(":").map(Number);

    if(ampm === "PM" && hour !== 12) hour += 12;

    if(ampm === "AM" && hour === 12) hour = 0;

    return hour * 60 + minute;

}

// =====================================
// FILE TO BASE64
// =====================================

function fileToBase64(file){

    return new Promise((resolve,reject)=>{

        const reader = new FileReader();

        reader.onload = ()=>resolve(reader.result);

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}

// =====================================
// AUTO REFRESH WHEN DATE CHANGES
// =====================================

dateInput.addEventListener("change", async ()=>{

    await loadBookedTimes();

});

// =====================================
// AUTO CHECK
// =====================================

startTime.addEventListener("change",checkBookingAvailability);

endTime.addEventListener("change",checkBookingAvailability);

// =====================================
// INITIAL LOAD
// =====================================

window.addEventListener("load",()=>{

    if(dateInput.value){

        loadBookedTimes();

    }

});

function showError(title, text) {
    Swal.fire({
        icon: "error",
        title,
        text,
        confirmButtonColor: "#c79b56",
        background: "#fff",
        color: "#333"
    });
}

function showSuccess(title, text) {
    Swal.fire({
        icon: "success",
        title,
        text,
        confirmButtonColor: "#c79b56",
        background: "#fff",
        color: "#333"
    });
}

function showWarning(title, text) {
    Swal.fire({
        icon: "warning",
        title,
        text,
        confirmButtonColor: "#c79b56",
        background: "#fff",
        color: "#333"
    });
}