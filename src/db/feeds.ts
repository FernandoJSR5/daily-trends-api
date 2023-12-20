import mongoose from 'mongoose';

const FeedSchema = new mongoose.Schema({});

export const FeedModel = mongoose.model('Feed', FeedSchema);
export const getFeeds = () => FeedModel.find();
