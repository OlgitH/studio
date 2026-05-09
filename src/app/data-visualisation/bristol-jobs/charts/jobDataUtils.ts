type JobListing = {
  title: string;
  company: string;
  salary_min: number | null;
  salary_max: number | null;
  days_on_market: number;
};

export type JobRow = {
  category: string;
  vacancies: number;
  friction: number;
  target: number;
  jobs: JobListing[];
};

/**
 * Transforms job data by cleaning up category names
 */
export function transformJobData(data: JobRow[]): JobRow[] {
  return data.map(row => ({
    ...row,
    category: row.category.replace('Legacy Tourism/Retail', 'Tourism /Retail')
  }));
}
