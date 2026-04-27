// Simulated historical data and prediction outputs for the MVP demo
// This will be replaced with real model outputs once .h5 files are integrated

// Generate realistic Patapsco River gage height data (2018 flood event focus)
function generateHourlyData(startDate, days, includeFloodEvent = true) {
  const data = [];
  const baseLevel = 2.1;
  let current = baseLevel;

  for (let d = 0; d < days; d++) {
    for (let h = 0; h < 24; h++) {
      const timestamp = new Date(startDate);
      timestamp.setDate(timestamp.getDate() + d);
      timestamp.setHours(h, 0, 0, 0);

      // Diurnal variation
      const diurnal = 0.05 * Math.sin((h - 6) * Math.PI / 12);
      // Random walk (seeded for consistency)
      const noise = (Math.sin(d * 100 + h * 7.3) * 0.5 + 0.5 - 0.5) * 0.08;
      // Trend
      let trend = 0;

      // Simulate flood event (days 4-6)
      if (includeFloodEvent && d >= 3 && d <= 6) {
        const floodProgress = (d - 3) * 24 + h;
        if (floodProgress < 24) {
          trend = floodProgress * 0.15; // Rising limb
        } else if (floodProgress < 36) {
          trend = 3.6 + (floodProgress - 24) * 0.25; // Rapid rise
        } else if (floodProgress < 48) {
          trend = 6.6 + Math.sin((floodProgress - 36) * Math.PI / 24) * 3; // Peak
        } else if (floodProgress < 72) {
          trend = Math.max(0, 6.6 - (floodProgress - 48) * 0.2); // Recession
        } else {
          trend = Math.max(0, 1.8 - (floodProgress - 72) * 0.08);
        }
      }

      current = baseLevel + diurnal + noise + trend;
      current = Math.max(1.5, current);

      data.push({
        timestamp: timestamp.toISOString(),
        datetime: `${timestamp.getFullYear()}-${String(timestamp.getMonth()+1).padStart(2,'0')}-${String(timestamp.getDate()).padStart(2,'0')} ${String(h).padStart(2,'0')}:00`,
        value: Math.round(current * 100) / 100,
        hour: h,
        day: d,
      });
    }
  }
  return data;
}

// Generate a 14-day window with a flood event
const historicalData = generateHourlyData(new Date('2018-07-15'), 14, true);

// Extract flood event period for prediction demo
const floodWindow = historicalData.filter((_, i) => i >= 72 && i < 240);

// Simulate model predictions with realistic error characteristics
function generatePredictions(actual, modelType) {
  return actual.map((point, i) => {
    let error = 0;
    const value = point.value;

    switch(modelType) {
      case 'lstm':
        // LSTM: larger errors at peaks, tends to underpredict extremes
        if (value > 5) error = -(value - 5) * 0.18 + (Math.sin(i * 3.7) * 0.5 + 0.5 - 0.3) * 0.4;
        else if (value > 3) error = (Math.sin(i * 2.3) * 0.5 + 0.5 - 0.4) * 0.3;
        else error = (Math.sin(i * 1.7) * 0.5 + 0.5 - 0.5) * 0.15;
        break;
      case 'convlstm':
        // ConvLSTM: better at peaks, still some lag
        if (value > 5) error = -(value - 5) * 0.1 + (Math.sin(i * 4.1) * 0.5 + 0.5 - 0.3) * 0.3;
        else if (value > 3) error = (Math.sin(i * 2.9) * 0.5 + 0.5 - 0.4) * 0.2;
        else error = (Math.sin(i * 1.3) * 0.5 + 0.5 - 0.5) * 0.12;
        break;
      case 'pgdl':
        // PGDL: best at extremes, physics-constrained
        if (value > 5) error = -(value - 5) * 0.05 + (Math.sin(i * 5.3) * 0.5 + 0.5 - 0.35) * 0.2;
        else if (value > 3) error = (Math.sin(i * 3.1) * 0.5 + 0.5 - 0.45) * 0.15;
        else error = (Math.sin(i * 2.1) * 0.5 + 0.5 - 0.5) * 0.1;
        break;
    }

    return {
      timestamp: point.timestamp,
      datetime: point.datetime,
      actual: value,
      predicted: Math.max(1.3, Math.round((value + error) * 100) / 100),
    };
  });
}

