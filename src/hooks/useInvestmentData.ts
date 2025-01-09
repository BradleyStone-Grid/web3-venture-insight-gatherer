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
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }

    dates.sort();
    return dates;
  }, [investments]);

  // Create project time series with accumulated investments and growth
  const projectTimeSeries = useMemo(() => {
    const series: { [key: string]: { date: string; price: number }[] } = {};

    uniqueProjects.forEach((project) => {
      series[project] = [];
      
      // Get all investments for this project, sorted by date
      const projectInvestments = investments
        .filter((inv) => inv.project === project)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (projectInvestments.length === 0) return;

      const firstInvestmentDate = projectInvestments[0].date;
      const lastInvestmentDate = projectInvestments[projectInvestments.length - 1].date;

      // Initialize accumulated value
      let accumulatedValue = 0;

      // Process each date in the range
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

        // Apply growth only after the last investment date
        if (date > lastInvestmentDate && accumulatedValue > 0) {
          const monthsSinceLastInvestment = Math.floor(
            (new Date(date).getTime() - new Date(lastInvestmentDate).getTime()) / 
            (1000 * 60 * 60 * 24 * 30)
          );
          
          // Apply a conservative monthly growth rate (0.5-1%)
          const baseGrowthRate = 0.005; // 0.5% base rate
          const variableGrowth = Math.sin(new Date(date).getTime()) * 0.0025; // ±0.25% variation
          const monthlyGrowthRate = baseGrowthRate + Math.max(0, variableGrowth);
          
          // Compound the growth for each month since last investment
          accumulatedValue *= Math.pow(1 + monthlyGrowthRate, monthsSinceLastInvestment);
        }

        // Add the data point
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
    const activeProjects = showAll ? uniqueProjects : selectedInvestments;

    return dateRange.map((date) => {
      const dataPoint: { [key: string]: any } = { date };

      activeProjects.forEach((project) => {
        const projectData = projectTimeSeries[project];
        if (!projectData) return;

        // Find exact matching point or interpolate
        const matchingPoint = projectData.find((d) => d.date === date);
        
        if (matchingPoint) {
          dataPoint[project] = matchingPoint.price;
        } else {
          // Find the last known value before this date
          const previousPoints = projectData.filter((d) => d.date <= date);
          if (previousPoints.length > 0) {
            dataPoint[project] = previousPoints[previousPoints.length - 1].price;
          } else {
            dataPoint[project] = 0;
          }
        }
      });

      return dataPoint;
    });
  };

  return {
    uniqueProjects,
    dateRange,
    getCombinedChartData,
  };
};