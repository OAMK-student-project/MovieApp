import { chromium } from "playwright";
import { XMLParser } from "fast-xml-parser";
import { randomUUID } from "crypto";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
const NAV_TIMEOUT_MS = 30_000;

function createXMLParser(arrayName) {
  return new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: true,
    parseAttributeValue: true,
    trimValues: true,
    isArray: (name) => name === arrayName,
  });
}

async function fetchXMLwithPlaywright(url) {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ userAgent: UA });

    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT_MS,
    });
    if (!response) throw new Error("Ei vastausta palvelimelta");

    const status = response.status();
    const contentType = response.headers()["content-type"] || "";
    const body = await response.text();

    return { status, contentType, body };
  } finally {
    if (browser) await browser.close();
  }
}

function ensureXML({ status, contentType, body }) {
  if (status < 200 || status >= 300) {
    throw new Error(`HTTP ${status}`);
  }
  const looksLikeHTML = body.startsWith("<!DOCTYPE html") || /<html/i.test(body);
  const contentTypeIsXML = /xml/i.test(contentType);
  if (!contentTypeIsXML || looksLikeHTML) {
    throw new Error(`Ei XML:ää. content-type=${contentType}`);
  }
}

//Handlataan tilanne, jossa finnkinon data voi olla lista tai yksi objekti
function asArray(value) {
  if (value == null) return []; // jos dataa ei ole, palauta tyhjä lista
  return Array.isArray(value) ? value : [value]; // jos on lista, niin anna se. Jos ei, niin kääri taulukkoon
}

const fetchTheaters = async (req, res, next) => {
  try {
    const url = "https://www.finnkino.fi/xml/TheatreAreas/";
    const { status, contentType, body } = await fetchXMLwithPlaywright(url);
    ensureXML({ status, contentType, body });

    const parser = createXMLParser("TheatreArea");
    const json = parser.parse(body);

    const areas = asArray(json?.TheatreAreas?.TheatreArea).map((e) => ({
      id: e.ID,
      name: e.Name,
    }));

    res.status(200).json(areas);
  } catch (err) {
    next(err);
  }
};

const fetchEvents = async (req, res, next) => {
  try {
    const area = String(req.query.area ?? "").trim();
    const dt = String(req.query.dt ?? "").trim();

    const validArea = /^\d+$/.test(area);
    const validDate = /^\d{2}\.\d{2}\.\d{4}$/.test(dt);
    if (!validArea || !validDate) {
      return res.status(400).json({ error: "Bad params: area/dt" });
    }

    const url = `https://www.finnkino.fi/xml/Schedule/?area=${encodeURIComponent(
      area
    )}&dt=${encodeURIComponent(dt)}`;

    const { status, contentType, body } = await fetchXMLwithPlaywright(url);
    ensureXML({ status, contentType, body });

    const parser = createXMLParser("Show");
    const json = parser.parse(body);

    const shows = asArray(json?.Schedule?.Shows?.Show).map((s) => ({
      uuid: `${randomUUID()}`,
      id: s.EventID ?? s.ID ?? `${s.dttmShowStart}-${s.TheatreID}`,
      title: s.Title,
      originalTitle: s.OriginalTitle,
      theatre: s.Theatre,
      auditorium: s.TheatreAuditorium,
      start: s.dttmShowStart,
      end: s.dttmShowEnd,
      lengthMin: s.LengthInMinutes,
      presentationMethod: s.PresentationMethodAndLanguage,
      images: {
        large: s.Images?.EventLargeImagePortrait,
        landscape: s.Images?.EventLargeImageLandscape,
      },
    }));

    res.status(200).json(shows);
  } catch (err) {
    next(err);
  }
};

export { fetchTheaters, fetchEvents };
