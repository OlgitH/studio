import ScrollHeader from './ScrollHeader';
import JobBarChart from './charts/JobBarChart';
import JobFrictionScatter from './charts/JobFrictionScatter';
import SalaryLineChart from './charts/SalaryLineChart';
import { transformJobData } from './charts/jobDataUtils';

// Force Next.js to revalidate this page on every request or at a specific interval
export const revalidate = 3600; // Revalidate every hour

type JobListing = {
  title: string;
  company: string;
  salary_min: number | null;
  salary_max: number | null;
  days_on_market: number;
};

type JobRow = {
  category: string;
  vacancies: number;
  friction: number;
  target: number;
  jobs: JobListing[];
};


async function getJobData() {
  // Use the FULL URL. This works on both local dev and GitHub Actions.
  const URL = "https://olgith.github.io/job-insights/public/job_data.json";

  try {
    const res = await fetch(URL, { cache: 'no-store' });
    if (!res.ok) return [];
    // The JSON source may contain bare `NaN` (invalid JSON) — replace before parsing.
    const text = await res.text();
    const sanitised = text.replace(/:\s*NaN/g, ': null');
    const data = JSON.parse(sanitised) as JobRow[];
    return transformJobData(data);
  } catch {
    console.error("Could not fetch data from GitHub Pages");
    return [];
  }
}

function getAverageSalary(jobs: JobListing[]): number | null {
  const values = jobs
    .map((job) => {
      if (job.salary_min != null && job.salary_max != null) {
        return (job.salary_min + job.salary_max) / 2;
      }
      if (job.salary_min != null) return job.salary_min;
      if (job.salary_max != null) return job.salary_max;
      return null;
    })
    .filter((salary): salary is number => salary != null);

  if (values.length === 0) return null;

  const total = values.reduce((sum, salary) => sum + salary, 0);
  return total / values.length;
}

export default async function JobReportPage() {
  const data = await getJobData();
  return (
    <>
      <ScrollHeader title="Bristol Job Market Analysis" />
      <main className="mx-auto max-w-4xl p-4 md:p-8">

        {/* 1. D3 bar chart — vacancies per sector, colour-coded by friction */}
        <h2 className='font-bold mb-6'>Are jobs like UX/UI really in demand?</h2>
        <p className='mb-10 font-light'>We are told there is a skills shortage but are employers actually struggling to fill these roles? If they were would they not be offering jobs to people quicker? The frustration of people who have taken bootcamps and courses only to find they cannot be hired is clear.</p>
        <JobBarChart data={data} />
        <p className='mb-10 font-light'>It appears that design and construction roles are taking notably longer than other sectors to fill roles.</p>
        <p className='mb-10 font-light'>It appears that green jobs are in high demand and are quickly filled, but there are not many green jobs on offer.</p>


        <JobFrictionScatter data={data} />

        <SalaryLineChart data={data} />

        {/* 2. Create a Dynamic Table from the JSON */}
        <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
          <table className="w-full table-fixed text-white">
            <thead>
              <tr className="font-normal">
                <th className="border p-3 w-[32%]">Category</th>
                <th className="border p-3 w-[18%]">Vacancies</th>
                <th className="border p-3 w-[25%]">Days to fill</th>
                <th className="border p-3 w-[25%]">Salary</th>
              </tr>
            </thead>
            
            <tbody className="font-normal">
              {data.map((row, index) => {
                const averageSalary = getAverageSalary(row.jobs);

                return (
                  <tr key={`${row.category}-${index}`} className="text-center">
                    <td className="border p-3 font-semibold break-words">{row.category}</td>
                    <td className="border p-3 break-words">{row.vacancies}</td>
                    <td className="border p-3 break-words">{row.friction.toFixed(1)}d</td>
                    <td className="border p-3 break-words">
                      {averageSalary != null
                        ? `£${Math.round(averageSalary).toLocaleString()}`
                        : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </main>
    </>
  );
}