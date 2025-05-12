// Base metrics interface
export interface BaseMetrics {
  timestamp: number;
}

export interface FrameRateMetrics extends BaseMetrics {
  fps: number;
  targetFPS: number;
  frameCount: number;
  droppedFrames: number;
  droppedFramesPercentage: number;
}

// Connection to DevTools
export interface DevToolsConnection {
  send: (eventName: string, data: any) => void;
  addListener: (eventName: string, callback: (data: any) => void) => () => void;
  disconnect: () => void;
}

export interface frameRateMonitorSetupConfig {
    sampleInterval?:number;
    targetFPS?:number;
    autoStart?:boolean;
}

export interface PerformanceMonitorOptions {
  connection?: DevToolsConnection;
  frameRate?: boolean | {
    sampleInterval?: number;
    targetFPS?: number;
    autoStart?: boolean;
  };
  memory?: boolean | {
    sampleInterval?: number;
    autoStart?: boolean;
  };
  component?: boolean | {
    threshold?: number;
    autoStart?: boolean;
  };
  startup?: boolean;
  network?: boolean;
  bundle?: boolean;
}