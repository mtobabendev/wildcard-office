import GarageLink from '../layout/GarageLink.jsx';

export default function ProductCard({ product, navigate }) {
  return (
    <article className="listing-card product-card">
      <div className="card-topline"><span>GARAGE FIND</span><span>{product.status}</span></div>
      <div className="product-card-media">
        {product.media[0]?.type === 'image'
          ? <img src={product.media[0].src} alt={product.media[0].alt} />
          : <div className="media-placeholder">DEMO ITEM</div>}
      </div>
      <h3>{product.name}</h3>
      <p className="card-subtitle">{product.subtitle}</p>
      <p>{product.description}</p>
      <p className="demo-price" aria-label={'Demo price $' + product.price.toFixed(2)}>DEMO {'$'}{product.price.toFixed(2)}</p>
      <GarageLink href={'/merch/' + product.slug} navigate={navigate} className="button button-secondary">
        Open Listing
      </GarageLink>
    </article>
  );
}
