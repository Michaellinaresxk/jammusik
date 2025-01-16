import {useEffect, useState, useCallback} from 'react';
import spotifyConfig from '../infra/api/spotifyConfig';
import {NewRelease} from '../types/tracksTypes';

export const useNewReleases = () => {
  const [newReleases, setNewReleases] = useState<NewRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewReleases = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🚀 Iniciando fetch de new releases...');
      const data = await spotifyConfig.getNewReleases();

      if (!Array.isArray(data)) {
        throw new Error('La respuesta no es un array');
      }

      // Log específico para los nuevos campos
      console.log('📦 Primer item con detalles:', {
        name: data[0]?.name,
        duration: data[0]?.duration_ms,
        popularity: data[0]?.popularity,
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
  }, []);

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
