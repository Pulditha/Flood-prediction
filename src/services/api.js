/**
 * PGDL Flood Prediction System — API Service
 * ============================================
 * Handles all communication between the React frontend and FastAPI backend.
 * Falls back to demo data when the backend is unreachable.
 */

const API_BASE = 'http://127.0.0.1:8000';

// Track backend connectivity
let backendOnline = false;

/**
 * Generic fetch wrapper with error handling and timeout.
 */
async function apiFetch(endpoint, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `API Error: ${response.status}`);
    }

    backendOnline = true;
    return await response.json();
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      console.warn(`API timeout: ${endpoint}`);
      backendOnline = false;
      throw new Error('Backend request timed out');
    }
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      backendOnline = false;
      console.warn(`Backend unreachable: ${endpoint}`);
      throw new Error('Backend unreachable');
    }
    throw err;
  }
}

// ============================================================
// API Methods
// ============================================================

/**
 * Check backend health and model load status.
 */
export async function checkHealth() {
  try {
    const data = await apiFetch('/health');
    return { online: true, ...data };
  } catch {
    return {
      online: false,
      status: 'offline',
      models_loaded: [],
      models_available: ['lstm', 'convlstm', 'pgdl'],
    };
  }
}

/**
 * Run prediction using selected models.
 * Falls back to /predict/demo if real models aren't loaded.
 */
export async function runPrediction({ inputSequence, models = ['lstm', 'convlstm', 'pgdl'], currentLevel = 2.34 }) {
  const body = {
    input_sequence: inputSequence,
    models,
    current_level: currentLevel,
  };

  try {
    // Try real prediction first
    const result = await apiFetch('/predict', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return { ...result, source: 'model' };
  } catch {
    try {
      // Fall back to demo prediction
      const result = await apiFetch('/predict/demo', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return { ...result, source: 'demo' };
    } catch {
      // Return frontend-generated fallback
      return generateFallbackPrediction(models, currentLevel);
    }
  }
}

/**
 * Get model evaluation metrics from the backend.
 */
export async function getMetrics() {
  try {
    return await apiFetch('/metrics');
  } catch {
    return null; // Frontend will use local demoData
  }
}

/**
 * Get list of available models and their load status.
 */
export async function getModels() {
  try {
    return await apiFetch('/models');
  } catch {
    return null;
  }
}

/**
 * Get flood threshold configuration.
 */
export async function getThresholds() {
  try {
    return await apiFetch('/thresholds');
  } catch {
    return { advisory: 5.0, warning: 7.0, emergency: 9.0 };
  }
}

/**
 * Get station information.
 */
export async function getStation() {
  try {
    return await apiFetch('/station');
  } catch {
    return null;
  }
}

/**
 * Check if backend is currently reachable.
 */
export function isBackendOnline() {
  return backendOnline;
}

// ============================================================
// Fallback — Frontend-only prediction when backend is down
// ============================================================

function generateFallbackPrediction(models, currentLevel) {
  const modelInfo = {
    lstm: { name: 'LSTM', color: '#f59e0b' },
    convlstm: { name: 'ConvLSTM', color: '#8b5cf6' },
    pgdl: { name: 'PGDL-ConvLSTM', color: '#00d4aa' },
  };

  const predictions = models.map(key => {
    const noise = key === 'lstm' ? 0.15 : key === 'convlstm' ? 0.08 : 0.03;
    const predicted = currentLevel + (Math.sin(Date.now() / 10000) * noise);
    return {
      model_name: modelInfo[key]?.name || key,
      model_key: key,
      predicted_level: Math.round(predicted * 1000) / 1000,
      delta_h: key === 'pgdl' ? Math.round((predicted - currentLevel) * 10000) / 10000 : null,
    };
  });

  const peak = Math.max(...predictions.map(p => p.predicted_level));
  const peakModel = predictions.find(p => p.predicted_level === peak);

  return {
    predictions,
    alert_level: peak >= 9 ? 'EMERGENCY' : peak >= 7 ? 'WARNING' : peak >= 5 ? 'ADVISORY' : 'NORMAL',
    peak_predicted: peak,
    peak_model: peakModel?.model_name || 'PGDL-ConvLSTM',
    physics_compliance: {
      rise_rate_valid: true,
      delta_h_within_bounds: true,
      constraint_score: 0.94,
      mass_conservation: 0.97,
    },
    inference_time_ms: 0,
    source: 'fallback',
  };
}

export default {
  checkHealth,
  runPrediction,
  getMetrics,
  getModels,
  getThresholds,
  getStation,
  isBackendOnline,
};
