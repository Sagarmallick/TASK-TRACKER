import { createSlice } from "@reduxjs/toolkit";

interface UISTATE {
  isCreateTaskOpen: boolean;
  selectedTaskId: string | null;
  isEditTaskOpen: boolean;
  statusFilter: "ALL" | "TODO" | "IN_PROGRESS" | "DONE";
  selectedProjectId: string | null;
}
const initialState: UISTATE = {
  isCreateTaskOpen: false,
  selectedTaskId: null,
  isEditTaskOpen: false,
  statusFilter: "ALL",
  selectedProjectId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCreateTask(state) {
      state.isCreateTaskOpen = true;
    },
    closeCreateTask(state) {
      state.isCreateTaskOpen = false;
    },
    setSelectedTask(state, action) {
      state.selectedTaskId = action.payload;
    },
    clearSelectedTask(state) {
      state.selectedTaskId = null;
    },
    openEditTask(state) {
      state.isEditTaskOpen = true;
    },
    closeEditTask(state) {
      state.isEditTaskOpen = false;
      state.selectedTaskId = null;
    },
    setSelectedProject(state, action) {
      state.selectedProjectId = action.payload;
    },
    clearSelectedProject(state) {
      state.selectedProjectId = null;
    },
  },
});

export const {
  openCreateTask,
  closeCreateTask,
  setSelectedTask,
  clearSelectedTask,
  openEditTask,
  closeEditTask,
  setSelectedProject,
  clearSelectedProject,
} = uiSlice.actions;
export default uiSlice.reducer;
