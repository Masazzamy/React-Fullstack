const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_sekolah",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Gagal koneksi ke database:", err.message);
    return;
  }
  console.log("✅ Berhasil terkoneksi ke database db_sekolah");
});

// ========================
// GET /siswa - Ambil semua data siswa
// ========================
app.get("/siswa", (req, res) => {
  console.log("[GET] /siswa - Mengambil semua data siswa...");

  const sql = "SELECT * FROM siswa";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error GET /siswa:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`✅ Berhasil mengambil ${results.length} data siswa`);
    res.json(results);
  });
});

// ========================
// POST /siswa - Tambah data siswa baru
// ========================
app.post("/siswa", (req, res) => {
  console.log("[POST] /siswa - Menambah data siswa baru...");

  const { nama, kelas, nis } = req.body;

  if (!nama || !kelas || !nis) {
    console.error("❌ Error POST /siswa: Field nama, kelas, dan nis wajib diisi");
    return res.status(400).json({ error: "Field nama, kelas, dan nis wajib diisi" });
  }

  const sql = "INSERT INTO siswa (nama, kelas, nis) VALUES (?, ?, ?)";

  db.query(sql, [nama, kelas, nis], (err, result) => {
    if (err) {
      console.error("❌ Error POST /siswa:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`✅ Data siswa berhasil ditambahkan dengan ID: ${result.insertId}`);
    res.status(201).json({ message: "Data masuk!", id: result.insertId });
  });
});

// ========================
// PUT /siswa/:id - Update data siswa berdasarkan ID
// ========================
app.put("/siswa/:id", (req, res) => {
  const { id } = req.params;
  console.log(`[PUT] /siswa/${id} - Mengupdate data siswa...`);

  const { nama, kelas, nis } = req.body;

  if (!nama || !kelas || !nis) {
    console.error("❌ Error PUT /siswa: Field nama, kelas, dan nis wajib diisi");
    return res.status(400).json({ error: "Field nama, kelas, dan nis wajib diisi" });
  }

  const sql = "UPDATE siswa SET nama = ?, kelas = ?, nis = ? WHERE id = ?";

  db.query(sql, [nama, kelas, nis, id], (err, result) => {
    if (err) {
      console.error(`❌ Error PUT /siswa/${id}:`, err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      console.error(`❌ Data siswa dengan ID ${id} tidak ditemukan`);
      return res.status(404).json({ error: `Data siswa dengan ID ${id} tidak ditemukan` });
    }
    console.log(`✅ Data siswa ID ${id} berhasil diupdate`);
    res.json({ message: "Data diupdate!" });
  });
});

// ========================
// DELETE /siswa/:id - Hapus data siswa berdasarkan ID
// ========================
app.delete("/siswa/:id", (req, res) => {
  const { id } = req.params;
  console.log(`[DELETE] /siswa/${id} - Menghapus data siswa...`);

  const sql = "DELETE FROM siswa WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(`❌ Error DELETE /siswa/${id}:`, err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      console.error(`❌ Data siswa dengan ID ${id} tidak ditemukan`);
      return res.status(404).json({ error: `Data siswa dengan ID ${id} tidak ditemukan` });
    }
    console.log(`✅ Data siswa ID ${id} berhasil dihapus`);
    res.json({ message: "Data dihapus!" });
  });
});

// ========================
// Start Server
// ========================
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
