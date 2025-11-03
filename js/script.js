document.addEventListener("DOMContentLoaded", function () {

    // ==========================================================
    // 1️⃣ ADMIN DATA
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

    const adminNameEl = document.getElementById("adminName");
    if (adminNameEl) adminNameEl.textContent = `Halo, ${adminData.name} 👋`;

    // ==========================================================
    // 2️⃣ NOTULEN DATA
    // ==========================================================
    const tableBody = document.getElementById("tableBody");

    function getNotulenData() {
        return JSON.parse(localStorage.getItem("notulenData")) || [];
    }

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
                    <td>${item.pembuat || adminData.name}</td>
                    <td>
                        <a href="detail_rapat_admin.html?id=${index}" class="btn btn-view" title="Lihat">
                            <i class="bi bi-eye"></i>
                        </a>
                        <a href="edit_rapat_admin.html?id=${index}" class="btn btn-edit" title="Edit" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </a>

                        <button class="btn btn-delete-notulen" data-index="${index}" title="Hapus">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });
    }

    renderNotulenTable(getNotulenData());

    // ==========================================================
    // 3️⃣ TAMBAH NOTULEN
    // ==========================================================
    const notulenForm = document.getElementById("notulenForm");
    const alertBox = document.getElementById("alertBox");

    if (notulenForm) {
        notulenForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const judul = document.getElementById("judul").value.trim();
            const tanggal = document.getElementById("tanggal").value;
            const isi = tinymce.get("isi") ? tinymce.get("isi").getContent() : document.getElementById("isi").value.trim();
            const fileInput = document.getElementById("fileInput");
            const peserta = Array.from(notulenForm.querySelectorAll('input[type="checkbox"]:checked')).map(i => i.value);

            if (!judul || !tanggal || !isi) {
                alert("Judul, tanggal, dan isi wajib diisi!");
                return;
            }

            const lampiran = fileInput && fileInput.files.length > 0 ? URL.createObjectURL(fileInput.files[0]) : "";

            const notulenData = getNotulenData();
            const newNotulen = { judul, tanggal, isi, peserta, lampiran, pembuat: adminData.name };
            notulenData.push(newNotulen);
            saveNotulenData(notulenData);

            if (alertBox) {
                alertBox.style.display = "block";
                setTimeout(() => alertBox.style.display = "none", 2000);
            }

            notulenForm.reset();
            if (tinymce.get("isi")) tinymce.get("isi").setContent("");
            renderNotulenTable(notulenData);
        });
    }

    // ==========================================================
    // 4️⃣ HAPUS NOTULEN
    // ==========================================================
    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-delete-notulen");
        if (!btn) return;

        const index = btn.dataset.index;
        if (index !== undefined && confirm("Yakin mau hapus data ini?")) {
            const notulenData = getNotulenData();
            notulenData.splice(index, 1);
            saveNotulenData(notulenData);
            renderNotulenTable(notulenData);
        }
    });

    // ==========================================================
    // 5️⃣ PENCARIAN NOTULEN
    // ==========================================================
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const keyword = this.value.toLowerCase();
            const filtered = getNotulenData().filter(
                item =>
                    item.judul.toLowerCase().includes(keyword) ||
                    item.peserta.join(",").toLowerCase().includes(keyword) ||
                    item.tanggal.includes(keyword)
            );
            renderNotulenTable(filtered);
        });
    }

    // ==========================================================
    // 6️⃣ LOGOUT
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
    // 7️⃣ SIDEBAR TOGGLE
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
    // 8️⃣ DATA PENGGUNA
    // ==========================================================
    const userTableBody = document.getElementById("userTableBody");

    function renderUserTable() {
        const users = JSON.parse(localStorage.getItem("userData")) || [];
        if (!userTableBody) return;

        userTableBody.innerHTML = "";

        if (users.length === 0) {
            userTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Belum ada pengguna.</td></tr>`;
            return;
        }

        users.forEach((u, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td><img src="${u.foto || `https://lipsum.app/id/${index + 90}/40x40`}" alt="${u.nama}" class="rounded-circle" width="40"></td>
                    <td>${u.nama}</td>
                    <td>${u.email}</td>
                    <td><span class="badge-role">${u.role}</span></td>
                    <td>
                        <button class="btn btn-delete-user btn-sm" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            userTableBody.insertAdjacentHTML("beforeend", row);
        });
    }

    renderUserTable();

    // ==========================================================
    // 9️⃣ HAPUS PENGGUNA
    // ==========================================================
    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-delete-user");
        if (!btn) return;

        const index = btn.dataset.index;
        if (index !== undefined && confirm("Yakin ingin menghapus pengguna ini?")) {
            const users = JSON.parse(localStorage.getItem("userData")) || [];
            users.splice(index, 1);
            localStorage.setItem("userData", JSON.stringify(users));
            renderUserTable();
        }
    });

    // ==========================================================
    // 🔟 TAMBAH PENGGUNA
    // ==========================================================
    const addUserForm = document.getElementById("addUserForm");
    const userAlertBox = document.getElementById("alertBoxUser");

    if (addUserForm) {
        addUserForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nama = document.getElementById("nama").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const role = document.getElementById("role").value;

            if (!nama || !email || !password) return alert("Semua field wajib diisi!");

            const users = JSON.parse(localStorage.getItem("userData")) || [];
            users.push({ nama, email, password, role, foto: "" });
            localStorage.setItem("userData", JSON.stringify(users));

            if (userAlertBox) {
                userAlertBox.style.display = "block";
                setTimeout(() => userAlertBox.style.display = "none", 2000);
            }

            addUserForm.reset();
            renderUserTable();
        });
    }

    // ==========================================================
    // 1️⃣1️⃣ EDIT PROFILE ADMIN
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

    document.addEventListener("click", function (e) {
        const btnEdit = e.target.closest(".btn-edit");
        if (btnEdit) {
            e.preventDefault();
            const index = btnEdit.dataset.index || btnEdit.href.split("id=")[1];
            const notulenData = JSON.parse(localStorage.getItem("notulenData")) || [];
            const detail = notulenData[index];
            if (detail) {
                localStorage.setItem("detailNotulen", JSON.stringify(detail));
                window.location.href = btnEdit.href; // redirect ke edit page
            } else {
                alert("Data notulen tidak ditemukan!");
            }
        }
    });

    // ==========================================================
    // 1️⃣2️⃣ EDIT NOTULEN
    // ==========================================================
    const editForm = document.getElementById("editForm");
    if (editForm) {
        const detail = JSON.parse(localStorage.getItem("detailNotulen"));
        const notulenData = getNotulenData();

        if (!detail) {
            alert("Data notulen tidak ditemukan!");
            window.location.href = "notulen_admin.html";
            return;
        }

        document.getElementById("judul").value = detail.judul || "";
        document.getElementById("tanggal").value = detail.tanggal || "";

        if (typeof tinymce !== "undefined") {
            tinymce.init({
                selector: "#isi",
                height: 300,
                setup: (editor) => {
                    editor.on("init", () => editor.setContent(detail.isi || ""));
                },
            });
        } else {
            document.getElementById("isi").value = detail.isi || "";
        }

        const pesertaContainer = document.getElementById("pesertaContainer");
        const semuaPeserta = JSON.parse(localStorage.getItem("pesertaList")) || ["rian", "tes", "yudha", "rian12"];

        pesertaContainer.innerHTML = semuaPeserta
            .map(
                (nama) => `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${nama}" ${detail.peserta?.includes(nama) ? "checked" : ""}>
                    <label class="form-check-label text-capitalize">${nama}</label>
                </div>`
            )
            .join("");

        const lampiranInfo = document.createElement("small");
        lampiranInfo.classList.add("text-muted", "d-block", "mt-1");
        const fileInput = document.getElementById("lampiran");
        if (detail.lampiran) {
            lampiranInfo.innerHTML = `Lampiran sebelumnya: <a href="${detail.lampiran}" target="_blank">${detail.lampiran}</a>`;
        }
        if (fileInput) fileInput.insertAdjacentElement("afterend", lampiranInfo);

        editForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!confirm("Simpan perubahan notulen ini?")) return;

            const updatedIsi = typeof tinymce !== "undefined" && tinymce.get("isi") ? tinymce.get("isi").getContent() : document.getElementById("isi").value.trim();

            const updated = {
                ...detail,
                judul: document.getElementById("judul").value.trim(),
                tanggal: document.getElementById("tanggal").value.trim(),
                isi: updatedIsi,
                peserta: Array.from(document.querySelectorAll("#pesertaContainer input:checked")).map((i) => i.value),
            };

            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                updated.lampiran = URL.createObjectURL(file);
            }

            const index = notulenData.findIndex(item => item.judul === detail.judul && item.tanggal === detail.tanggal);
            if (index !== -1) {
                notulenData[index] = updated;
            }

            saveNotulenData(notulenData);
            localStorage.setItem("detailNotulen", JSON.stringify(updated));

            alert("Perubahan berhasil disimpan!");
            window.location.href = "notulen_admin.html";
        });
    }

    // ==========================================================
    // 1️⃣3️⃣ INIT TINYMCE
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
