/* =================================================_
   AMK CLOTHING - MASTER SYSTEM SCRIPT (localStorage SYNC)
   ================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize default client data structure if not present
  if (!localStorage.getItem('userName')) {
    localStorage.setItem('userName', 'Latecia');
    localStorage.setItem('userEmail', 'latecia@rosebank.co.za');
    localStorage.setItem('userPhone', '+27 82 000 0000');
    localStorage.setItem('userPassword', '••••••••');
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', 'client');
  }

  updateHeaderAuthState();
  syncCartAndWishlistBadges();
});

/* =================================================_
   1. AUTHENTICATION & HEADER STATE
   ================================================= */

function updateHeaderAuthState() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const authText = document.getElementById('headerAuthText');
  const clientName = localStorage.getItem('userName') || 'Latecia';
  const clientEmail = localStorage.getItem('userEmail') || 'latecia@rosebank.co.za';

  if (isLoggedIn && authText) {
    authText.textContent = clientName;
    const dropName = document.getElementById('dropdownClientName');
    const dropEmail = document.getElementById('dropdownClientEmail');
    if (dropName) dropName.textContent = clientName;
    if (dropEmail) dropEmail.textContent = clientEmail;
  } else if (authText) {
    authText.textContent = "Sign In";
    const dropdown = document.getElementById('storefrontProfileDropdown');
    if (dropdown) dropdown.style.display = 'none';
  }
}

function handleProfileClick(e) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn) {
    e.preventDefault();
    e.stopPropagation();
    
    const dropdown = document.getElementById('storefrontProfileDropdown');
    if (dropdown) {
      const isHidden = dropdown.style.display === 'none' || dropdown.style.display === '';
      dropdown.style.display = isHidden ? 'block' : 'none';
    }
  } else {
    window.location.href = 'login-selection.html';
  }
}

function logoutClient() {
  localStorage.setItem('isLoggedIn', 'false');
  localStorage.removeItem('userType');
  
  const dropdown = document.getElementById('storefrontProfileDropdown');
  if (dropdown) dropdown.style.display = 'none';
  
  alert('Logged out successfully.');
  window.location.href = 'index.html';
}

/* =================================================_
   STRICT AUTHENTICATION GUARD FOR NAV ICONS
   ================================================= */
function checkClientAuth(actionName) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    alert(`Authentication Required: Please sign in or create an account to ${actionName}.`);
    window.location.href = 'login-selection.html';
    return false; // Blocks navigation
  }
  return true; // Allows access
}

/* =================================================_
   2. EDIT PROFILE FUNCTIONS (Name, Email, Phone, Password)
   ================================================= */

function openEditProfileModal() {
  const dropdown = document.getElementById('storefrontProfileDropdown');
  if (dropdown) dropdown.style.display = 'none';

  const currentName = localStorage.getItem('userName') || 'Latecia';
  const currentEmail = localStorage.getItem('userEmail') || 'latecia@rosebank.co.za';
  const currentPhone = localStorage.getItem('userPhone') || '+27 82 000 0000';
  const currentPassword = localStorage.getItem('userPassword') || '••••••••';

  const nameInput = document.getElementById('editNameInput');
  const emailInput = document.getElementById('editEmailInput');
  const phoneInput = document.getElementById('editPhoneInput');
  const passInput = document.getElementById('editPasswordInput');

  if (nameInput) nameInput.value = currentName;
  if (emailInput) emailInput.value = currentEmail;
  if (phoneInput) phoneInput.value = currentPhone;
  if (passInput) passInput.value = currentPassword;

  const modal = document.getElementById('editProfileModal');
  if (modal) modal.style.display = 'flex';
}

function closeEditProfileModal() {
  const modal = document.getElementById('editProfileModal');
  if (modal) modal.style.display = 'none';
}

function saveProfileChanges(e) {
  e.preventDefault();
  const newName = document.getElementById('editNameInput').value.trim();
  const newEmail = document.getElementById('editEmailInput').value.trim();
  const newPhone = document.getElementById('editPhoneInput').value.trim();
  const newPassword = document.getElementById('editPasswordInput').value.trim();

  if (!newName || !newEmail || !newPhone || !newPassword) {
    alert("Please fill in all fields to update your profile.");
    return;
  }

  localStorage.setItem('userName', newName);
  localStorage.setItem('userEmail', newEmail);
  localStorage.setItem('userPhone', newPhone);
  localStorage.setItem('userPassword', newPassword);

  alert("Profile updated successfully!");
  closeEditProfileModal();
  updateHeaderAuthState();
}

