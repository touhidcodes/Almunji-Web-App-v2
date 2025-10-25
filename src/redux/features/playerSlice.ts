import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlayerState {
  isPlaying: boolean;
  volume: number;
  fontSize: number;
  currentVerse: number | null;
  repeatMode: "none" | "all" | "one";
  playbackSpeed: number;
}

const initialState: PlayerState = {
  isPlaying: false,
  volume: 0.7,
  fontSize: 18,
  currentVerse: null,
  repeatMode: "none",
  playbackSpeed: 1,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload;
    },
    setCurrentVerse: (state, action: PayloadAction<number | null>) => {
      state.currentVerse = action.payload;
    },
    setRepeatMode: (state, action: PayloadAction<"none" | "all" | "one">) => {
      state.repeatMode = action.payload;
    },
    setPlaybackSpeed: (state, action: PayloadAction<number>) => {
      state.playbackSpeed = action.payload;
    },
  },
});

export const {
  setIsPlaying,
  setVolume,
  setFontSize,
  setCurrentVerse,
  setRepeatMode,
  setPlaybackSpeed,
} = playerSlice.actions;

export default playerSlice.reducer;
