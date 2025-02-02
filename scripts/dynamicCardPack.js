document.addEventListener("DOMContentLoaded", async () => {
    const themeCardsContainer = document.getElementById("themeCards");

    if (!themeCardsContainer) {
        console.error("❌ Error: #themeCards element not found in the DOM.");
        return;
    }

    // Define default theme colors
    const defaultColors = {
        primary: "#3498db",
        secondary: "#FFFFFF",
        accent1: "#e74c3c",
        accent2: "#e74c3c"
    };

    // Apply default theme
    const header = document.querySelector("header");
    if (header) header.style.backgroundColor = defaultColors.accent1;

    let likedPacks = new Set(JSON.parse(localStorage.getItem("likedPacks")) || []);

    const token = localStorage.getItem("token");

    if (token) {
        try {
            const userRes = await fetch("https://colorpack-backend-132344824938.us-central1.run.app/api/users/me", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (userRes.ok) {
                const userData = await userRes.json();
                likedPacks = new Set(userData.likedColorPacks.map(pack => pack._id));
            }
        } catch (error) {
            console.error("❌ Error fetching user liked color packs:", error);
        }
    }

    try {
        // Fetch color packs from the backend
        const response = await fetch("https://colorpack-backend-132344824938.us-central1.run.app/api/colorpacks");
        const colorPacks = await response.json();

        // Clear existing theme packs
        themeCardsContainer.innerHTML = "";

        // Loop through color packs and generate HTML
        colorPacks.forEach(pack => {
            const themeCard = document.createElement("div");
            themeCard.className = "hover:scale-110 transition-transform duration-200 ease-in-out theme-pack p-4 bg-white rounded-lg shadow-lg cursor-pointer";
            themeCard.dataset.packId = pack._id;

            const isLiked = likedPacks.has(pack._id); // Check if user liked it

            // Add theme name, author, and color swatches
            themeCard.innerHTML = `
                <p class="text-lg font-bold">${pack.name}</p>
                <p class="text-sm text-gray-500">By: ${pack.author || "Anonymous"}</p>
                <div class="w-full h-px bg-gray-300 my-2"></div>
                
                <!-- Color Preview -->
                <div class="justify-center mt-2 flex gap-2">
                    ${createColorSwatch(pack.primary)}
                    ${createColorSwatch(pack.secondary)}
                    ${createColorSwatch(pack.accent1)}
                    ${createColorSwatch(pack.accent2)}
                </div>

                <div class="flex items-center mt-3 justify-evenly w-full">
                    <!-- Like Button -->
                    <div onClick={handleLike(event.currentTarget)} class="like-btn flex justify-center items-center gap-2 text-gray-500 hover:text-yellow-500 transition duration-200 w-24 h-12 px-4 py-2 rounded-lg border border-transparent 
                        ${isLiked ? "text-yellow-400" : "text-gray-500"}"
                        data-pack-id="${pack._id}">
                        <i class="fas fa-thumbs-up text-xl"></i>
                        <span class="text-sm font-bold">${pack.likes}</span>
                    </div>

                    <!-- Dislike Button -->
                    <div onClick={handleDislike(event.currentTarget)} class="dislike-btn flex justify-center items-center gap-2 text-gray-500 hover:text-red-400 transition duration-200 w-24 h-12 px-4 py-2 rounded-lg border border-transparent"
                        data-pack-id="${pack._id}">
                        <i class="fas fa-thumbs-down text-xl"></i>
                        <span class="text-sm font-bold">${pack.dislikes}</span>
                    </div>
                </div>
            `;

            // Apply theme on click (except for like/dislike)
            themeCard.addEventListener("click", (event) => {
                if (!event.target.closest(".like-btn") && !event.target.closest(".dislike-btn")) {
                    applyTheme(pack);
                }
            });

            themeCardsContainer.appendChild(themeCard);
        });

        // Add reset functionality
        document.getElementById("reset").addEventListener("click", resetTheme);

    } catch (error) {
        console.error("❌ Error fetching color packs:", error);
    }
});

/**
 * Reset the theme to default colors
 */
function resetTheme() {
    const defaultColors = {
        primary: "#3498db",
        secondary: "#FFFFFF",
        accent1: "#e74c3c",
        accent2: "#e74c3c"
    };

    document.documentElement.style.setProperty('--primary-color', defaultColors.primary);
    document.documentElement.style.setProperty('--secondary-color', defaultColors.secondary);
    document.documentElement.style.setProperty('--accent1-color', defaultColors.accent1);
    document.documentElement.style.setProperty('--accent2-color', defaultColors.accent2);

    document.body.style.backgroundColor = defaultColors.primary;
    document.body.style.color = defaultColors.secondary;

    const header = document.querySelector('header');
    if (header) {
        header.style.backgroundColor = defaultColors.accent1;
    }

    const cbtn = document.getElementById('createBtn');
    if (cbtn) {
        cbtn.style.backgroundColor= defaultColors.accent1;
        cbtn.style.color = defaultColors.secondary;
    }

}

/**
 * Apply selected color theme
 */
function applyTheme(pack) {
    document.documentElement.style.setProperty("--primary-color", pack.primary);
    document.documentElement.style.setProperty("--secondary-color", pack.secondary);
    document.documentElement.style.setProperty("--accent1-color", pack.accent1);
    document.documentElement.style.setProperty("--accent2-color", pack.accent2);

    document.body.style.backgroundColor = pack.primary;
    document.body.style.color = pack.secondary;

    const header = document.querySelector("header");
    if (header) {
        header.style.backgroundColor = pack.accent1;
    }

    const create = document.getElementById("createBtn");
    if (create) {
        create.style.backgroundColor = pack.accent1;
        create.style.color = pack.secondary;
    }
}

/**
 * Create a color swatch div
 */
function createColorSwatch(color) {
    return `
        <div class="relative group">
            <div class="w-6 h-10 rounded-lg hover:scale-125 transition-transform duration-200 cursor-pointer"
                 style="background-color: ${color};"
                 onclick="copyToClipboard('${color}', this)">
            </div>
            <span class="absolute left-6 -top-6 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                ${color}
            </span>
        </div>
    `;
}
