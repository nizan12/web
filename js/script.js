document.addEventListener("DOMContentLoaded", function () {
    // =============================
    // Data Notulen (Simulasi)
    // =============================
    const tableBody = document.getElementById("tableBody");

    const notulenData = [{
            judul: "Rapat Akhir Tahun",
            tanggal: "31/12/2025",
            pembuat: "Rian"
        },
        {
            judul: "Evaluasi Kinerja",
            tanggal: "10/10/2025",
            pembuat: "Didit"
        },
        {
            judul: "Rapat Tim Proyek",
            tanggal: "05/09/2025",
            pembuat: "Sinta"
        },
        {
            judul: "Rapat Divisi",
            tanggal: "20/10/2025",
            pembuat: "Admin"
        },
    ];

    function renderNotulenTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = "";
        data.forEach((item, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.judul}</td>
                    <td>${item.tanggal}</td>
                    <td>${item.pembuat}</td>
                    <td>
                        <a href="detail_rapat_admin.html?id=${index}" class="btn btn-view" title="Lihat">
                            <i class="bi bi-eye"></i>
                        </a>
                        <a href="edit_rapat_admin.html?id=${index}" class="btn btn-edit" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </a>
                        <button class="btn btn-delete" data-index="${index}" title="Hapus">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });
    }

    if (tableBody) renderNotulenTable(notulenData);

    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-delete");
        if (!btn) return;
        const index = btn.dataset.index;
        if (confirm("Yakin mau hapus data ini?")) {
            notulenData.splice(index, 1);
            renderNotulenTable(notulenData);
        }
    });

    const searchInput = document.getElementById("searchInput");
    if (searchInput && tableBody) {
        searchInput.addEventListener("input", function () {
            const keyword = this.value.toLowerCase();
            const filtered = notulenData.filter(
                (item) =>
                item.judul.toLowerCase().includes(keyword) ||
                item.pembuat.toLowerCase().includes(keyword) ||
                item.tanggal.includes(keyword)
            );
            renderNotulenTable(filtered);
        });
    }

    // =======================
    // Logout Function
    // =======================
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            if (confirm("Apakah kamu yakin ingin logout?")) {
                localStorage.removeItem("userData");
                window.location.href = "../login.html";
            }
        });
    }

    // ===========================
    // Sidebar Toggle
    // ===========================
    const toggleBtn = document.getElementById("toggleSidebar");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (toggleBtn && sidebar && overlay) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        overlay.addEventListener("click", () => {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
        });
    }

    // =============================
    // Data Pengguna (Simulasi)
    // =============================
    const users = [{
            id: 1,
            name: "rian",
            email: "rian@gmail.com",
            role: "Peserta",
            photo: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: 2,
            name: "rian12",
            email: "rian12@gmail.com",
            role: "Peserta",
            photo: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
            id: 3,
            name: "tes",
            email: "tes@gmail.com",
            role: "Peserta",
            photo: "https://randomuser.me/api/portraits/men/56.jpg"
        },
        {
            id: 4,
            name: "yudha",
            email: "yudha@gmail.com",
            role: "Peserta",
            photo: "https://randomuser.me/api/portraits/men/12.jpg"
        },
    ];

    const userTableBody = document.getElementById("userTableBody");

    function renderUserTable(data) {
        if (!userTableBody) return;
        userTableBody.innerHTML = "";
        data.forEach((u, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td><img src="${u.photo}" alt="${u.name}" class="user-photo"></td>
                    <td>${u.name}</td>
                    <td>${u.email}</td>
                    <td><span class="badge-role">${u.role}</span></td>
                    <td>
                        <button class="btn btn-delete btn-sm" data-id="${u.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            userTableBody.insertAdjacentHTML("beforeend", row);
        });
    }

    if (userTableBody) renderUserTable(users);

    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-delete");
        if (!btn || !userTableBody) return;
        const id = parseInt(btn.dataset.id);
        const index = users.findIndex((u) => u.id === id);
        if (index !== -1 && confirm("Yakin ingin menghapus pengguna ini?")) {
            users.splice(index, 1);
            renderUserTable(users);
        }
    });

    if (searchInput && userTableBody) {
        searchInput.addEventListener("input", function () {
            const keyword = this.value.toLowerCase();
            const filtered = users.filter(
                (u) =>
                u.name.toLowerCase().includes(keyword) ||
                u.email.toLowerCase().includes(keyword) ||
                u.role.toLowerCase().includes(keyword)
            );
            renderUserTable(filtered);
        });
    }
});


// =============================
// Edit Profile
// =============================

const adminData = JSON.parse(localStorage.getItem("adminData"))
console.log("Data di localStorage:", adminData);


if (adminData) {
    document.getElementById("profileNama").textContent = adminData.name;
    document.getElementById("profileEmail").textContent = adminData.email;
}
document.getElementById("editprofile").addEventListener("click", function () {
    window.location.href = "edit_profile_admin.html";
});

// =============================
// Simulasi Penyimpanan Peserta
// =============================
const form = document.getElementById("addUserForm");
const alertBox = document.getElementById("alertBox");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!nama || !email || !password) {
        alert("Semua field wajib diisi!");
        return;
    }

    console.log("Data pengguna baru:", {
        nama,
        email,
        password,
        role
    });

    alertBox.style.display = "block";
    form.reset();

    setTimeout(() => {
        alertBox.style.display = "none";
    }, 2000);
});



// =============================
// Simulasi Penyimpanan Form
// =============================
document.addEventListener("DOMContentLoaded", function () {
    const notulenForm = document.getElementById("notulenForm");
    if (!notulenForm) return;

    notulenForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const judul = document.getElementById("judul").value;
        const tanggal = document.getElementById("tanggal").value;
        const isi = document.getElementById("isi").value;

        const peserta = [];
        document.querySelectorAll(".form-check-input:checked").forEach((cb) => peserta.push(cb.value));

        console.log("Data Notulen:", {
            judul,
            tanggal,
            isi,
            peserta
        });

        const alertBox = document.getElementById("alertBox");
        alertBox.style.display = "block";

        setTimeout(() => {
            alertBox.style.display = "none";
            notulenForm.reset();
        }, 2000);
    });
});

// =============================
// TinyMCE Init
// =============================
if (typeof tinymce !== "undefined") {
    tinymce.init({
        selector: "#isi",
        plugins: [
            "anchor", "autolink", "charmap", "codesample", "emoticons", "image", "link", "lists", "media",
            "searchreplace", "table", "visualblocks", "wordcount", "code"
        ],
        toolbar: "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | " +
            "link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | " +
            "align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
        tinycomments_mode: "embedded",
        tinycomments_author: "Author name",
    });
}
