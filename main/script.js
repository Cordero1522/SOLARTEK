// Toggle del menú móvil
document.getElementById('mobileToggle').addEventListener('click', function() {
    document.getElementById('navLinks').classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
    });
});

const form = document.getElementById("quoteForm");
const messageDiv = document.getElementById("response-message");
const button = document.getElementById("submit-button");


form.addEventListener("submit", async function (e) {
    e.preventDefault();

    messageDiv.textContent = "Submitting...";
    messageDiv.style.display = "block";
    messageDiv.style.backgroundColor = "beige";
    messageDiv.style.color = "black";
    button.disabled = true;

    try {
        const formData = new FormData(this);
        const formDataObj = {};

        for (let [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }

        const scriptURL = "https://script.google.com/macros/s/AKfycbwmnE8bHncypwSxj664qX_C7twiF5GOTNBfBsyTRzoHfftHQl1KPCKT9gOb_ta_5wb_ew/exec";

        const response = await fetch(scriptURL, {
            method: "POST",
            redirect: "follow",
            body: JSON.stringify(formDataObj),
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        });

        const data = await response.json();

        if (data.status === "success") {
            messageDiv.textContent = "Data submitted successfully!";
            messageDiv.style.backgroundColor = "#48c78e";
            messageDiv.style.color = "white";
            form.reset();
        } else {
            throw new Error(data.message || "Submission failed");
        }

    } catch (error) {
        messageDiv.textContent = "Error: " + error.message;
        messageDiv.style.backgroundColor = "#f14668";
        messageDiv.style.color = "white";
    } finally {
        button.disabled = false;
        setTimeout(() => {
            messageDiv.style.display = "none";
        }, 4000);
    }
});