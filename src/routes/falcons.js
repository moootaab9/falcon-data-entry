const express = require('express');
const multer = require('multer');
const path = require('path');
const prisma = require('../db');

const router = express.Router();

// إعداد multer لحفظ الصور في uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, name + ext);
  }
});
const upload = multer({ storage });

// إنشاء سجل صقر
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      ringNumber: req.body.ringNumber || null,
      species: req.body.species || null,
      sex: req.body.sex || null,
      age: req.body.age ? parseInt(req.body.age, 10) : null,
      weight: req.body.weight ? parseFloat(req.body.weight) : null,
      wingspan: req.body.wingspan ? parseFloat(req.body.wingspan) : null,
      owner: req.body.owner || null,
      trained: req.body.trained === 'on' || req.body.trained === 'true',
      location: req.body.location || null,
      notes: req.body.notes || null,
      photo: req.file ? `/uploads/${req.file.filename}` : null
    };
    const created = await prisma.falcon.create({ data });
    res.json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في إنشاء السجل' });
  }
});

// الحصول على جميع السجلات
router.get('/', async (req, res) => {
  try {
    const all = await prisma.falcon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في جلب السجلات' });
  }
});

// الحصول على سجل واحد
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await prisma.falcon.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'غير موجود' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ' });
  }
});

// تحديث سجل
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = {
      name: req.body.name,
      ringNumber: req.body.ringNumber || null,
      species: req.body.species || null,
      sex: req.body.sex || null,
      age: req.body.age ? parseInt(req.body.age, 10) : null,
      weight: req.body.weight ? parseFloat(req.body.weight) : null,
      wingspan: req.body.wingspan ? parseFloat(req.body.wingspan) : null,
      owner: req.body.owner || null,
      trained: req.body.trained === 'on' || req.body.trained === 'true',
      location: req.body.location || null,
      notes: req.body.notes || null
    };
    if (req.file) data.photo = `/uploads/${req.file.filename}`;
    const updated = await prisma.falcon.update({ where: { id }, data });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في التحديث' });
  }
});

// حذف سجل
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.falcon.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الحذف' });
  }
});

module.exports = router;
