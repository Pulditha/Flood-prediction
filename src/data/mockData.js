export const systemInfo = {
  title: 'Physics-Guided Flood Prediction System',
  subtitle:
    'Intelligent Real-Time Flood Forecasting and Hydrological Risk Monitoring Dashboard',
  station: 'Kelani Basin Monitoring Node K-07',
  analyst: 'Research Analyst A-204',
}

export const summaryCards = [
  { label: 'Current Gauge Height', value: '4.18 m', status: 'Rising +0.12m/hr' },
  { label: 'Rainfall Intensity', value: '62 mm/hr', status: 'Convective band active' },
  { label: 'Soil Saturation', value: '81%', status: 'Near saturation threshold' },
  { label: 'Predicted Next Hour Stage', value: '4.39 m', status: 'Expected +0.21m' },
  { label: 'Flood Risk Level', value: 'High Flood Risk', status: 'Threshold proximity high' },
]

export const stageSeries = [
  { time: 'T-24', observed: 3.32, predicted: null, threshold: 4.5 },
  { time: 'T-20', observed: 3.41, predicted: null, threshold: 4.5 },
  { time: 'T-16', observed: 3.56, predicted: null, threshold: 4.5 },
  { time: 'T-12', observed: 3.75, predicted: null, threshold: 4.5 },
  { time: 'T-8', observed: 3.88, predicted: null, threshold: 4.5 },
  { time: 'T-4', observed: 4.03, predicted: null, threshold: 4.5 },
  { time: 'T-1', observed: 4.18, predicted: null, threshold: 4.5 },
  { time: 'T+1', observed: null, predicted: 4.39, threshold: 4.5 },
]

export const severity = {
  level: 'High Flood Risk',
  message: 'Rapid stage increase detected. Preparedness actions recommended.',
  score: 78,
}

export const constraints = [
  { name: 'Extreme Rain Trigger', active: true },
  { name: 'Soil Saturation Trigger', active: true },
  { name: 'Rising Water Constraint', active: true },
  { name: 'Safe Prediction Bound', active: true },
]

export const predictionLogs = [
  {
    time: '2026-04-27 10:00',
    currentStage: '3.96 m',
    predictedStage: '4.07 m',
    risk: 'Moderate Risk',
  },
  {
    time: '2026-04-27 10:30',
    currentStage: '4.05 m',
    predictedStage: '4.22 m',
    risk: 'High Flood Risk',
  },
  {
    time: '2026-04-27 11:00',
    currentStage: '4.12 m',
    predictedStage: '4.29 m',
    risk: 'High Flood Risk',
  },
  {
    time: '2026-04-27 11:30',
    currentStage: '4.18 m',
    predictedStage: '4.39 m',
    risk: 'High Flood Risk',
  },
]

export const dataIntegrity = [
  { label: 'Synced', status: true },
  { label: 'Validated', status: true },
  { label: 'Normalized', status: true },
  { label: 'Sequence Window Ready', status: true },
]

export const gaugeFeed = {
  station: 'Kelani - Hanwella Gauge',
  value: '4.18 m',
  quality: 'Sensor confidence: 98.7%',
}

export const pipelineSteps = [
  'Data Preprocessing',
  'ConvLSTM Feature Extraction',
  'Physics Guided Constraint Enforcement',
  'Next Hour Forecast Generation',
]

export const finalPrediction = {
  predictedWaterLevel: '4.39 m',
  expectedTrend: 'Rise (+0.21 m/hr)',
  thresholdBreachProbability: '72%',
  eventConfidence: '93%',
}

export const modelMetrics = [
  { label: 'MAE', value: '0.087 m' },
  { label: 'RMSE', value: '0.121 m' },
  { label: 'R²', value: '0.94' },
  { label: 'Peak Accuracy', value: '91.6%' },
  { label: 'Event Detection Rate', value: '92.8%' },
]

export const historicalComparison = [
  { event: 'E1', actual: 3.8, predicted: 3.74 },
  { event: 'E2', actual: 4.1, predicted: 4.05 },
  { event: 'E3', actual: 4.6, predicted: 4.48 },
  { event: 'E4', actual: 4.9, predicted: 4.84 },
  { event: 'E5', actual: 4.3, predicted: 4.25 },
  { event: 'E6', actual: 5.2, predicted: 5.11 },
]

export const alerts = [
  {
    time: '2026-04-27 10:45',
    alert: 'Threshold Exceedance Warning',
    station: 'Kelani K-07',
    status: 'Active',
  },
  {
    time: '2026-04-27 11:05',
    alert: 'Rapid Rise Detection',
    station: 'Kalu K-03',
    status: 'Monitoring',
  },
  {
    time: '2026-04-27 11:20',
    alert: 'Soil Saturation Trigger',
    station: 'Kelani K-07',
    status: 'Active',
  },
]

export const floodEventLogs = [
  {
    timestamp: '2026-04-26 22:00',
    stage: '4.62 m',
    action: 'Community alert issued',
    decision: 'Model-supported warning escalated',
  },
  {
    timestamp: '2026-04-27 02:00',
    stage: '4.48 m',
    action: 'Drainage pre-release activated',
    decision: 'Moderate-to-high transition',
  },
  {
    timestamp: '2026-04-27 08:30',
    stage: '4.11 m',
    action: 'Continued watch mode',
    decision: 'Constraint-consistent forecast',
  },
]

export const reportCards = [
  {
    title: 'Daily Flood Monitoring Report',
    date: '2026-04-27',
    type: 'PDF',
  },
  {
    title: 'Model Decision Trace Log',
    date: '2026-04-27',
    type: 'CSV',
  },
  {
    title: 'Threshold Exceedance Summary',
    date: '2026-04-26',
    type: 'PDF',
  },
]
