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
                  {option.priceModifier !== 0 && (
                    <small>{option.priceModifier > 0 ? '+' : '-'}{'$'}{Math.abs(option.priceModifier).toFixed(2)} DEMO</small>
                  )}
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
