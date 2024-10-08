export default function convertVatthus(citation) {
  const conversion = {
    vv1: "vv1-1",
    vv2: "vv1-2",
    vv3: "vv1-3",
    vv4: "vv1-4",
    vv5: "vv1-5",
    vv6: "vv1-6",
    vv7: "vv1-7",
    vv8: "vv1-8",
    vv9: "vv1-9",
    vv10: "vv1-10",
    vv11: "vv1-11",
    vv12: "vv1-12",
    vv13: "vv1-13",
    vv14: "vv1-14",
    vv15: "vv1-15",
    vv16: "vv1-16",
    vv17: "vv1-17",
    vv18: "vv2-1",
    vv19: "vv2-2",
    vv20: "vv2-3",
    vv21: "vv2-4",
    vv22: "vv2-5",
    vv23: "vv2-6",
    vv24: "vv2-7",
    vv25: "vv2-8",
    vv26: "vv2-9",
    vv27: "vv2-10",
    vv28: "vv2-11",
    vv29: "vv3-1",
    vv30: "vv3-2",
    vv31: "vv3-3",
    vv32: "vv3-4",
    vv33: "vv3-5",
    vv34: "vv3-6",
    vv35: "vv3-7",
    vv36: "vv3-8",
    vv37: "vv3-9",
    vv38: "vv3-10",
    vv39: "vv4-1",
    vv40: "vv4-2",
    vv41: "vv4-3",
    vv42: "vv4-4",
    vv43: "vv4-5",
    vv44: "vv4-6",
    vv45: "vv4-7",
    vv46: "vv4-8",
    vv47: "vv4-9",
    vv48: "vv4-10",
    vv49: "vv4-11",
    vv50: "vv4-12",
    vv51: "vv5-1",
    vv52: "vv5-2",
    vv53: "vv5-3",
    vv54: "vv5-4",
    vv55: "vv5-5",
    vv56: "vv5-6",
    vv57: "vv5-7",
    vv58: "vv5-8",
    vv59: "vv5-9",
    vv60: "vv5-10",
    vv61: "vv5-11",
    vv62: "vv5-12",
    vv63: "vv5-13",
    vv64: "vv5-14",
    vv65: "vv6-1",
    vv66: "vv6-2",
    vv67: "vv6-3",
    vv68: "vv6-4",
    vv69: "vv6-5",
    vv70: "vv6-6",
    vv71: "vv6-7",
    vv72: "vv6-8",
    vv73: "vv6-9",
    vv74: "vv6-10",
    vv75: "vv7-1",
    vv76: "vv7-2",
    vv77: "vv7-3",
    vv78: "vv7-4",
    vv79: "vv7-5",
    vv80: "vv7-6",
    vv81: "vv7-7",
    vv82: "vv7-8",
    vv83: "vv7-9",
    vv84: "vv7-10",
    vv85: "vv7-11",
    pv1: "pv1-1",
    pv2: "pv1-2",
    pv3: "pv1-3",
    pv4: "pv1-4",
    pv5: "pv1-5",
    pv6: "pv1-6",
    pv7: "pv1-7",
    pv8: "pv1-8",
    pv9: "pv1-9",
    pv10: "pv1-10",
    pv11: "pv1-11",
    pv12: "pv1-12",
    pv13: "pv2-1",
    pv14: "pv2-2",
    pv15: "pv2-3",
    pv16: "pv2-4",
    pv17: "pv2-5",
    pv18: "pv2-6",
    pv19: "pv2-7",
    pv20: "pv2-8",
    pv21: "pv2-9",
    pv22: "pv2-10",
    pv23: "pv2-11",
    pv24: "pv2-12",
    pv25: "pv2-13",
    pv26: "pv3-1",
    pv27: "pv3-2",
    pv28: "pv3-3",
    pv29: "pv3-4",
    pv30: "pv3-5",
    pv31: "pv3-6",
    pv32: "pv3-7",
    pv33: "pv3-8",
    pv34: "pv3-9",
    pv35: "pv3-10",
    pv36: "pv4-1",
    pv37: "pv4-2",
    pv38: "pv4-3",
    pv39: "pv4-4",
    pv40: "pv4-5",
    pv41: "pv4-6",
    pv42: "pv4-7",
    pv43: "pv4-8",
    pv44: "pv4-9",
    pv45: "pv4-10",
    pv46: "pv4-11",
    pv47: "pv4-12",
    pv48: "pv4-13",
    pv49: "pv4-14",
    pv50: "pv4-15",
    pv51: "pv4-16",
  };
  return conversion[citation.toLowerCase()];
}
