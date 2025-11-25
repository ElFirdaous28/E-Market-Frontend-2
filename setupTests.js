import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

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