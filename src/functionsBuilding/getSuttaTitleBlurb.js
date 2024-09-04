import { allSuttasPaliNameDictionary } from "../data/allSuttasPaliNameDictionary.js";
import { blurbs } from "../data/blurbs.js";

export default function getSuttaTitleBlurb(citation) {
  let title = "";
  let blurb = "";
  let samyutta = "";
  let connector = "";
  const samuttaNames = {
    SN1: "Devatā Saṁyutta",
    SN2: "Devaputta Saṁyutta",
    SN3: "Kosala Saṁyutta",
    SN4: "Māra Saṁyutta",
    SN5: "Bhikkhunī Saṁyutta",
    SN6: "Brahma Saṁyutta",
    SN7: "Brāhmaṇa Saṁyutta",
    SN8: "Vaṅgīsa Saṁyutta",
    SN9: "Vana Saṁyutta",
    SN10: "Yakkha Saṁyutta",
    SN11: "Sakka Saṁyutta",
    SN12: "Nidāna Saṁyutta",
    SN13: "Abhisamaya Saṁyutta",
    SN14: "Dhātu Saṁyutta",
    SN15: "Anamatagga Saṁyutta",
    SN16: "Kassapa Saṁyutta",
    SN17: "Lābhasakkāra Saṁyutta",
    SN18: "Rāhula Saṁyutta",
    SN19: "Lakkhaṇa Saṁyutta",
    SN20: "Opamma Saṁyutta",
    SN21: "Bhikkhu Saṁyutta",
    SN22: "Khandha Saṁyutta",
    SN23: "Rādha Saṁyutta",
    SN24: "Diṭṭhi Saṁyutta",
    SN25: "Okkanta Saṁyutta",
    SN26: "Uppāda Saṁyutta",
    SN27: "Kilesa Saṁyutta",
    SN28: "Sāriputta Saṁyutta",
    SN29: "Nāga Saṁyutta",
    SN30: "Supaṇṇa Saṁyutta",
    SN31: "Gandhabbakāya Saṁyutta",
    SN32: "Valāhaka Saṁyutta",
    SN33: "Vacchagotta Saṁyutta",
    SN34: "Jhāna Saṁyutta",
    SN35: "Saḷāyatana Saṁyutta",
    SN36: "Vedanā Saṁyutta",
    SN37: "Mātugāma Saṁyutta",
    SN38: "Jambukhādaka Saṁyutta",
    SN39: "Sāmaṇḍaka Saṁyutta",
    SN40: "Moggallāna Saṁyutta",
    SN41: "Citta Saṁyutta",
    SN42: "Gāmaṇi Saṁyutta",
    SN43: "Asaṅkhata Saṁyutta",
    SN44: "Abyākata Saṁyutta",
    SN45: "Magga Saṁyutta",
    SN46: "Bojjhaṅga Saṁyutta",
    SN47: "Satipaṭṭhāna Saṁyutta",
    SN48: "Indriya Saṁyutta",
    SN49: "Sammappadhāna Saṁyutta",
    SN50: "Bala Saṁyutta",
    SN51: "Iddhipāda Saṁyutta",
    SN52: "Anuruddha Saṁyutta",
    SN53: "Jhāna Saṁyutta",
    SN54: "Ānāpāna Saṁyutta",
    SN55: "Sotāpatti Saṁyutta",
    SN56: "Sacca Saṁyutta",
  };

  if (/^SN\d+?\./.test(citation)) {
    let samyuttaNumber = citation.split(".")[0];
    samyutta = ` (<i>${samuttaNames[samyuttaNumber]}</i>)`;
  }

  title = allSuttasPaliNameDictionary[citation]
    ? `<span class="tip-name">${allSuttasPaliNameDictionary[citation]}</span>`
    : "";

  blurb = blurbs[citation.toLowerCase()] ? `${blurbs[citation.toLowerCase()]}` : "";

  if (blurb && title) connector = ": ";

  if (!blurb) return "";

  return title + connector + blurb + samyutta;
}
