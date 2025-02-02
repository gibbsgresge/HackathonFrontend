document.addEventListener("DOMContentLoaded", () => {
    const colorWheel = document.getElementById("colorWheel");
    const verifyButton = document.getElementById("verifyButton");
    const clearButton = document.getElementById("clearButton");
    const goBackButton = document.getElementById("goBackButton");
    const saveButton = document.getElementById("saveButton");
    const packNameInput = document.getElementById("packName");
    const colorBoxes = document.querySelectorAll(".color-box");
    let selectedSlot = null;
    let selectedColors = { primary: "", secondary: "", accent1: "", accent2: "" };
    
    // Handle color box selection
    colorBoxes.forEach(box => {
        box.addEventListener("click", () => {
            selectedSlot = box.dataset.slot;
            verifyButton.disabled = false;
            colorBoxes.forEach(b => b.classList.remove("border-4", "border-blue-500"));
            box.classList.add("border-4", "border-blue-500");
        });
    });

    // Verify selected color
    verifyButton.addEventListener("click", () => {
        if (selectedSlot) {
            selectedColors[selectedSlot] = colorWheel.value;
            document.getElementById(`${selectedSlot}Box`).style.backgroundColor = colorWheel.value;
        }
    });

    // Clear selections
    clearButton.addEventListener("click", () => {
        selectedColors = { primary: "", secondary: "", accent1: "", accent2: "" };
        colorBoxes.forEach(box => {
            box.style.backgroundColor = "#ddd";
            box.classList.remove("border-4", "border-blue-500");
        });
        packNameInput.value = "";
    });

    // Go back to home page
    goBackButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Save color pack
    saveButton.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to save a color pack.");
            return;
        }

        const colorPack = {
            name: packNameInput.value,
            primary: selectedColors.primary,
            secondary: selectedColors.secondary,
            accent1: selectedColors.accent1,
            accent2: selectedColors.accent2
        };

        if (!colorPack.name || !colorPack.primary || !colorPack.secondary || !colorPack.accent1 || !colorPack.accent2) {
            alert("Please fill in all colors and name before saving.");
            return;
        }

        try {
            const response = await fetch("https://colorpack-backend-132344824938.us-central1.run.app/api/colorpacks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(colorPack)
            });

            if (!response.ok) {
                throw new Error("Failed to save color pack");
            }

            alert("Color pack saved successfully!");
            window.location.href = "index.html"; // Redirect back to home
        } catch (error) {
            console.error("Error saving color pack:", error);
            alert("Error saving color pack. Please try again.");
        }
    });
});