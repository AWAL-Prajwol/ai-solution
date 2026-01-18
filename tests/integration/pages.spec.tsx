import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Public pages render', () => {
  it('Services page', async () => {
    const Services = (await import('@/app/services/page')).default;
    render(<Services />);
    expect(
      screen.getByRole('heading', { name: /Services/i })
    ).toBeInTheDocument();
  });

  it('Case Studies page', async () => {
    const CaseStudies = (await import('@/app/case-studies/page')).default;
    render(<CaseStudies />);
    expect(screen.getByText(/Case Studies/i)).toBeInTheDocument();
  });

  it('Feedback page', async () => {
    const Feedback = (await import('@/app/feedback/page')).default;
    render(<Feedback />);
    expect(screen.getByText(/Customer Feedback/i)).toBeInTheDocument();
  });

  it('Blog page', async () => {
    const Blog = (await import('@/app/blog/page')).default;
    render(<Blog />);
    expect(screen.getByText(/Blog/i)).toBeInTheDocument();
  });

  it('Gallery page', async () => {
    const Gallery = (await import('@/app/gallery/page')).default;
    render(<Gallery />);
    expect(screen.getByText(/Gallery/i)).toBeInTheDocument();
  });

  it('Events page', async () => {
    const Events = (await import('@/app/events/page')).default;
    render(<Events />);
    expect(screen.getByText(/Events/i)).toBeInTheDocument();
  });

  it('Contact page', async () => {
    const Contact = (await import('@/app/contact/page')).default;
    render(<Contact />);
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
  });
});
