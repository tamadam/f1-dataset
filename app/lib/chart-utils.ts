/* eslint-disable @typescript-eslint/no-explicit-any */
export const createAnimation = (graphData: any, totalDuration: number) => {
  const delayBetweenPoints = totalDuration / (graphData.labels.length || 1);
  const previousY = (ctx: any) => {
    if (ctx.index === 0) {
      return ctx.chart.scales.y.getPixelForValue(0);
    }
    const prev = ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1];
    return prev
      ? prev.getProps(["y"], true).y
      : ctx.chart.scales.y.getPixelForValue(0);
  };

  const animation = {
    x: {
      type: "number",
      easing: "linear",
      duration: delayBetweenPoints,
      from: NaN,
      delay(ctx: any) {
        if (ctx.type !== "data" || ctx.xStarted) return 0;
        ctx.xStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
    y: {
      type: "number",
      easing: "linear",
      duration: delayBetweenPoints,
      from: previousY,
      delay(ctx: any) {
        if (ctx.type !== "data" || ctx.yStarted) return 0;
        ctx.yStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
  };

  return animation;
};
