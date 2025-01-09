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
      dates.add(currentDate.toISOString().split('T')[0]);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return Array.from(dates).sort();
  }, [investments]);

  // Create project time series with accumulated investments and growth
  const projectTimeSeries = useMemo(() => {
    console.log("Processing investment data with enhanced tracking...");
    const series: { [key: string]: { date: string; price: number }[] } = {};

    // Initialize series for all projects
    uniqueProjects.forEach((project) => {
      series[project] = [];
      
      const projectInvestments = investments
        .filter((inv) => inv.project === project)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (projectInvestments.length === 0) return;

      let accumulatedValue = 0;
      let lastInvestmentDate = projectInvestments[0].date;

      dateRange.forEach((date) => {
        // Add any new investments on this date
        const investmentsOnDate = projectInvestments.filter((inv) => inv.date === date);
        if (investmentsOnDate.length > 0) {
          accumulatedValue += investmentsOnDate.reduce((sum, inv) => sum + inv.amount, 0);
          lastInvestmentDate = date;
        }

        // Apply growth based on time since last investment
        if (accumulatedValue > 0) {
          const monthsSinceLastInvestment = Math.max(0, 
            (new Date(date).getTime() - new Date(lastInvestmentDate).getTime()) / 
            (1000 * 60 * 60 * 24 * 30.44)
          );
          
          // Enhanced growth calculation with variable rates
          const baseGrowthRate = 0.015; // 1.5% base monthly growth
          const projectMultiplier = uniqueProjects.indexOf(project) + 1;
          const marketConditionFactor = Math.sin(monthsSinceLastInvestment) * 0.005;
          const monthlyGrowthRate = Math.max(0.005, 
            (baseGrowthRate * projectMultiplier + marketConditionFactor)
          );
          
          // Apply compound growth
          if (monthsSinceLastInvestment > 0) {
            accumulatedValue *= Math.pow(1 + monthlyGrowthRate, monthsSinceLastInvestment);
          }
        }

        series[project].push({
          date,
          price: Math.round(accumulatedValue)
        });

        console.log(`Project ${project} at ${date}: ${accumulatedValue}`);
      });
    });

    return series;
  }, [uniqueProjects, dateRange, investments]);

  // Combine project data for the chart
  const getCombinedChartData = (showAll: boolean, selectedInvestments: string[]) => {
    console.log("Generating enhanced chart data...");
    console.log("Show all:", showAll);
    console.log("Selected investments:", selectedInvestments);

    const activeProjects = showAll ? uniqueProjects : selectedInvestments;

    const chartData = dateRange.map((date) => {
      const dataPoint: { [key: string]: any } = { date };

      uniqueProjects.forEach((project) => {
        if (activeProjects.includes(project)) {
          const projectData = projectTimeSeries[project];
          const matchingPoint = projectData?.find((d) => d.date === date);
          dataPoint[project] = matchingPoint ? matchingPoint.price : 0;
        }
      });

      return dataPoint;
    });

    console.log("Enhanced Chart Data:", chartData);
    return chartData;
  };

  return {
    uniqueProjects,
    dateRange,
    getCombinedChartData,
  };
};