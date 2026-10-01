import { formatMoney } from '../../data/products.js';

export default function OptionSelector({ groups, selections, onChange }) {
  if (!groups?.length) return null;

  return (
    <div className="option-groups">
      {groups.map((group) => (
        <fieldset className="option-group" key={group.id}>
          <legend>{group.label}{group.required ? ' *' : ''}</legend>
          <div className="option-grid">
            {group.options.map((option) => {
              const selected = selections[group.id] === option.id;
              const modifier = Number.isInteger(option.priceModifier) && option.priceModifier !== 0
                ? (option.priceModifier > 0
                    ? '+' + formatMoney(option.priceModifier)
                    : formatMoney(option.priceModifier))
                : null;

              return (
                <button
                  type="button"
                  key={option.id}
                  className={selected ? 'option-button is-selected' : 'option-button'}
                  onClick={() => onChange(group, option)}
                  disabled={!option.available}
                  aria-pressed={selected}
                >
                  <span>{option.label}</span>
                  {modifier && <small>{modifier}</small>}
                  {option.description && <small>{option.description}</small>}
                  {!option.available && <small>Unavailable</small>}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
