import mongoose, { Schema } from 'mongoose';
import { IGallery } from '../../entities/gallery.entity';



const GallerySchema: Schema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    image_category: { type: String, required: true },
  });


  const Gallery = mongoose.model<IGallery>('Gallery', GallerySchema);
  export default Gallery;