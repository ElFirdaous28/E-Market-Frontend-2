import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

process.env.VITE_API_URL = 'http://localhost:3000';

// 1. Mock React Toastify
jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
    },
}));

// 2. Mock React Router Dom
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));