import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Headphones,
  Pause,
  Play,
  Share2,
  Sparkles,
  Volume2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const clampIndex = (value, length) => {
  if (length === 0) {
    return 0;
  }

  if (value < 0) {
    return length - 1;
  }

  if (value >= length) {
    return 0;
  }

  return value;
};

const voiceModes = {
  calm: {
    label: "Calm",
    rate: 0.9
  },
  quick: {
    label: "Quick",
    rate: 1.12
  }
};

const getSpeechText = (article) =>
  [article.title, article.description, article.content].filter(Boolean).join(". ");

const NewsPlayer = ({
  articles,
  selectedIndex,
  onSelect,
  savedArticleIds = new Set(),
  onToggleSaved
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(28);
  const [shareLabel, setShareLabel] = useState("Share");
  const [voiceMode, setVoiceMode] = useState("calm");
  const article = articles[selectedIndex];

  useEffect(() => {
    setProgress(18);
    setIsPlaying(false);
    setShareLabel("Share");
  }, [article?._id]);

  useEffect(() => {
    if (!isPlaying || !articles.length) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          onSelect(clampIndex(selectedIndex + 1, articles.length));
          return 0;
        }

        return current + 2;
      });
    }, 700);

    return () => window.clearInterval(interval);
  }, [articles.length, isPlaying, onSelect, selectedIndex]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return undefined;
    }

    if (!isPlaying || !article) {
      window.speechSynthesis.cancel();
      return undefined;
    }

    const utterance = new SpeechSynthesisUtterance(getSpeechText(article));
    utterance.rate = voiceModes[voiceMode].rate;
    utterance.pitch = 1;
    utterance.onend = () => setIsPlaying(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => window.speechSynthesis.cancel();
  }, [article, isPlaying, voiceMode]);

  const paragraphs = useMemo(() => {
    if (!article?.content) {
      return [];
    }

    return article.content.split(". ").map((sentence, index, list) => {
      const suffix = sentence.endsWith(".") || index === list.length - 1 ? "" : ".";
      return `${sentence}${suffix}`;
    });
  }, [article]);

  if (!article) {
    return (
      <section className="player-panel empty-player">
        <Sparkles size={28} />
        <h2>No story selected</h2>
        <p>Your personalized brief will appear here after the feed loads.</p>
      </section>
    );
  }

  const next = () => onSelect(clampIndex(selectedIndex + 1, articles.length));
  const previous = () => onSelect(clampIndex(selectedIndex - 1, articles.length));
  const isSaved = savedArticleIds.has(article._id);

  const shareStory = async () => {
    const shareText = `${article.title} - ${article.source}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.description || shareText
        });
        setShareLabel("Shared");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setShareLabel("Copied");
      }

      window.setTimeout(() => setShareLabel("Share"), 1400);
    } catch (error) {
      if (error.name !== "AbortError") {
        setShareLabel("Copy failed");
        window.setTimeout(() => setShareLabel("Share"), 1400);
      }
    }
  };

  return (
    <section className="player-panel" style={{ "--accent": article.accent || "#7c5cff" }}>
      <div className="player-hero">
        <img src={article.image} alt="" className="player-image" />
        <div className="player-overlay" />

        <div className="player-topbar">
          <span className="signal-dot" />
          <span>Personalized briefing</span>
          <span>{String(selectedIndex + 1).padStart(2, "0")}/{String(articles.length).padStart(2, "0")}</span>
        </div>

        <div className="player-title-stack">
          <div className="player-tags">
            <span>{article.category}</span>
            {article.isRecommended && (
              <span>
                <Sparkles size={13} />
                Recommended
              </span>
            )}
          </div>
          <h1>{article.title}</h1>
          <p>{article.description}</p>
        </div>
      </div>

      <div className="player-controls">
        <div className="story-meta-row">
          <span>
            <Clock3 size={15} />
            {article.readTime}
          </span>
          <span>
            <Headphones size={15} />
            {article.duration}
          </span>
          <span>{article.source}</span>
        </div>

        <div className="progress-track" aria-label="Playback progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="control-row">
          <button className="icon-button soft" type="button" onClick={previous} aria-label="Previous story">
            <ChevronLeft size={20} />
          </button>
          <button
            className="play-button"
            type="button"
            onClick={() => setIsPlaying((current) => !current)}
            aria-label={isPlaying ? "Pause story" : "Play story"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
          </button>
          <button className="icon-button soft" type="button" onClick={next} aria-label="Next story">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="utility-row">
          <button
            type="button"
            onClick={() => setVoiceMode((current) => (current === "calm" ? "quick" : "calm"))}
          >
            <Volume2 size={16} />
            {voiceModes[voiceMode].label}
          </button>
          <button
            className={isSaved ? "is-active" : ""}
            type="button"
            onClick={() => onToggleSaved?.(article._id)}
          >
            <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Saved" : "Save"}
          </button>
          <button type="button" onClick={shareStory}>
            <Share2 size={16} />
            {shareLabel}
          </button>
        </div>
      </div>

      <article className="reader-panel">
        <div className="reader-heading">
          <span>Read mode</span>
          <time dateTime={article.publishedAt}>
            {new Intl.DateTimeFormat("en", {
              month: "short",
              day: "numeric",
              year: "numeric"
            }).format(new Date(article.publishedAt))}
          </time>
        </div>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
    </section>
  );
};

export default NewsPlayer;
