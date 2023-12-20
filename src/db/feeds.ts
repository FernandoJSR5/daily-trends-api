import mongoose from 'mongoose';

const FeedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    journal: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    image_link: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

export const FeedModel = mongoose.model('Feed', FeedSchema);
export const getFeeds = () => FeedModel.find();
