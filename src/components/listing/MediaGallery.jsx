import { useEffect, useState } from 'react';

export default function MediaGallery({ media, requestedIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (Number.isInteger(requestedIndex) && requestedIndex >= 0 && requestedIndex < media.length) {
      setActiveIndex(requestedIndex);
    }
  }, [requestedIndex, media.length]);

  if (!media.length) {
    return <div className="media-gallery"><div className="active-media media-placeholder">MEDIA BAY EMPTY</div></div>;
  }

  const active = media[activeIndex];

  return (
    <div className="media-gallery">
      <div className="active-media">
        {active.type === 'video' ? (
          <video controls preload="metadata" poster={active.poster || undefined}>
            <source src={active.src} />
          </video>
        ) : (
          <img src={active.src} alt={active.alt} />
        )}
      </div>
      <div className="thumbnail-rail" aria-label="Listing media">
        {media.map((item, index) => (
          <button
            type="button"
            key={item.src + '-' + index}
            className={index === activeIndex ? 'thumbnail is-active' : 'thumbnail'}
            onClick={() => setActiveIndex(index)}
            aria-pressed={index === activeIndex}
            aria-label={'Show media ' + (index + 1) + ': ' + item.alt}
          >
            {item.type === 'image' ? <img src={item.src} alt="" /> : <span aria-hidden="true">VIDEO</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