/* =================================================_
   3. ADMIN PRODUCT MANAGEMENT (ADD, EDIT, DELETE, SALE)
   ================================================= */

function getAllProducts() {
  const defaultProducts = [
    { id: 'p1', title: "Signature Petite Tailored Evening Dress", price: "R 1,650.00", category: "Petite", sizes: ["Petite XXS", "Petite XS", "Petite S", "Petite M", "Petite L"], images: ["Images/Outfit_Pics/WomanPetitedress.jpg", "Images/Outfit_Pics/WomanPetitedress2.jpg", "Images/Outfit_Pics/WomanPetitedress3.jpg"] },
    { id: 'p2', title: "Classic Petite Summer Wrap Dress", price: "R 1,450.00", category: "Petite", sizes: ["Petite XXS", "Petite XS", "Petite S", "Petite M"], images: ["Images/Outfit_Pics/womanpetitedress4.jpg", "Images/Outfit_Pics/womanpetitedress5.jpg", "Images/Outfit_Pics/womanpetitedress6.jpg"] },
    { id: 'c1', title: "Signature Curve Tailored Evening Gown", price: "R 1,850.00", category: "Curve", sizes: ["1XL", "2XL", "3XL", "4XL", "Custom Fit"], images: ["Images/Outfit_Pics/WomanCurvedress.jpg", "Images/Outfit_Pics/Womancurvedress1.jpg", "Images/Outfit_Pics/WomanCurvedress2.jpg"] },
    { id: 'c2', title: "Classic Curve Wrap Dress", price: "R 1,550.00", category: "Curve", sizes: ["1XL", "2XL", "3XL", "Custom Fit"], images: ["Images/Outfit_Pics/WomanCurvedress3.jpg", "Images/Outfit_Pics/WomanCurvedress5.jpg", "Images/Outfit_Pics/womancurvedress6.jpg"] },
    { id: 'k1', title: "Signature Kids' Traditional & Formal Outfit", price: "R 850.00", category: "Kids", sizes: ["Age 3-4", "Age 5-6", "Age 7-8", "Age 9-10"], images: ["Images/Outfit_Pics/kids1.jpg", "Images/Outfit_Pics/WomanPetitedress.jpg", "Images/Outfit_Pics/WomanCurvedress.jpg"] }
  ];

  let adminUploaded = JSON.parse(localStorage.getItem('adminUploadedProducts')) || [];
  return [...defaultProducts, ...adminUploaded];
}

function saveAdminProduct(productData, editId = null) {
  let adminUploaded = JSON.parse(localStorage.getItem('adminUploadedProducts')) || [];

  if (editId) {
    adminUploaded = adminUploaded.map(p => p.id === editId ? { ...p, ...productData, id: editId } : p);
    alert("Product updated successfully!");
  } else {
    productData.id = 'admin_' + Date.now();
    adminUploaded.push(productData);
    alert("New product posted successfully!");
  }

  localStorage.setItem('adminUploadedProducts', JSON.stringify(adminUploaded));
  window.location.reload();
}

function deleteAdminProduct(productId) {
  if (confirm("Are you sure you want to delete this posted product?")) {
    let adminUploaded = JSON.parse(localStorage.getItem('adminUploadedProducts')) || [];
    adminUploaded = adminUploaded.filter(p => p.id !== productId);
    localStorage.setItem('adminUploadedProducts', JSON.stringify(adminUploaded));
    alert("Product deleted.");
    window.location.reload();
  }
}

/* =================================================_
   4. CART & WISHLIST BADGES
   ================================================= */

function syncCartAndWishlistBadges() {
  const cart = JSON.parse(localStorage.getItem('amkCart')) || [];
  const wishlist = JSON.parse(localStorage.getItem('amkWishlist')) || [];

  const cartBadge = document.getElementById('cartBadge');
  const wishlistBadge = document.getElementById('wishlistBadge');

  if (cartBadge) {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalQty;
  }
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
  }
}