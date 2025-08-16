import { saveAs } from 'file-saver';

type kmlDataType = {
  longitude: number;
  latitude: number;
  name: string;
};

type KmlGeneratorProps = {
  kmlData: kmlDataType[];
  selectedFilters: Record<string, any>;
  legendName: string;
};

// Escape XML special characters for KML
const escapeXml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

// Sanitize filename (remove/replace unsafe chars)
const sanitizeFileName = (unsafe: string) => {
  return unsafe.replace(/[^a-zA-Z0-9-_=.]/g, "_");
};

export const KmlGenerator = ({ kmlData, selectedFilters, legendName }: KmlGeneratorProps) => {
  const handleDownloadKML = () => {
    const kml = generateKML(kmlData);

    const selectedFiltersString = Object.entries(selectedFilters)
      .filter(([key]) => key !== 'startDate' && key !== 'endDate') // exclude dates
      .map(([key, value]) => `${sanitizeFileName(key)}=${sanitizeFileName(String(value))}`)
      .join('_');

    const startDateString = selectedFilters.startDate
      ? `_startDate=${sanitizeFileName(selectedFilters.startDate.toString())}`
      : '';
    const endDateString = selectedFilters.endDate
      ? `_endDate=${sanitizeFileName(selectedFilters.endDate.toString())}`
      : '';

    const fileName = `kml_${selectedFiltersString}${startDateString}${endDateString}_legend=${sanitizeFileName(legendName)}.kml`;

    const blob = new Blob([kml], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, fileName);
  };

  const generateKML = (markers: kmlDataType[]) => {
    let kml = `<?xml version="1.0" encoding="UTF-8"?>
      <kml xmlns="http://www.opengis.net/kml/2.2">
      <Document>
    `;

    markers.forEach(marker => {
      const { longitude, latitude, name } = marker;
      kml += `
        <Placemark>
          <name>${escapeXml(name)}</name>
          <Point>
            <coordinates>${longitude},${latitude}</coordinates>
          </Point>
        </Placemark>
      `;
    });

    kml += `
      </Document>
      </kml>
    `;

    return kml;
  };

  return (
    <button
      onClick={handleDownloadKML}
      className="bg-orange-500 text-white text-sm p-2 px-3 absolute z-10 right-4 top-4 rounded-md"
    >
      Generate KML
    </button>
  );
};
