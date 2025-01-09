import { useMemo } from "react";

interface Investment {
  date: string;
  amount: number;
  round: string;
  project: string;
}

export const useInvestmentData = (investments: Investment[] = []) => {
  // Calculate unique projects
  const uniqueProjects = useMemo(() => 
    [...new Set(investments.map(inv => inv.project))],
    [investments]
  );

  // Generate complete date range for the chart
  const dateRange = useMemo(() => {
    if (!investments || investments.length === 0) return [];
    
    const startDate = new Date(Math.min(...investments.map(inv => new Date(inv.date).getTime())));
    const endDate = new Date();
    const dates = [];
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }
    
    return dates;
  }, [investments]);

  // Create project time series with accumulated investments and growth
  const projectTimeSeries = useMemo(() => {
    const series: { [key: string]: { date: string; price: number }[] } = {};
    
    // Initialize series for each project
    uniqueProjects.forEach(project => {
      series[project] = [];
      const projectInvestments = investments
        .filter(inv => inv.project === project)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (projectInvestments.length === 0) return;

      const firstInvestmentDate = projectInvestments[0].date;
      const lastInvestmentDate = projectInvestments[projectInvestments.length - 1].date;
      let accumulatedValue = 0;
      let lastKnownValue = 0;

      dateRange.forEach(date => {
        if (date >= firstInvestmentDate) {
          // Find investments on this date
          const investmentsOnDate = projectInvestments.filter(inv => inv.date === date);
          
          // Add new investments to accumulated value
          if (investmentsOnDate.length > 0) {
            accumulatedValue += investmentsOnDate.reduce((sum, inv) => sum + inv.amount, 0);
            lastKnownValue = accumulatedValue;
          }

          // Only apply growth after the last investment date
          if (date > lastInvestmentDate) {
            const monthsSinceLastInvestment = Math.floor(
              (new Date(date).getTime() - new Date(lastInvestmentDate).getTime()) / 
              (1000 * 60 * 60 * 24 * 30)
            );
            
            // Apply a more conservative monthly growth rate (0.5-1%)
            const monthlyGrowthRate = 0.005 + (Math.sin(new Date(date).getTime()) + 1) * 0.0025;
            accumulatedValue = lastKnownValue * Math.pow(1 + monthlyGrowthRate, monthsSinceLastInvestment);
          }

          // Add data point
          series[project].push({
            date,
            price: Math.round(accumulatedValue)
          });
        } else {
          // Add zero value before first investment
          series[project].push({
            date,
            price: 0
          });
        }
      });
    });

    console.log("Project Time Series:", series);
    return series;
  }, [uniqueProjects, dateRange, investments]);

  // Combine project data for the chart
  const getCombinedChartData = (showAll: boolean, selectedInvestments: string[]) => {
    const activeProjects = showAll ? uniqueProjects : selectedInvestments;
    
    return dateRange.map(date => {
      const dataPoint: { [key: string]: any } = { date };
      
      activeProjects.forEach(project => {
        const projectData = projectTimeSeries[project];
        if (!projectData) return;

        const matchingPoint = projectData.find(d => d.date === date);
        dataPoint[project] = matchingPoint ? matchingPoint.price : 0;
      });
      
      return dataPoint;
    });
  };

  return {
    uniqueProjects,
    dateRange,
    projectTimeSeries,
    getCombinedChartData
  };
};