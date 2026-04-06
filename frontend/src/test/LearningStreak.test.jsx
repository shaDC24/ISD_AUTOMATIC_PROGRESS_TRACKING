import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LearningStreak from '../components/LearningStreak';
import studentAPI from '../services/api';

// Mock studentAPI
vi.mock('../services/api', () => ({
    default: {
        get: vi.fn(),
    },
}));

describe('LearningStreak Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    /**
     * Test Case: Rendering with Streak Data
     * Verifies that the streak count is correctly calculated and displayed.
     */
    it('renders streak count based on API data', async () => {
        // Mocking a 3-day streak (today, yesterday, day before)
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const dayBefore = new Date(Date.now() - 172800000).toISOString().split('T')[0];

        studentAPI.get.mockResolvedValue({
            data: [
                { day: today, completed: '1' },
                { day: yesterday, completed: '1' },
                { day: dayBefore, completed: '1' },
            ]
        });

        render(<LearningStreak />);

        // Wait for API call and streak calculation
        await waitFor(() => {
            expect(screen.getByTestId('streak-count')).toHaveTextContent('3');
        });

        // Should show "days" next to the count
        expect(screen.getByText(/days/i)).toBeInTheDocument();
    });

    /**
     * Test Case: Fallback on API Error
     * Verifies that the component shows a default streak if the API fails.
     */
    it('renders fallback streak on API error', async () => {
        studentAPI.get.mockRejectedValue(new Error('Network error'));

        render(<LearningStreak />);

        // The fallback in the component sets a 3-day streak
        await waitFor(() => {
            expect(screen.getByTestId('streak-count')).toHaveTextContent('3');
        });
    });
});
