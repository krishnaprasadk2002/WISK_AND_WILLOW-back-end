import mongoose, { Schema } from 'mongoose';
import { IGalleryCategory } from '../../entities/gallery.entity';

const GalleryCategorySchema: Schema = new Schema({
    name: { type: String, required: true },
});

const GalleryCategory = mongoose.model<IGalleryCategory>('GalleryCategory', GalleryCategorySchema);
export default GalleryCategory;
