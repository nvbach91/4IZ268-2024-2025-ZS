import { auth, db } from './firebase-init.js';
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import Auth from './auth.js';
import Notifications from './notifications.js';
import Utils from './utils.js';

const Profile = {
    async render() {
        if (!await Auth.checkLoginState()) {
            window.location.hash = 'login';
            return '';
        }

        const user = auth.currentUser;

        return `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card shadow">
                            <div class="card-header bg-primary text-white">
                                <h2 class="mb-0">👤 My Profile</h2>
                            </div>
                            <div class="card-body">
                                <form id="profileForm" class="needs-validation" novalidate>
                                    <div class="mb-4">
                                        <label class="form-label">Name</label>
                                        <input type="text" 
                                            class="form-control form-control-lg" 
                                            name="name" 
                                            value="${user?.displayName || ''}"
                                            placeholder="Enter your name"
                                            required>
                                        <div class="invalid-feedback">
                                            Please enter your name
                                        </div>
                                    </div>

                                    <div class="mb-4">
                                        <label class="form-label">Email</label>
                                        <input type="email" 
                                            class="form-control form-control-lg" 
                                            value="${user?.email || ''}"
                                            disabled>
                                        <small class="text-muted">Email cannot be changed</small>
                                    </div>

                                    <div class="mb-4">
                                        <label class="form-label">Phone Number</label>
                                        <input type="tel" 
                                            class="form-control form-control-lg" 
                                            name="phone"
                                            value=""
                                            placeholder="Enter your phone number">
                                    </div>

                                    <div class="mb-4">
                                        <label class="form-label">Preferred Language</label>
                                        <select class="form-select form-select-lg" name="language">
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                        </select>
                                    </div>

                                    <div class="d-grid gap-2">
                                        <button type="submit" class="btn btn-primary btn-lg">
                                            💾 Update Profile
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    bindEvents() {
        document.addEventListener("submit", async (e) => {
            if (e.target.matches("#profileForm")) {
                e.preventDefault();
                const form = e.target;

                if (!form.checkValidity()) {
                    e.stopPropagation();
                    form.classList.add("was-validated");
                    return;
                }

                try {
                    Utils.showLoading();
                    const formData = new FormData(form);

                    const profileData = {
                        displayName: formData.get("name"),
                        phoneNumber: formData.get("phone"),
                        preferences: {
                            language: formData.get("language")
                        }
                    };

                    const user = auth.currentUser;
                    if (!user) throw new Error("User is not logged in.");

                    await updateProfile(user, {
                        displayName: profileData.displayName
                    });

                    await setDoc(doc(db, "users", user.uid), {
                        ...profileData,
                        updatedAt: serverTimestamp()
                    }, { merge: true });

                    Notifications.showAlert("Profile updated successfully!", "success");
                } catch (error) {
                    console.error("Error updating profile:", error);
                    Notifications.showAlert("Failed to update profile. Please try again.", "error");
                } finally {
                    Utils.hideLoading();
                }
            }
        });
    },

    async init() {
        this.bindEvents();

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User is not logged in.");

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                const form = document.getElementById("profileForm");

                if (form && data) {
                    if (data.preferences?.language) {
                        form.querySelector('[name="language"]').value = data.preferences.language;
                    }
                    if (data.phoneNumber) {
                        form.querySelector('[name="phone"]').value = data.phoneNumber;
                    }
                }
            }
        } catch (error) {
            console.error("Error loading user preferences:", error);
            Notifications.showAlert("Failed to load user profile.", "error");
        }
    }
};

export default Profile;
