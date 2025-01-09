import { useMemo, useState, useEffect } from "react";

interface Investment {
  date: string;
  amount: number;
  round: string;
  project: string;
}

export const useInvestmentData = (investments: Investment[] = []) => {
  const [isLoading, setIsLoading] = useState(true);

  // Calculate unique projects
  const uniqueProjects = useMemo(
    () => [...new Set(investments.map((inv) => inv.project))],
    [investments]
  );

  // Generate complete date range for the chart
  const dateRange = useMemo(() => {
    if (!investments || investments.length === 0) return [];

    const startDate = new Date(
      Math.min(...investments.map((inv) => new Date(inv.date).getTime()))
    );
    const endDate = new Date();
    const dates = [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate = new Date(
        currentDate.setMonth(currentDate.getMonth() + 1)
      );
    }

    // Ensure dates are sorted
    dates.sort();

    return dates;
  }, [investments]);

  // Create project time series with accumulated investments and growth
  const projectTimeSeries = useMemo(() => {
    setIsLoading(true);
    const series: { [key: string]: { date: string; price: number }[] } = {};

    // Initialize series for each project
    uniqueProjects.forEach((project) => {
      series[project] = [];
      const projectInvestments = investments
        .filter((inv) => inv.project === project)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (projectInvestments.length === 0) return;

      const firstInvestmentDate = projectInvestments[0].date;
      const lastInvestmentDate = projectInvestments[projectInvestments.length - 1].date;
      let accumulatedValue = 0;

      dateRange.forEach((date) => {
        // Find investments on this date
        const investmentsOnDate = projectInvestments.filter((inv) => inv.date === date);

        // Add new investments to accumulated value
        if (investmentsOnDate.length > 0) {
          accumulatedValue += investmentsOnDate.reduce((sum, inv) => sum + inv.amount, 0);
        }

        // Only apply growth after the last investment date
        if (date > lastInvestmentDate) {
          // Calculate the number of months between the current date and the last investment date
          const monthsSinceLastInvestment = Math.floor(
            (new Date(date).getTime() - new Date(lastInvestmentDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
          );

          // Apply the monthly growth rate for each month since the last investment
          let growthAdjustedValue = accumulatedValue;
          for (let i = 0; i < monthsSinceLastInvestment; i++) {
            const monthlyGrowthRate = 0.005 + (Math.random() * 0.005);
            growthAdjustedValue *= (1 + monthlyGrowthRate);
          }

          // Add data point with growth applied
          series[project].push({
            date,
            price: Math.round(growthAdjustedValue),
          });
        } else {
          // Add data point
          series[project].push({
            date,
            price: Math.round(accumulatedValue),
          });
        }
      });
    });

    console.log("Project Time Series:", series);
    return series;
  }, [uniqueProjects, dateRange, investments]);

  useEffect(() => {
    if (projectTimeSeries) {
      setIsLoading(false);
    }
  }, [projectTimeSeries]);

  // Combine project data for the chart
  const getCombinedChartData = (showAll: boolean, selectedInvestments: string[]) => {
    if (isLoading) {
      return []; // Return empty array while loading
    }

    const activeProjects = showAll ? uniqueProjects : selectedInvestments;

    return dateRange.map((date) => {
      const dataPoint: { [key: string]: any } = { date };

      activeProjects.forEach((project) => {
        const projectData = projectTimeSeries[project];
        if (!projectData) return;

        // Find the closest data point before or on the current date
        let matchingPoint = projectData.find((d) => d.date === date);

        if (!matchingPoint) {
          // Find the last known value before this date
          let lastKnownValue = 0;
          for (let i = projectData.length - 1; i >= 0; i--) {
            if (projectData[i].date <= date) {
              lastKnownValue = projectData[i].price;
              break;
            }
          }

          // Use the last known value for the current date
          matchingPoint = { date, price: lastKnownValue };
        }

        if (matchingPoint) {
          dataPoint[project] = matchingPoint.price;
        }
      });

      return dataPoint;
    });
  };

  return {
    uniqueProjects,
    dateRange,
    getCombinedChartData,
    isLoading,
  };
};
