import { useState } from 'react';
import { Dialog, DialogContent, IconButton, Box, Typography } from '@mui/material';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ZoomInOutlined from '@mui/icons-material/ZoomInOutlined';
import styles from './ImageGallery.module.scss';

export default function ImageGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const move = direction => setActive(index => (index + direction + images.length) % images.length);
  return <div className={styles.gallery}>
    <button className={styles.mainImage} onClick={() => setOpen(true)} aria-label={`Збільшити зображення: ${name}`}><img src={images[active]} alt={`${name}, зображення ${active + 1}`} width="600" height="500" /><span className={styles.zoom}><ZoomInOutlined /></span></button>
    <div className={styles.thumbnails}>{images.map((src, index) => <button key={src} className={`${styles.thumbnail} ${active === index ? styles.active : ''}`} onClick={() => setActive(index)} aria-label={`Зображення ${index + 1}`} aria-pressed={active === index}><img src={src} alt="" width="600" height="500" /></button>)}</div>
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); } }} aria-label={`Галерея: ${name}`}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 1 }}><Typography fontSize={13}>{active + 1} / {images.length}</Typography><IconButton aria-label="Закрити галерею" onClick={() => setOpen(false)}><CloseOutlined /></IconButton></Box>
      <DialogContent sx={{ p: 2 }}><img src={images[active]} alt={name} className={styles.lightboxImage} /><Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}><IconButton aria-label="Попереднє зображення" onClick={() => move(-1)}><ArrowBack /></IconButton><IconButton aria-label="Наступне зображення" onClick={() => move(1)}><ArrowForward /></IconButton></Box></DialogContent>
    </Dialog>
  </div>;
}
