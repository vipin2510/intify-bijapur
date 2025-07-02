import { useEffect, useState } from "react";

export const Layer = ({ map, showLayer }: LayerProps) => {
  const files = [
    'Amdaighati_Area_Committee.geojson',
    'Barsur_Area_Committee.geojson',
    'Bayanar_Area_Committee.geojson',
    'BJR.geojson',
    'Bodhghat_Area_Committe.geojson',
    'BTR.geojson',
    'DWA.geojson',
    'Indravati_Area_Committee.geojson',
    'KGN.geojson',
    'Kiskodo_Area_Committee.geojson',
    'KKR.geojson',
    'Kutul_Area_Committee.geojson',
    'Nelnar_Area_Committee.geojson',
    'NPR.geojson',
    'Partapur_Area_Committee.geojson',
    'Raoghat_Area_Committee.geojson',
  ];

  const [layers, setLayers] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);

  useEffect(() => {
    if (!map.current) return;

    const createBorders = () => {
      setLayers([]);
      setSources([]);

      map.current.addSource('source-100', {
        type: 'geojson',
        data: '/Geojson/Narayanpur_border.geojson',
      });

      map.current.addLayer({
        id: 'data-100',
        type: 'line',
        source: 'source-100',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 4,
        },
      });

      files.forEach((file, index) => {
        const sourceId = `source-${index}`;
        const layerId = `data-${index}`;

        map.current.addSource(sourceId, {
          type: 'geojson',
          data: `/Geojson/${file}`,
        });

        map.current.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': '#000000',
            'line-width': 2,
          },
        });

        setLayers((prev) => [...prev, layerId]);
        setSources((prev) => [...prev, sourceId]);
      });
    };

    const removeBorders = () => {
      layers.forEach((layer) => {
        if (map.current.getLayer(layer)) {
          map.current.removeLayer(layer);
        }
      });

      if (map.current.getLayer('data-100')) {
        map.current.removeLayer('data-100');
        map.current.removeSource('source-100');
      }

      sources.forEach((source) => {
        if (map.current.getSource(source)) {
          map.current.removeSource(source);
        }
      });
    };

    const onLoad = () => {
      showLayer.border ? createBorders() : removeBorders();
    };

    map.current.on('load', onLoad);

    return () => {
      if (map.current) map.current.off('load', onLoad);
    };
  }, [showLayer.border]);

  return <></>;
};
