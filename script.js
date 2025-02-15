let inputSlider = document.getElementById("inputSlider");
let sliderValue = document.getElementById("sliderValue");
let passBox = document.getElementById("passBox");
let lowercase = document.getElementById("lowercase");
let uppercase = document.getElementById("uppercase");
let numbers = document.getElementById("numbers");
let symbols = document.getElementById("symbols");
let genBtn = document.getElementById("genBtn");
let saveBtn = document.getElementById("saveBtn");
let copyIcon = document.getElementById("copyIcon");
let toggleVisibility = document.getElementById("toggleVisibility");
let appName = document.getElementById("appName");
let savedPasswords = document.getElementById("savedPasswords");
let toggleSaved = document.getElementById("toggleSaved");

// Update slider value
sliderValue.textContent = inputSlider.value;
inputSlider.addEventListener("input", () => {
    sliderValue.textContent = inputSlider.value;
});

// Character Sets
let lowerChars = "abcdefghijklmnopqrstuvwxyz";
let upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let allNumbers = "0123456789";
let allSymbols = "~!@#$%^&*()_+=-";

// Load saved passwords from local storage
let passwordData = JSON.parse(localStorage.getItem("passwords")) || [];
let showPasswords = false; // To control visibility
loadPasswords();

// Generate Password
function generatePassword() {
    let genPassword = "";
    let allChars = "";

    allChars += lowercase.checked ? lowerChars : "";
    allChars += uppercase.checked ? upperChars : "";
    allChars += numbers.checked ? allNumbers : "";
    allChars += symbols.checked ? allSymbols : "";

    if (allChars === "") return "";

    for (let i = 0; i < inputSlider.value; i++) {
        genPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    passBox.value = genPassword; // Display the password in the input box
}

// Generate Button Click
genBtn.addEventListener("click", () => {
    generatePassword();
});

// Copy to Clipboard
copyIcon.addEventListener("click", () => {
    navigator.clipboard.writeText(passBox.value);
    alert("Copied to clipboard!");
});

// Toggle Password Visibility
toggleVisibility.addEventListener("click", () => {
    passBox.type = passBox.type === "password" ? "text" : "password";
});

// Save Password (Now also Saves to Excel)
saveBtn.addEventListener("click", () => {
    if (!appName.value.trim() || !passBox.value.trim()) {
        alert("Please enter a website/app name and generate a password first.");
        return;
    }

    let newPassword = { Website: appName.value, Password: passBox.value };
    passwordData.push(newPassword);
    localStorage.setItem("passwords", JSON.stringify(passwordData));
    loadPasswords();
    saveToExcel();
});

// Load Saved Passwords
function loadPasswords() {
    if (!showPasswords) return;
    savedPasswords.innerHTML = passwordData.map(entry => `<li><strong>${entry.Website}:</strong> ${entry.Password}</li>`).join('');
}

// Toggle saved passwords visibility
toggleSaved.addEventListener("click", () => {
    showPasswords = !showPasswords;
    savedPasswords.classList.toggle("hidden");
    loadPasswords();
});

// Save to Excel
function saveToExcel() {
    if (passwordData.length === 0) return;

    let worksheet = XLSX.utils.json_to_sheet(passwordData);
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Passwords");

    // Create an Excel file and trigger the download
    XLSX.writeFile(workbook, "Saved_Passwords.xlsx");
}
