import { useMemo } from "react";

interface Investment {
  date: string;
  amount: number;
  round: string;
  project: string;
}

export const useInvestmentData = (investments: Investment[] = []) => {
  // Calculate unique projects
  const uniqueProjects = useMemo(
    () => [...new Set(investments.map((inv) => inv.project))].sort(),
    [investments]
  );

  // Generate complete date range for the chart
  const dateRange = useMemo(() => {
    if (!investments || investments.length === 0) return [];

    const dates = new Set<string>();
    const startDate = new Date(
      Math.min(...investments.map((inv) => new Date(inv.date).getTime()))
    );
    const endDate = new Date();
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.add(currentDate.toISOString().split("T")[0]);
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        15
      );
    }
    return Array.from(dates).sort();
  }, [investments]);

  // Create project time series with accumulated investments
  const projectTimeSeries = useMemo(() => {
    console.log("Processing investment data...");
    const series: { [key: string]: { date: string; price: number }[] } = {};

    // Initialize series for each project
    uniqueProjects.forEach((project) => {
      series[project] = [];

      // Get all investments for this project, sorted by date
      const projectInvestments = investments
        .filter((inv) => inv.project === project)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (projectInvestments.length === 0) return;

      // Track accumulated value for this project
      let accumulatedValue = 0;

      // Process each date in the range
      dateRange.forEach((date) => {
        // Find investments on or before this date for this project
        const investmentsUpToDate = projectInvestments.filter(
          (inv) => new Date(inv.date) <= new Date(date)
        );

        // Add new investments to accumulated value
        accumulatedValue = investmentsUpToDate.reduce(
            (sum, inv) => sum + inv.amount,
            0
        );

        // Only add data points after the first investment for this project
        if (date >= projectInvestments[0].date) {
          // Apply growth calculation
          const monthsSinceFirstInvestment = Math.floor(
            (new Date(date).getTime() -
              new Date(projectInvestments[0].date).getTime()) /
              (1000 * 60 * 60 * 24 * 30.44)
          );

          const baseGrowthRate = 0.002; // 0.2% monthly growth
          const volatilityFactor =
            Math.sin(monthsSinceFirstInvestment * 0.3) * 0.001;
          const monthlyRate = baseGrowthRate + volatilityFactor;

          const growthMultiplier = Math.pow(
            1 + monthlyRate,
            monthsSinceFirstInvestment
          );
          const valueWithGrowth = accumulatedValue * growthMultiplier;

          // Add the data point
          series[project].push({
            date,
            price: Math.round(valueWithGrowth),
          });
        }
      });

      console.log(`Project ${project} time series:`, series[project]);
    });
    return series;
  }, [uniqueProjects, dateRange, investments]);

  // Combine project data for the chart
  const getCombinedChartData = (
    showAll: boolean,
    selectedInvestments: string[]
  ) => {
    console.log("Generating chart data...");
    console.log("Show all:", showAll);
    console.log("Selected investments:", selectedInvestments);

    const activeProjects = showAll ? uniqueProjects : selectedInvestments;
    const chartData: any[] = []; // Get all dates where any project has data
    const relevantDates = new Set<string>();
    activeProjects.forEach((project) => {
      const projectData = projectTimeSeries[project];
      if (projectData) {
        projectData.forEach((point) => relevantDates.add(point.date));
      }
    }); // Create data points for each date
    Array.from(relevantDates)
      .sort()
      .forEach((date) => {
        const dataPoint: { [key: string]: any } = { date };

        activeProjects.forEach((project) => {
          const projectData = projectTimeSeries[project];
          if (projectData) {
            const matchingPoint = projectData.find((d) => d.date === date);
            if (matchingPoint) {
              dataPoint[project] = matchingPoint.price;
            }
          }
        });

        chartData.push(dataPoint);
      });
    console.log("Chart Data:", chartData);
    return chartData;
  };
  return { uniqueProjects, dateRange, getCombinedChartData };
};
