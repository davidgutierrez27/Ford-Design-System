window.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".unit-btn");
    const sizes = document.querySelectorAll(".type-row__size");

    function convert(px, unit) {
        if (unit === "px") return `${px}px`;
        if (unit === "rem") return `${(px / 16).toFixed(3)}rem`;
        if (unit === "pt") return `${(px * 0.75).toFixed(2)}pt`;
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const unit = btn.dataset.unit;

            sizes.forEach(el => {
                const px = Number(el.dataset.size);
                el.textContent = convert(px, unit);
            });
        });
    });
});
