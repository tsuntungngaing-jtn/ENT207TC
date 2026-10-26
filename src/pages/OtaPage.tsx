import { otaChannels } from '../data/mock'
import { TopBar } from '../components/layout/TopBar'
import { Page, Panel, SectionTitle } from '../components/ui/Primitives'

export function OtaPage() {
  return (
    <>
      <TopBar title="OTA Operations" subtitle="Distribution pace, share, and ranking pulse" />
      <Page>
        <div className="mx-auto max-w-7xl animate-fade-up">
          <Panel>
            <SectionTitle
              title="Channel performance"
              subtitle="Weekday booking pace pressure across OTAs"
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-3 font-semibold">Channel</th>
                    <th className="pb-3 font-semibold">Share</th>
                    <th className="pb-3 font-semibold">Booking pace</th>
                    <th className="pb-3 font-semibold">Listing rank</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {otaChannels.map((c) => (
                    <tr key={c.name} className="border-b border-slate-100">
                      <td className="py-3.5 font-semibold text-navy-900">{c.name}</td>
                      <td className="py-3.5">{c.share}%</td>
                      <td className="py-3.5 font-semibold text-risk">{c.pace}%</td>
                      <td className="py-3.5">#{c.rank}</td>
                      <td className="py-3.5">
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                          Monitor
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Approved strategies sync rates and packages to these channels after human confirmation.
            </p>
          </Panel>
        </div>
      </Page>
    </>
  )
}
