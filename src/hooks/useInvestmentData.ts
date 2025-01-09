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
    const series: { [key: string]: { date: string; price: number | null }[] } = {};
    
    uniqueProjects.forEach(project => {
      const projectInvestments = investments
        .filter(inv => inv.project === project)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (projectInvestments.length === 0) return;

      const firstInvestmentDate = projectInvestments[0].date;
      let accumulatedValue = 0;
      
      series[project] = dateRange
        .filter(date => date >= firstInvestmentDate)
        .map(date => {
          const investmentsOnDate = projectInvestments.filter(inv => inv.date === date);
          
          if (investmentsOnDate.length > 0) {
            accumulatedValue += investmentsOnDate.reduce((sum, inv) => sum + inv.amount, 0);
          }

          const dataPoint = {
            date,
            price: Math.round(accumulatedValue)
          };

          // Apply growth for future dates
          if (date !== dateRange[dateRange.length - 1]) {
            const growthSeed = new Date(date).getTime();
            const randomGrowth = (Math.sin(growthSeed) + 1) * 0.05; // 0% to 10% growth
            accumulatedValue *= (1 + randomGrowth);
          }

          return dataPoint;
        });
    });

    console.log("Project Time Series:", series);
    return series;
  }, [uniqueProjects, dateRange, investments]);

  // Combine project data for the chart
  const getCombinedChartData = (showAll: boolean, selectedInvestments: string[]) => {
    const activeProjects = showAll ? uniqueProjects : selectedInvestments;
    
    return dateRange.map(date => {
      const dataPoint: any = { date };
      
      activeProjects.forEach(project => {
        const projectData = projectTimeSeries[project];
        if (!projectData) return;
        
        const matchingPoint = projectData.find(d => d.date === date);
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
    projectTimeSeries,
    getCombinedChartData
  };
};