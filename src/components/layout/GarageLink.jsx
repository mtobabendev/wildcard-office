export default function GarageLink({ href, navigate, children, className = '', ...props }) {
  const onClick = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return;

    event.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} onClick={onClick} className={className} {...props}>
      {children}
    </a>
  );
}
