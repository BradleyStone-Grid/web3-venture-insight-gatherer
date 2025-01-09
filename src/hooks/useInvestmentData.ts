import { useMemo } from "react";

interface Investment {
  date: string;
  amount: number;
  round: string;
  project: string;
}

export const useInvestmentData = (investments: Investment[] = []) => {
  const uniqueProjects = useMemo(
    () => [...new Set(investments.map((inv) => inv.project))],
    [investments]
  );

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

    return dates;
  }, [investments]);

  const projectTimeSeries = useMemo(() => {
    const series: { [key: string]: { date: string; price: number }[] } = {};

    uniqueProjects.forEach((project) => {
      series[project] = [];
      const projectInvestments = investments
        .filter((inv) => inv.project === project)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (projectInvestments.length === 0) return;

      const firstInvestmentDate = projectInvestments[0].date;
      const lastInvestmentDate =
        projectInvestments[projectInvestments.length - 1].date;
      let accumulatedValue = 0;

      dateRange.forEach((date) => {
        const investmentsOnDate = projectInvestments.filter(
          (inv) => inv.date === date
        );

        if (investmentsOnDate.length > 0) {
          accumulatedValue += investmentsOnDate.reduce(
            (sum, inv) => sum + inv.amount,
            0
          );
        }

        if (date > lastInvestmentDate) {
          const monthlyGrowthRate =
            0.005 + (Math.sin(new Date(date).getTime()) + 1) * 0.0025;
          accumulatedValue = accumulatedValue * (1 + monthlyGrowthRate);
        }

        series[project].push({
          date,
          price: Math.round(accumulatedValue),
        });
      });
    });

    console.log("Project Time Series:", series);
    return series;
  }, [uniqueProjects, dateRange, investments]);

  const getCombinedChartData = (
    showAll: boolean,
    selectedInvestments: string[]
  ) => {
    const activeProjects = showAll ? uniqueProjects : selectedInvestments;

    return dateRange.map((date) => {
      const dataPoint: { [key: string]: any } = { date };

      activeProjects.forEach((project) => {
        const projectData = projectTimeSeries[project];
        if (!projectData) return;

        let matchingPoint = projectData.find((d) => d.date === date);
        let lastKnownValue = 0;

        if (!matchingPoint) {
          for (let i = 0; i < projectData.length; i++) {
            if (projectData[i].date <= date) {
              lastKnownValue = projectData[i].price;
            } else {
              break;
            }
          }

          matchingPoint = { date, price: lastKnownValue };

          if (projectData.filter((d) => d.date <= date).length > 0) {
            const lastInvestmentDate =
              projectData.filter((d) => d.date <= date).at(-1)?.date ?? "";
            const lastInvestmentValue =
              projectData.filter((d) => d.date <= date).at(-1)?.price ?? 0;

            let accumulatedValue = lastInvestmentValue;

            const dateRangeToApplyGrowth = dateRange.filter(
              (d) => d > lastInvestmentDate && d <= date
            );

            dateRangeToApplyGrowth.forEach((d) => {
              const growthSeed = new Date(d).getTime();
              const randomGrowth = 0.005 + (Math.sin(growthSeed) + 1) * 0.0025;
              accumulatedValue *= (1 + randomGrowth);
            });
            matchingPoint = { date, price: accumulatedValue };
          }
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
    projectTimeSeries,
    getCombinedChartData,
  };
};