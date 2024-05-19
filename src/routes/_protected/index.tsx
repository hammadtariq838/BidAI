import { useAppSelector } from '@/app/hooks'
import Loader from '@/components/Loader'
import { Button } from '@/components/ui/button'
import { useGetSummaryQuery } from '@/services/tender/tenderApiSlice'
import { SummaryResponse } from '@/types/response.type'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/')({
  component: Screen
})

function Screen() {
  const { data: summary, isLoading } = useGetSummaryQuery()

  return (
    <main className='bg-white grow rounded-t-lg px-10 py-3'>
      {
        isLoading ? (
          <div className='min-h-screen flex items-center justify-center'>
            <Loader className='w-10 h-10' />
          </div>
        )
          : (
            <Summary summary={summary} />
          )
      }
    </main>
  )
}

const BasicStatics = ({ summary }: { summary: SummaryResponse | undefined }) => {
  const basicStats = {
    'totalBids': summary?.summary.totalProjects,
    'totalContractors': summary?.summary.totalContractors,
    'totalBidTypes': summary?.summary.totalBidTypes,
    'totalStates': 1,
    'totalCounties': summary?.summary.totalCounties,
  }
  return (
    <section className="flex flex-col grow justify-center w-full text-sm leading-5 text-black bg-white rounded-lg border border-solid shadow max-md:mt-10 max-md:max-w-full">
      <header className="justify-center items-start px-6 py-3 font-medium bg-gray-50 leading-[100%] rounded-t-lg">
        Basic Statistics
      </header>
      <div className={`justify-center items-start px-6 py-4 border-t border-solid`}>
        <div className="flex justify-between">
          <span>Total Bids available: {basicStats.totalBids} </span>
          <span>Total Contractors: {basicStats.totalContractors}</span>
        </div>
      </div>
      <div className={`justify-center items-start px-6 py-4 border-t border-solid`}>
        Total bid types: {basicStats.totalBidTypes}
      </div>
      <div className={`justify-center items-start px-6 py-4 border-t border-solid`}>
        <div className="flex justify-between">
          <span>Total states data: {basicStats.totalStates}</span>
          <span>Total counties data: {basicStats.totalCounties}</span>
        </div>
      </div>
    </section>
  )
}

const BudgetStatistics = ({ summary }: { summary: SummaryResponse | undefined }) => {
  const budgetStats = summary?.summary.budgetStats;
  return (
    <section className="flex flex-col grow justify-center w-full text-sm leading-5 text-black bg-white rounded-lg border border-solid shadow max-md:mt-10 max-md:max-w-full">
      <header className="justify-center items-start px-6 py-3 font-medium bg-gray-50 leading-[100%] rounded-t-lg">
        Budget Statistics
      </header>
      <div className={`justify-center items-start px-6 py-4 border-t border-solid`}>
        Min Budget: $ {budgetStats?.min.toLocaleString()}
      </div>
      <div className={`justify-center items-start px-6 py-4 border-t border-solid`}>
        Max Budget: $ {budgetStats?.max.toLocaleString()}
      </div>
      <div className={`justify-center items-start px-6 py-4 border-t border-solid`}>
        Mean Budget: $ {budgetStats?.mean.toLocaleString()}
      </div>
    </section>
  )
}

const CountyProjectStatistics = ({ summary }: { summary: SummaryResponse | undefined }) => {
  return (
    <div className="flow-root">
      <div className="relative overflow-y-auto max-h-[200px] w-full scroll-smooth">
        <Table summary={summary} />
      </div>
    </div>
  )
}


function Table({ summary }: { summary: SummaryResponse | undefined }) {
  const columnLabels: { [key: string]: string } = {
    state: "State",
    county: "County",
    total_projects: "Total Projects",
  };

  const countyTenders = summary?.summary.countyTenderCounts;

  return (
    <table className="w-full divide-y-1">
      <thead className="bg-[#F9FAFB] rounded-t-lg">
        <tr>
          {Object.entries(columnLabels).map(([, label], idx) => (
            <th
              key={idx}
              className="py-3.5 sticky top-0 z-10 bg-[#F9FAFB] font-medium text-start px-4 text-sm rounded-t-lg"
            >
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y-1">
        {countyTenders?.map((item, itemIdx) => (
          <tr
            key={itemIdx}
          >
            {itemIdx === 0 && (
              <td
                className="px-4 py-4 whitespace-wrap text-sm max-w-[200px]"
                rowSpan={countyTenders?.length}
              >
                Mississippi
              </td>
            )}
            <td
              className="px-4 py-4 whitespace-wrap text-sm max-w-[200px]"
            >
              {item.county}
            </td>
            <td
              className="px-4 py-4 whitespace-wrap text-sm max-w-[200px]"
            >
              {item.count}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


function Summary({ summary }: { summary: SummaryResponse | undefined }) {
  const navigate = useNavigate()
  const user = useAppSelector(state => state.auth.user)

  return (
    <div className="flex flex-col px-7 bg-white rounded-xl max-md:px-5">
      <div className="flex justify-between">
        <div className='flex-flex-col'>
          <h3 className="text-2xl leading-8 font-semibold text-black max-md:max-w-full">Welcome,
            <span className='font-semibold'> {user?.account.name}</span>
          </h3>
          <p className=" text-base font-medium leading-6 text-black max-md:max-w-full">
            Follow these instructions to generate your own smart and custom bids
          </p>
          <p className="mt-2 text-sm leading-5 text-black max-md:max-w-full">
            Select the &quot;bids&quot; parameter provided in the left panel to filter the bids. <br />
            Open whichever specific bid you want to use as a base bid and click on &quot;Generate the new bid&quot;. <br />
            Tweak the bid to reflect the changes you need and export it in whatever format you prefer.
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: '/bids' })}
        >
          Go to Bidding Screen
        </Button>
      </div>
      <section className="mt-4 max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <BasicStatics summary={summary} />
          <BudgetStatistics summary={summary} />
        </div>
      </section>
      <section className="mt-4 rounded-lg border border-solid shadow max-md:max-w-full">
        <CountyProjectStatistics summary={summary} />
      </section>
    </div>
  )
}

