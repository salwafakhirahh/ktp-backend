import express from 'express';
import {
    getAllKtp,
    getKtpByNik,
    createKtp,
    updateKtp,
    deleteKtp,
    restoreKtp
} from '../controllers/ktpController.js';

const router = express.Router();

router.get('/', getAllKtp);
router.get('/:nik', getKtpByNik);
router.post('/', createKtp);
router.put('/:nik', updateKtp);
router.delete('/:nik', deleteKtp);
router.patch('/restore/:nik', restoreKtp); // endpoint untuk mengembalikan data

export default router;