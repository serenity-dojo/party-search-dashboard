export const formatSanctionsStatus = (status: string): string => {
    const mapping: Record<string, string> = {
      Approved: "Approved",
      PendingReview: "Pending Review",
      Escalated: "Escalated",
      ConfirmedMatch: "Confirmed Match",
      FalsePositive: "False Positive",
    };
  
    return mapping[status] || status;
  };

export const formatMatchScore = (score: number | string): string => {
    const numericScore = typeof score === 'number' ? score : parseFloat(score);
  
    if (isNaN(numericScore)) return score.toString();
  
    const percentage = numericScore * 100;
  
    // Show no decimal if it's whole, otherwise show 1 decimal place
    return Number.isInteger(percentage)
      ? `${percentage}%`
      : `${percentage.toFixed(1)}%`;
  };
  