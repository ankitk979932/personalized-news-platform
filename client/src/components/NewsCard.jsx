import { Bookmark, Clock3, Headphones, Sparkles } from "lucide-react";

const NewsCard = ({ article, active, onSelect, index, saved = false }) => {
  return (
    <button
      className={`news-card ${active ? "is-active" : ""}`}
      type="button"
      onClick={onSelect}
      style={{ "--accent": article.accent || "#7c5cff" }}
    >
      <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
      <img src={article.image} alt="" className="news-card-image" />
      <span className="news-card-body">
        <span className="news-card-topline">
          <span>{article.category}</span>
          <span className="news-card-badges">
            {saved && (
              <span className="saved-mini">
                <Bookmark size={12} fill="currentColor" />
                Saved
              </span>
            )}
            {article.isRecommended && (
              <span className="recommended-mini">
                <Sparkles size={12} />
                Match
              </span>
            )}
          </span>
        </span>
        <span className="news-card-title">{article.title}</span>
        <span className="news-card-meta">
          <span>
            <Clock3 size={13} />
            {article.readTime}
          </span>
          <span>
            <Headphones size={13} />
            {article.duration}
          </span>
        </span>
      </span>
    </button>
  );
};

export default NewsCard;
