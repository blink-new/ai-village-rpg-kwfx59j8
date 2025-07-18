import { Weather, TimeOfDay } from '../types/world';

export class WeatherSystem {
  private currentWeather: Weather;
  private currentTime: TimeOfDay;
  private weatherTransitionTime: number = 0;
  private timeSpeed: number = 1; // 1 = real time, higher = faster
  private weatherPatterns: Weather[] = [];

  constructor() {
    this.currentTime = {
      hour: 12,
      minute: 0,
      dayPhase: 'day',
      lightLevel: 1.0
    };

    this.currentWeather = {
      type: 'clear',
      intensity: 0,
      duration: 300000, // 5 minutes
      effects: {
        visibility: 1.0,
        movement: 1.0,
        combat: 1.0
      }
    };

    this.initializeWeatherPatterns();
  }

  private initializeWeatherPatterns(): void {
    this.weatherPatterns = [
      {
        type: 'clear',
        intensity: 0,
        duration: 600000, // 10 minutes
        effects: {
          visibility: 1.0,
          movement: 1.0,
          combat: 1.0
        }
      },
      {
        type: 'rain',
        intensity: 0.5,
        duration: 300000, // 5 minutes
        effects: {
          visibility: 0.8,
          movement: 0.9,
          combat: 0.95
        }
      },
      {
        type: 'storm',
        intensity: 0.8,
        duration: 180000, // 3 minutes
        effects: {
          visibility: 0.6,
          movement: 0.8,
          combat: 0.85
        }
      },
      {
        type: 'snow',
        intensity: 0.4,
        duration: 420000, // 7 minutes
        effects: {
          visibility: 0.7,
          movement: 0.85,
          combat: 0.9
        }
      },
      {
        type: 'fog',
        intensity: 0.6,
        duration: 240000, // 4 minutes
        effects: {
          visibility: 0.4,
          movement: 1.0,
          combat: 0.8
        }
      }
    ];
  }

  // Update time and weather
  update(deltaTime: number): void {
    this.updateTime(deltaTime);
    this.updateWeather(deltaTime);
  }

  private updateTime(deltaTime: number): void {
    // Convert deltaTime to game minutes
    const gameMinutesPerSecond = this.timeSpeed * 0.5; // 1 real second = 0.5 game minutes at normal speed
    const minutesToAdd = (deltaTime / 1000) * gameMinutesPerSecond;

    this.currentTime.minute += minutesToAdd;

    // Handle minute overflow
    if (this.currentTime.minute >= 60) {
      const hoursToAdd = Math.floor(this.currentTime.minute / 60);
      this.currentTime.minute = this.currentTime.minute % 60;
      this.currentTime.hour = (this.currentTime.hour + hoursToAdd) % 24;
    }

    // Update day phase and light level
    this.updateDayPhase();
  }

  private updateDayPhase(): void {
    const hour = this.currentTime.hour;

    if (hour >= 5 && hour < 7) {
      this.currentTime.dayPhase = 'dawn';
      this.currentTime.lightLevel = 0.3 + (hour - 5) * 0.35; // 0.3 to 1.0
    } else if (hour >= 7 && hour < 18) {
      this.currentTime.dayPhase = 'day';
      this.currentTime.lightLevel = 1.0;
    } else if (hour >= 18 && hour < 20) {
      this.currentTime.dayPhase = 'dusk';
      this.currentTime.lightLevel = 1.0 - (hour - 18) * 0.35; // 1.0 to 0.3
    } else {
      this.currentTime.dayPhase = 'night';
      this.currentTime.lightLevel = 0.2;
    }
  }

  private updateWeather(deltaTime: number): void {
    this.currentWeather.duration -= deltaTime;

    // Transition to new weather when current weather expires
    if (this.currentWeather.duration <= 0) {
      this.transitionToNewWeather();
    }

    // Update weather transition effects
    if (this.weatherTransitionTime > 0) {
      this.weatherTransitionTime -= deltaTime;
    }
  }

  private transitionToNewWeather(): void {
    // Choose new weather based on current conditions and randomness
    const weatherWeights = this.calculateWeatherWeights();
    const newWeather = this.selectWeatherByWeight(weatherWeights);
    
    this.currentWeather = { ...newWeather };
    this.weatherTransitionTime = 5000; // 5 second transition
  }

  private calculateWeatherWeights(): Map<string, number> {
    const weights = new Map<string, number>();
    const currentType = this.currentWeather.type;
    const timeOfDay = this.currentTime.dayPhase;

    // Base weights
    weights.set('clear', 0.4);
    weights.set('rain', 0.2);
    weights.set('storm', 0.1);
    weights.set('snow', 0.15);
    weights.set('fog', 0.15);

    // Adjust based on current weather (weather tends to persist)
    const currentWeight = weights.get(currentType) || 0;
    weights.set(currentType, currentWeight * 1.5);

    // Adjust based on time of day
    if (timeOfDay === 'night') {
      weights.set('fog', (weights.get('fog') || 0) * 1.5);
      weights.set('clear', (weights.get('clear') || 0) * 0.8);
    }

    if (timeOfDay === 'dawn' || timeOfDay === 'dusk') {
      weights.set('fog', (weights.get('fog') || 0) * 1.3);
    }

    // Weather transitions (some weather types are more likely to follow others)
    if (currentType === 'rain') {
      weights.set('storm', (weights.get('storm') || 0) * 2);
      weights.set('clear', (weights.get('clear') || 0) * 1.5);
    }

    if (currentType === 'storm') {
      weights.set('rain', (weights.get('rain') || 0) * 2);
      weights.set('clear', (weights.get('clear') || 0) * 1.8);
    }

    return weights;
  }

