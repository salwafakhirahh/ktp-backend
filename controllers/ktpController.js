import pool from '../config/db.js';

// GET ALL (kecuali yang sudah dihapus)
export const getAllKtp = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ktp WHERE is_deleted = FALSE ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET BY NIK
export const getKtpByNik = async (req, res) => {
    try {
        const { nik } = req.params;
        const result = await pool.query('SELECT * FROM ktp WHERE nik = $1 AND is_deleted = FALSE', [nik]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('getKtpByNik error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// CREATE (dengan foto & signature base64)
export const createKtp = async (req, res) => {
    try {
        const {
            nik, nama, ttl, jk, goldar,
            alamat, rt, kelurahan, kecamatan,
            kabupaten, agama, status, pekerjaan, wn,
            foto, signature
        } = req.body;

        // Validasi NIK
        if (!/^\d{16}$/.test(nik)) {
            return res.status(400).json({ message: 'NIK harus 16 digit angka' });
        }

        // Tentukan jenis wilayah (KABUPATEN/KOTA)
        const jenis_wilayah = kabupaten?.toLowerCase().includes('kota') ? 'KOTA' : 'KABUPATEN';

        const result = await pool.query(
            `INSERT INTO ktp (
                nik, nama, ttl, jk, goldar,
                alamat, rt, kelurahan, kecamatan,
                kabupaten, jenis_wilayah,
                agama, status, pekerjaan, wn,
                foto, signature
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING *`,
            [
                nik, nama, ttl, jk, goldar,
                alamat, rt, kelurahan, kecamatan,
                kabupaten, jenis_wilayah,
                agama, status, pekerjaan, wn,
                foto, signature
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('CREATE ERROR:', error);
        if (error.code === '23505') {
            return res.status(400).json({ message: 'NIK sudah terdaftar' });
        }
        res.status(500).json({ message: error.message });
    }
};

// UPDATE (dengan foto & signature)
export const updateKtp = async (req, res) => {
    try {
        const { nik } = req.params;
        const {
            nama, ttl, jk, goldar,
            alamat, rt, kelurahan, kecamatan,
            kabupaten, agama, status, pekerjaan, wn,
            foto, signature
        } = req.body;

        // Cek apakah data dengan NIK ini ada
        const check = await pool.query('SELECT * FROM ktp WHERE nik = $1 AND is_deleted = FALSE', [nik]);
        if (check.rows.length === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        const jenis_wilayah = kabupaten?.toLowerCase().includes('kota') ? 'KOTA' : 'KABUPATEN';

        const result = await pool.query(
            `UPDATE ktp SET
                nama = $1, ttl = $2, jk = $3, goldar = $4,
                alamat = $5, rt = $6, kelurahan = $7, kecamatan = $8,
                kabupaten = $9, jenis_wilayah = $10,
                agama = $11, status = $12, pekerjaan = $13, wn = $14,
                foto = $15, signature = $16
            WHERE nik = $17
            RETURNING *`,
            [
                nama, ttl, jk, goldar,
                alamat, rt, kelurahan, kecamatan,
                kabupaten, jenis_wilayah,
                agama, status, pekerjaan, wn,
                foto, signature,
                nik
            ]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('UPDATE ERROR:', error);
        res.status(500).json({ message: error.message });
    }
};

// DELETE (soft delete)
export const deleteKtp = async (req, res) => {
    try {
        const { nik } = req.params;
        await pool.query('UPDATE ktp SET is_deleted = TRUE WHERE nik = $1', [nik]);
        res.json({ message: 'Data berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// RESTORE (mengembalikan data yang dihapus)
export const restoreKtp = async (req, res) => {
    try {
        const { nik } = req.params;
        await pool.query('UPDATE ktp SET is_deleted = FALSE WHERE nik = $1', [nik]);
        res.json({ message: 'Data berhasil direstore' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};