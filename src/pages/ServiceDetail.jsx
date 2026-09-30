import { useState } from 'react';
import ListingHeader from '../components/listing/ListingHeader.jsx';
import MediaGallery from '../components/listing/MediaGallery.jsx';
import OptionSelector from '../components/listing/OptionSelector.jsx';
import { ServiceActionPanel } from '../components/listing/PurchasePanel.jsx';
import DetailAccordion from '../components/listing/DetailAccordion.jsx';
import RelatedListings from '../components/listing/RelatedListings.jsx';
import { services } from '../data/services.js';

export default function ServiceDetail({ service, navigate }) {
  const initialSelections = Object.fromEntries(
    service.optionGroups
      .map((group) => [group.id, group.options.find((option) => option.available)?.id])
      .filter(([, value]) => value),
  );

  const [selections, setSelections] = useState(initialSelections);
  const [mediaIndex, setMediaIndex] = useState(0);

  const onOptionChange = (group, option) => {
    setSelections((current) => ({ ...current, [group.id]: option.id }));
    if (Number.isInteger(option.mediaIndex)) setMediaIndex(option.mediaIndex);
  };

  const sections = [
    { title: 'What You Get', content: service.details },
    { title: 'Process', content: service.process },
    { title: 'Typical Turnaround', content: service.turnaround },
    { title: 'What We Need From You', content: 'A clear description of the system or device, what you expected, what actually happened, relevant constraints, and any deadline that matters. Do not send passwords or secrets.' },
    { title: 'Scope / Limitations', content: 'Intake is a request only. Scope and pricing must be agreed before work begins. Submitting this request does not authorize work or create a charge.' },
  ];

  return (
    <section className="section-shell detail-page">
      <div className="detail-grid">
        <MediaGallery media={service.media} requestedIndex={mediaIndex} />
        <div className="detail-info">
          <ListingHeader eyebrow="WORK ORDER // WILDCARD DEV SERVICE" name={service.name} subtitle={service.subtitle} tags={service.tags} />
          <p>{service.description}</p>
          <OptionSelector groups={service.optionGroups} selections={selections} onChange={onOptionChange} />
          <ServiceActionPanel service={service} selections={selections} navigate={navigate} />
        </div>
      </div>
      <DetailAccordion sections={sections} />
      <RelatedListings relatedIds={service.relatedIds} records={services} basePath="/services" navigate={navigate} />
    </section>
  );
}
