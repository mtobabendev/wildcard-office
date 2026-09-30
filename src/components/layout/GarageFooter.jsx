import GarageLink from './GarageLink.jsx';

export default function GarageFooter({ navigate }) {
  return (
    <footer className="garage-footer">
      <div>
        <strong>PENNY'S GARAGE</strong>
        <p>Repairs • Builds • Questionable Experiments</p>
      </div>
      <GarageLink href="/quote" navigate={navigate}>Bring me something weird</GarageLink>
    </footer>
  );
}
