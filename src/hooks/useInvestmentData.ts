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
      // Ensure we move to the next month correctly
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        15
      );
    }

    return Array.from(dates).sort();
  }, [investments]);

  // Create project time series with accumulated investments and growth
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
      const lastInvestmentDate = projectInvestments[projectInvestments.length - 1].date;

      let accumulatedValue = 0;

      dateRange.forEach((date) => {
        // Before first investment, value is 0
        if (date < firstInvestmentDate) {
          series[project].push({ date, price: 0 });
          return;
        }

        // Add any new investments on this date
        const investmentsOnDate = projectInvestments.filter((inv) => inv.date === date);
        if (investmentsOnDate.length > 0) {
          accumulatedValue += investmentsOnDate.reduce((sum, inv) => sum + inv.amount, 0);
        }

        // Apply growth after the last investment date
        if (date > lastInvestmentDate && accumulatedValue > 0) {
          const monthsSinceLastInvestment = Math.floor(
            (new Date(date).getTime() - new Date(lastInvestmentDate).getTime()) / 
            (1000 * 60 * 60 * 24 * 30.44) // Using average month length
          );
          
          // Apply monthly growth with some variability
          const baseGrowthRate = 0.008; // 0.8% base monthly growth
          const marketConditionFactor = Math.sin(new Date(date).getTime()) * 0.002;
          const monthlyGrowthRate = Math.max(0.001, baseGrowthRate + marketConditionFactor);
          
          accumulatedValue *= Math.pow(1 + monthlyGrowthRate, monthsSinceLastInvestment);
        }

        series[project].push({
          date,
          price: Math.round(accumulatedValue)
        });
      });
    });

    console.log("Project Time Series:", series);
    return series;
  }, [uniqueProjects, dateRange, investments]);

  // Combine project data for the chart
  const getCombinedChartData = (showAll: boolean, selectedInvestments: string[]) => {
    console.log("Generating chart data...");
    console.log("Show all:", showAll);
    console.log("Selected investments:", selectedInvestments);

    const activeProjects = showAll ? uniqueProjects : selectedInvestments;

    const chartData = dateRange.map((date) => {
      const dataPoint: { [key: string]: any } = { date };

      uniqueProjects.forEach((project) => {
        const projectData = projectTimeSeries[project];
        if (!projectData) return;

        const matchingPoint = projectData.find((d) => d.date === date);
        dataPoint[project] = matchingPoint ? matchingPoint.price : 0;
      });

      return dataPoint;
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