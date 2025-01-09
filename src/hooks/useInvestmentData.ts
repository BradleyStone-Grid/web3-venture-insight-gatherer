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
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        15
      );
    }

    return Array.from(dates).sort();
  }, [investments]);

  // Create project time series with accumulated investments and realistic growth/decline
  const projectTimeSeries = useMemo(() => {
    console.log("Processing investment data...");
    const series: { [key: string]: { date: string; price: number }[] } = {};

    uniqueProjects.forEach((project) => {
      series[project] = [];
      
      const projectInvestments = investments
        .filter((inv) => inv.project === project)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (projectInvestments.length === 0) return;

      const firstInvestmentDate = projectInvestments[0].date;
      let accumulatedValue = 0;

      dateRange
        .filter(date => date >= firstInvestmentDate)
        .forEach((date) => {
          // Add any new investments on this date
          const investmentsOnDate = projectInvestments.filter(
            (inv) => inv.date === date
          );
          
          if (investmentsOnDate.length > 0) {
            accumulatedValue += investmentsOnDate.reduce(
              (sum, inv) => sum + inv.amount, 
              0
            );
          }

          // Apply more realistic growth/decline after initial investment
          if (accumulatedValue > 0) {
            const monthsSinceLastInvestment = Math.floor(
              (new Date(date).getTime() - new Date(firstInvestmentDate).getTime()) / 
              (1000 * 60 * 60 * 24 * 30.44)
            );
            
            // Apply monthly growth/decline with project-specific variability
            const baseGrowthRate = 0.005; // 0.5% base monthly growth
            const projectRiskFactor = (uniqueProjects.indexOf(project) + 1) * 0.001;
            const volatilityFactor = Math.sin(monthsSinceLastInvestment * 0.5) * projectRiskFactor;
            const monthlyRate = baseGrowthRate + volatilityFactor;
            
            const growthMultiplier = Math.pow(1 + monthlyRate, monthsSinceLastInvestment);
            accumulatedValue *= growthMultiplier;
          }

          series[project].push({
            date,
            price: Math.round(accumulatedValue)
          });
        });

      console.log(`Project ${project} time series:`, series[project]);
    });

    return series;
  }, [uniqueProjects, dateRange, investments]);

  // Combine project data for the chart
  const getCombinedChartData = (showAll: boolean, selectedInvestments: string[]) => {
    console.log("Generating chart data...");
    console.log("Show all:", showAll);
    console.log("Selected investments:", selectedInvestments);

    const activeProjects = showAll ? uniqueProjects : selectedInvestments;
    const chartData: any[] = [];

    const relevantDates = new Set<string>();
    activeProjects.forEach(project => {
      const projectData = projectTimeSeries[project];
      if (projectData) {
        projectData.forEach(point => relevantDates.add(point.date));
      }
    });

    Array.from(relevantDates).sort().forEach(date => {
      const dataPoint: { [key: string]: any } = { date };
      
      uniqueProjects.forEach(project => {
        const projectData = projectTimeSeries[project];
        if (!projectData) return;

        const matchingPoint = projectData.find(d => d.date === date);
        if (matchingPoint) {
          dataPoint[project] = matchingPoint.price;
        }
      });

      chartData.push(dataPoint);
    });

    console.log("Chart Data:", chartData);
    return chartData;
  };

  return {
    uniqueProjects,
    dateRange,
    getCombinedChartData,
  };
};