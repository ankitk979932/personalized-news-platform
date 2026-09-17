import mongoose from "mongoose";
import News from "../models/News.js";

const normalize = (value) => value.toLowerCase().trim();

const scoreArticle = (article, interests) => {
  const normalizedInterests = interests.map(normalize);
  const categoryScore = normalizedInterests.includes(normalize(article.category)) ? 100 : 0;
  const tagScore = article.tags.reduce((score, tag) => {
    return normalizedInterests.includes(normalize(tag)) ? score + 18 : score;
  }, 0);
  const text = `${article.title} ${article.description}`.toLowerCase();
  const textScore = normalizedInterests.reduce((score, interest) => {
    return text.includes(interest) ? score + 6 : score;
  }, 0);

  return categoryScore + tagScore + textScore;
};

export const getNews = async (req, res, next) => {
  try {
    const news = await News.find().sort({ publishedAt: -1 });
    return res.status(200).json({ count: news.length, news });
  } catch (error) {
    next(error);
  }
};

export const getPersonalizedNews = async (req, res, next) => {
  try {
    const interests = req.user.interests || [];
    const news = await News.find().lean();
    const personalized = news
      .map((article) => {
        const relevanceScore = scoreArticle(article, interests);
        return {
          ...article,
          relevanceScore,
          isRecommended: relevanceScore > 0
        };
      })
      .sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }

        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });

    return res.status(200).json({
      userInterests: interests,
      count: personalized.length,
      news: personalized
    });
  } catch (error) {
    next(error);
  }
};

export const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid news ID." });
    }

    const article = await News.findById(id);

    if (!article) {
      return res.status(404).json({ message: "News article was not found." });
    }

    return res.status(200).json({ article });
  } catch (error) {
    next(error);
  }
};