const lstmPredictions = generatePredictions(floodWindow, 'lstm');
const convlstmPredictions = generatePredictions(floodWindow, 'convlstm');
const pgdlPredictions = generatePredictions(floodWindow, 'pgdl');

// Combined chart data
export const predictionChartData = floodWindow.map((point, i) => ({
  timestamp: point.datetime,
  actual: point.value,
  lstm: lstmPredictions[i].predicted,
  convlstm: convlstmPredictions[i].predicted,
  pgdl: pgdlPredictions[i].predicted,
}));

// Model evaluation metrics (simulated from typical results)
export const modelMetrics = {
  lstm: {
    name: 'LSTM',
    color: '#f59e0b',
    mae: 0.482,
    rmse: 0.731,
    bias: -0.156,
    r2: 0.847,
    nse: 0.832,
    peakError: 1.24,
    timingError: 3.2,
    peakTiers: {
      above5ft: { mae: 0.89, rmse: 1.12, count: 42 },
      above7ft: { mae: 1.34, rmse: 1.67, count: 18 },
      above9ft: { mae: 1.82, rmse: 2.14, count: 6 },
    },
  },
  convlstm: {
    name: 'ConvLSTM',
    color: '#8b5cf6',
    mae: 0.341,
    rmse: 0.523,
    bias: -0.098,
    r2: 0.912,
    nse: 0.901,
    peakError: 0.87,
    timingError: 2.1,
    peakTiers: {
      above5ft: { mae: 0.62, rmse: 0.84, count: 42 },
      above7ft: { mae: 0.91, rmse: 1.23, count: 18 },
      above9ft: { mae: 1.28, rmse: 1.56, count: 6 },
    },
  },
  pgdl: {
    name: 'PGDL-ConvLSTM',
    color: '#00d4aa',
    mae: 0.248,
    rmse: 0.389,
    bias: -0.042,
    r2: 0.956,
    nse: 0.948,
    peakError: 0.51,
    timingError: 1.1,
    peakTiers: {
      above5ft: { mae: 0.38, rmse: 0.52, count: 42 },
      above7ft: { mae: 0.54, rmse: 0.73, count: 18 },
      above9ft: { mae: 0.72, rmse: 0.91, count: 6 },
    },
    physicsCompliance: {
      riseRateValid: true,
      deltaHWithinBounds: true,
      constraintScore: 0.94,
      massConservation: 0.97,
    },
  },
};

// Radar chart data for model comparison
// For radar, higher = better. So for error metrics we need to invert
export const radarData = [
  { metric: 'Accuracy', lstm: 0.85, convlstm: 0.91, pgdl: 0.96, fullMark: 1.0 },
  { metric: 'Peak Capture', lstm: 0.58, convlstm: 0.74, pgdl: 0.91, fullMark: 1.0 },
  { metric: 'Timing', lstm: 0.65, convlstm: 0.78, pgdl: 0.93, fullMark: 1.0 },
  { metric: 'Stability', lstm: 0.70, convlstm: 0.82, pgdl: 0.95, fullMark: 1.0 },
  { metric: 'Extreme Events', lstm: 0.45, convlstm: 0.62, pgdl: 0.88, fullMark: 1.0 },
  { metric: 'Physics', lstm: 0.30, convlstm: 0.40, pgdl: 0.94, fullMark: 1.0 },
];

// Historical water level data for dashboard
export const recentWaterLevels = historicalData.slice(-168); // Last 7 days

