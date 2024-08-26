export default function justBook(location) {
  return location.replace(/[:0-9.–-]/g, "").toLowerCase();
}
