export default function copyCurrentUrl() {
  const url = window.location.href;
  return window.navigator.clipboard.writeText(url);
}