  private selectWeatherByWeight(weights: Map<string, number>): Weather {
    const totalWeight = Array.from(weights.values()).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (const [weatherType, weight] of weights.entries()) {
      random -= weight;
      if (random <= 0) {
        const pattern = this.weatherPatterns.find(p => p.type === weatherType);
        if (pattern) {
          return {
            ...pattern,
            intensity: pattern.intensity * (0.8 + Math.random() * 0.4) // Add some variance
          };
        }
      }
    }

    // Fallback to clear weather
    return this.weatherPatterns[0];
  }

  // Get current weather effects for gameplay
  getWeatherEffects(): {
    visibility: number;
    movement: number;
    combat: number;
    lightLevel: number;
    particles: {
      type: string;
      density: number;
      speed: number;
    } | null;
  } {
    const particles = this.getWeatherParticles();
    
    return {
      visibility: this.currentWeather.effects.visibility * this.currentTime.lightLevel,
      movement: this.currentWeather.effects.movement,
      combat: this.currentWeather.effects.combat,
      lightLevel: this.currentTime.lightLevel,
      particles
    };
  }

  private getWeatherParticles(): {
    type: string;
    density: number;
    speed: number;
  } | null {
    switch (this.currentWeather.type) {
      case 'rain':
        return {
          type: 'rain',
          density: this.currentWeather.intensity * 100,
          speed: 300 + this.currentWeather.intensity * 200
        };
      case 'storm':
        return {
          type: 'rain',
          density: this.currentWeather.intensity * 150,
          speed: 400 + this.currentWeather.intensity * 300
        };
      case 'snow':
        return {
          type: 'snow',
          density: this.currentWeather.intensity * 80,
          speed: 50 + this.currentWeather.intensity * 100
        };
      case 'fog':
        return {
          type: 'fog',
          density: this.currentWeather.intensity * 60,
          speed: 20
        };
      default:
        return null;
    }
  }

  // Get current time information
  getTimeInfo(): TimeOfDay & {
    timeString: string;
    isNight: boolean;
    isDawn: boolean;
    isDusk: boolean;
  } {
    const hour12 = this.currentTime.hour === 0 ? 12 : 
                   this.currentTime.hour > 12 ? this.currentTime.hour - 12 : 
                   this.currentTime.hour;
    const ampm = this.currentTime.hour >= 12 ? 'PM' : 'AM';
    const timeString = `${hour12}:${Math.floor(this.currentTime.minute).toString().padStart(2, '0')} ${ampm}`;

    return {
      ...this.currentTime,
      timeString,
      isNight: this.currentTime.dayPhase === 'night',
      isDawn: this.currentTime.dayPhase === 'dawn',
      isDusk: this.currentTime.dayPhase === 'dusk'
    };
  }

  // Get current weather information
  getWeatherInfo(): Weather & {
    weatherString: string;
    isTransitioning: boolean;
  } {
    const weatherString = this.currentWeather.type.charAt(0).toUpperCase() + 
                         this.currentWeather.type.slice(1);

    return {
      ...this.currentWeather,
      weatherString,
      isTransitioning: this.weatherTransitionTime > 0
    };
  }

  // Set time speed (for debugging or game mechanics)
  setTimeSpeed(speed: number): void {
    this.timeSpeed = Math.max(0.1, Math.min(100, speed));
  }

  // Force weather change (for testing or special events)
  forceWeather(weatherType: Weather['type'], duration?: number): void {
    const pattern = this.weatherPatterns.find(p => p.type === weatherType);
    if (pattern) {
      this.currentWeather = {
        ...pattern,
        duration: duration || pattern.duration
      };
      this.weatherTransitionTime = 2000; // Quick transition
    }
  }

  // Set specific time (for testing or game events)
  setTime(hour: number, minute: number = 0): void {
    this.currentTime.hour = Math.max(0, Math.min(23, hour));
    this.currentTime.minute = Math.max(0, Math.min(59, minute));
    this.updateDayPhase();
  }

  // Check if it's raining (affects fire spells, etc.)
  isRaining(): boolean {
    return this.currentWeather.type === 'rain' || this.currentWeather.type === 'storm';
  }

  // Check if visibility is reduced
  hasReducedVisibility(): boolean {
    return this.currentWeather.effects.visibility < 0.8 || this.currentTime.lightLevel < 0.5;
  }

  // Get ambient sound based on weather and time
  getAmbientSound(): {
    weather: string | null;
    time: string | null;
    volume: number;
  } {
    let weatherSound: string | null = null;
    let timeSound: string | null = null;
    let volume = 0.3;

    // Weather sounds
    switch (this.currentWeather.type) {
      case 'rain':
        weatherSound = 'rain';
        volume = 0.4 + this.currentWeather.intensity * 0.3;
        break;
      case 'storm':
        weatherSound = 'storm';
        volume = 0.5 + this.currentWeather.intensity * 0.4;
        break;
      case 'snow':
        weatherSound = 'wind';
        volume = 0.2 + this.currentWeather.intensity * 0.2;
        break;
    }

    // Time-based ambient sounds
    switch (this.currentTime.dayPhase) {
      case 'dawn':
        timeSound = 'birds';
        volume = Math.max(volume, 0.3);
        break;
      case 'day':
        timeSound = 'nature';
        volume = Math.max(volume, 0.2);
        break;
      case 'dusk':
        timeSound = 'evening';
        volume = Math.max(volume, 0.25);
        break;
      case 'night':
        timeSound = 'night';
        volume = Math.max(volume, 0.15);
        break;
    }

    return { weather: weatherSound, time: timeSound, volume };
  }
}