// Alert history
export const alertHistory = [
  { id: 1, timestamp: '2018-07-22 03:15', level: 'EMERGENCY', value: 9.21, threshold: 9.0, message: 'River stage exceeded 9.0 ft — EMERGENCY FLOOD STAGE' },
  { id: 2, timestamp: '2018-07-22 00:30', level: 'WARNING', value: 7.43, threshold: 7.0, message: 'River stage exceeded 7.0 ft — FLOOD WARNING issued' },
  { id: 3, timestamp: '2018-07-21 21:00', level: 'ADVISORY', value: 5.12, threshold: 5.0, message: 'River stage exceeded 5.0 ft — FLOOD ADVISORY issued' },
  { id: 4, timestamp: '2018-07-21 18:30', level: 'ADVISORY', value: 5.01, threshold: 5.0, message: 'Approaching flood advisory threshold' },
  { id: 5, timestamp: '2018-07-22 12:00', level: 'WARNING', value: 7.15, threshold: 7.0, message: 'Recession phase — WARNING still active' },
  { id: 6, timestamp: '2018-07-23 06:00', level: 'ADVISORY', value: 5.34, threshold: 5.0, message: 'Continued recession — ADVISORY level' },
  { id: 7, timestamp: '2018-07-24 00:00', level: 'NORMAL', value: 3.82, threshold: 5.0, message: 'All clear — river stage below advisory threshold' },
];

// Dashboard KPIs
export const dashboardKPIs = {
  currentLevel: { value: 2.34, unit: 'ft', trend: 'stable', change: '+0.02' },
  peakToday: { value: 2.51, unit: 'ft', trend: 'down', change: '-0.12' },
  alertStatus: { value: 'NORMAL', level: 'normal' },
  modelAccuracy: { value: '95.6', unit: '%', model: 'PGDL' },
};

// System status feed
export const systemFeed = [
  { time: '00:05:23', event: 'PGDL model prediction completed', type: 'success' },
  { time: '00:05:22', event: 'Input sequence validated (24 timesteps)', type: 'info' },
  { time: '00:05:20', event: 'USGS gauge data received — 2.34 ft', type: 'info' },
  { time: '00:04:15', event: 'ConvLSTM prediction completed', type: 'success' },
  { time: '00:04:14', event: 'LSTM baseline prediction completed', type: 'success' },
  { time: '00:03:00', event: 'Scheduled prediction cycle initiated', type: 'info' },
  { time: '00:00:00', event: 'System heartbeat — all models loaded', type: 'success' },
];

// Flood threshold configuration
export const floodThresholds = {
  advisory: 5.0,
  warning: 7.0,
  emergency: 9.0,
};

// Gauge station info
export const stationInfo = {
  id: '01589000',
  name: 'Patapsco River at Hollofield',
  state: 'Maryland',
  agency: 'USGS',
  lat: 39.2882,
  lng: -76.7867,
  datum: 'NAVD88',
  drainageArea: '285 sq mi',
  dataRange: '2016-01-01 to 2019-12-31',
};

// Residual (error) data for Model Arena scatter plot
export const residualData = floodWindow.map((point, i) => ({
  actual: point.value,
  lstm_error: lstmPredictions[i].predicted - point.value,
  convlstm_error: convlstmPredictions[i].predicted - point.value,
  pgdl_error: pgdlPredictions[i].predicted - point.value,
}));

// Cumulative distribution data for model comparison
export const cdfData = (() => {
  const sorted = (arr) => [...arr].sort((a, b) => a - b);
  const lstmErrors = sorted(residualData.map(d => Math.abs(d.lstm_error)));
  const convlstmErrors = sorted(residualData.map(d => Math.abs(d.convlstm_error)));
  const pgdlErrors = sorted(residualData.map(d => Math.abs(d.pgdl_error)));
  
  return lstmErrors.map((_, i) => ({
    percentile: Math.round((i / lstmErrors.length) * 100),
    lstm: Math.round(lstmErrors[i] * 1000) / 1000,
    convlstm: Math.round(convlstmErrors[i] * 1000) / 1000,
    pgdl: Math.round(pgdlErrors[i] * 1000) / 1000,
  })).filter((_, i) => i % 4 === 0); // Downsample for performance
})();
