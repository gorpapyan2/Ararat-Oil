// Page Components
export { ShiftsPage } from "./ShiftsPage";
export { ShiftsDashboard } from "./ShiftsDashboard";
export { default as ShiftOpen } from "./ShiftOpen";
export { default as ShiftClose } from "./ShiftClose";
export { default as ShiftDetails } from "./ShiftDetails"; 

// Import default and re-export as named export
import ShiftsManagementPageDefault from "./ShiftsManagementPage";
export { ShiftsManagementPageDefault as ShiftsManagementPage }; 