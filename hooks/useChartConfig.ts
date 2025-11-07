import { useMemo, useCallback } from 'react';
import { PrenomData } from '@/types';
import { getChartColor, getChartBorderColor } from '@/utils/colors';
import { calculateAverageScore } from '@/utils/scoring';

type MentionType = 'sm' | 'ab' | 'b' | 'tb' | 'fel';

interface ChartDataPoint {
  x: number;
  y: number;
  label: string;
  backgroundColor: string;
  borderColor: string;
  data: PrenomData;
}

interface UseChartConfigProps {
  data: PrenomData[];
  selectedMention: MentionType;
  selectedPrenom: PrenomData | null;
}

interface UseChartConfigReturn {
  chartData: ChartDataPoint[];
  chartOptions: any;
  handlePointClick: (points: any[]) => void;
}

/**
 * Custom hook for chart configuration and data transformation
 */
export const useChartConfig = ({
  data,
  selectedMention,
  selectedPrenom,
}: UseChartConfigProps): UseChartConfigReturn => {
  const chartData = useMemo(() => {
    return data.map((prenom) => {
      const mentionRate = prenom[`taux_${selectedMention}` as keyof PrenomData] as number;
      const score = calculateAverageScore(prenom);

      return {
        x: mentionRate * 100,
        y: prenom.count,
        label: prenom.firstname,
        backgroundColor: getChartColor(selectedMention),
        borderColor: getChartBorderColor(selectedMention),
        data: prenom,
      };
    });
  }, [data, selectedMention]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const point = context.raw as ChartDataPoint;
            return [
              `Prénom: ${point.label}`,
              `Taux: ${point.x.toFixed(1)}%`,
              `Nombre: ${point.y}`,
            ];
          },
        },
      },
      zoom: {
        limits: {
          y: { min: 1, max: 100000 },
          x: { min: 0, max: 100 },
        },
        pan: {
          enabled: true,
          mode: 'xy' as const,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy' as const,
        },
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: `Taux de ${getMentionLabel(selectedMention)} (%)`,
        },
        min: 0,
        max: 100,
      },
      y: {
        type: 'logarithmic' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Nombre de candidats',
        },
        min: 10,
        max: 100000,
      },
    },
    onClick: (_: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const clickedData = chartData[index];
        if (clickedData) {
          handlePointClick([clickedData]);
        }
      }
    },
  }), [selectedMention, chartData]);

  const handlePointClick = useCallback((points: any[]) => {
    // This will be overridden by the parent component
    console.log('Point clicked:', points);
  }, []);

  return {
    chartData,
    chartOptions,
    handlePointClick,
  };
};

/**
 * Get label for mention type
 */
const getMentionLabel = (mention: MentionType): string => {
  const labels = {
    sm: 'Sans mention',
    ab: 'Assez bien',
    b: 'Bien',
    tb: 'Très bien',
    fel: 'Félicitations',
  };
  return labels[mention];
};