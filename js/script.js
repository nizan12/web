document.addEventListener("DOMContentLoaded", function () {
    // ==========================================================
    // 1️⃣ ADMIN DATA (nama, email, role)
    // ==========================================================
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    if (!adminData) {
        adminData = {
            name: "Admin Nizan",
            email: "nizan@polibatam.ac.id",
            role: "Admin",
        };
        localStorage.setItem("adminData", JSON.stringify(adminData));
    }

    // Tampilkan nama admin di dashboard
    const adminNameEl = document.getElementById("adminName");
    if (adminNameEl) adminNameEl.textContent = `Halo, ${adminData.name} 👋`;

    // ==========================================================
    // 2️⃣ DATA NOTULEN (localStorage)
    // ==========================================================
    const tableBody = document.getElementById("tableBody");

    const notulenData = JSON.parse(localStorage.getItem("notulenData")) || [];

    function saveNotulenData(data) {
        localStorage.setItem("notulenData", JSON.stringify(data));
    }

    function renderNotulenTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = "";
        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Data notulen tidak ditemukan.</td></tr>`;
            return;
        }
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

    // ==========================================================
    // 3️⃣ HAPUS DATA NOTULEN
    // ==========================================================
    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-delete");
        if (!btn || !tableBody) return;
        const index = btn.dataset.index;
        if (confirm("Yakin mau hapus data ini?")) {
            notulenData.splice(index, 1);
            saveNotulenData(notulenData);
            renderNotulenTable(notulenData);
        }
    });

    // ==========================================================
    // 4️⃣ PENCARIAN
    // ==========================================================
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

    // ==========================================================
    // 5️⃣ LOGOUT FUNCTION
    // ==========================================================
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            if (confirm("Apakah kamu yakin ingin logout?")) {
                localStorage.removeItem("userData");
                localStorage.removeItem("adminData");
                window.location.href = "../login.html";
            }
        });
    }

    // ==========================================================
    // 6️⃣ SIDEBAR TOGGLE
    // ==========================================================
    const toggleBtn = document.getElementById("toggleSidebar");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (toggleBtn && sidebar && overlay) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
            overlay.classList.toggle("active");
            document.body.classList.toggle("no-scroll");
        });

        overlay.addEventListener("click", () => {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
            document.body.classList.remove("no-scroll");
        });
    }

    // ==========================================================
    // 7️⃣ DATA PENGGUNA (SIMULASI)
    // ==========================================================
    const users = [
        { id: 1, name: "Rian", email: "rian@gmail.com", role: "Peserta", photo: "https://randomuser.me/api/portraits/men/44.jpg" },
        { id: 2, name: "Sinta", email: "sinta@gmail.com", role: "Peserta", photo: "https://randomuser.me/api/portraits/women/45.jpg" },
        { id: 3, name: "Yudha", email: "yudha@gmail.com", role: "Peserta", photo: "https://randomuser.me/api/portraits/men/56.jpg" },
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

    // ==========================================================
    // 8️⃣ FORM TAMBAH NOTULEN
    // ==========================================================
    const notulenForm = document.getElementById("notulenForm");
    if (notulenForm) {
        notulenForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const judul = document.getElementById("judul").value.trim();
            const tanggal = document.getElementById("tanggal").value.trim();
            const isi = tinymce.get("isi") ? tinymce.get("isi").getContent() : "";
            const peserta = Array.from(document.querySelectorAll(".form-check-input:checked")).map(cb => cb.value);
            const pembuat = adminData?.name || "Admin";
            const fileInput = document.getElementById("fileInput");
            let lampiranURL = null;
            if (fileInput && fileInput.files.length > 0) {
                lampiranURL = URL.createObjectURL(fileInput.files[0]);
            }

            const newNotulen = { judul, tanggal, pembuat, isi, peserta, lampiran: lampiranURL };

            notulenData.push(newNotulen);
            saveNotulenData(notulenData);
            localStorage.setItem("detailNotulen", JSON.stringify(newNotulen));

            const alertBox = document.getElementById("alertBox");
            if (alertBox) alertBox.style.display = "block";

            setTimeout(() => {
                if (alertBox) alertBox.style.display = "none";
                notulenForm.reset();
                window.location.href = "dashboard_admin.html";
            }, 1000);
        });
    }

    // ==========================================================
    // 9️⃣ FORM TAMBAH PENGGUNA
    // ==========================================================
    const addUserForm = document.getElementById("addUserForm");
    const alertBox = document.getElementById("alertBox");
    if (addUserForm) {
        addUserForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nama = document.getElementById("nama").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const role = document.getElementById("role").value;
            if (!nama || !email || !password) return alert("Semua field wajib diisi!");
            console.log("Pengguna baru:", { nama, email, password, role });
            if (alertBox) alertBox.style.display = "block";
            addUserForm.reset();
            setTimeout(() => (alertBox ? (alertBox.style.display = "none") : null), 2000);
        });
    }

    // ==========================================================
    // 🔟 EDIT PROFILE ADMIN
    // ==========================================================
    const profileNama = document.getElementById("profileNama");
    const profileEmail = document.getElementById("profileEmail");
    const editProfileBtn = document.getElementById("editprofile");

    if (profileNama) profileNama.textContent = adminData.name;
    if (profileEmail) profileEmail.textContent = adminData.email;
    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", function () {
            window.location.href = "edit_profile_admin.html";
        });
    }

    // ==========================================================
// 1️⃣1️⃣ EDIT NOTULEN (edit_rapat_admin.html)
// ==========================================================
const editForm = document.getElementById("editForm");
if (editForm) {
  const detail = JSON.parse(localStorage.getItem("detailNotulen"));
  const notulenData = JSON.parse(localStorage.getItem("notulenData")) || [];

  if (!detail) {
    alert("Data notulen tidak ditemukan!");
    window.location.href = "notulen_admin.html";
    return;
  }

  // === Isi data lama ke form ===
  document.getElementById("judul").value = detail.judul || "";
  document.getElementById("tanggal").value = detail.tanggal || "";

  // Inisialisasi TinyMCE jika digunakan
  if (typeof tinymce !== "undefined") {
    tinymce.init({
      selector: "#isi",
      height: 300,
      setup: (editor) => {
        editor.on("init", () => {
          editor.setContent(detail.isi || "");
        });
      },
    });
  } else {
    document.getElementById("isi").value = detail.isi || "";
  }

  // === Tampilkan daftar peserta ===
  const pesertaContainer = document.getElementById("pesertaContainer");
  const semuaPeserta = JSON.parse(localStorage.getItem("pesertaList")) || [
    "rian",
    "tes",
    "yohana",
    "joko",
  ];

  pesertaContainer.innerHTML = semuaPeserta
    .map(
      (nama) => `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="${nama}" ${
        detail.peserta?.includes(nama) ? "checked" : ""
      }>
      <label class="form-check-label text-capitalize">${nama}</label>
    </div>`
    )
    .join("");

  // === Tampilkan info lampiran lama ===
  const lampiranInfo = document.createElement("small");
  lampiranInfo.classList.add("text-muted", "d-block", "mt-1");
  if (detail.lampiran) {
    lampiranInfo.innerHTML = `Lampiran sebelumnya: 
      <a href="${detail.lampiran}" target="_blank">${detail.lampiran}</a>`;
  }
  const fileInput = document.getElementById("lampiran");
  fileInput.insertAdjacentElement("afterend", lampiranInfo);

  // === Saat disubmit ===
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!confirm("Simpan perubahan notulen ini?")) return;

    const updatedIsi =
      typeof tinymce !== "undefined" && tinymce.get("isi")
        ? tinymce.get("isi").getContent()
        : document.getElementById("isi").value.trim();

    const updated = {
      ...detail,
      judul: document.getElementById("judul").value.trim(),
      tanggal: document.getElementById("tanggal").value.trim(),
      isi: updatedIsi,
      peserta: Array.from(
        document.querySelectorAll("#pesertaContainer input:checked")
      ).map((i) => i.value),
    };

    // Update lampiran jika ada file baru
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      updated.lampiran = URL.createObjectURL(file);
    }

    // Update data di array notulenData
    const index = notulenData.findIndex(
      (item) => item.judul === detail.judul && item.tanggal === detail.tanggal
    );
    if (index !== -1) {
      notulenData[index] = updated;
    }

    // Simpan ulang ke localStorage
    localStorage.setItem("notulenData", JSON.stringify(notulenData));
    localStorage.setItem("detailNotulen", JSON.stringify(updated));

    alert("Perubahan berhasil disimpan!");
    window.location.href = "notulen_admin.html";
  });
}


    // ==========================================================
    // 1️⃣2️⃣ INIT TinyMCE
    // ==========================================================
    if (typeof tinymce !== "undefined") {
        tinymce.init({
            selector: "#isi",
            plugins: [
                "anchor", "autolink", "charmap", "codesample", "emoticons", "image", "link", "lists", "media",
                "searchreplace", "table", "visualblocks", "wordcount", "code"
            ],
            toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | " +
                "link image media table mergetags | align lineheight | numlist bullist | removeformat",
            tinycomments_mode: "embedded",
            tinycomments_author: adminData.name,
        });
    }
});
