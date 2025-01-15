import {useEffect, useState, useCallback} from 'react';
import spotifyConfig from '../infra/api/spotifyConfig';
import {NewRelease} from '../types/tracksTypes';

export const useNewReleases = () => {
  const [newReleases, setNewReleases] = useState<NewRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convertimos fetchNewReleases a useCallback para evitar recreaciones innecesarias
  const fetchNewReleases = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🚀 Iniciando fetch de new releases...');
      const data = await spotifyConfig.getNewReleases();

      // Validación de datos
      if (!Array.isArray(data)) {
        throw new Error('La respuesta no es un array');
      }

      console.log('📦 Respuesta del backend:', {
        rawData: data,
        dataType: typeof data,
        isArray: Array.isArray(data),
        length: data?.length,
        firstItem: data?.[0],
      });

      setNewReleases(data);
    } catch (err: any) {
      console.error('❌ Error en useNewReleases:', {
        error: err,
        message: err?.message,
        stack: err?.stack,
      });
      setError(err?.message || 'Failed to fetch new releases');
    } finally {
      setIsLoading(false);
    }
  }, []); // Sin dependencias ya que no usa props ni state

  useEffect(() => {
    fetchNewReleases();
  }, [fetchNewReleases]);

  return {
    newReleases,
    isLoading,
    error,
    refreshNewReleases: fetchNewReleases,
  };
};
