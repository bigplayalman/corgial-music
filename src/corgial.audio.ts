import { Subject, Observable, BehaviorSubject } from "rxjs";
import { takeUntil, pluck, distinctUntilChanged } from "rxjs/operators";
import moment from "moment";

export interface StreamState {
  playing: boolean;
  readableCurrentTime: string;
  readableDuration: string;
  duration: number | undefined;
  currentTime: number | undefined;
  canplay: boolean;
  error: boolean;
}

export class CorgialAudio {
  private stop$ = new Subject();
  private audioObj = new Audio();
  audioEvents = [
    "ended", "error", "play", "playing", "pause", "timeupdate", "canplay", "loadedmetadata", "loadstart"
  ];
  private state: StreamState = {
    playing: false,
    readableCurrentTime: "",
    readableDuration: "",
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
  };

  private streamObservable(url: string) {
    return new Observable(observer => {
      // Play audio
      this.audioObj.src = "https://" + url;
      this.audioObj.load();
      this.audioObj.play();

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        // reset state
        this.resetState();
      };
    });
  }

  private addEvents(obj: HTMLAudioElement, events: string[], handler: (event: Event) => void) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj: HTMLAudioElement, events: string[], handler: (event: Event) => void) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }

  playStream(url: string) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play() {
    this.audioObj.play();
  }

  pause() {
    this.audioObj.pause();
  }

  stop() {
    this.stop$.next();
  }

  seekTo(seconds: number) {
    this.audioObj.currentTime = seconds;
  }

  formatTime(time: number, format: string = "HH:mm:ss") {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(this.state);

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case "canplay":
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case "playing":
        this.state.playing = true;
        break;
      case "pause":
        this.state.playing = false;
        break;
      case "timeupdate":
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(this.state.currentTime);
        break;
      case "error":
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private resetState() {
    this.state = {
      playing: false,
      readableCurrentTime: "",
      readableDuration: "",
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false
    };
  }

  getCurrentState() {
    return this.stateChange.getValue();
  }

  getStateProp(prop: string) {
    return this.stateChange.pipe(
      pluck(prop),
      distinctUntilChanged()
    );
  }

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }
}