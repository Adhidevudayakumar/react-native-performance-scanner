import { InteractionManager } from 'react-native';
import { frameRateMonitorSetupConfig } from '../types';

export function setupFrameRateMonitor(config :frameRateMonitorSetupConfig) {
  // Simple configuration with defaults
  const sampleInterval = config?.sampleInterval || 1000; // 1 second default
  const targetFPS = config?.targetFPS || 60;
  
  // Essential state variables
  let frameCount = 0;
  let lastTimestamp = performance.now();
  let intervalId : ReturnType<typeof setInterval> | null = null;
  let metrics = { fps: 0, dropped: 0 };
  let callbacks = [];
  
  // Frame counter function
  const countFrames = () => {
    frameCount++;
    const now = performance.now();
    
    // Simple dropped frame detection (basic version)
    if (now - lastTimestamp > (1000/targetFPS) * 1.5) {
      metrics.dropped++;
    }
    
    lastTimestamp = now;
    
    // Continue counting if active
    if (intervalId) requestAnimationFrame(countFrames);
  };
  
  // Start monitoring
  const start = () => {
    // Reset counters
    frameCount = 0;
    metrics = { fps: 0, dropped: 0 };
    lastTimestamp = performance.now();
    
    // Begin tracking frames
    requestAnimationFrame(countFrames);
    
    // Report metrics regularly
    intervalId = setInterval(() => {
      // Calculate current FPS
      metrics.fps = Math.round(frameCount * (1000 / sampleInterval));
      
      // Notify listeners
      callbacks.forEach(cb => cb(metrics));
      
      // Reset counter for next interval
      frameCount = 0;
    }, sampleInterval);
  };
  
  // Stop monitoring
  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  
  // Subscribe to updates
  const onUpdate = (callback) => {
    callbacks.push(callback);
    return () => {
      callbacks = callbacks.filter(cb => cb !== callback);
    };
  };
  
  // Auto-start if configured
  if (config?.autoStart !== false) {
    InteractionManager.runAfterInteractions(start);
  }
  
  return {
    start,
    stop,
    onUpdate,
    getCurrentMetrics: () => ({ ...metrics }),
    cleanup: stop
  };
}