import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TaskCard from '../../src/components/TaskCard';

describe('TaskCard', () => {
  const mockTask = {
    id: '6a9ae5ccfd',
    title: 'Complete Week 4 Testing',
    assignee: 'StudentDev',
    dueDate: '2026-09-18T00:00:00.000Z',
    status: 'To Do',
    tags: [{ label: 'Urgent', color: 'red' }]
  };

  it('renders task details correctly', () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.getByText('Complete Week 4 Testing')).toBeInTheDocument();
    expect(screen.getByText('StudentDev')).toBeInTheDocument();
    
    expect(screen.getByText(/Sep 18, 2026/i)).toBeInTheDocument(); 
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });
});