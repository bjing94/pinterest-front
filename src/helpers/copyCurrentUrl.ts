export default function copyCurrentUrl() {
  const url = window.location.href;
  return navigator.clipboard.writeText(url);
}
