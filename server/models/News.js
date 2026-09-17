import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    source: {
      type: String,
      required: true
    },
    publishedAt: {
      type: Date,
      required: true,
      index: true
    },
    tags: {
      type: [String],
      default: []
    },
    readTime: {
      type: String,
      default: "4 min"
    },
    duration: {
      type: String,
      default: "02:40"
    },
    accent: {
      type: String,
      default: "#7c5cff"
    }
  },
  {
    timestamps: true
  }
);

const News = mongoose.model("News", newsSchema);

export default News;
