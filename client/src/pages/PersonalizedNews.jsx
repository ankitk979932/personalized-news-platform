import { Bookmark, RefreshCcw, Search, Sparkles, TrendingUp, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";
import Navbar from "../components/Navbar.jsx";
import NewsCard from "../components/NewsCard.jsx";
import NewsPlayer from "../components/NewsPlayer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getPersonalizedNews } from "../services/api.js";

const savedNewsKey = "nuzio-saved-news";

const readSavedNews = () => {
  try {
    const storedIds = JSON.parse(localStorage.getItem(savedNewsKey));
    return Array.isArray(storedIds) ? new Set(storedIds) : new Set();
  } catch (error) {
    return new Set();
  }
};

const persistSavedNews = (savedArticleIds) => {
  try {
    localStorage.setItem(savedNewsKey, JSON.stringify([...savedArticleIds]));
  } catch (error) {
    // Local storage can fail in private browsing; saving should never break the feed.
  }
};

const matchesSearch = (article, searchTerm) => {
  const query = searchTerm.trim().toLowerCase();

  if (!query) {
    return true;
  }

  return [article.title, article.description, article.category, article.source, article.content]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(query));
};

const PersonalizedNews = () => {
  const { token, user, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [interests, setInterests] = useState(user?.interests || []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedArticleIds, setSavedArticleIds] = useState(readSavedNews);

  const loadNews = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getPersonalizedNews(token);
      setArticles(data.news || []);
      setInterests(data.userInterests || []);
      setSelectedIndex(0);
    } catch (requestError) {
      if (/token|expired|auth/i.test(requestError.message)) {
        logout();
        return;
      }

      setError(requestError.message || "Unable to load personalized news.");
    } finally {
      setIsLoading(false);
    }
  }, [logout, token]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useEffect(() => {
    persistSavedNews(savedArticleIds);
  }, [savedArticleIds]);

  const categoryOptions = useMemo(() => {
    const categories = articles.map((article) => article.category).filter(Boolean);
    return ["All", ...new Set(categories)];
  }, [articles]);

  const visibleArticles = useMemo(
    () =>
      articles.filter((article) => {
        const categoryMatch = activeCategory === "All" || article.category === activeCategory;
        const savedMatch = !showSavedOnly || savedArticleIds.has(article._id);
        return categoryMatch && savedMatch && matchesSearch(article, searchTerm);
      }),
    [activeCategory, articles, savedArticleIds, searchTerm, showSavedOnly]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [activeCategory, searchTerm, showSavedOnly]);

  useEffect(() => {
    if (selectedIndex >= visibleArticles.length) {
      setSelectedIndex(0);
    }
  }, [selectedIndex, visibleArticles.length]);

  const toggleSavedArticle = useCallback((articleId) => {
    setSavedArticleIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(articleId)) {
        nextIds.delete(articleId);
      } else {
        nextIds.add(articleId);
      }

      return nextIds;
    });
  }, []);

  const clearFilters = () => {
    setSearchTerm("");
    setActiveCategory("All");
    setShowSavedOnly(false);
  };

  const selectedArticle = visibleArticles[selectedIndex];
  const recommendedCount = articles.filter((article) => article.isRecommended).length;

  return (
    <main className="news-page">
      <Navbar />

      <section className="dashboard-grid">
        <aside className="briefing-column">
          <div className="briefing-intro">
            <span className="login-eyebrow dark">
              <Sparkles size={15} />
              Your queue
            </span>
            <h1>Hi, {user?.name || "there"}</h1>
            <p>Nuzio sorted the most relevant stories first using your saved interests.</p>
          </div>

          <div className="interest-wrap">
            {(interests.length ? interests : ["General"]).map((interest) => (
              <span className="interest-chip" key={interest}>
                {interest}
              </span>
            ))}
          </div>

          <div className="metric-strip">
            <div>
              <strong>{articles.length}</strong>
              <span>Stories</span>
            </div>
            <div>
              <strong>{recommendedCount}</strong>
              <span>Matches</span>
            </div>
            <div>
              <strong>{savedArticleIds.size}</strong>
              <span>Saved</span>
            </div>
          </div>

          <div className="feed-tools">
            <label className="search-control">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search stories"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </label>

            <div className="category-tabs" aria-label="Filter by category">
              {categoryOptions.map((category) => (
                <button
                  className={`category-chip ${activeCategory === category ? "is-active" : ""}`}
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              className={`saved-toggle ${showSavedOnly ? "is-active" : ""}`}
              type="button"
              onClick={() => setShowSavedOnly((current) => !current)}
            >
              <Bookmark size={16} fill={showSavedOnly ? "currentColor" : "none"} />
              Saved only
            </button>
          </div>

          <button className="refresh-button" type="button" onClick={loadNews}>
            <RefreshCcw size={16} />
            Refresh brief
          </button>
        </aside>

        <div className="player-column">
          {isLoading && <Loading label="Building your brief" />}

          {!isLoading && error && (
            <div className="panel-message">
              <ErrorMessage message={error} />
              <button className="primary-button compact" type="button" onClick={loadNews}>
                Try again
              </button>
            </div>
          )}

          {!isLoading && !error && articles.length === 0 && (
            <div className="panel-message">
              <Sparkles size={30} />
              <h2>No news available</h2>
              <p>Seed the database, then refresh this screen.</p>
            </div>
          )}

          {!isLoading && !error && articles.length > 0 && (
            visibleArticles.length > 0 ? (
              <NewsPlayer
                articles={visibleArticles}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                savedArticleIds={savedArticleIds}
                onToggleSaved={toggleSavedArticle}
              />
            ) : (
              <div className="panel-message">
                <Search size={30} />
                <h2>No matching stories</h2>
                <p>Clear filters or try another search term.</p>
                <button className="primary-button compact" type="button" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            )
          )}
        </div>

        <aside className="queue-column">
          <div className="queue-header">
            <div>
              <span>Up next</span>
              <h2>{showSavedOnly ? "Saved stories" : "Personalized feed"}</h2>
            </div>
            <span className="trend-pill">
              <TrendingUp size={14} />
              Live rank
            </span>
          </div>

          <div className="queue-list">
            {visibleArticles.length > 0 ? (
              visibleArticles.map((article, index) => (
                <NewsCard
                  key={article._id}
                  article={article}
                  active={selectedArticle?._id === article._id}
                  index={index}
                  saved={savedArticleIds.has(article._id)}
                  onSelect={() => setSelectedIndex(index)}
                />
              ))
            ) : (
              <div className="queue-empty">No stories in this view.</div>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
};

export default PersonalizedNews;
