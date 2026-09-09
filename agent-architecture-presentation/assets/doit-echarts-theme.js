/*
 * DoiT 2026 ECharts theme.
 *
 * Registers a theme named "doit". Use it with:
 *     echarts.init(el, 'doit', { renderer: 'svg', width: w, height: h })
 *
 * Two things here are not stylistic preference and should not be edited casually.
 *
 * 1. THE CATEGORICAL PALETTE IS VALIDATED, not chosen by eye. Checked against a white
 *    surface for lightness band, chroma floor, colour-vision separation and contrast:
 *      1 series  #FC3264  brand pink
 *      2 series  #6E4FC4  worst CVD dE 18.2 (protan)
 *      3 series  #0E9AA7  worst CVD dE 16.5 (deutan)
 *    Brand indigo #35256D FAILS the lightness band (L 0.329, band is 0.43-0.77) and must
 *    never be a data colour. #6E4FC4 is its passing step. A fourth hue needs re-validating
 *    before use; the obvious warm candidates fail contrast on white.
 *
 * 2. NO BOLD ANYWHERE. The 2026 brand has no bold text, so every fontWeight here is
 *    'normal'. Emphasis is carried by colour, not weight. ECharts defaults several labels
 *    to bold, which is why each one is set explicitly rather than left alone.
 */
(function (root, factory) {
  var theme = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = theme;                       // node, for build-time rendering
  }
  if (root && root.echarts) {
    root.echarts.registerTheme('doit', theme);    // browser, self-registering
  }
  if (root) { root.doitEchartsTheme = theme; }
})(typeof self !== 'undefined' ? self : this, function () {
  var INK = '#1C1E35';
  var BODY = '#8892A4';
  var MUTED = '#9CA3AF';
  var LINE = '#E5E8EF';
  var SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  // Categorical, in fixed order. Never cycled, never reordered by rank.
  var SERIES = ['#FC3264', '#6E4FC4', '#0E9AA7'];

  var axisCommon = {
    axisLine: { show: true, lineStyle: { color: LINE, width: 1.5 } },
    axisTick: { show: false },
    axisLabel: { color: BODY, fontFamily: SANS, fontSize: 19, fontWeight: 'normal' },
    splitLine: { show: true, lineStyle: { color: LINE, width: 1, type: 'solid' } },
    splitArea: { show: false }
  };

  return {
    color: SERIES,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: SANS, fontWeight: 'normal', color: INK },

    title: {
      // Slide headlines are Georgia and live in the slide's <h1>, not in the chart.
      show: false
    },

    // Recessive grid. Charts sit on a white slide, so they need no frame of their own.
    grid: { left: 8, right: 8, top: 46, bottom: 8, containLabel: true },

    categoryAxis: Object.assign({}, axisCommon, { splitLine: { show: false } }),
    valueAxis: axisCommon,
    logAxis: axisCommon,
    timeAxis: axisCommon,

    // Identity is never colour alone: a legend is present whenever there are 2+ series.
    legend: {
      top: 0,
      itemWidth: 16,
      itemHeight: 16,
      itemGap: 26,
      icon: 'roundRect',
      textStyle: { color: INK, fontFamily: SANS, fontSize: 20, fontWeight: 'normal' }
    },

    tooltip: {
      backgroundColor: '#FFFFFF',
      borderColor: LINE,
      borderWidth: 1.5,
      padding: [10, 14],
      textStyle: { color: INK, fontFamily: SANS, fontSize: 18, fontWeight: 'normal' },
      axisPointer: { lineStyle: { color: MUTED }, crossStyle: { color: MUTED } }
    },

    // Series defaults. borderRadius rounds the data-end only, so baselines stay flat and
    // bar lengths stay comparable.
    bar: {
      itemStyle: { borderRadius: [4, 4, 0, 0], borderColor: '#FFFFFF', borderWidth: 2 },
      barMaxWidth: 128,
      label: {
        // Georgia for numbers, matching the template's big-number treatment.
        color: INK, fontSize: 22, fontWeight: 'normal',
        fontFamily: "Georgia, 'Times New Roman', serif"
      }
    },
    line: {
      lineStyle: { width: 2 },
      symbolSize: 9,
      smooth: false,
      label: { color: INK, fontFamily: SANS, fontSize: 20, fontWeight: 'normal' }
    },
    pie: {
      // Deliberately plain. A pie is almost never the right form for a ranking; use bars.
      itemStyle: { borderColor: '#FFFFFF', borderWidth: 2 },
      label: { color: INK, fontFamily: SANS, fontSize: 20, fontWeight: 'normal' }
    },
    gauge: {
      // For one proportion against a target. Note a gauge cannot show overage above its
      // max, so for values that can exceed the target use a bar with a markLine instead.
      axisLine: { lineStyle: { width: 26, color: [[1, LINE]] } },
      progress: { show: true, width: 26, itemStyle: { color: SERIES[0] } },
      pointer: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      title: { color: BODY, fontFamily: SANS, fontSize: 20, fontWeight: 'normal' },
      detail: {
        color: INK, fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: 72, fontWeight: 'normal'
      }
    },

    // Reserved status colours. Never reused as "series 4", and always paired with a label.
    visualMap: { inRange: { color: ['#FBB4C6', '#FC3264', '#B3123F'] } },

    // Sequential ramp for ORDERED categories (priority, severity, tiers). Ordered data is
    // not categorical; giving it three unrelated hues reads as a rainbow.
    doitSequential: ['#FBB4C6', '#F97BA0', '#FC3264', '#B3123F'],
    doitStatus: { critical: '#DC2626', warning: '#E8A33D', good: '#059669' }
  };
});
