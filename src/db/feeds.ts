import mongoose from 'mongoose';

const FeedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    author: {
      type: String,
    },
    journal: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const FeedModel = mongoose.model('Feed', FeedSchema);
export const getFeedsByDate = (date: String) =>
  FeedModel.find({
    updatedAt: {
      $gte: date,
    },
  });
export const createFeed = (values: Record<string, any>) =>
  new FeedModel(values).save().then((feed) => feed.toObject());
